"use client";

import React, { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";
import {
  SearchIcon,
  XIcon,
  DownloadIcon,
  RotateCcwIcon,
  LayoutListIcon,
  KanbanIcon,
  ChevronDownIcon
} from "./ui/Icons";

const CATEGORIES = [
  "All",
  "Feature Request",
  "Integration",
  "Security",
  "UI/UX Enhancement",
  "Performance",
  "Billing & Invoicing",
  "Bug Report"
];

const STATUSES = [
  "All",
  "Under Review",
  "Planned",
  "In Progress",
  "Completed",
  "Declined"
];

const PRIORITIES = [
  "All",
  "Low",
  "Medium",
  "High",
  "Urgent"
];

export default function FilterBar() {
  const {
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
    filteredFeedbacks,
    feedbacks,
    exportCSV,
    exportJSON,
    resetSampleData
  } = useFeedback();

  const [showExportMenu, setShowExportMenu] = useState(false);

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    selectedStatus !== "All" ||
    selectedPriority !== "All";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSelectedPriority("All");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
      {/* Top row: Search, View Mode Toggle, and Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keyword, client company, or feature description..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Toggle & Export / Reset Tools */}
        <div className="flex items-center gap-2 justify-end">
          {/* List / Roadmap Board Switcher */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("roadmap")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "roadmap"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
            >
              <DownloadIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
              <ChevronDownIcon className="w-3 h-3 text-slate-400" />
            </button>
            {showExportMenu && (
              <div
                className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  onClick={() => {
                    exportCSV();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                >
                  <span>Export to CSV (Excel)</span>
                  <span className="text-[10px] text-slate-400">.csv</span>
                </button>
                <button
                  onClick={() => {
                    exportJSON();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                >
                  <span>Export Raw Data</span>
                  <span className="text-[10px] text-slate-400">.json</span>
                </button>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm("Reset feedback data to standard corporate sample set?")) {
                resetSampleData();
              }
            }}
            title="Reset to default sample data"
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
          >
            <RotateCcwIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Second row: Dropdown filters & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {pri}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 ml-1 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Sort selector & Record Count */}
        <div className="flex items-center gap-3 text-xs ml-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="votes">Most Upvoted</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="comments">Most Discussed</option>
            </select>
          </div>

          <span className="text-slate-400">|</span>

          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredFeedbacks.length}</strong> of {feedbacks.length}
          </span>
        </div>
      </div>
    </div>
  );
}
