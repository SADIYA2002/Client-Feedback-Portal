import Activity from "@/app/models/Activity";
import { connect } from "@/app/utils/DbConfog";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connect();
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(50);
    return Response.json(activities, { status: 200 });
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const data = await request.json();

    const activity = await Activity.create({
      action: data.action,
      entityType: data.entityType || "feedback",
      entityId: data.entityId,
      entityTitle: data.entityTitle || "",
      actorName: data.actorName || "Anonymous",
      actorRole: data.actorRole || "Client",
      actorCompany: data.actorCompany || "",
      details: data.details || ""
    });

    return Response.json(activity, { status: 201 });
  } catch (error) {
    console.error("POST /api/activities error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
