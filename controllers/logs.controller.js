import Log from "../models/logs.model.js";
import { checkSuspiciousActivity } from "../services/checkSuspiciousActivity.js";

// Create log
export const createLog = async (req, res, next) => {
  try {
    const log = await Log.create({
      organizationId: req.user.organizationId, // from JWT
      user: {
        id: req.body.userId || req.user.id,    // required
        name: req.body.userName || req.user.name || "Unknown",
        email: req.body.userEmail || req.user.email,
      },
      action: req.body.action,                 // required
      eventType: req.body.eventType || "OTHER",// default if not provided
      description: req.body.description || "",
      metadata: req.body.metadata || {},
      timestamp: req.body.timestamp || Date.now(),
    });

    // 🚨 After saving, check for suspicious activity
    await checkSuspiciousActivity(req.user.organizationId);

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// List logs with pagination + filters
export const listLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "timestamp",
      order = "desc",
      ...filters
    } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { [sortBy]: order === "asc" ? 1 : -1 },
    };

    const query = { organizationId: req.user.organizationId }; // enforce org from token

    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.userId) query["user.id"] = filters.userId;
    if (filters.action) query.action = new RegExp(filters.action, "i");

    const logs = await Log.paginate(query, options);

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// Aggregation: count per event type
export const logsStats = async (req, res, next) => {
  try {
    const stats = await Log.aggregate([
      { $match: { organizationId: req.user.organizationId } },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
