import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["FEEDBACK_CREATED", "UPVOTED", "DOWNVOTED", "STATUS_CHANGED", "PRIORITY_CHANGED", "COMMENT_ADDED"]
    },
    entityType: { type: String, default: "feedback" },
    entityId: { type: String, required: true },
    entityTitle: { type: String, default: "" },
    actorName: { type: String, default: "Anonymous" },
    actorRole: { type: String, default: "Client" },
    actorCompany: { type: String, default: "" },
    details: { type: String, default: "" }
  },
  {
    timestamps: true,
    collection: "activities"
  }
);

activitySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
});

const Activity = mongoose.models.Activity || mongoose.model("Activity", activitySchema);
export default Activity;
