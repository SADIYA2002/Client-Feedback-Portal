"use client";

import React from "react";
import { useFeedback } from "../context/FeedbackContext";
import {
  ThumbsUpIcon,
  MessageSquareIcon,
  PaperclipIcon,
  BuildingIcon,
  UserIcon,
  TagIcon,
  TrashIcon
} from "./ui/Icons";

export const getStatusStyle = (status) => {
  switch (status) {
    case "Under Review":
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    case "Planned":
      return "bg-blue-50 text-blue-700 border-blue-200/80";
    case "In Progress":
      return "bg-purple-50 text-purple-700 border-purple-200/80";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    case "Declined":
      return "bg-slate-100 text-slate-600 border-slate-200/80";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export const getPriorityStyle = (priority) => {
  switch (priority) {
    case "Urgent":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "High":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Medium":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Low":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return isoString;
  }
};

export default function FeedbackItem({ feedback, onOpen }) {
  const { userVotes, toggleUpvote, userRole, updateStatus, deleteFeedback } = useFeedback();

  const itemId = feedback.id || feedback._id;
  const isUpvoted = Boolean(userVotes[itemId] || userVotes[feedback.id] || userVotes[feedback._id]);

  const handleVoteClick = (e) => {
    e.stopPropagation();
    toggleUpvote(itemId);
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    updateStatus(itemId, e.target.value);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this feedback item?")) {
      deleteFeedback(itemId);
    }
  };

  return (
    <div
      onClick={onOpen}
      className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 relative"
    >
      {/* Upvote Button (Left) */}
      <button
        onClick={handleVoteClick}
        aria-label="Upvote this feedback"
        className={`flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 py-2.5 px-2 rounded-xl border transition-all duration-150 ${
          isUpvoted
            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm hover:bg-indigo-700"
            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
        }`}
      >
        <ThumbsUpIcon className="w-4 h-4 mb-0.5" filled={isUpvoted} />
        <span className="text-xs font-bold tracking-tight">
          {feedback.votes || 0}
        </span>
        <span className="text-[10px] uppercase font-semibold opacity-80">
          {isUpvoted ? "Voted" : "Vote"}
        </span>
      </button>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Category */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <TagIcon className="w-3 h-3 text-slate-400" />
            {feedback.category}
          </span>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(
              feedback.status
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80"></span>
            {feedback.status}
          </span>

          {/* Priority Indicator */}
          {feedback.priority && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getPriorityStyle(
                feedback.priority
              )}`}
            >
              {feedback.priority}
            </span>
          )}

          {/* Timestamp */}
          <span className="text-xs text-slate-400 ml-auto hidden sm:inline-block">
            {formatDate(feedback.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 line-clamp-1">
          {feedback.title}
        </h3>

        {/* Description Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {feedback.description}
        </p>

        {/* Card Footer Metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          {/* Client Company & Submitter */}
          <div className="flex items-center gap-1.5">
            <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{feedback.clientCompany}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{feedback.clientName}</span>
          </div>

          {/* Attachment counter */}
          {feedback.attachments && feedback.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <PaperclipIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>{feedback.attachments.length} file{feedback.attachments.length > 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Comments counter */}
          <div className="flex items-center gap-1 text-slate-500 font-medium ml-auto">
            <MessageSquareIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{(feedback.comments || []).length} comment{(feedback.comments || []).length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Staff Management Action (Optional: visible when team role is active) */}
      {userRole === "staff" && (
        <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:border-l sm:pl-4 border-slate-200">
          <select
            value={feedback.status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Under Review">Under Review</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Declined">Declined</option>
          </select>
          <button
            onClick={handleDelete}
            title="Delete Feedback"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
