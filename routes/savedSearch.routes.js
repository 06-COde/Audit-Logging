import express from "express";
import {
  createSavedSearch,
  listSavedSearches,
  getSavedSearch,
  deleteSavedSearch,
} from "../controllers/savedSearch.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected Routes
router.post("/", auth, createSavedSearch);
router.get("/", auth, listSavedSearches);
router.get("/:id", auth, getSavedSearch);
router.delete("/:id", auth, deleteSavedSearch);

export default router;
