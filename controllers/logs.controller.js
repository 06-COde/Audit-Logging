import Log from "../models/logs.model.js";
import { checkSuspiciousActivity } from "../services/checkSuspiciousActivity.js";
import { buildPagination } from "../utils/pagination.js";

// 📌 Create new log entry
export const createLog = async (req, res, next) => {
  try {
    const log = await Log.create({
      organizationId:
        req.user?.organizationId || req.body.organizationId, // fallback for Postman
      user: {
        id: req.body.userId || req.user?.id, // required field
        name: req.body.userName || req.user?.name || "Unknown",
        email: req.body.userEmail || req.user?.email || "unknown@example.com",
      },
      action: req.body.action,
      eventType: req.body.eventType || "OTHER",
      description: req.body.description || "",
      metadata: req.body.metadata || {},
      timestamp: req.body.timestamp || Date.now(),
    });

    // 🚨 Detect suspicious activity (only if req.user exists)
    if (req.user?.organizationId) {
      await checkSuspiciousActivity(req.user.organizationId);
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    console.error("Create Log Error:", error);
    next(error);
  }
};

// 📌 List logs with advanced filtering, search & pagination
export const listLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "timestamp",
      order = "desc",
      search,
      ...filters
    } = req.query;

    const query = {
      organizationId: req.user?.organizationId || req.body.organizationId, // fallback for Postman
    };

    // Apply filters
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.userId) query["user.id"] = filters.userId;
    if (filters.action) query.action = new RegExp(filters.action, "i");

    // Fuzzy search across multiple fields
    if (search) {
      query.$or = [
        { action: new RegExp(search, "i") },
        { eventType: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { "user.name": new RegExp(search, "i") },
        { "user.email": new RegExp(search, "i") },
      ];
    }

    const pagination = buildPagination(page, limit);

    const logs = await Log.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    const total = await Log.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      meta: {
        total,
        page: pagination.page,
        pages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.error("List Logs Error:", error);
    next(error);
  }
};

// 📌 Aggregation for dashboard charts
export const aggregateSummary = async (req, res, next) => {
  try {
    const orgId = req.user?.organizationId || req.body.organizationId;

    const [eventTypeStats, uniqueUsers, frequentActions, timeline] =
      await Promise.all([
        // Count per event type
        Log.aggregate([
          { $match: { organizationId: orgId } },
          { $group: { _id: "$eventType", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // Unique users
        Log.aggregate([
          { $match: { organizationId: orgId } },
          { $group: { _id: "$user.id" } },
          { $count: "uniqueUsers" },
        ]),

        // Frequent actions
        Log.aggregate([
          { $match: { organizationId: orgId } },
          { $group: { _id: "$action", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),

        // Timeline per day
        Log.aggregate([
          { $match: { organizationId: orgId } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        eventTypeStats,
        uniqueUsers: uniqueUsers[0]?.uniqueUsers || 0,
        frequentActions,
        timeline,
      },
    });
  } catch (error) {
    console.error("Aggregate Logs Error:", error);
    next(error);
  }
};
