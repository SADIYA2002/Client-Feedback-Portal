import Feedback from "@/app/models/Feedback";
import Activity from "@/app/models/Activity";
import { connect } from "@/app/utils/DbConfog";
import { SAMPLE_FEEDBACKS } from "@/app/services/feedbackStorage";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connect();
    let feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();

    // If Atlas database is empty, seed with initial realistic business baseline
    if (!feedbacks || feedbacks.length === 0) {
      console.log("Seeding MongoDB Atlas with initial enterprise feedback data...");
      await Feedback.insertMany(SAMPLE_FEEDBACKS);
      feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    }

    const formatted = feedbacks.map((fb) => ({
      ...fb,
      id: fb.id || fb._id.toString(),
      _id: fb._id.toString()
    }));

    return Response.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET /api/feedback error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const data = await request.json();

    const newFeedback = await Feedback.create({
      id: "fb-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: data.title,
      description: data.description,
      category: data.category || "Feature Request",
      status: "Under Review",
      priority: data.priority || "Medium",
      clientName: data.clientName || "Anonymous Client",
      clientCompany: data.clientCompany || "Enterprise Client",
      clientEmail: data.clientEmail || "",
      votes: 1,
      upvotedBy: [data.userId || "current-user"],
      attachments: data.attachments || [],
      comments: []
    });

    try {
      await Activity.create({
        action: "FEEDBACK_CREATED",
        entityType: "feedback",
        entityId: newFeedback.id,
        entityTitle: newFeedback.title,
        actorName: newFeedback.clientName,
        actorRole: "Client",
        actorCompany: newFeedback.clientCompany,
        details: `Created feedback: "${newFeedback.title}"`
      });
    } catch (actErr) {
      console.warn("Could not log activity:", actErr);
    }

    return Response.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
