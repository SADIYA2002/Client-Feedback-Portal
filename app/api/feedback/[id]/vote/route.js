import Feedback from "@/app/models/Feedback";
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
    const { userId = "current-user", userName = "Client" } = await request.json().catch(() => ({}));

    const query = getQuery(id);
    const item = await Feedback.findOne(query);

    if (!item) {
      return Response.json({ error: "Feedback item not found" }, { status: 404 });
    }

    const upvotedBy = Array.isArray(item.upvotedBy) ? [...item.upvotedBy] : [];
    const index = upvotedBy.indexOf(userId);
    let hasVoted = false;
    let newVotes = item.votes || 0;

    if (index > -1) {
      upvotedBy.splice(index, 1);
      newVotes = Math.max(0, newVotes - 1);
      hasVoted = false;
    } else {
      upvotedBy.push(userId);
      newVotes += 1;
      hasVoted = true;
    }

    item.votes = newVotes;
    item.upvotedBy = upvotedBy;
    await item.save();

    // Log activity
    try {
      await Activity.create({
        action: hasVoted ? "UPVOTED" : "DOWNVOTED",
        entityType: "feedback",
        entityId: item.id,
        entityTitle: item.title,
        actorName: userName,
        actorRole: "Client",
        details: `${hasVoted ? "Upvoted" : "Removed vote on"}: "${item.title}" (Total votes: ${newVotes})`
      });
    } catch (actErr) {
      console.warn("Could not log vote activity:", actErr);
    }

    return Response.json({ feedback: item, hasVoted }, { status: 200 });
  } catch (error) {
    console.error("POST /api/feedback/[id]/vote error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
