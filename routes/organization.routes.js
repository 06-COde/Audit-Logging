import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import {
  createOrganization, listOrganizations, getOrganization, updateOrganization, deleteOrganization
} from '../controllers/organization.controller.js';

const router = express.Router();

router.post('/', createOrganization);
router.get("/", auth, listOrganizations);
router.get("/:id", auth, getOrganization);
router.put("/:id", auth, updateOrganization);
router.delete("/:id", auth, deleteOrganization);

export default router;
