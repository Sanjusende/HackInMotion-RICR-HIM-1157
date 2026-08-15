import CropHealth from '../../models/CropHealth.js';
import ApiResponse from '../../utils/apiResponse.js';

class CropHealthController {
  /**
   * GET /api/admin/crop-health
   * List all AI crop health scans in the system
   */
  async getCropHealthScans(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const skip = (page - 1) * limit;

      const healthFilter = req.query.health || ''; // 'Healthy' | 'Diseased'
      const cropFilter = req.query.crop || '';

      const query = {};
      if (healthFilter) {
        query.health = healthFilter;
      }
      if (cropFilter) {
        query.crop = { $regex: cropFilter, $options: 'i' };
      }

      const scans = await CropHealth.find(query)
        .populate({
          path: 'farmId',
          select: 'name location currentCrop',
          populate: {
            path: 'userId',
            select: 'name email phone',
          },
        })
        .sort({ reportedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalScans = await CropHealth.countDocuments(query);

      return ApiResponse.success(
        res,
        {
          scans,
          pagination: {
            page,
            limit,
            total: totalScans,
            pages: Math.ceil(totalScans / limit),
          },
        },
        'Crop health scans retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/crop-health/:id
   * Get detail of a specific crop health scan
   */
  async getCropHealthScanById(req, res, next) {
    try {
      const { id } = req.params;

      const scan = await CropHealth.findById(id)
        .populate({
          path: 'farmId',
          select: 'name location landSize soilType currentCrop growthStage season',
          populate: {
            path: 'userId',
            select: 'name email phone language',
          },
        })
        .lean();

      if (!scan) {
        return ApiResponse.error(res, 'Crop health scan record not found', 404);
      }

      return ApiResponse.success(res, scan, 'Crop health scan record retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CropHealthController();
