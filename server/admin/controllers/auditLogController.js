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

      const actionFilter = typeof req.query.action === 'string' ? req.query.action.trim() : '';
      const moduleFilter = typeof req.query.module === 'string' ? req.query.module.trim() : '';

      const ALLOWED_MODULES = ['AUTH', 'FARMER', 'FARM', 'DISEASE', 'NOTIFICATION', 'SCHEME', 'TICKET', 'REPORT', 'SETTINGS'];
      const query = {};
      // Allow only uppercase letters, digits and underscores (e.g. LOGIN, CREATE_ADMIN)
      if (actionFilter && /^[A-Z0-9_]+$/.test(actionFilter)) {
        query.action = actionFilter;
      }
      if (moduleFilter && ALLOWED_MODULES.includes(moduleFilter)) {
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
