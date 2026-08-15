import AuditLog from '../models/AuditLog.js';
import ApiResponse from '../../utils/apiResponse.js';
import { pickAllowed, safeInt } from '../../utils/queryHelpers.js';

const ALLOWED_AUDIT_MODULES = ['AUTH', 'FARMER', 'FARM', 'DISEASE', 'NOTIFICATION', 'SCHEME', 'TICKET', 'REPORT', 'SETTINGS'];

class AuditLogController {
  /**
   * GET /api/admin/audit-logs
   * Retrieves paginated list of system audit logs
   */
  async getAuditLogs(req, res, next) {
    try {
      const page  = safeInt(req.query.page, 1, 1);
      const limit = safeInt(req.query.limit, 20, 1, 100);
      const skip  = (page - 1) * limit;

      const rawAction = typeof req.query.action === 'string' ? req.query.action.trim() : '';
      const moduleFilter = pickAllowed(req.query.module, ALLOWED_AUDIT_MODULES);

      const query = {};
      // Allow only uppercase letters, digits and underscores (e.g. LOGIN, CREATE_ADMIN)
      if (rawAction && /^[A-Z0-9_]{1,64}$/.test(rawAction)) query.action = rawAction;
      if (moduleFilter) query.module = moduleFilter;  // safe: whitelist-validated

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
