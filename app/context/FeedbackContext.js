"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { feedbackStorage, SAMPLE_FEEDBACKS, PRESET_PROFILES } from "../services/feedbackStorage";

const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Users list (loaded dynamically from MongoDB Atlas & local custom additions)
  const [availableUsers, setAvailableUsers] = useState(PRESET_PROFILES);

  // Authentication & Current User State (First Screen Gating)
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("client"); // 'client' | 'staff'

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [sortBy, setSortBy] = useState("votes"); // 'votes', 'newest', 'oldest', 'comments'
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'roadmap'

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeItemModal, setActiveItemModal] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch feedbacks from MongoDB Atlas
  const loadFeedbacksFromAtlas = useCallback(async () => {
    const data = await feedbackStorage.getFeedbacks();
    setFeedbacks(data);
    const loadedVotes = feedbackStorage.getUserVotes();
    setUserVotes(loadedVotes);
  }, []);

  // Fetch users from MongoDB Atlas
  const loadUsers = useCallback(async () => {
    const users = await feedbackStorage.getUsers();
    if (Array.isArray(users) && users.length > 0) {
      setAvailableUsers(users);
    }
  }, []);

  // Initial client load
  useEffect(() => {
    const init = async () => {
      const storedUser = feedbackStorage.getCurrentUser();
      if (storedUser) {
        setCurrentUser(storedUser);
        setUserRole(storedUser.role === "Product Team" ? "staff" : "client");
      }
      await Promise.all([loadFeedbacksFromAtlas(), loadUsers()]);
      setIsLoaded(true);
    };
    init();
  }, [loadFeedbacksFromAtlas, loadUsers]);

  // Login handler with support for saving custom users
  const handleLogin = async (userProfile, isCustom = false) => {
    let finalProfile = userProfile;
    if (isCustom) {
      finalProfile = await feedbackStorage.addUser(userProfile);
      setAvailableUsers((prev) => {
        const id = finalProfile.id || finalProfile.userId;
        const exists = prev.some((u) => (u.id || u.userId) === id);
        return exists ? prev : [finalProfile, ...prev];
      });
    }
    feedbackStorage.setCurrentUser(finalProfile);
    setCurrentUser(finalProfile);
    setUserRole(finalProfile.role === "Product Team" ? "staff" : "client");
    showToast(`Welcome back, ${finalProfile.name}! Accessing inner dashboard...`, "success");
  };

  // Logout / Switch User handler (returns to first login screen)
  const handleLogout = () => {
    feedbackStorage.clearCurrentUser();
    setCurrentUser(null);
    loadUsers(); // Refresh users list so new additions show immediately
    showToast("Signed out. Select a user account to continue.", "info");
  };

  // Compute metrics
  const metrics = useMemo(() => {
    const total = feedbacks.length;
    const underReview = feedbacks.filter((f) => f.status === "Under Review").length;
    const planned = feedbacks.filter((f) => f.status === "Planned").length;
    const inProgress = feedbacks.filter((f) => f.status === "In Progress").length;
    const completed = feedbacks.filter((f) => f.status === "Completed").length;
    const totalVotes = feedbacks.reduce((acc, curr) => acc + (curr.votes || 0), 0);

    return {
      total,
      underReview,
      planned,
      inProgress,
      completed,
      totalVotes
    };
  }, [feedbacks]);

  // Filtered & Sorted Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks
      .filter((item) => {
        // Search filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchClient = item.clientCompany?.toLowerCase().includes(q) || item.clientName?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchClient && !matchCategory) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "All" && item.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== "All" && item.status !== selectedStatus) {
          return false;
        }

        // Priority filter
        if (selectedPriority !== "All" && item.priority !== selectedPriority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "votes") {
          return (b.votes || 0) - (a.votes || 0);
        }
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === "comments") {
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        }
        return 0;
      });
  }, [feedbacks, searchTerm, selectedCategory, selectedStatus, selectedPriority, sortBy]);

  // Actions connecting to MongoDB Atlas
  const handleAddFeedback = async (newFeedbackData) => {
    const activeUser = currentUser || {
      name: "Marcus Vance",
      company: "Apex Financial Group",
      email: "m.vance@apexfinancial.com"
    };

    const payload = {
      ...newFeedbackData,
      clientName: newFeedbackData.clientName || activeUser.name,
      clientCompany: newFeedbackData.clientCompany || activeUser.company,
      clientEmail: newFeedbackData.clientEmail || activeUser.email,
      userId: activeUser.id || "current-user"
    };

    const created = await feedbackStorage.addFeedback(payload);
    if (created) {
      setFeedbacks((prev) => [created, ...prev]);
      setUserVotes(feedbackStorage.getUserVotes());
      showToast("Feedback stored in MongoDB Atlas successfully!", "success");
    } else {
      showToast("Saved locally (offline mode)", "info");
    }
    return created;
  };

  const handleUpdateStatus = async (id, newStatus) => {
    // Optimistic UI update
    setFeedbacks((prev) =>
      prev.map((fb) => ((fb.id === id || fb._id === id) ? { ...fb, status: newStatus } : fb))
    );
    await feedbackStorage.updateFeedback(id, { status: newStatus });
    showToast(`Status updated to "${newStatus}" in MongoDB Atlas`, "info");
  };

  const handleUpdatePriority = async (id, newPriority) => {
    // Optimistic UI update
    setFeedbacks((prev) =>
      prev.map((fb) => ((fb.id === id || fb._id === id) ? { ...fb, priority: newPriority } : fb))
    );
    await feedbackStorage.updateFeedback(id, { priority: newPriority });
    showToast(`Priority updated to "${newPriority}" in MongoDB Atlas`, "info");
  };

  const handleDeleteFeedback = async (id) => {
    setFeedbacks((prev) => prev.filter((fb) => fb.id !== id && fb._id !== id));
    await feedbackStorage.deleteFeedback(id);
    showToast("Feedback deleted from MongoDB Atlas", "warning");
  };

  const handleToggleUpvote = async (id) => {
    const userId = currentUser ? currentUser.id : "guest-user";
    const userName = currentUser ? currentUser.name : "Guest Client";
    const result = await feedbackStorage.toggleUpvote(id, userId, userName);

    if (result && result.feedback) {
      setFeedbacks((prev) =>
        prev.map((fb) => ((fb.id === id || fb._id === id) ? result.feedback : fb))
      );
    } else {
      // Fallback local toggle
      const hasVoted = Boolean(userVotes[id]);
      setFeedbacks((prev) =>
        prev.map((fb) => {
          if (fb.id === id || fb._id === id) {
            return { ...fb, votes: Math.max(0, (fb.votes || 0) + (hasVoted ? -1 : 1)) };
          }
          return fb;
        })
      );
      feedbackStorage.recordUserVote(id, !hasVoted);
    }

    setUserVotes(feedbackStorage.getUserVotes());
    if (result.hasVoted) {
      showToast("Vote recorded in MongoDB Atlas!", "success");
    } else {
      showToast("Vote removed in MongoDB Atlas.", "info");
    }
  };

  const handleAddComment = async (feedbackId, content) => {
    const isStaff = userRole === "staff";
    const commentPayload = {
      content,
      authorName: isStaff ? "Sarah Jenkins (Product Lead)" : (currentUser?.name || "Client Representative"),
      authorRole: isStaff ? "Product Team" : "Client",
      authorCompany: isStaff ? "FeedbackHub (Product Team)" : (currentUser?.company || "Enterprise Client"),
      authorEmail: isStaff ? "sarah.jenkins@feedbackhub.internal" : (currentUser?.email || ""),
      avatar: isStaff
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
        : (currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80")
    };

    const newComment = await feedbackStorage.addComment(feedbackId, commentPayload);
    if (newComment) {
      setFeedbacks((prev) =>
        prev.map((fb) => {
          if (fb.id === feedbackId || fb._id === feedbackId) {
            const comments = Array.isArray(fb.comments) ? [...fb.comments, newComment] : [newComment];
            return { ...fb, comments };
          }
          return fb;
        })
      );
    }
    showToast("Comment saved to MongoDB Atlas", "success");
    return newComment;
  };

  const handleResetSampleData = async () => {
    const resetData = await feedbackStorage.resetToSampleData();
    setFeedbacks(resetData);
    setUserVotes(feedbackStorage.getUserVotes());
    showToast("MongoDB Atlas re-seeded with enterprise baseline data", "info");
  };

  const handleExportJSON = () => {
    feedbackStorage.exportToJSON(feedbacks);
    showToast("Exported MongoDB Atlas records as JSON", "success");
  };

  const handleExportCSV = () => {
    feedbackStorage.exportToCSV(feedbacks);
    showToast("Exported MongoDB Atlas report as CSV", "success");
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        filteredFeedbacks,
        userVotes,
        isLoaded,
        metrics,
        // Auth / User Gating
        currentUser,
        setCurrentUser,
        isAuthenticated: Boolean(currentUser),
        login: handleLogin,
        logout: handleLogout,
        userRole,
        setUserRole,
        availableUsers,
        loadUsers,
        // Filter state
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        selectedPriority,
        setSelectedPriority,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        // Modal State
        isNewModalOpen,
        setIsNewModalOpen,
        activeItemModal,
        setActiveItemModal,
        openNewFeedbackModal: () => setIsNewModalOpen(true),
        closeNewFeedbackModal: () => setIsNewModalOpen(false),
        openDetailModal: (item) => setActiveItemModal(item),
        closeDetailModal: () => setActiveItemModal(null),
        // Actions
        addFeedback: handleAddFeedback,
        updateStatus: handleUpdateStatus,
        updatePriority: handleUpdatePriority,
        deleteFeedback: handleDeleteFeedback,
        toggleUpvote: handleToggleUpvote,
        addComment: handleAddComment,
        resetSampleData: handleResetSampleData,
        exportJSON: handleExportJSON,
        exportCSV: handleExportCSV,
        // Toast
        toast,
        showToast
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
