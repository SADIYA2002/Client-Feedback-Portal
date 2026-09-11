"use client";

import React from "react";
import { useFeedback } from "./context/FeedbackContext";
import LoginScreen from "./components/LoginScreen";
import MetricsHeader from "./components/MetricsHeader";
import FilterBar from "./components/FilterBar";
import FeedbackItem from "./components/FeedbackItem";
import RoadmapBoard from "./components/RoadmapBoard";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import FeedbackItemPopup from "./components/FeedbackItemPopup";
import Navbar from "./components/Navbar";
import { PlusIcon, SearchIcon, RotateCcwIcon, UserIcon } from "./components/ui/Icons";

export default function Home() {
  const {
    currentUser,
    isAuthenticated,
    logout,
    filteredFeedbacks,
    feedbacks,
    viewMode,
    isLoaded,
    isNewModalOpen,
    closeNewFeedbackModal,
    openNewFeedbackModal,
    activeItemModal,
    openDetailModal,
    closeDetailModal,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    setSelectedPriority
  } = useFeedback();

  // FIRST SCREEN: If user is not logged in, show the User Selection / Login Screen immediately
  if (!currentUser) {
    return <LoginScreen />;
  }

  // INNER PAGE: Authenticated Dashboard
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSelectedPriority("All");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Active User Status Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-500">
            Authenticated as: <strong className="text-slate-900 font-bold">{currentUser.name}</strong> ({currentUser.company})
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
            {currentUser.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="text-indigo-600 hover:text-indigo-800 font-bold underline transition-colors cursor-pointer text-xs"
        >
          Change User / Switch Profile →
        </button>
      </div>

      {/* Executive Metrics Header */}
      <MetricsHeader />

      {/* Filter, Search & View Controls */}
      <FilterBar />

      {/* Main Content Area: List View or Roadmap Board */}
      {viewMode === "roadmap" ? (
        <RoadmapBoard onOpenFeedback={openDetailModal} />
      ) : (
        <div>
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm my-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <SearchIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No matching client feedback found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                We couldn&apos;t find any feedback matching your current filters or search criteria. Try adjusting your search query or reset the filters.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <RotateCcwIcon className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
                <button
                  onClick={openNewFeedbackModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Submit New Feedback</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFeedbacks.map((item) => (
                <FeedbackItem
                  key={item.id}
                  feedback={item}
                  onOpen={() => openDetailModal(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Feedback Submission Modal */}
      {isNewModalOpen && (
        <FeedbackFormPopup onClose={closeNewFeedbackModal} />
      )}

      {/* Feedback Details & Comments Modal */}
      {activeItemModal && (
        <FeedbackItemPopup
          feedback={activeItemModal}
          onClose={closeDetailModal}
        />
      )}
      </main>
    </div>
  );
}
