"use client";

import React from "react";
import { useFeedback } from "../context/FeedbackContext";
import { ThumbsUpIcon, MessageSquareIcon, BuildingIcon, TagIcon } from "./ui/Icons";
import { getPriorityStyle } from "./FeedbackItem";

export default function RoadmapBoard({ onOpenFeedback }) {
  const { filteredFeedbacks, toggleUpvote, userVotes } = useFeedback();

  const columns = [
    {
      id: "Planned",
      title: "Planned",
      description: "Scoped and prioritized for upcoming release cycles",
      headerColor: "border-blue-500 text-blue-700 bg-blue-50/70",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      id: "In Progress",
      title: "In Progress",
      description: "Active engineering and design implementation",
      headerColor: "border-purple-500 text-purple-700 bg-purple-50/70",
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      id: "Completed",
      title: "Completed",
      description: "Shipped and verified in live production",
      headerColor: "border-emerald-500 text-emerald-700 bg-emerald-50/70",
      badgeColor: "bg-emerald-100 text-emerald-800"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {columns.map((col) => {
        const items = filteredFeedbacks.filter((item) => item.status === col.id);

        return (
          <div
            key={col.id}
            className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`p-3.5 rounded-xl border-t-4 border-b border-l border-r border-slate-200 mb-4 ${col.headerColor}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {col.title}
                </h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                  {items.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                {col.description}
              </p>
            </div>

            {/* Column Cards */}
            <div className="space-y-3.5 flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                  <p className="text-xs">No feedback in this stage</p>
                </div>
              ) : (
                items.map((item) => {
                  const itemId = item.id || item._id;
                  const isUpvoted = Boolean(userVotes[itemId] || userVotes[item.id] || userVotes[item._id]);

                  return (
                    <div
                      key={itemId}
                      onClick={() => onOpenFeedback(item)}
                      className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      {/* Top tags */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                          {item.category}
                        </span>

                        {item.priority && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getPriorityStyle(item.priority)}`}>
                            {item.priority}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                        {item.title}
                      </h4>

                      {/* Description excerpt */}
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Card footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-500 truncate max-w-[130px]">
                          <BuildingIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate text-[11px] font-medium">{item.clientCompany}</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* Upvote button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUpvote(itemId);
                            }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold transition-all ${
                              isUpvoted
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                          >
                            <ThumbsUpIcon className="w-3 h-3" filled={isUpvoted} />
                            <span>{item.votes || 0}</span>
                          </button>

                          {/* Comment count */}
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <MessageSquareIcon className="w-3 h-3" />
                            <span>{(item.comments || []).length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
