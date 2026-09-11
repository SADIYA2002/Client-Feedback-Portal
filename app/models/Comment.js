import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commentId: { type: String, required: true, unique: true, index: true },
    feedbackId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: "Client" },
    authorEmail: { type: String, default: "" },
    authorCompany: { type: String, default: "" },
    avatar: { type: String, default: "" },
    content: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "comments"
  }
);

commentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.commentId || ret._id.toString();
    return ret;
  }
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
