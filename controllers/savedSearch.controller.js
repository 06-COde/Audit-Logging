import SavedSearch from "../models/savedSearch.model.js";

// Create a saved search
export const createSavedSearch = async (req, res, next) => {
  try {
    // Make sure user info comes from token
    const { id: userId, organizationId } = req.user;
    const { name, query, isGlobal } = req.body;

    if (!userId || !organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized: missing userId or organizationId" });
    }

    const savedSearch = await SavedSearch.create({
      organizationId,
      userId, // secure assignment from token
      name,
      query,
      isGlobal: !!isGlobal,
    });

    res.status(201).json({ success: true, data: savedSearch });
  } catch (error) {
    next(error);
  }
};

// List saved searches (scoped to org + user/global)
export const listSavedSearches = async (req, res, next) => {
  try {
    const { id: userId, organizationId } = req.user;

    const savedSearches = await SavedSearch.find({
      organizationId,
      $or: [{ userId }, { isGlobal: true }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: savedSearches });
  } catch (error) {
    next(error);
  }
};

// Get single saved search
export const getSavedSearch = async (req, res, next) => {
  try {
    const { id: userId, organizationId } = req.user;

    const savedSearch = await SavedSearch.findOne({
      _id: req.params.id,
      organizationId,
      $or: [{ userId }, { isGlobal: true }],
    });

    if (!savedSearch) {
      return res.status(404).json({ success: false, message: "Not found or not authorized" });
    }

    res.json({ success: true, data: savedSearch });
  } catch (error) {
    next(error);
  }
};

// Delete saved search
export const deleteSavedSearch = async (req, res, next) => {
  try {
    const { id: userId, organizationId } = req.user;

    const deleted = await SavedSearch.findOneAndDelete({
      _id: req.params.id,
      organizationId,
      $or: [{ userId }, { isGlobal: true }],
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found or not authorized" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
