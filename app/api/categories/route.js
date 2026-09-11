import Category from "@/app/models/Category";
import { connect } from "@/app/utils/DbConfog";

export const dynamic = "force-dynamic";

export const DEFAULT_CATEGORIES = [
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

export const GET = async () => {
  try {
    await connect();
    let categories = await Category.find().sort({ sortOrder: 1 });

    if (!categories || categories.length === 0) {
      console.log("Seeding MongoDB Atlas categories collection...");
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ sortOrder: 1 });
    }

    return Response.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
