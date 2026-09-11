"use client";

import React from "react";
import { useFeedback } from "../context/FeedbackContext";
import { SparklesIcon, ClockIcon, CheckCircleIcon, TrendingUpIcon, ThumbsUpIcon } from "./ui/Icons";

export default function MetricsHeader() {
  const { metrics, setSelectedStatus } = useFeedback();

  const cards = [
    {
      label: "TOTAL FEEDBACK",
      value: metrics.total,
      subtext: "Logged client items",
      icon: SparklesIcon,
      accentColor: "text-slate-400",
      hoverBorder: "hover:border-slate-500/50",
      filterStatus: "All"
    },
    {
      label: "UNDER REVIEW",
      value: metrics.underReview,
      subtext: "Pending product triage",
      icon: ClockIcon,
      accentColor: "text-amber-400",
      hoverBorder: "hover:border-amber-400/50",
      filterStatus: "Under Review"
    },
    {
      label: "IN ROADMAP",
      value: metrics.planned + metrics.inProgress,
      subtext: `${metrics.inProgress} active, ${metrics.planned} planned`,
      icon: TrendingUpIcon,
      accentColor: "text-purple-300",
      hoverBorder: "hover:border-purple-400/50",
      filterStatus: "In Progress"
    },
    {
      label: "DELIVERED",
      value: metrics.completed,
      subtext: "Shipped to production",
      icon: CheckCircleIcon,
      accentColor: "text-emerald-400",
      hoverBorder: "hover:border-emerald-400/50",
      filterStatus: "Completed"
    },
    {
      label: "CLIENT UPVOTES",
      value: metrics.totalVotes,
      subtext: "Aggregated demand",
      icon: ThumbsUpIcon,
      accentColor: "text-rose-300",
      hoverBorder: "hover:border-rose-400/50",
      filterStatus: "All"
    }
  ];

  return (
    <div className="mb-6">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-br from-[#070c18] via-[#091024] to-[#251b5e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Bottom-right luminous ambient glow matching screenshot */}
        <div className="absolute -bottom-24 -right-20 w-[480px] h-[360px] bg-gradient-to-tl from-indigo-600/40 via-purple-600/25 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-7">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#0f172a]/80 text-slate-300 border border-slate-700/60 mb-3 backdrop-blur-sm shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live MongoDB Atlas Connection
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Client Voice & Product Innovation Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Collaborate directly with our engineering and product teams. Submit high-impact feature requests, upvote existing business requirements, and monitor real-time delivery status on our public roadmap.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-slate-400">Roadmap Velocity:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#042f2e]/90 text-emerald-400 border border-emerald-600/40 text-xs font-bold shadow-sm">
              98.4% On Schedule
            </span>
          </div>
        </div>

        {/* Glassmorphic Metric Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-5 border-t border-white/10 relative z-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => setSelectedStatus(card.filterStatus)}
                className={`group bg-[#0f172a]/60 border border-slate-800/80 ${card.hoverBorder} rounded-2xl p-4 text-left backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${card.accentColor}`}>
                    {card.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 transition-transform group-hover:scale-110">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {card.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
