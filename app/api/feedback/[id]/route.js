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

export const PATCH = async (request, { params }) => {
  try {
    await connect();
    const { id } = params;
    const updates = await request.json();

    const query = getQuery(id);
    const updated = await Feedback.findOneAndUpdate(query, updates, { new: true });

    if (!updated) {
      return Response.json({ error: "Feedback item not found" }, { status: 404 });
    }

    // Log activity
    try {
      if (updates.status) {
        await Activity.create({
          action: "STATUS_CHANGED",
          entityType: "feedback",
          entityId: updated.id,
          entityTitle: updated.title,
          actorName: "Product Team",
          actorRole: "Product Team",
          details: `Changed status to "${updates.status}" for "${updated.title}"`
        });
      }
      if (updates.priority) {
        await Activity.create({
          action: "PRIORITY_CHANGED",
          entityType: "feedback",
          entityId: updated.id,
          entityTitle: updated.title,
          actorName: "Product Team",
          actorRole: "Product Team",
          details: `Changed priority to "${updates.priority}" for "${updated.title}"`
        });
      }
    } catch (actErr) {
      console.warn("Could not log activity:", actErr);
    }

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/feedback/[id] error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connect();
    const { id } = params;

    const query = getQuery(id);
    const deleted = await Feedback.findOneAndDelete(query);

    if (!deleted) {
      return Response.json({ error: "Feedback item not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Feedback deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/feedback/[id] error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
