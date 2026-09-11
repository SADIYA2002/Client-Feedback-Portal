"use client";

import React, { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";
import { PRESET_PROFILES } from "../services/feedbackStorage";

export default function LoginScreen() {
  const { login, availableUsers } = useFeedback();
  const [activeTab, setActiveTab] = useState("preset"); // 'preset' | 'custom'

  // Custom login state
  const [customName, setCustomName] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState("Client");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customName.trim() || !customCompany.trim()) {
      setError("Please provide both your name and client organization.");
      return;
    }

    setIsSubmitting(true);
    const customId = "client-custom-" + Date.now().toString(36);

    const newProfile = {
      userId: customId,
      id: customId,
      name: customName.trim(),
      company: customCompany.trim(),
      email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, ".")}@${customCompany.toLowerCase().replace(/\s+/g, "")}.com`,
      role: customRole,
      tier: customRole === "Product Team" ? "Internal Staff • Admin" : "Client Enterprise Partner",
      avatarBg: customRole === "Product Team" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700",
      badgeColor: customRole === "Product Team" ? "bg-rose-600 text-white" : "bg-indigo-600 text-white",
      avatar: ""
    };

    await login(newProfile, true);
    setIsSubmitting(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 overflow-hidden select-none">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Portal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 text-white shadow-lg shadow-indigo-200 mb-2 ring-4 ring-indigo-50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Client Feedback & Roadmap Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Sign in to submit feature requests, upvote items, and track live roadmap status.
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("preset")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "preset"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Select User Account
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "custom"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Custom Sign-in
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {activeTab === "preset" ? (
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 sticky top-0 bg-white py-0.5 z-10">
                  Choose a profile to access inner portal:
                </div>

                {(availableUsers && availableUsers.length > 0 ? availableUsers : PRESET_PROFILES).map((profile) => {
                  const profileId = profile.id || profile.userId;
                  const initial = profile.role === "Product Team" ? "PM" : (profile.name ? profile.name.charAt(0).toUpperCase() : "U");
                  const isStaff = profile.role === "Product Team";

                  return (
                    <button
                      key={profileId}
                      onClick={() => login(profile)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex items-center justify-between group ${
                        isStaff
                          ? "border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300"
                          : "border-slate-200 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300"
                      } shadow-sm hover:shadow`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Profile Avatar Widget */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight flex-shrink-0 shadow-inner ${
                            profile.avatarBg || "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {initial}
                        </div>

                        {/* Name & Company */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {profile.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full flex-shrink-0 ${
                                isStaff
                                  ? "bg-rose-600 text-white"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {profile.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {profile.company}
                          </div>
                        </div>
                      </div>

                      {/* Right arrow */}
                      <div className="flex items-center gap-1.5 pl-2 flex-shrink-0">
                        <span className="hidden sm:inline text-[11px] font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                          Sign In →
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-300 transition-all">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom Login Form */
              <form onSubmit={handleCustomSubmit} className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Enter your client credentials:
                </div>

                {error && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">
                    Client Organization / Company *
                  </label>
                  <input
                    type="text"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">
                    Work Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. john@acme.com"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">
                    Access Role
                  </label>
                  <select
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Client">Client (Submit, Vote, Comment)</option>
                    <option value="Product Team">Product Team (Manage Statuses, Triage, Delete)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition-all mt-1"
                >
                  Enter Client Portal
                </button>
              </form>
            )}
          </div>

          {/* Security Footer */}
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Encrypted Local Session
            </span>
            <span>SOC2 Type II Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
