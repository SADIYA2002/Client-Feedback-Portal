const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
let mongoUrl = process.env.MONGO_URL;
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("MONGO_URL=")) {
      mongoUrl = trimmed.replace("MONGO_URL=", "").trim();
    }
  }
}

if (!mongoUrl) {
  console.error("MONGO_URL not found in .env.local!");
  process.exit(1);
}

// Schemas
const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: "Client" },
    tier: { type: String, default: "Enterprise Tier" },
    badgeColor: { type: String, default: "bg-blue-600 text-white" },
    avatarBg: { type: String, default: "bg-blue-100 text-blue-700" },
    avatar: { type: String, default: "" }
  },
  { timestamps: true, collection: "users" }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    color: { type: String, default: "bg-slate-100 text-slate-700" },
    icon: { type: String, default: "tag" },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true, collection: "categories" }
);

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
  { timestamps: true, collection: "comments" }
);

const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    entityType: { type: String, default: "feedback" },
    entityId: { type: String, required: true },
    entityTitle: { type: String, default: "" },
    actorName: { type: String, default: "Anonymous" },
    actorRole: { type: String, default: "Client" },
    actorCompany: { type: String, default: "" },
    details: { type: String, default: "" }
  },
  { timestamps: true, collection: "activities" }
);

const feedbackSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    description: String,
    category: String,
    status: String,
    priority: String,
    clientName: String,
    clientCompany: String,
    clientEmail: String,
    votes: Number,
    upvotedBy: [String],
    attachments: Array,
    comments: Array
  },
  { timestamps: true, collection: "feedbacks" }
);

const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Comment = mongoose.model("Comment", commentSchema);
const Activity = mongoose.model("Activity", activitySchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);

const PRESET_USERS = [
  {
    userId: "client-1",
    name: "Marcus Vance",
    company: "Apex Financial Group",
    email: "m.vance@apexfinancial.com",
    role: "Client",
    tier: "Enterprise Tier • VIP Client",
    badgeColor: "bg-blue-600 text-white",
    avatarBg: "bg-blue-100 text-blue-700",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
  },
  {
    userId: "client-2",
    name: "Elena Rostova",
    company: "CloudScale Technologies",
    email: "elena@cloudscale.io",
    role: "Client",
    tier: "Scale Tier • Tech Partner",
    badgeColor: "bg-emerald-600 text-white",
    avatarBg: "bg-emerald-100 text-emerald-700",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80"
  },
  {
    userId: "client-3",
    name: "Dr. Sarah Chen",
    company: "BioHealth Innovations",
    email: "s.chen@biohealth.org",
    role: "Client",
    tier: "Enterprise Tier • Healthcare",
    badgeColor: "bg-purple-600 text-white",
    avatarBg: "bg-purple-100 text-purple-700",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
  },
  {
    userId: "staff-1",
    name: "Sarah Jenkins",
    company: "FeedbackHub (Product Team)",
    email: "sarah.jenkins@feedbackhub.internal",
    role: "Product Team",
    tier: "Internal Staff • Admin Access",
    badgeColor: "bg-rose-600 text-white",
    avatarBg: "bg-rose-100 text-rose-700",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
  }
];

const PRESET_CATEGORIES = [
  {
    name: "Feature Request",
    slug: "feature-request",
    description: "New functional capabilities, workflows, and enhancement requests",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: "sparkles",
    sortOrder: 1
  },
  {
    name: "Integration",
    slug: "integration",
    description: "API, webhooks, third-party connectors, and data synchronization",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "link",
    sortOrder: 2
  },
  {
    name: "UI / UX Improvement",
    slug: "ui-ux-improvement",
    description: "User interface polish, navigation, accessibility, and ergonomics",
    color: "bg-sky-50 text-sky-700 border-sky-200",
    icon: "layout",
    sortOrder: 3
  },
  {
    name: "Performance",
    slug: "performance",
    description: "Latency, query speed, throughput, and resource optimization",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "zap",
    sortOrder: 4
  },
  {
    name: "Security / Compliance",
    slug: "security-compliance",
    description: "Data protection, audit logging, SOC2/HIPAA compliance, and IAM",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "shield",
    sortOrder: 5
  },
  {
    name: "Bug / Issue",
    slug: "bug-issue",
    description: "Defects, error codes, edge-case failures, and regressions",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: "alert-circle",
    sortOrder: 6
  }
];

