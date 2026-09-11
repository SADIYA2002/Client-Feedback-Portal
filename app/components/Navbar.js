"use client";

import React, { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";
import { PlusIcon, CheckCircleIcon, AlertCircleIcon, ChevronDownIcon } from "./ui/Icons";
import { PRESET_PROFILES } from "../services/feedbackStorage";

export default function Navbar() {
  const {
    currentUser,
    isAuthenticated,
    logout,
    login,
    userRole,
    setUserRole,
    toast,
    openNewFeedbackModal,
    availableUsers
  } = useFeedback();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Portal Identity */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                    FeedbackHub
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Client Requirements & Roadmap Portal
                </p>
              </div>
            </div>

            {/* Right Side: Profile Widget & Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* If authenticated, show user profile widget button */}
              {isAuthenticated && currentUser ? (
                <>
                  {/* Active Profile Widget (Matches requested design in screenshot) */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50/90 hover:bg-slate-100 border border-slate-200/90 rounded-2xl transition-all text-left shadow-sm group"
                      title="Click to switch user or sign out"
                    >
                      {/* Avatar Square */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight shadow-inner ${
                          currentUser.avatarBg || "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {currentUser.role === "Product Team" ? "PM" : currentUser.name.charAt(0)}
                      </div>

                      {/* Name & Company */}
                      <div className="hidden sm:block text-left">
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {currentUser.company}
                        </div>
                      </div>

                      <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showUserDropdown && (
                      <div
                        className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150"
                        onMouseLeave={() => setShowUserDropdown(false)}
                      >
                        <div className="p-3 border-b border-slate-100">
                          <div className="text-[10px] font-bold uppercase text-slate-400">Signed In As</div>
                          <div className="text-sm font-bold text-slate-900 mt-0.5">{currentUser.name}</div>
                          <div className="text-xs text-slate-500">{currentUser.company}</div>
                          <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mt-2">
                            {currentUser.role}
                          </span>
                        </div>

                        {/* Quick switch options */}
                        <div className="py-2 max-h-60 overflow-y-auto">
                          <div className="text-[11px] font-semibold text-slate-400 px-3 pb-1">
                            Switch Account:
                          </div>
                          {(availableUsers || PRESET_PROFILES).map((p) => {
                            const pId = p.id || p.userId;
                            const currentId = currentUser.id || currentUser.userId;
                            if (pId === currentId) return null;
                            return (
                              <button
                                key={pId}
                                onClick={() => {
                                  login(p);
                                  setShowUserDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                              >
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                    p.avatarBg || "bg-indigo-100 text-indigo-700"
                                  }`}
                                >
                                  {p.role === "Product Team" ? "PM" : (p.name ? p.name.charAt(0).toUpperCase() : "U")}
                                </div>
                                <div className="truncate">
                                  <div className="font-bold text-slate-800 truncate">{p.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{p.company}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Logout / Return to first screen */}
                        <div className="border-t border-slate-100 pt-1">
                          <button
                            onClick={() => {
                              setShowUserDropdown(false);
                              logout();
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-between"
                          >
                            <span>Change User / Sign Out</span>
                            <span className="text-[10px] text-rose-400">First Screen →</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Feedback CTA Button */}
                  <button
                    onClick={openNewFeedbackModal}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Submit feedback</span>
                  </button>
                </>
              ) : (
                <div className="text-xs font-semibold text-slate-500">
                  Select Profile to Continue
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white ${
              toast.type === "warning"
                ? "bg-amber-600"
                : toast.type === "info"
                ? "bg-slate-800"
                : "bg-emerald-600"
            }`}
          >
            {toast.type === "warning" ? (
              <AlertCircleIcon className="w-4 h-4" />
            ) : (
              <CheckCircleIcon className="w-4 h-4" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
