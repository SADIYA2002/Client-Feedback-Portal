import Feedback from "@/app/models/Feedback";
import Comment from "@/app/models/Comment";
import Activity from "@/app/models/Activity";
import { connect } from "@/app/utils/DbConfog";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

const getQuery = (id) => {
  if (mongoose.isValidObjectId(id)) {
    return { $or: [{ _id: id }, { id: id }] };
  }
  return { id: id };
};

export const POST = async (request, { params }) => {
  try {
    await connect();
    const { id } = params;
    const body = await request.json();

    const query = getQuery(id);
    const item = await Feedback.findOne(query);

    if (!item) {
      return Response.json({ error: "Feedback item not found" }, { status: 404 });
    }

    const commentId = "c-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const newComment = {
      id: commentId,
      authorName: body.authorName || "Client Representative",
      authorRole: body.authorRole || "Client",
      avatar: body.avatar || "",
      content: body.content,
      createdAt: new Date()
    };

    if (!Array.isArray(item.comments)) {
      item.comments = [];
    }
    item.comments.push(newComment);
    await item.save();

    // 1. Sync to standalone 'comments' collection in MongoDB Atlas
    try {
      await Comment.create({
        commentId: commentId,
        feedbackId: item.id || item._id.toString(),
        authorName: newComment.authorName,
        authorRole: newComment.authorRole,
        authorEmail: body.authorEmail || "",
        authorCompany: body.authorCompany || "",
        avatar: newComment.avatar,
        content: newComment.content
      });
    } catch (commentErr) {
      console.warn("Could not save to Comment collection:", commentErr);
    }

    // 2. Log to 'activities' collection in MongoDB Atlas
    try {
      await Activity.create({
        action: "COMMENT_ADDED",
        entityType: "comment",
        entityId: item.id || item._id.toString(),
        entityTitle: item.title,
        actorName: newComment.authorName,
        actorRole: newComment.authorRole,
        actorCompany: body.authorCompany || "",
        details: `Commented on "${item.title}": "${body.content.slice(0, 60)}..."`
      });
    } catch (actErr) {
      console.warn("Could not log comment activity:", actErr);
    }

    return Response.json({ feedback: item, comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback/[id]/comment error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
