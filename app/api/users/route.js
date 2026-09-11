import User from "@/app/models/User";
import { connect } from "@/app/utils/DbConfog";
import { PRESET_PROFILES } from "@/app/services/feedbackStorage";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connect();
    let users = await User.find().sort({ createdAt: 1 }).lean();

    if (!users || users.length === 0) {
      console.log("Seeding MongoDB Atlas users collection...");
      const formatted = PRESET_PROFILES.map((p) => ({
        userId: p.id,
        name: p.name,
        company: p.company,
        email: p.email,
        role: p.role,
        tier: p.tier,
        badgeColor: p.badgeColor,
        avatarBg: p.avatarBg,
        avatar: p.avatar || ""
      }));
      await User.insertMany(formatted);
      users = await User.find().sort({ createdAt: 1 }).lean();
    }

    const formattedUsers = users.map((u) => ({
      ...u,
      id: u.userId || u._id.toString(),
      _id: u._id.toString()
    }));

    return Response.json(formattedUsers, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const data = await request.json();

    const userId = data.userId || data.id || "user-" + Date.now().toString(36);

    // If existing by userId or email, return or update
    let existingUser = null;
    if (data.email) {
      existingUser = await User.findOne({ $or: [{ userId }, { email: data.email }] });
    } else {
      existingUser = await User.findOne({ userId });
    }

    if (existingUser) {
      existingUser.name = data.name || existingUser.name;
      existingUser.company = data.company || existingUser.company;
      existingUser.role = data.role || existingUser.role;
      existingUser.tier = data.tier || existingUser.tier;
      if (data.badgeColor) existingUser.badgeColor = data.badgeColor;
      if (data.avatarBg) existingUser.avatarBg = data.avatarBg;
      await existingUser.save();
      return Response.json(existingUser, { status: 200 });
    }

    const newUser = await User.create({
      userId: userId,
      name: data.name,
      company: data.company || "Independent",
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, ".")}@${(data.company || "company").toLowerCase().replace(/\s+/g, "")}.com`,
      role: data.role || "Client",
      tier: data.tier || (data.role === "Product Team" ? "Internal Staff • Admin" : "Client Enterprise Partner"),
      badgeColor: data.badgeColor || (data.role === "Product Team" ? "bg-rose-600 text-white" : "bg-indigo-600 text-white"),
      avatarBg: data.avatarBg || (data.role === "Product Team" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"),
      avatar: data.avatar || ""
    });

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
