import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const logSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true, // Faster queries per organization
    },
    user: {
      id: { type: String, required: true },
      name: { type: String },
      email: { type: String },
    },
    action: {
      type: String,
      required: true,
      index: true, // Useful for filtering/searching
    },
    eventType: {
      type: String,
      required: true,
      enum: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "OTHER"],
      default: "OTHER",
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Flexible JSON object
      default: {},
    },
    description: {
      type: String,
      index: "text", 
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true, 
    },
  },
  { versionKey: false }
);

// Pagination plugin
logSchema.plugin(mongoosePaginate);

const Log = mongoose.model("Log", logSchema);

export default Log;
