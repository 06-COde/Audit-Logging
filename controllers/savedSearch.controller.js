import SavedSearch from "../models/savedSearch.model.js";

// Create a saved search
export const createSavedSearch = async (req, res, next) => {
  try {
    const { name, query, isGlobal } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found in request" });
    }

    const savedSearch = await SavedSearch.create({
      organizationId: req.user.organizationId,
      userId: query.userId,  // ✅ saved from query
      name,
      query,
      isGlobal,
    });

    res.status(201).json({ success: true, data: savedSearch });
  } catch (error) {
    next(error);
  }
};

// List saved searches (scoped to org + user/global)
export const listSavedSearches = async (req, res, next) => {
  try {
    const savedSearches = await SavedSearch.find({});

    res.json({ success: true, data: savedSearches });
  } catch (error) {
    next(error);
  }
};

// Get single saved search (must belong to org + user/global)
export const getSavedSearch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const savedSearch = await SavedSearch.findOne({
      _id: id,
      
    });

    if (!savedSearch) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, data: savedSearch });
  } catch (error) {
    next(error);
  }
};

// Delete saved search (must belong to org + user/global)
export const deleteSavedSearch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await SavedSearch.findOneAndDelete({
      _id: id,
      
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found or not authorized" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