async function seedAtlas() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB Atlas successfully!");

    // 1. Seed users
    console.log("\n--- 1. Checking 'users' collection ---");
    for (const u of PRESET_USERS) {
      const existing = await User.findOne({ userId: u.userId });
      if (!existing) {
        await User.create(u);
        console.log(`Created user: ${u.name} (${u.role})`);
      } else {
        console.log(`User already exists: ${u.name}`);
      }
    }
    const userCount = await User.countDocuments();
    console.log(`Total 'users': ${userCount}`);

    // 2. Seed categories
    console.log("\n--- 2. Checking 'categories' collection ---");
    for (const cat of PRESET_CATEGORIES) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }
    const catCount = await Category.countDocuments();
    console.log(`Total 'categories': ${catCount}`);

    // 3. Migrate comments from existing feedbacks to 'comments' collection
    console.log("\n--- 3. Checking 'comments' collection ---");
    const feedbacks = await Feedback.find();
    let migratedComments = 0;
    for (const fb of feedbacks) {
      const fbId = fb.id || fb._id.toString();
      if (Array.isArray(fb.comments)) {
        for (const c of fb.comments) {
          const commentId = c.id || "c-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
          const existing = await Comment.findOne({ commentId: commentId });
          if (!existing) {
            await Comment.create({
              commentId: commentId,
              feedbackId: fbId,
              authorName: c.authorName || "Client",
              authorRole: c.authorRole || "Client",
              authorCompany: fb.clientCompany || "",
              authorEmail: "",
              avatar: c.avatar || "",
              content: c.content || ""
            });
            migratedComments++;
          }
        }
      }
    }
    const commentCount = await Comment.countDocuments();
    console.log(`Migrated ${migratedComments} comments. Total 'comments': ${commentCount}`);

    // 4. Seed initial activities if empty
    console.log("\n--- 4. Checking 'activities' collection ---");
    const actCount = await Activity.countDocuments();
    if (actCount === 0) {
      console.log("Seeding baseline activities audit trail...");
      for (const fb of feedbacks.slice(0, 5)) {
        await Activity.create({
          action: "FEEDBACK_CREATED",
          entityType: "feedback",
          entityId: fb.id || fb._id.toString(),
          entityTitle: fb.title,
          actorName: fb.clientName,
          actorRole: "Client",
          actorCompany: fb.clientCompany,
          details: `Submitted new feedback: "${fb.title}"`
        });
        if (fb.status !== "Under Review") {
          await Activity.create({
            action: "STATUS_CHANGED",
            entityType: "feedback",
            entityId: fb.id || fb._id.toString(),
            entityTitle: fb.title,
            actorName: "Sarah Jenkins",
            actorRole: "Product Team",
            actorCompany: "FeedbackHub (Product Team)",
            details: `Promoted item to status "${fb.status}"`
          });
        }
      }
    }
    const totalActivities = await Activity.countDocuments();
    console.log(`Total 'activities': ${totalActivities}`);

    // 5. Check feedbacks
    const feedbackCount = await Feedback.countDocuments();
    console.log(`\nTotal 'feedbacks': ${feedbackCount}`);

    console.log("\n==========================================");
    console.log("  ALL 5 COLLECTIONS IN MONGODB ATLAS:");
    console.log("==========================================");
    console.log(`  1. feedbacks   : ${feedbackCount} documents`);
    console.log(`  2. users       : ${userCount} documents`);
    console.log(`  3. categories  : ${catCount} documents`);
    console.log(`  4. comments    : ${commentCount} documents`);
    console.log(`  5. activities  : ${totalActivities} documents`);
    console.log("==========================================");

    await mongoose.disconnect();
    console.log("Disconnected. Database updated successfully!");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

seedAtlas();
