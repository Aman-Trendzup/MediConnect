import { AuditLog } from '../models/auditLog.model.js';

export const logAdminAction = async ({ user, action, targetModel, target}) => {
  try {
    await AuditLog.create({
      user: user,
      action,
      targetModel,
      target,
    });
  } catch (error) {
    console.error("Failed to save audit log:", error.message);
  }
};