import Comment from "@/app/models/Comment";
import { connect } from "@/app/utils/DbConfog";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const feedbackId = searchParams.get("feedbackId");

    const query = feedbackId ? { feedbackId } : {};
    const comments = await Comment.find(query).sort({ createdAt: 1 });

    return Response.json(comments, { status: 200 });
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const data = await request.json();

    const newComment = await Comment.create({
      commentId: "c-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      feedbackId: data.feedbackId,
      authorName: data.authorName || "Client Representative",
      authorRole: data.authorRole || "Client",
      authorCompany: data.authorCompany || "",
      authorEmail: data.authorEmail || "",
      avatar: data.avatar || "",
      content: data.content
    });

    return Response.json(newComment, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
