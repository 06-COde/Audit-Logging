// controllers/organization.controller.js
import Organization from "../models/organization.model.js";
import crypto from "crypto";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

/**
 * Create new organization (admin only)
 */
export const createOrganization = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ success: false, message: "Name and email are required" });

    const apiKey = crypto.randomBytes(32).toString("hex");
    const org = await Organization.create({ name, email, apiKey });

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
 * List organizations with pagination
 */
export const listOrganizations = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const total = await Organization.countDocuments();
    const orgs = await Organization.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      meta: { total, pages: Math.ceil(total / limit), page, limit },
      data: orgs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization by ID
 */
export const getOrganization = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ success: false, message: "Organization not found" });

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const org = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!org) return res.status(404).json({ success: false, message: "Organization not found" });

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const org = await Organization.findByIdAndDelete(req.params.id);
    if (!org) return res.status(404).json({ success: false, message: "Organization not found" });

    res.json({ success: true, message: "Organization deleted" });
  } catch (error) {
    next(error);
  }
};
