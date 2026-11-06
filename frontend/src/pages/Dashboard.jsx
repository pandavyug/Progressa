import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api.js";

 backup-bugs-fixed
import {
  Layers3,
  CircleCheck,
  Clock3,
  ListTodo,
  CalendarDays,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  FolderKanban,
  Plus,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL = `${API}`;

const parseDate = (value) => {
  if (!value) return null;

  // Supports ISO dates and dates like 29-oct-2026
  const isoDate = new Date(value);

  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate;
  }

  const match = value.match(/^(\d{1,2})-([a-z]{3})-(\d{4})$/i);

  if (match) {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    const month = months.indexOf(match[2].toLowerCase());

    if (month !== -1) {
      return new Date(Number(match[3]), month, Number(match[1]));
    }
  }

  return null;
};

const formatDate = (value) => {
  const date = parseDate(value);

  if (!date) return "No date";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  // Get logged-in user information

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      setUserName(savedUser?.U_name || "");
    } catch {
      console.error("Unable to read logged-in user.");
      setUserName("");
    }
  }, []);

  // Fetch logged-in user's tasks

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/task/getAllTasks`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch tasks");
      }

      setTasks(Array.isArray(data.Tasks) ? data.Tasks : []);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks using navbar search

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return tasks;

    return tasks.filter((task) =>
      [task.Title, task.Description, task.Status, task.Priority].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [tasks, search]);

  // Calculate task statistics

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.Status?.toLowerCase() === "completed",
    ).length;

    const pending = tasks.filter(
      (task) => task.Status?.toLowerCase() === "pending",
    ).length;

    const inProgress = tasks.filter(
      (task) => task.Status?.toLowerCase() === "in progress",
    ).length;

    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      completionRate,
    };
  }, [tasks]);

  // Task activity for the last six months

  const monthlyActivity = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

      const month = date.getMonth();
      const year = date.getFullYear();

      const created = tasks.filter((task) => {
        const taskDate = parseDate(task.CreatedAt);

        return (
          taskDate &&
          taskDate.getMonth() === month &&
          taskDate.getFullYear() === year
        );
      }).length;

      const completed = tasks.filter((task) => {
        const taskDate = parseDate(task.CompletedAt);

        return (
          taskDate &&
          taskDate.getMonth() === month &&
          taskDate.getFullYear() === year
        );
      }).length;

      return {
        month: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        created,
        completed,
      };
    });
  }, [tasks]);

  const maxActivity = Math.max(
    1,
    ...monthlyActivity.flatMap((item) => [item.created, item.completed]),
  );

  // Upcoming deadlines

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...filteredTasks]
      .filter((task) => {
        if (task.Status?.toLowerCase() === "completed") {
          return false;
        }

        const dueDate = parseDate(task.Due_date);

        return dueDate && dueDate >= today;
      })
      .sort((a, b) => parseDate(a.Due_date) - parseDate(b.Due_date))
      .slice(0, 5);
  }, [filteredTasks]);

  // Recent tasks

  const recentTasks = useMemo(() => {
    return [...filteredTasks]
      .sort((a, b) => {
        const dateA = parseDate(a.CreatedAt)?.getTime() || 0;
        const dateB = parseDate(b.CreatedAt)?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [filteredTasks]);

  // Task status distribution

  const statusData = [
    {
      name: "Completed",
      count: stats.completed,
      color: "#16A34A",
    },
    {
      name: "Pending",
      count: stats.pending,
      color: "#E5A000",
    },
    {
      name: "In Progress",
      count: stats.inProgress,
      color: "#E5383B",
    },
  ];

  const statusTotal = statusData.reduce((sum, item) => sum + item.count, 0);

  let accumulated = 0;

  const donutGradient = statusTotal
    ? `conic-gradient(${statusData
        .map((item) => {
          const start = accumulated;

          accumulated += (item.count / statusTotal) * 100;

          return `${item.color} ${start}% ${accumulated}%`;
        })
        .join(", ")})`
    : "#D3D3D3";

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700";

      case "pending":
        return "bg-amber-50 text-amber-700";

      case "in progress":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-[#BA181B]";

      case "medium":
        return "bg-amber-50 text-amber-700";

      case "low":
        return "bg-emerald-50 text-emerald-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const isOverdue = (dueDate) => {
    const date = parseDate(dueDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return date && date < today;
  };

  return (
    <>
      <div className="min-h-screen bg-[#F5F3F4] font-['Raleway',sans-serif]">
        <Sidebar />

        <Navbar userName={userName} onSearch={setSearch} />

        {/* Main content */}

        <main className="ml-[235px] pt-[85px]">
          <div className="mx-auto max-w-[1800px] space-y-6 p-6 lg:p-8">
            {/* Heading */}

            <section className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[2px] text-[#B1A7A6]">
                  Overview
                </p>

                <h1 className="mt-1 font-['XMind','Raleway',sans-serif] text-3xl font-extrabold text-[#161A1D]">
                  Welcome back,{" "}
                  <span className="text-[#BA181B]">{userName || "User"}</span>!
                </h1>

                <p className="mt-2 text-sm text-[#B1A7A6]">
                  Here's an overview of your tasks and progress.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#D3D3D3]/70 bg-white px-4 py-3 shadow-sm">
                <CalendarDays size={21} className="text-[#BA181B]" />

                <div>
                  <p className="text-xs font-bold text-[#161A1D]">
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <p className="mt-1 text-[10px] text-[#B1A7A6]">
                    Let's make progress today!
                  </p>
                </div>
              </div>
            </section>

            {/* Error state */}

            {error && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-[#BA181B]" />

                  <p className="text-sm font-medium text-[#A4161A]">{error}</p>
                </div>

                <button
                  onClick={fetchTasks}
                  className="flex items-center gap-2 rounded-lg bg-[#BA181B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#660708]"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            )}

            {/* Statistics cards */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Total Tasks",
                  count: stats.total,
                  subtitle: "All your tasks",
                  icon: Layers3,
                  color: "#BA181B",
                  bg: "bg-[#FEF0F0]",
                },
                {
                  title: "Completed Tasks",
                  count: stats.completed,
                  subtitle: `${stats.completionRate}% completion rate`,
                  icon: CircleCheck,
                  color: "#16834A",
                  bg: "bg-[#EFFAF4]",
                },
                {
                  title: "Pending Tasks",
                  count: stats.pending,
                  subtitle: "Waiting to be started",
                  icon: Clock3,
                  color: "#D68A00",
                  bg: "bg-[#FFF8E9]",
                },
                {
                  title: "In Progress",
                  count: stats.inProgress,
                  subtitle: "Currently being worked on",
                  icon: ListTodo,
                  color: "#2563EB",
                  bg: "bg-[#EEF5FF]",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-[#D3D3D3]/50 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}
                      >
                        <Icon size={22} style={{ color: item.color }} />
                      </div>

                      <ArrowUpRight
                        size={19}
                        className="text-[#B1A7A6] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>

                    <p className="mt-5 text-sm font-semibold text-[#B1A7A6]">
                      {item.title}
                    </p>

                    <h2 className="mt-1 text-3xl font-extrabold text-[#161A1D]">
                      {loading ? "—" : item.count}
                    </h2>

                    <p className="mt-2 text-[11px] text-[#B1A7A6]">
                      {item.subtitle}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Charts and upcoming tasks */}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              {/* Task overview */}

              <div className="rounded-2xl border border-[#D3D3D3]/50 bg-white p-5 shadow-sm xl:col-span-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#161A1D]">
                      Task Overview
                    </h3>

                    <p className="mt-1 text-xs text-[#B1A7A6]">
                      Tasks created and completed over six months
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex h-48 items-end justify-between gap-3 border-b border-l border-[#D3D3D3]/60 px-3 pb-2">
                  {monthlyActivity.map((item) => (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="flex h-full w-full items-end justify-center gap-1">
                        <div
                          title={`${item.created} tasks created`}
                          className="w-3 rounded-t-md bg-[#E5383B] transition-all duration-500 hover:bg-[#A4161A]"
                          style={{
                            height: `${Math.max(
                              item.created ? 4 : 0,
                              (item.created / maxActivity) * 100,
                            )}%`,
                          }}
                        />

                        <div
                          title={`${item.completed} tasks completed`}
                          className="w-3 rounded-t-md bg-emerald-500 transition-all duration-500 hover:bg-emerald-700"
                          style={{
                            height: `${Math.max(
                              item.completed ? 4 : 0,
                              (item.completed / maxActivity) * 100,
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="mt-3 text-[10px] font-semibold text-[#B1A7A6]">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-6">
                  <span className="flex items-center gap-2 text-[11px] text-[#B1A7A6]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E5383B]" />
                    Created
                  </span>

                  <span className="flex items-center gap-2 text-[11px] text-[#B1A7A6]">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                </div>
              </div>

              {/* Status chart */}

              <div className="rounded-2xl border border-[#D3D3D3]/50 bg-white p-5 shadow-sm xl:col-span-3">
                <h3 className="text-base font-extrabold text-[#161A1D]">
                  Task Status
                </h3>

                <p className="mt-1 text-xs text-[#B1A7A6]">
                  Current task distribution
                </p>

                <div className="flex flex-col items-center">
                  <div
                    className="relative mt-7 flex h-40 w-40 items-center justify-center rounded-full"
                    style={{ background: donutGradient }}
                  >
                    <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-3xl font-extrabold text-[#161A1D]">
                        {loading ? "—" : stats.total}
                      </span>

                      <span className="mt-1 text-[10px] text-[#B1A7A6]">
                        Total Tasks
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 w-full space-y-3">
                    {statusData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2 text-xs text-[#B1A7A6]">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </span>

                        <span className="text-xs font-bold text-[#161A1D]">
                          {loading ? "—" : item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming deadlines */}

              <div className="rounded-2xl border border-[#D3D3D3]/50 bg-white p-5 shadow-sm xl:col-span-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#161A1D]">
                      Upcoming Deadlines
                    </h3>

                    <p className="mt-1 text-xs text-[#B1A7A6]">
                      Your next due tasks
                    </p>
                  </div>

                  <CalendarDays size={19} className="text-[#BA181B]" />
                </div>

                <div className="mt-5 space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <LoaderCircle className="animate-spin text-[#BA181B]" />
                    </div>
                  ) : upcomingTasks.length === 0 ? (
                    <div className="py-10 text-center">
                      <CheckCircle2
                        size={30}
                        className="mx-auto text-emerald-500"
                      />

                      <p className="mt-3 text-sm font-bold text-[#161A1D]">
                        No upcoming deadlines
                      </p>

                      <p className="mt-1 text-xs text-[#B1A7A6]">
                        You're all caught up!
                      </p>
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center gap-3 border-b border-[#D3D3D3]/40 pb-3 last:border-0"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF0F0]">
                          <CalendarDays size={18} className="text-[#BA181B]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#161A1D]">
                            {task.Title}
                          </p>

                          <p className="mt-1 text-[10px] text-[#B1A7A6]">
                            {task.Priority} Priority
                          </p>
                        </div>

                        <span className="shrink-0 text-[10px] font-bold text-[#BA181B]">
                          {formatDate(task.Due_date)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Recent tasks and projects */}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              {/* Recent Tasks */}

              <div className="overflow-hidden rounded-2xl border border-[#D3D3D3]/50 bg-white shadow-sm xl:col-span-7">
                <div className="flex items-center justify-between border-b border-[#D3D3D3]/50 p-5">
                  <div>
                    <h3 className="text-base font-extrabold text-[#161A1D]">
                      Recent Tasks
                    </h3>

                    <p className="mt-1 text-xs text-[#B1A7A6]">
                      Your latest task activities
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/tasks")}
                    className="flex items-center gap-2 text-xs font-bold text-[#BA181B] transition hover:text-[#660708]"
                  >
                    View All
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left">
                    <thead>
                      <tr className="border-b border-[#D3D3D3]/40 text-[10px] font-bold uppercase tracking-wider text-[#B1A7A6]">
                        <th className="px-5 py-3">Task</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-5 py-3">Due Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="py-12 text-center">
                            <LoaderCircle className="mx-auto animate-spin text-[#BA181B]" />
                          </td>
                        </tr>
                      ) : recentTasks.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-12 text-center text-xs text-[#B1A7A6]"
                          >
                            {search
                              ? "No matching tasks found."
                              : "No tasks available yet."}
                          </td>
                        </tr>
                      ) : (
                        recentTasks.map((task) => (
                          <tr
                            key={task._id}
                            className="border-b border-[#D3D3D3]/30 transition hover:bg-[#F5F3F4]/70"
                          >
                            <td className="px-5 py-4">
                              <p className="text-xs font-bold text-[#161A1D]">
                                {task.Title}
                              </p>

                              <p className="mt-1 max-w-[200px] truncate text-[10px] text-[#B1A7A6]">
                                {task.Description}
                              </p>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getPriorityStyle(task.Priority)}`}
                              >
                                {task.Priority}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(task.Status)}`}
                              >
                                {task.Status}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`whitespace-nowrap text-[11px] font-semibold ${isOverdue(task.Due_date) ? "text-[#BA181B]" : "text-[#B1A7A6]"}`}
                              >
                                {formatDate(task.Due_date)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Projects placeholder */}

              <div className="rounded-2xl border border-[#D3D3D3]/50 bg-white p-5 shadow-sm xl:col-span-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#161A1D]">
                      Projects Overview
                    </h3>

                    <p className="mt-1 text-xs text-[#B1A7A6]">
                      Organize your work into projects
                    </p>
                  </div>

                  <FolderKanban size={20} className="text-[#BA181B]" />
                </div>

                <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF0F0]">
                    <FolderKanban size={27} className="text-[#BA181B]" />
                  </div>

                  <h4 className="mt-4 text-sm font-bold text-[#161A1D]">
                    Projects are coming soon
                  </h4>

                  <p className="mt-2 max-w-[260px] text-xs leading-5 text-[#B1A7A6]">
                    Soon you'll be able to organize tasks, manage projects and
                    track team progress right here.
                  </p>

                  <span className="mt-4 rounded-full bg-[#FEF0F0] px-4 py-2 text-[10px] font-bold text-[#BA181B]">
                    Coming Soon
                  </span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
