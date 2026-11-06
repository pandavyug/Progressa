import { useState } from "react";
import {
  Bell,
  ChevronDown,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { API } from "../config/api.js";
import Toast from "./Toast";

const Navbar = ({ userName, onTaskCreated }) => {
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    Title: "",
    Description: "",
    Status: "Pending",
    Priority: "Medium",
    Due_date: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closePopup = () => {
    setShowTaskPopup(false);
    setError("");
    setForm({
      Title: "",
      Description: "",
      Status: "Pending",
      Priority: "Medium",
      Due_date: "",
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.Title.trim() || !form.Description.trim() || !form.Due_date) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/task/createTask`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          Title: form.Title.trim(),
          Description: form.Description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create task.");
      }

      closePopup();
      await onTaskCreated?.();

      setToast({
        type: "success",
        message: "Task created successfully!",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <>
      <header className="fixed right-0  top-0 z-30 flex h-[85px] w-full items-center justify-end border-b border-[#D3D3D3]/60 bg-white/95 px-8 backdrop-blur-md">

        {/* Right section */}
        <div className="flex shrink-0 items-center gap-5">

          {/* Add Task Button */}
          <button
            type="button"
            onClick={() => setShowTaskPopup(true)}
            className="flex items-center gap-2 rounded-xl bg-[#BA181B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#A4161A] active:scale-95"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            title="Notifications"
            className="relative rounded-full p-2 text-[#161A1D]/65 transition hover:bg-[#F5F3F4] hover:text-[#BA181B]"
          >
            <Bell size={21} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E5383B]" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 border-l border-[#D3D3D3] pl-6">

            <div className="min-w-0 text-right">
              <p className="max-w-[160px] truncate text-sm font-bold text-[#161A1D]">
                {userName || "Welcome"}
              </p>

              <p className="text-[10px] font-medium text-[#B1A7A6]">
                Progressa User
              </p>
            </div>

            <ChevronDown size={17} className="text-[#B1A7A6]" />
          </div>
        </div>
      </header>

      {/* Add Task Popup */}
      {showTaskPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B090A]/50 px-4 py-6 backdrop-blur-sm">

          <div className="w-full max-w-[550px] overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Popup Header */}
            <div className="flex items-center justify-between border-b border-[#D3D3D3]/60 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-[#161A1D]">
                  Create New Task
                </h2>
                <p className="mt-1 text-xs text-[#B1A7A6]">
                  Add a new task to your Progressa workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={closePopup}
                disabled={loading}
                className="rounded-lg p-2 text-[#B1A7A6] transition hover:bg-[#F5F3F4] hover:text-[#BA181B]"
              >
                <X size={21} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTask} className="space-y-5 p-6">

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                  Task Title *
                </label>

                <input
                  type="text"
                  name="Title"
                  value={form.Title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#D3D3D3] px-4 py-3 text-sm outline-none transition focus:border-[#BA181B] focus:ring-2 focus:ring-[#BA181B]/10"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                  Description *
                </label>

                <textarea
                  name="Description"
                  value={form.Description}
                  onChange={handleChange}
                  placeholder="Describe your task..."
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#D3D3D3] px-4 py-3 text-sm outline-none transition focus:border-[#BA181B] focus:ring-2 focus:ring-[#BA181B]/10"
                />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                    Status
                  </label>

                  <select
                    name="Status"
                    value={form.Status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#D3D3D3] bg-white px-3 py-3 text-sm outline-none focus:border-[#BA181B]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                    Priority
                  </label>

                  <select
                    name="Priority"
                    value={form.Priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#D3D3D3] bg-white px-3 py-3 text-sm outline-none focus:border-[#BA181B]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                  Due Date *
                </label>

                <input
                  type="date"
                  name="Due_date"
                  value={form.Due_date}
                  onChange={handleChange}
                  min={minDate}
                  required
                  className="w-full rounded-xl border border-[#D3D3D3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BA181B]"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[#BA181B]">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-[#D3D3D3]/60 pt-5">

                <button
                  type="button"
                  onClick={closePopup}
                  disabled={loading}
                  className="rounded-xl border border-[#D3D3D3] px-5 py-3 text-sm font-semibold text-[#161A1D] transition hover:bg-[#F5F3F4]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#BA181B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A4161A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Task
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Navbar;
