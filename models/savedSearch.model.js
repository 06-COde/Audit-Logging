import mongoose from "mongoose";

const SavedSearchSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    userId: {
      type: String, // or ObjectId if you have a User collection
      required: true,
    },
    name: {
      type: String,
      required: true, // e.g. "Failed logins in 24h"
    },
    query: {
      type: Object,
      required: true, // store filters: { eventType: "LOGIN_FAILED", dateRange: "last24h" }
    },
    isGlobal: {
      type: Boolean,
      default: false, // org-wide vs personal saved search
    },
  },
  { timestamps: true }
);

export default mongoose.model("SavedSearch", SavedSearchSchema);
