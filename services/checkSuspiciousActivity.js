import Log from "../models/logs.model.js";
import Organization from "../models/organization.model.js";
import { sendSuspiciousActivityEmail } from "./notification.service.js";

export const checkSuspiciousActivity = async (organizationId) => {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  const deleteCount = await Log.countDocuments({
    organizationId,
    action: "DELETE",
    createdAt: { $gte: oneMinuteAgo },
  });

  if (deleteCount > 5) {
    const org = await Organization.findById(organizationId);
    if (org) {
      await sendSuspiciousActivityEmail(org, deleteCount);
    }
  }
};
