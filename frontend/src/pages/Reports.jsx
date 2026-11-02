
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  TrendingUp,
  Target,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API = "http://localhost:2108";

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user's information
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.U_name || "");
      } catch (error) {
        console.error("Unable to read user information.");
      }
    }
  }, []);

  // Fetch user's tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/task/getAllTasks`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch tasks.");
      }

      setTasks(Array.isArray(data.Tasks) ? data.Tasks : []);
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Convert date strings into local date objects
  const parseDate = (value) => {
    if (!value) return null;

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (isoMatch) {
      return new Date(
        Number(isoMatch[1]),
        Number(isoMatch[2]) - 1,
        Number(isoMatch[3])
      );
    }

    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3,
      may: 4, jun: 5, jul: 6, aug: 7,
      sep: 8, oct: 9, nov: 10, dec: 11,
    };

    const formattedMatch =
      /^(\d{1,2})-([a-z]{3})-(\d{4})$/i.exec(value);

    if (formattedMatch) {
      const month = months[formattedMatch[2].toLowerCase()];

      if (month === undefined) return null;

      return new Date(
        Number(formattedMatch[3]),
        month,
        Number(formattedMatch[1])
      );
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  };

  // Calculate report statistics
  const report = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.Status === "Completed"
    ).length;

    const pending = tasks.filter(
      (task) => task.Status === "Pending"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.Status === "In Progress"
    ).length;

    const high = tasks.filter(
      (task) => task.Priority === "High"
    ).length;

    const medium = tasks.filter(
      (task) => task.Priority === "Medium"
    ).length;

    const low = tasks.filter(
      (task) => task.Priority === "Low"
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((task) => {
      const dueDate = parseDate(task.Due_date);

      return (
        dueDate &&
        dueDate < today &&
        task.Status !== "Completed"
      );
    });

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      high,
      medium,
      low,
      overdue,
      completionRate,
    };
  }, [tasks]);

  // Status and priority chart data
  const statusData = [
    {
      label: "Completed",
      count: report.completed,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      label: "In Progress",
      count: report.inProgress,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      label: "Pending",
      count: report.pending,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
  ];

  const priorityData = [
    {
      label: "High",
      count: report.high,
      color: "bg-[#BA181B]",
    },
    {
      label: "Medium",
      count: report.medium,
      color: "bg-orange-400",
    },
    {
      label: "Low",
      count: report.low,
      color: "bg-blue-500",
    },
  ];

  // Display recent tasks using their update dates
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = parseDate(a.UpdatedAt)?.getTime() || 0;
        const dateB = parseDate(b.UpdatedAt)?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tasks]);

  const formatDate = (value) => {
    const date = parseDate(value);

    if (!date) return value || "Not available";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getBarWidth = (count) => {
    return report.total > 0
      ? `${(count / report.total) * 100}%`
      : "0%";
  };

  return (
    <>
      <div className="min-h-screen mt-16 bg-[#F5F3F4]">
        <Sidebar />

        <div className="md:ml-64">
          <Navbar userName={userName} />

          <main className="p-5 sm:p-8">
            {/* Page Heading */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="mt-1 font-['XMind','Raleway',sans-serif] text-3xl font-extrabold text-[#161A1D]">
                  Reports
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Track your productivity and task performance.
                </p>
              </div>

              <button
                onClick={fetchTasks}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-[#BA181B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A4161A] disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh Reports
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                  <RefreshCw
                    size={35}
                    className="mx-auto animate-spin text-[#BA181B]"
                  />
                  <p className="mt-3 text-sm text-gray-500">
                    Generating your reports...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Overview Cards */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                        <ListTodo size={23} />
                      </div>
                      <TrendingUp className="text-gray-300" size={20} />
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                      Total Tasks
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold text-[#161A1D]">
                      {report.total}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="rounded-xl bg-green-50 p-3 text-green-600 w-fit">
                      <CheckCircle2 size={23} />
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                      Completed Tasks
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold text-[#161A1D]">
                      {report.completed}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600 w-fit">
                      <Clock size={23} />
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                      Pending Tasks
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold text-[#161A1D]">
                      {report.pending}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 w-fit">
                      <Target size={23} />
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                      In Progress
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold text-[#161A1D]">
                      {report.inProgress}
                    </h2>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#161A1D]">
                        Overall Completion Rate
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Percentage of tasks you have completed.
                      </p>
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#BA181B]">
                      {report.completionRate}%
                    </h2>
                  </div>

                  <div className="mt-6 h-4 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#BA181B] transition-all duration-700"
                      style={{ width: `${report.completionRate}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    {report.completed} out of {report.total} tasks completed
                  </p>
                </div>

                {/* Status and Priority Reports */}
                <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {/* Status Report */}
                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                        <BarChart3 size={22} />
                      </div>

                      <div>
                        <h2 className="font-bold text-[#161A1D]">
                          Task Status Report
                        </h2>
                        <p className="text-xs text-gray-500">
                          Breakdown by task status
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {statusData.map((item) => (
                        <div key={item.label}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              {item.label}
                            </span>

                            <span className={`text-sm font-bold ${item.textColor}`}>
                              {item.count}
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: getBarWidth(item.count) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Report */}
                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                        <Target size={22} />
                      </div>

                      <div>
                        <h2 className="font-bold text-[#161A1D]">
                          Task Priority Report
                        </h2>
                        <p className="text-xs text-gray-500">
                          Breakdown by priority level
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {priorityData.map((item) => (
                        <div key={item.label}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              {item.label} Priority
                            </span>

                            <span className="text-sm font-bold text-[#161A1D]">
                              {item.count}
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: getBarWidth(item.count) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Overdue Tasks */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                      <AlertCircle size={22} />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#161A1D]">
                        Overdue Tasks
                      </h2>
                      <p className="text-xs text-gray-500">
                        Tasks that have passed their due date and are not completed.
                      </p>
                    </div>

                    <span className="ml-auto rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-[#BA181B]">
                      {report.overdue.length}
                    </span>
                  </div>

                  {report.overdue.length === 0 ? (
                    <div className="rounded-xl bg-green-50 p-5 text-center">
                      <CheckCircle2
                        size={30}
                        className="mx-auto text-green-600"
                      />
                      <p className="mt-2 font-semibold text-green-700">
                        No overdue tasks!
                      </p>
                      <p className="mt-1 text-xs text-green-600">
                        Great work. You are on track.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {report.overdue.map((task) => (
                        <div
                          key={task._id || task.T_id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50/50 p-4"
                        >
                          <div>
                            <h3 className="font-semibold text-[#161A1D]">
                              {task.Title}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                              Due date: {formatDate(task.Due_date)}
                            </p>
                          </div>

                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(task.Status)}`}>
                            {task.Status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Tasks */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-5">
                    <h2 className="font-bold text-[#161A1D]">
                      Recent Tasks
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Your five most recently updated tasks.
                    </p>
                  </div>

                  {recentTasks.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">
                      No tasks available yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[550px] text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-xs text-gray-400">
                            <th className="pb-3 font-semibold">Task</th>
                            <th className="pb-3 font-semibold">Priority</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold">Due Date</th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentTasks.map((task) => (
                            <tr
                              key={task._id || task.T_id}
                              className="border-b border-gray-50 last:border-0"
                            >
                              <td className="py-4 pr-4 text-sm font-semibold text-[#161A1D]">
                                {task.Title}
                              </td>

                              <td className="py-4 text-sm text-gray-600">
                                {task.Priority}
                              </td>

                              <td className="py-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(task.Status)}`}>
                                  {task.Status}
                                </span>
                              </td>

                              <td className="py-4 text-sm text-gray-500">
                                {formatDate(task.Due_date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Reports;
