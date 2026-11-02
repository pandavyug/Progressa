import { API } from "../config/api.js";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  Loader2,
  X,
  ListTodo,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_URL = `${API}`;

// Format date as YYYY-MM-DD using local date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Convert YYYY-MM-DD into a local Date
const parseDate = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const Calendar = () => {
  const today = new Date();

  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [selectedTask, setSelectedTask] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);

  // Get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.U_name || "");
      } catch {
        console.error("Unable to read user information.");
      }
    }
  }, []);

  // Fetch logged-in user's tasks
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

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();

    const previousMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month's remaining dates
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, previousMonthDays - i),
        currentMonth: false,
      });
    }

    // Current month's dates
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }

    // Next month's dates to complete the calendar
    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextDay),
        currentMonth: false,
      });

      nextDay++;
    }

    return days;
  }, [currentMonth]);

  // Group tasks by due date
  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((task) => {
      if (!task.Due_date) return;

      if (!grouped[task.Due_date]) {
        grouped[task.Due_date] = [];
      }

      grouped[task.Due_date].push(task);
    });

    return grouped;
  }, [tasks]);

  // Tasks for selected date
  const selectedDateTasks = tasksByDate[selectedDate] || [];

  // Upcoming tasks
  const upcomingTasks = useMemo(() => {
    const todayString = formatDate(today);

    return tasks
      .filter(
        (task) =>
          task.Due_date &&
          task.Due_date >= todayString &&
          task.Status !== "Completed"
      )
      .sort((a, b) => a.Due_date.localeCompare(b.Due_date))
      .slice(0, 5);
  }, [tasks]);

  // Task statistics
  const completedTasks = tasks.filter(
    (task) => task.Status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.Status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.Status === "In Progress"
  ).length;

  // Month navigation
  const previousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );

    setSelectedDate(formatDate(now));
  };

  // Status styles
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

  // Open task details
  const openTask = async (task) => {
    setSelectedTask(task);
    setPopupLoading(true);

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
    } catch (err) {
      alert(err.message);
      setSelectedTask(null);
    } finally {
      setPopupLoading(false);
    }
  };

  const closePopup = () => {
    setSelectedTask(null);
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="min-h-screen bg-[#F5F3F4] mt-16 font-['Raleway',sans-serif]">
        <Sidebar />

        <div className="md:ml-64">
          <Navbar userName={userName} />

          <main className="p-5 md:p-8">

            {/* Page Header */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="mt-1 font-['XMind','Raleway',sans-serif] text-3xl font-extrabold text-[#161A1D]">
                  Calendar
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Keep track of your tasks and never miss a deadline.
                </p>
              </div>

              <button
                onClick={goToToday}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#BA181B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#660708]"
              >
                <CalendarCheck size={18} />
                Today
              </button>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Total Tasks
                  </p>

                  <ListTodo className="text-[#BA181B]" size={21} />
                </div>

                <h2 className="mt-3 text-3xl font-bold text-[#161A1D]">
                  {tasks.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>

                  <Clock className="text-blue-500" size={21} />
                </div>

                <h2 className="mt-3 text-3xl font-bold text-[#161A1D]">
                  {inProgressTasks}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Completed
                  </p>

                  <CheckCircle2 className="text-green-600" size={21} />
                </div>

                <h2 className="mt-3 text-3xl font-bold text-[#161A1D]">
                  {completedTasks}
                </h2>
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle size={19} />
                {error}

                <button
                  onClick={fetchTasks}
                  className="ml-auto font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Main Calendar Layout */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">

              {/* Calendar */}
              <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">

                {/* Calendar Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#161A1D]">
                      {monthName}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Select a date to view your tasks
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={previousMonth}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-[#F5F3F4]"
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={nextMonth}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-[#F5F3F4]"
                      aria-label="Next month"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Weekdays */}
                <div className="mb-2 grid grid-cols-7">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-400"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Days */}
                {loading ? (
                  <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2
                      size={35}
                      className="animate-spin text-[#BA181B]"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 border-l border-t border-gray-100">
                    {calendarDays.map((day, index) => {
                      const dateString = formatDate(day.date);
                      const dayTasks = tasksByDate[dateString] || [];

                      const isToday =
                        dateString === formatDate(today);

                      const isSelected =
                        dateString === selectedDate;

                      return (
                        <button
                          key={dateString}
                          onClick={() => {
                            setSelectedDate(dateString);

                            if (!day.currentMonth) {
                              setCurrentMonth(
                                new Date(
                                  day.date.getFullYear(),
                                  day.date.getMonth(),
                                  1
                                )
                              );
                            }
                          }}
                          className={`group flex min-h-[85px] flex-col items-center border-b border-r border-gray-100 p-1.5 transition sm:min-h-[115px] sm:items-start sm:p-2 ${
                            !day.currentMonth
                              ? "bg-gray-50/60 text-gray-300"
                              : "bg-white text-[#161A1D] hover:bg-[#F5F3F4]"
                          } ${
                            isSelected
                              ? "bg-[#BA181B]/5 ring-2 ring-inset ring-[#BA181B]"
                              : ""
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                              isToday
                                ? "bg-[#BA181B] text-white"
                                : isSelected
                                ? "bg-[#BA181B]/10 text-[#BA181B]"
                                : ""
                            }`}
                          >
                            {day.date.getDate()}
                          </span>

                          {/* Task indicators */}
                          <div className="mt-1 w-full space-y-1">
                            {dayTasks.slice(0, 2).map((task) => (
                              <div
                                key={task._id || task.T_id}
                                className={`hidden truncate rounded px-1.5 py-1 text-left text-[9px] font-semibold sm:block ${
                                  task.Status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : task.Status === "In Progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {task.Title}
                              </div>
                            ))}

                            {dayTasks.length > 0 && (
                              <div className="flex justify-center gap-1 sm:hidden">
                                {dayTasks.slice(0, 4).map((task) => (
                                  <span
                                    key={task._id || task.T_id}
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      task.Status === "Completed"
                                        ? "bg-green-500"
                                        : task.Status === "In Progress"
                                        ? "bg-blue-500"
                                        : "bg-yellow-500"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}

                            {dayTasks.length > 2 && (
                              <p className="hidden text-[9px] text-gray-400 sm:block">
                                +{dayTasks.length - 2} more
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Legend */}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    Pending
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    In Progress
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    Completed
                  </div>
                </div>
              </section>

              {/* Right Side Panel */}
              <div className="space-y-6">

                {/* Selected Date Tasks */}
                <section className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#161A1D]">
                        Selected Date
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        {parseDate(selectedDate)?.toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <CalendarDays
                      size={23}
                      className="text-[#BA181B]"
                    />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2
                        size={25}
                        className="animate-spin text-[#BA181B]"
                      />
                    </div>
                  ) : selectedDateTasks.length === 0 ? (
                    <div className="rounded-xl bg-[#F5F3F4] px-4 py-8 text-center">
                      <CalendarDays
                        size={30}
                        className="mx-auto mb-2 text-gray-300"
                      />

                      <p className="text-sm font-semibold text-gray-600">
                        No tasks scheduled
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Enjoy your free time!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateTasks.map((task) => (
                        <button
                          key={task._id || task.T_id}
                          onClick={() => openTask(task)}
                          className="w-full rounded-xl border border-gray-100 p-4 text-left transition hover:border-[#BA181B]/30 hover:bg-[#F5F3F4]"
                        >
                          <h3 className="line-clamp-2 text-sm font-bold text-[#161A1D]">
                            {task.Title}
                          </h3>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
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
                              <Flag size={12} />
                              {task.Priority}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                {/* Upcoming Tasks */}
                <section className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#161A1D]">
                        Upcoming Tasks
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Your next deadlines
                      </p>
                    </div>

                    <Clock size={22} className="text-[#BA181B]" />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-6">
                      <Loader2
                        size={25}
                        className="animate-spin text-[#BA181B]"
                      />
                    </div>
                  ) : upcomingTasks.length === 0 ? (
                    <p className="rounded-xl bg-[#F5F3F4] p-5 text-center text-sm text-gray-500">
                      No upcoming tasks.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingTasks.map((task) => (
                        <button
                          key={task._id || task.T_id}
                          onClick={() => {
                            setSelectedDate(task.Due_date);

                            const date = parseDate(task.Due_date);

                            if (date) {
                              setCurrentMonth(
                                new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  1
                                )
                              );
                            }

                            openTask(task);
                          }}
                          className="flex w-full items-start gap-3 text-left"
                        >
                          <div className="mt-1">
                            {task.Status === "In Progress" ? (
                              <Clock
                                size={17}
                                className="text-blue-500"
                              />
                            ) : (
                              <Circle
                                size={17}
                                className="text-yellow-500"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#161A1D]">
                              {task.Title}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {parseDate(task.Due_date)?.toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              ) || task.Due_date}
                            </p>
                          </div>

                          <ChevronRight
                            size={17}
                            className="mt-1 shrink-0 text-gray-400"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </section>

              </div>
            </div>
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
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-bold text-[#161A1D]">
                Task Details
              </h2>

              <button
                onClick={closePopup}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {popupLoading ? (
              <div className="flex justify-center py-16">
                <Loader2
                  size={30}
                  className="animate-spin text-[#BA181B]"
                />
              </div>
            ) : (
              <div className="space-y-5 p-6">
                <h1 className="text-2xl font-bold text-[#161A1D]">
                  {selectedTask.Title}
                </h1>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      selectedTask.Status
                    )}`}
                  >
                    {selectedTask.Status}
                  </span>

                  <span
                    className={`rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                      selectedTask.Priority
                    )}`}
                  >
                    {selectedTask.Priority} Priority
                  </span>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                    Description
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {selectedTask.Description || "No description available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Task ID
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedTask.T_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Due Date
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedTask.Due_date}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Assigned To
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedTask.Assigned_to}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Created By
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedTask.Created_by}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Created At
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedTask.CreatedAt || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Updated At
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedTask.UpdatedAt || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Completed At
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedTask.CompletedAt
                        ? new Date(
                            selectedTask.CompletedAt
                          ).toLocaleString()
                        : "Not completed"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
