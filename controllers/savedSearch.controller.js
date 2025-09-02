import SavedSearch from "../models/savedSearch.model.js";

// Create a saved search
export const createSavedSearch = async (req, res, next) => {
  try {
    const { name, query, isGlobal } = req.body;
    const savedSearch = await SavedSearch.create({
      organizationId: req.user.organizationId,
      userId: req.user.id,
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
    const savedSearches = await SavedSearch.find({
      organizationId: req.user.organizationId,
      $or: [{ userId: req.user.id }, { isGlobal: true }],
    });
    res.json({ success: true, data: savedSearches });
  } catch (error) {
    next(error);
  }
};

// Get single saved search
export const getSavedSearch = async (req, res, next) => {
  try {
    const savedSearch = await SavedSearch.findById(req.params.id);
    if (!savedSearch) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, data: savedSearch });
  } catch (error) {
    next(error);
  }
};

// Delete saved search
export const deleteSavedSearch = async (req, res, next) => {
  try {
    await SavedSearch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
