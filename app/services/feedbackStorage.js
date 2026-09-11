// Purge any legacy data from localStorage so all data stays in MongoDB Atlas
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("business_client_feedback_system_v1");
    localStorage.removeItem("business_client_feedback_user_votes_v1");
    localStorage.removeItem("business_client_feedback_current_user_v1");
    localStorage.removeItem("business_client_feedback_custom_users_v1");
    localStorage.removeItem("feedback_system_items");
    localStorage.removeItem("feedback_system_user_votes");
    localStorage.removeItem("feedback_system_current_user");
    localStorage.removeItem("feedback_system_custom_users");
  } catch (e) {}
}

const SESSION_USER_KEY = "portal_active_session_user";

export const SAMPLE_FEEDBACKS = [
  {
    id: "fb-101",
    title: "Automated Weekly Executive PDF Report Export",
    description: "Our board requires automated weekly summary reports delivered via email in high-resolution PDF format. Currently, we have to manually capture dashboards every Monday morning. Having scheduled PDF exports with executive KPI summaries would save our operations team 4+ hours per week.",
    category: "Feature Request",
    status: "In Progress",
    priority: "High",
    clientName: "Marcus Vance",
    clientCompany: "Apex Financial Group",
    clientEmail: "m.vance@apexfinancial.com",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    votes: 42,
    upvotedBy: ["client-1", "client-3", "client-5"],
    attachments: [
      {
        name: "executive-summary-mockup.png",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
      }
    ],
    comments: [
      {
        id: "c-1",
        authorName: "Sarah Jenkins (Product Lead)",
        authorRole: "Product Team",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        content: "We have scoped this for Sprint 14! We are incorporating custom branding and schedule frequency options (Weekly/Monthly).",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: "c-2",
        authorName: "Marcus Vance",
        authorRole: "Client",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
        content: "That aligns perfectly with our quarterly audit schedule. Appreciate the fast turnaround!",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "fb-102",
    title: "Real-time Webhook Integration for CRM Systems",
    description: "We need outbound webhooks to sync client activity events instantly into Salesforce and HubSpot. Our sales engineers currently run daily CSV scripts which creates sync lag during critical customer onboarding stages.",
    category: "Integration",
    status: "Planned",
    priority: "Urgent",
    clientName: "Elena Rostova",
    clientCompany: "CloudScale Technologies",
    clientEmail: "elena@cloudscale.io",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    votes: 38,
    upvotedBy: ["client-2", "client-4"],
    attachments: [],
    comments: [
      {
        id: "c-3",
        authorName: "Alex Rivera (API Architect)",
        authorRole: "Product Team",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
        content: "Webhook payload schemas and retry logic specifications are drafted. Target delivery: Q4 release.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "fb-103",
    title: "Granular Role-Based Access Control (RBAC) & Audit Logs",
    description: "To comply with HIPAA and SOC2 Type II compliance guidelines, our compliance security department requires customizable role permissions (e.g., Billing Admin, Read-Only Auditor, Project Manager) and tamper-proof audit trails.",
    category: "Security",
    status: "Completed",
    priority: "High",
    clientName: "Dr. Sarah Chen",
    clientCompany: "BioHealth Innovations",
    clientEmail: "s.chen@biohealth.org",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    votes: 56,
    upvotedBy: ["client-1", "client-2", "client-3", "client-6"],
    attachments: [],
    comments: [
      {
        id: "c-4",
        authorName: "Sarah Jenkins (Product Lead)",
        authorRole: "Product Team",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        content: "RBAC v2 with comprehensive audit trail logging was deployed in release 2.4.0. Documentation has been emailed to your compliance officer.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "fb-104",
    title: "Multi-Currency Invoice Settlement & Tax Breakdown",
    description: "Our European and APAC subsidiaries need invoices generated in EUR and SGD with localized VAT/GST tax identification breakdowns, rather than purely USD conversion.",
    category: "Billing & Invoicing",
    status: "Under Review",
    priority: "Medium",
    clientName: "David Kim",
    clientCompany: "OmniLogistics Global",
    clientEmail: "dkim@omnilogistics.com",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    votes: 19,
    upvotedBy: ["client-3"],
    attachments: [],
    comments: []
  },
  {
    id: "fb-105",
    title: "Dark Mode Theme for Late-Night Operations Center",
    description: "Our 24/7 incident command center operators work in low-light environments and frequently request a high-contrast dark theme to reduce eye strain over 12-hour shifts.",
    category: "UI/UX Enhancement",
    status: "Planned",
    priority: "Low",
    clientName: "Chloe Dupont",
    clientCompany: "Vanguard Media Partners",
    clientEmail: "c.dupont@vanguardmedia.com",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    votes: 27,
    upvotedBy: ["client-1", "client-4", "client-5"],
    attachments: [
      {
        name: "dark-mode-concept.png",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
      }
    ],
    comments: [
      {
        id: "c-5",
        authorName: "Alex Rivera (Design Lead)",
        authorRole: "Product Team",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
        content: "Design system tokens for dark mode palette are finalized. Engineering will implement after the Q4 release.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "fb-106",
    title: "Slow Query Latency on Bulk Record Exports exceeding 100k items",
    description: "When downloading complete transaction logs exceeding 100,000 rows, the browser request times out after 60 seconds without streaming the response in chunks.",
    category: "Performance",
    status: "In Progress",
    priority: "Urgent",
    clientName: "Marcus Vance",
    clientCompany: "Apex Financial Group",
    clientEmail: "m.vance@apexfinancial.com",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    votes: 31,
    upvotedBy: ["client-1", "client-2"],
    attachments: [],
    comments: [
      {
        id: "c-6",
        authorName: "Alex Rivera (API Architect)",
        authorRole: "Product Team",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
        content: "We are migrating bulk exports to an asynchronous background job with signed S3 download links delivered via in-app notification.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  }
];

export const PRESET_PROFILES = [
  {
    id: "client-1",
    name: "Marcus Vance",
    company: "Apex Financial Group",
    email: "m.vance@apexfinancial.com",
    role: "Client",
    tier: "Enterprise Tier • VIP Client",
    badgeColor: "bg-blue-600 text-white",
    avatarBg: "bg-blue-100 text-blue-700"
  },
  {
    id: "client-2",
    name: "Elena Rostova",
    company: "CloudScale Technologies",
    email: "elena@cloudscale.io",
    role: "Client",
    tier: "Scale Tier • Tech Partner",
    badgeColor: "bg-emerald-600 text-white",
    avatarBg: "bg-emerald-100 text-emerald-700"
  },
  {
    id: "client-3",
    name: "Dr. Sarah Chen",
    company: "BioHealth Innovations",
    email: "s.chen@biohealth.org",
    role: "Client",
    tier: "Enterprise Tier • Healthcare",
    badgeColor: "bg-purple-600 text-white",
    avatarBg: "bg-purple-100 text-purple-700"
  },
  {
    id: "staff-1",
    name: "Sarah Jenkins",
    company: "FeedbackHub (Product Team)",
    email: "sarah.jenkins@feedbackhub.internal",
    role: "Product Team",
    tier: "Internal Staff • Admin Access",
    badgeColor: "bg-rose-600 text-white",
    avatarBg: "bg-rose-100 text-rose-700"
  }
];

export const feedbackStorage = {
  isSessionAvailable() {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  },

  getCurrentUser() {
    if (!this.isSessionAvailable()) return null;
    try {
      const data = sessionStorage.getItem(SESSION_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (!this.isSessionAvailable()) return;
    try {
      if (user) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY);
      }
    } catch (e) {
      console.error("Failed to save session user", e);
    }
  },

  clearCurrentUser() {
    if (!this.isSessionAvailable()) return;
    try {
      sessionStorage.removeItem(SESSION_USER_KEY);
    } catch (e) {
      console.error("Failed to clear session user", e);
    }
  },

  // Derive user votes directly from MongoDB Atlas feedbacks array
  getUserVotes(feedbacks = [], currentUserId = null) {
    if (!currentUserId || !Array.isArray(feedbacks)) return {};
    const votes = {};
    for (const fb of feedbacks) {
      const id = fb.id || fb._id;
      if (Array.isArray(fb.upvotedBy) && fb.upvotedBy.includes(currentUserId)) {
        votes[id] = true;
      }
    }
    return votes;
  },

  // Read all from MongoDB Atlas via Next.js API
  async getFeedbacks() {
    try {
      const res = await fetch("/api/feedback", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.warn("Could not fetch from MongoDB Atlas directly, using baseline", e);
    }
    return SAMPLE_FEEDBACKS;
  },

  // Add new feedback to MongoDB Atlas
  async addFeedback(item) {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const created = await res.json();
        return created;
      }
    } catch (e) {
      console.error("Failed to post feedback to MongoDB Atlas", e);
    }
    return null;
  },

  // Update status/priority in MongoDB Atlas
  async updateFeedback(id, updates) {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Failed to update feedback in MongoDB Atlas", e);
    }
    return null;
  },

  // Delete feedback from MongoDB Atlas
  async deleteFeedback(id) {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE"
      });
      return res.ok;
    } catch (e) {
      console.error("Failed to delete feedback in MongoDB Atlas", e);
      return false;
    }
  },

  // Get users directly from MongoDB Atlas
  async getUsers() {
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users) && users.length > 0) {
          return users;
        }
      }
    } catch (e) {
      console.warn("Could not fetch users from MongoDB Atlas, using preset profiles", e);
    }
    return PRESET_PROFILES;
  },

  // Save new user profile directly to MongoDB Atlas users collection
  async addUser(user) {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Failed to save user to MongoDB Atlas", e);
    }
    return user;
  },

  // Get categories from MongoDB Atlas
  async getCategories() {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (res.ok) {
        const cats = await res.json();
        if (Array.isArray(cats) && cats.length > 0) return cats;
      }
    } catch (e) {
      console.warn("Could not fetch categories from MongoDB Atlas", e);
    }
    return [];
  },

  // Get activities audit log from MongoDB Atlas
  async getActivities() {
    try {
      const res = await fetch("/api/activities", { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Could not fetch activities from MongoDB Atlas", e);
    }
    return [];
  },

  // Toggle upvote in MongoDB Atlas
  async toggleUpvote(id, userId = "current-user", userName = "Client") {
    try {
      const res = await fetch(`/api/feedback/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Failed to vote in MongoDB Atlas", e);
    }
    return { hasVoted: false };
  },

  // Add comment in MongoDB Atlas
  async addComment(feedbackId, commentData) {
    try {
      const res = await fetch(`/api/feedback/${feedbackId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData)
      });
      if (res.ok) {
        const result = await res.json();
        return result.comment;
      }
    } catch (e) {
      console.error("Failed to add comment in MongoDB Atlas", e);
    }
    return null;
  },

  // Reset MongoDB Atlas collection to baseline
  async resetToSampleData() {
    try {
      const res = await fetch("/api/feedback/reset", {
        method: "POST"
      });
      if (res.ok) {
        return await this.getFeedbacks();
      }
    } catch (e) {
      console.error("Failed to reset MongoDB Atlas database", e);
    }
    return SAMPLE_FEEDBACKS;
  },

  exportToJSON(feedbacks = []) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbacks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `client-feedback-atlas-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportToCSV(feedbacks = []) {
    if (!feedbacks || feedbacks.length === 0) return;
    const headers = ["ID", "Title", "Category", "Status", "Priority", "Client Name", "Client Company", "Client Email", "Votes", "Comments Count", "Created At"];
    const rows = feedbacks.map(fb => [
      `"${fb.id || fb._id}"`,
      `"${(fb.title || "").replace(/"/g, '""')}"`,
      `"${fb.category || ""}"`,
      `"${fb.status || ""}"`,
      `"${fb.priority || ""}"`,
      `"${(fb.clientName || "").replace(/"/g, '""')}"`,
      `"${(fb.clientCompany || "").replace(/"/g, '""')}"`,
      `"${fb.clientEmail || ""}"`,
      fb.votes || 0,
      (fb.comments || []).length,
      `"${fb.createdAt || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `client-feedback-atlas-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
