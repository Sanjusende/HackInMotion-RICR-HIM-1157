import CommunityReport from '../../models/CommunityReport.js';
import ApiResponse from '../../utils/apiResponse.js';

class CommunityReportController {
  /**
   * GET /api/admin/community-reports
   * Retrieves all community crop reports with pagination
   */
  async getReports(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const skip = (page - 1) * limit;
      const search = req.query.search || '';

      const query = {};
      if (search) {
        query.$or = [
          { crop: { $regex: search, $options: 'i' } },
          { possibleIssue: { $regex: search, $options: 'i' } },
        ];
      }

      const reports = await CommunityReport.find(query)
        .sort({ lastReportedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await CommunityReport.countDocuments(query);

      return ApiResponse.success(
        res,
        {
          reports,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        'Community reports retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new CommunityReportController();
