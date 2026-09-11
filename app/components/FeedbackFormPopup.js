"use client";

import React, { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";
import { XIcon, PaperclipIcon, TagIcon, BuildingIcon, UserIcon, MailIcon, AlertCircleIcon } from "./ui/Icons";

const CATEGORIES = [
  "Feature Request",
  "Integration",
  "Security",
  "UI/UX Enhancement",
  "Performance",
  "Billing & Invoicing",
  "Bug Report"
];

const PRIORITIES = [
  { value: "Low", desc: "Nice-to-have optimization" },
  { value: "Medium", desc: "Notable efficiency gain" },
  { value: "High", desc: "Important operational requirement" },
  { value: "Urgent", desc: "Critical business blocker" }
];

export default function FeedbackFormPopup({ onClose }) {
  const { addFeedback, currentUser } = useFeedback();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Feature Request");
  const [priority, setPriority] = useState("Medium");
  const [clientName, setClientName] = useState(currentUser.name || "");
  const [clientCompany, setClientCompany] = useState(currentUser.company || "");
  const [clientEmail, setClientEmail] = useState(currentUser.email || "");
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload handler (Base64 data URL for local storage compatibility)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      // Limit file size to 2MB for localStorage safety
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 2MB limit for local storage.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            url: event.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Detailed description is required";
    if (!clientCompany.trim()) newErrors.clientCompany = "Company name is required";
    if (!clientName.trim()) newErrors.clientName = "Your name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    addFeedback({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      clientName: clientName.trim(),
      clientCompany: clientCompany.trim(),
      clientEmail: clientEmail.trim(),
      attachments
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-2">
              Corporate Submission
            </div>
            <h2 className="text-xl font-bold tracking-tight">Submit Client Feedback</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Provide actionable feedback or feature proposals for our engineering roadmap.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Client Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Client Organization *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="e.g. Apex Financial Group"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.clientCompany ? "border-rose-400 bg-rose-50" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.clientCompany && (
                <p className="text-rose-500 text-xs mt-1">{errors.clientCompany}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.clientName ? "border-rose-400 bg-rose-50" : "border-slate-200"
                }`}
              />
              {errors.clientName && (
                <p className="text-rose-500 text-xs mt-1">{errors.clientName}</p>
              )}
            </div>
          </div>

          {/* Feedback Category & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Business Urgency / Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.value} — {p.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feedback Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Feedback Summary / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Automated Weekly Executive PDF Report Export"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? "border-rose-400 bg-rose-50" : "border-slate-200"
              }`}
            />
            {errors.title && (
              <p className="text-rose-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Feedback Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Detailed Description & Business Impact *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the current limitation, the desired capability, and how it impacts your day-to-day operations or business workflow..."
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? "border-rose-400 bg-rose-50" : "border-slate-200"
              }`}
            />
            {errors.description && (
              <p className="text-rose-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Screenshots or Documentation (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-slate-200">
                <PaperclipIcon className="w-4 h-4 text-indigo-600" />
                <span>Upload Screenshot (PNG, JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">Stored directly in browser LocalStorage</span>
            </div>

            {/* Uploaded attachments preview */}
            {attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 shadow-sm"
                  >
                    <img
                      src={att.url}
                      alt={att.name}
                      className="w-7 h-7 rounded object-cover border border-slate-200"
                    />
                    <span className="max-w-[140px] truncate font-medium">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-1"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
