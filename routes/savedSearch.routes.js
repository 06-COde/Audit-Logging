import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createSavedSearch,
  listSavedSearches,
  getSavedSearch,
  deleteSavedSearch,
} from "../controllers/savedSearch.controller.js";

const router = express.Router();

router.post("/", auth, createSavedSearch);
router.get("/", auth, listSavedSearches);
router.get("/:id", auth, getSavedSearch);
router.delete("/:id", auth, deleteSavedSearch);

export default router;
