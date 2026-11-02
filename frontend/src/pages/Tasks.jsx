import { API } from "../config/api.js";
import { useEffect, useState } from "react";
import {
  Search,
  X,
  CalendarDays,
  Flag,
  CircleCheck,
  Clock,
  Trash2,
  Pencil,
  Save,
  Loader2,
  ListTodo,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL = `${API}`;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedTask, setSelectedTask] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.U_name || "");
      } catch {
        console.error("Unable to read logged-in user.");
      }
    }
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/task/getAllTasks`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch tasks.");
      }

      setTasks(data.Tasks || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open task popup and fetch complete task details
  const openTaskPopup = async (task) => {
    setSelectedTask(task);
    setPopupLoading(true);
    setIsEditing(false);

    try {
      const response = await fetch(
        `${API_URL}/task/getTaskById/${task.T_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch task details.");
      }

      const fullTask = data.Task || data.task || data;

      setSelectedTask(fullTask);
      setEditForm({
        Title: fullTask.Title || "",
        Description: fullTask.Description || "",
        Status: fullTask.Status || "Pending",
        Priority: fullTask.Priority || "Medium",
        Due_date: fullTask.Due_date || "",
      });
    } catch (err) {
      alert(err.message);
      setSelectedTask(null);
    } finally {
      setPopupLoading(false);
    }
  };

  // Close popup
  const closePopup = () => {
    setSelectedTask(null);
    setIsEditing(false);
  };

  // Handle edit form
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update task using PUT
  const updateTask = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/task/updateTaskById/${selectedTask.T_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update task.");
      }

      setSelectedTask((prev) => ({
        ...prev,
        ...editForm,
      }));

      setIsEditing(false);

      await fetchTasks();

      alert("Task updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete task
  const deleteTask = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/task/deleteTaskById/${selectedTask.T_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete task.");
      }

      setTasks((prev) =>
        prev.filter((task) => task.T_id !== selectedTask.T_id)
      );

      closePopup();
      alert("Task deleted successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Status colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Priority colors
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";

      case "Medium":
        return "text-orange-500";

      default:
        return "text-green-600";
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.Title?.toLowerCase().includes(
      search.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "All" || task.Status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="min-h-screen bg-[#F5F3F4] font-['Raleway',sans-serif]">
        <Sidebar />

        <div className="md:ml-64">
          <Navbar
            userName={userName}
            onSearch={setSearch}
          />

          <main className="p-5 md:p-8 mt-25">
            {/* Page Header */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="mt-1 font-['XMind','Raleway',sans-serif] text-3xl font-extrabold text-[#161A1D]">
                  My Tasks
                </h1>

                <p className="mt-1 text-sm text-[#777]">
                  Manage and track all your tasks in one place.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
                <ListTodo size={20} className="text-[#BA181B]" />

                <span className="text-sm font-semibold text-[#161A1D]">
                  {tasks.length} Tasks
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#BA181B]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Pending", "In Progress", "Completed"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        statusFilter === status
                          ? "bg-[#BA181B] text-white"
                          : "bg-[#F5F3F4] text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Task Cards */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2
                  size={35}
                  className="animate-spin text-[#BA181B]"
                />
              </div>
            ) : error ? (
              <div className="rounded-xl bg-white p-8 text-center">
                <AlertCircle
                  size={35}
                  className="mx-auto mb-3 text-red-500"
                />

                <p className="font-medium text-red-600">{error}</p>

                <button
                  onClick={fetchTasks}
                  className="mt-4 rounded-lg bg-[#BA181B] px-5 py-2 text-sm text-white"
                >
                  Try Again
                </button>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="rounded-2xl bg-white px-5 py-16 text-center shadow-sm">
                <ListTodo
                  size={45}
                  className="mx-auto mb-4 text-gray-300"
                />

                <h3 className="text-lg font-semibold text-[#161A1D]">
                  No Tasks Found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  No tasks match your search or selected filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {filteredTasks.map((task) => (
                  <button
                    key={task._id || task.T_id}
                    onClick={() => openTaskPopup(task)}
                    className="rounded-2xl border border-transparent bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#BA181B]/30 hover:shadow-md"
                  >
                    {/* Task Title */}
                    <h2 className="mb-4 line-clamp-2 text-xl font-bold text-[#161A1D]">
                      {task.Title}
                    </h2>

                    {/* Task Information */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          task.Status
                        )}`}
                      >
                        {task.Status}
                      </span>

                      <span
                        className={`flex items-center gap-1 text-xs font-semibold ${getPriorityStyle(
                          task.Priority
                        )}`}
                      >
                        <Flag size={13} />
                        {task.Priority}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <CalendarDays size={13} />
                        {task.Due_date}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Task Details Popup */}
      {selectedTask && (
        <div
          onClick={closePopup}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            {/* Popup Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <h2 className="text-xl font-bold text-[#161A1D]">
                Task Details
              </h2>

              <button
                onClick={closePopup}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            {popupLoading ? (
              <div className="flex justify-center py-20">
                <Loader2
                  size={35}
                  className="animate-spin text-[#BA181B]"
                />
              </div>
            ) : (
              <div className="p-6">
                {/* Task Information */}
                {!isEditing ? (
                  <>
                    <h1 className="mb-4 text-2xl font-bold text-[#161A1D]">
                      {selectedTask.Title}
                    </h1>

                    <div className="mb-6 flex flex-wrap gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          selectedTask.Status
                        )}`}
                      >
                        {selectedTask.Status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                          selectedTask.Priority
                        )} bg-gray-50`}
                      >
                        {selectedTask.Priority} Priority
                      </span>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                          Description
                        </p>

                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                          {selectedTask.Description || "No description available."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Task ID
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {selectedTask.T_id}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Due Date
                          </p>

                          <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarDays size={16} />
                            {selectedTask.Due_date}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Assigned To
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {selectedTask.Assigned_to}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Created By
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {selectedTask.Created_by}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Created At
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {selectedTask.CreatedAt || "Not available"}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Updated At
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {selectedTask.UpdatedAt || "Not available"}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Completed At
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {selectedTask.CompletedAt
                              ? new Date(
                                  selectedTask.CompletedAt
                                ).toLocaleString()
                              : "Not completed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Edit Form */
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Title
                      </label>

                      <input
                        name="Title"
                        value={editForm.Title}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#BA181B]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Description
                      </label>

                      <textarea
                        name="Description"
                        rows="4"
                        value={editForm.Description}
                        onChange={handleChange}
                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#BA181B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Status
                        </label>

                        <select
                          name="Status"
                          value={editForm.Status}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#BA181B]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Priority
                        </label>

                        <select
                          name="Priority"
                          value={editForm.Priority}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#BA181B]"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Due Date
                      </label>

                      <input
                        type="date"
                        name="Due_date"
                        value={editForm.Due_date}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#BA181B]"
                      />
                    </div>
                  </div>
                )}

                {/* Popup Footer */}
                {!popupLoading && (
                  <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-gray-100 pt-5">
                    <button
                      onClick={deleteTask}
                      disabled={deleting || isEditing}
                      className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}

                      Delete
                    </button>

                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 rounded-xl bg-[#BA181B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A4161A]"
                      >
                        <Pencil size={16} />
                        Edit Task
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          disabled={saving}
                          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={updateTask}
                          disabled={saving}
                          className="flex items-center gap-2 rounded-xl bg-[#BA181B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A4161A] disabled:opacity-60"
                        >
                          {saving ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <Save size={17} />
                          )}

                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Tasks;
