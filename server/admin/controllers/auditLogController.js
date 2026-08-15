import AuditLog from '../models/AuditLog.js';
import ApiResponse from '../../utils/apiResponse.js';

class AuditLogController {
  /**
   * GET /api/admin/audit-logs
   * Retrieves paginated list of system audit logs
   */
  async getAuditLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const skip = (page - 1) * limit;

      const actionFilter = req.query.action || '';
      const moduleFilter = req.query.module || '';

      const query = {};
      if (actionFilter) {
        query.action = actionFilter;
      }
      if (moduleFilter) {
        query.module = moduleFilter;
      }

      const logs = await AuditLog.find(query)
        .populate('adminId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await AuditLog.countDocuments(query);

      return ApiResponse.success(
        res,
        {
          logs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        'Audit logs retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuditLogController();
