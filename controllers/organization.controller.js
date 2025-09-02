import Organization from "../models/organization.model.js";
import crypto from "crypto";
import { generateToken } from "../utils/jwt.js";

/**
 * Create new organization + return token
 */
export const createOrganization = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Generate API key for this org
    const apiKey = crypto.randomBytes(32).toString("hex");

    const org = await Organization.create({ name, email, apiKey });

    // issue JWT with org info
    const token = generateToken({ organizationId: org._id, email });

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: org,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of organizations (admin use case)
 */
export const listOrganizations = async (req, res, next) => {
  try {
    const orgs = await Organization.find();
    res.json({ success: true, count: orgs.length, data: orgs });
  } catch (error) {
    next(error);
  }
};

/**
 * Get one organization by ID
 */
export const getOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    res.json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

/**
 * Update organization
 */
export const updateOrganization = async (req, res, next) => {
  try {
    const updates = req.body;
    const org = await Organization.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!org) return res.status(404).json({ message: "Organization not found" });

    res.json({ success: true, message: "Organization updated", data: org });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete organization
 */
export const deleteOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    res.json({ success: true, message: "Organization deleted" });
  } catch (error) {
    next(error);
  }
};
