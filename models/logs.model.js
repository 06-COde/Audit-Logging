import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const logSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    user: {
      id: { type: String, required: true, index: true },
      name: { type: String, index: true },
      email: { type: String, index: true },
    },
    action: { type: String, required: true, index: true },
    eventType: {
      type: String,
      required: true,
      enum: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "OTHER"],
      default: "OTHER",
      index: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

    // For $text search on free text + metadata
    description: { type: String, default: "" },
    metadataText: { type: String, default: "" }, // derived
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    versionKey: false,
    timestamps: true, // createdAt used in notifications, etc.
  }
);

// derive metadataText for full-text queries
logSchema.pre("save", function (next) {
  try {
    this.metadataText = typeof this.metadata === "string"
      ? this.metadata
      : JSON.stringify(this.metadata ?? {});
  } catch {
    this.metadataText = "";
  }
  next();
});

// Text index with weights
logSchema.index(
  { description: "text", metadataText: "text" },
  { weights: { description: 5, metadataText: 2 }, name: "LogTextIndex" }
);

// Compound index to support cursor pagination & org isolation
logSchema.index({ organizationId: 1, timestamp: -1, _id: -1 });

logSchema.plugin(mongoosePaginate);

const Log = mongoose.model("Log", logSchema);
export default Log;
