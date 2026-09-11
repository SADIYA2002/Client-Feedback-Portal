"use client";

import React, { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";
import {
  XIcon,
  ThumbsUpIcon,
  MessageSquareIcon,
  BuildingIcon,
  TagIcon,
  ClockIcon,
  PaperclipIcon,
  TrashIcon
} from "./ui/Icons";
import { getStatusStyle, getPriorityStyle, formatDate } from "./FeedbackItem";

export default function FeedbackItemPopup({ feedback, onClose }) {
  const {
    feedbacks,
    userVotes,
    toggleUpvote,
    userRole,
    updateStatus,
    updatePriority,
    deleteFeedback,
    addComment,
    currentUser
  } = useFeedback();

  // Keep local reference updated from context if votes or comments change
  const itemId = feedback.id || feedback._id;
  const currentItem = feedbacks.find((f) => f.id === itemId || f._id === itemId) || feedback;
  const activeId = currentItem.id || currentItem._id || itemId;
  const isUpvoted = Boolean(userVotes[activeId] || userVotes[currentItem.id] || userVotes[currentItem._id]);

  const [newCommentText, setNewCommentText] = useState("");
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    addComment(activeId, newCommentText.trim());
    setNewCommentText("");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to permanently delete this feedback?")) {
      deleteFeedback(activeId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-sm">
                <TagIcon className="w-3 h-3 text-slate-400" />
                {currentItem.category}
              </span>

              {/* Status Badge or Staff Select */}
              {userRole === "staff" ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  <select
                    value={currentItem.status}
                    onChange={(e) => updateStatus(activeId, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${getStatusStyle(
                      currentItem.status
                    )}`}
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              ) : (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                    currentItem.status
                  )}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                  {currentItem.status}
                </span>
              )}

              {/* Priority */}
              {currentItem.priority && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityStyle(
                    currentItem.priority
                  )}`}
                >
                  {currentItem.priority} Priority
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {currentItem.title}
            </h2>

            {/* Submitter info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">{currentItem.clientCompany}</span>
              <span className="text-slate-300">•</span>
              <span>Submitted by {currentItem.clientName}</span>
              <span className="text-slate-300">•</span>
              <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(currentItem.createdAt)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors ml-4"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Description */}
          <div className="bg-white rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Business Case & Description
            </h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              {currentItem.description}
            </p>
          </div>

          {/* Attachments Section */}
          {currentItem.attachments && currentItem.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <PaperclipIcon className="w-3.5 h-3.5 text-indigo-500" />
                Attachments ({currentItem.attachments.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentItem.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePreviewImage(att.url)}
                    className="group border border-slate-200 hover:border-indigo-400 rounded-xl overflow-hidden cursor-pointer bg-slate-50 transition-all shadow-sm"
                  >
                    <div className="h-28 overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img
                        src={att.url}
                        alt={att.name || "Attachment"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-2 text-xs truncate font-medium text-slate-700">
                      {att.name || `Attachment ${idx + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upvote & Triage Bar */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleUpvote(activeId)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isUpvoted
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <ThumbsUpIcon className="w-4 h-4" filled={isUpvoted} />
                <span>{isUpvoted ? "Upvoted" : "Upvote Requirement"}</span>
                <span className="bg-white/20 text-current px-2 py-0.5 rounded-md text-[11px]">
                  {currentItem.votes || 0}
                </span>
              </button>
              <span className="text-xs text-slate-500 hidden sm:inline">
                {currentItem.votes || 0} clients support this priority
              </span>
            </div>

            {userRole === "staff" && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete Feedback</span>
              </button>
            )}
          </div>

          {/* Discussion / Comments Section */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquareIcon className="w-4 h-4 text-indigo-600" />
              <span>Discussion & Team Responses</span>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {(currentItem.comments || []).length}
              </span>
            </h4>

            {/* Comment List */}
            <div className="space-y-3.5 mb-6">
              {(currentItem.comments || []).length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No comments yet. Start the discussion below.
                </div>
              ) : (
                currentItem.comments.map((comment) => {
                  const isTeam = comment.authorRole === "Product Team";
                  return (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isTeam
                          ? "bg-indigo-50/50 border-indigo-100"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          {comment.avatar ? (
                            <img
                              src={comment.avatar}
                              alt={comment.authorName}
                              className="w-6 h-6 rounded-full object-cover border border-slate-300"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {comment.authorName.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-900">
                            {comment.authorName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isTeam
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {comment.authorRole}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8 whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment Composer */}
            <form onSubmit={handlePostComment} className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>
                  Posting as:{" "}
                  <strong className="text-slate-800">
                    {userRole === "staff" ? "Sarah Jenkins (Product Lead)" : currentUser.name}
                  </strong>
                </span>
                <span className="text-indigo-600 font-medium">
                  {userRole === "staff" ? "Product Team Response" : "Client Feedback"}
                </span>
              </div>
              <textarea
                rows={3}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={
                  userRole === "staff"
                    ? "Add a product team update, roadmap timeline, or request more technical details..."
                    : "Add your operational perspective or reply to the team..."
                }
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-40"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Client Feedback ID: <code className="font-mono text-slate-700">{activeId}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Lightbox Image Preview Modal if attachment clicked */}
      {activePreviewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setActivePreviewImage(null)}
        >
          <img
            src={activePreviewImage}
            alt="Full Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
