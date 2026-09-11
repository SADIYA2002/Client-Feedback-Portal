import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  id: { type: String, default: () => "c-" + Date.now().toString(36) },
  authorName: { type: String, default: "Client Representative" },
  authorRole: { type: String, default: "Client" },
  avatar: { type: String, default: "" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const attachmentSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  url: { type: String, required: true },
  size: { type: String, default: "" }
});

const feedbackSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "Feature Request" },
    status: { type: String, default: "Under Review" },
    priority: { type: String, default: "Medium" },
    clientName: { type: String, default: "Anonymous Client" },
    clientCompany: { type: String, default: "Enterprise Client" },
    clientEmail: { type: String, default: "" },
    votes: { type: Number, default: 0 },
    upvotedBy: { type: [String], default: [] },
    attachments: [attachmentSchema],
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

// Virtual for id getter
feedbackSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.id || ret._id.toString();
    return ret;
  }
});

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
export default Feedback;
