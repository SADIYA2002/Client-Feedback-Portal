import Feedback from "@/app/models/Feedback";
import { connect } from "@/app/utils/DbConfog";
import { SAMPLE_FEEDBACKS } from "@/app/services/feedbackStorage";

export const dynamic = "force-dynamic";

export const POST = async () => {
  try {
    await connect();
    await Feedback.deleteMany({});
    const inserted = await Feedback.insertMany(SAMPLE_FEEDBACKS);
    return Response.json({ success: true, message: "Database reset to sample enterprise baseline", count: inserted.length }, { status: 200 });
  } catch (error) {
    console.error("POST /api/feedback/reset error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
