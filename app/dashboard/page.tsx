"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CalendarIcon,
  BellIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const STATS = {
  totalStudents: 47,
  activeSessions: 12,
  pendingFollowUps: 8,
  averageCGPA: 8.3,
  atRiskStudents: 5,
  highPerformers: 18
};

const CGPA_DISTRIBUTION = [
  { range: "7.0-7.5", count: 5 },
  { range: "7.5-8.0", count: 12 },
  { range: "8.0-8.5", count: 18 },
  { range: "8.5-9.0", count: 9 },
  { range: "9.0-9.5", count: 3 }
];

const PERFORMANCE_TREND = [
  { month: "Jan", cgpa: 8.1 },
  { month: "Feb", cgpa: 8.2 },
  { month: "Mar", cgpa: 8.15 },
  { month: "Apr", cgpa: 8.3 },
  { month: "May", cgpa: 8.25 },
  { month: "Jun", cgpa: 8.3 }
];

const SEMESTER_DISTRIBUTION = [
  { semester: "1st", count: 3 },
  { semester: "2nd", count: 5 },
  { semester: "3rd", count: 8 },
  { semester: "4th", count: 10 },
  { semester: "5th", count: 9 },
  { semester: "6th", count: 7 },
  { semester: "7th", count: 4 },
  { semester: "8th", count: 1 }
];

const INTEREST_DISTRIBUTION = [
  { subject: "ML/AI", value: 15, fullMark: 20 },
  { subject: "Cloud", value: 12, fullMark: 20 },
  { subject: "Web Dev", value: 10, fullMark: 20 },
  { subject: "Cybersecurity", value: 6, fullMark: 20 },
  { subject: "Robotics", value: 8, fullMark: 20 },
  { subject: "Data Science", value: 9, fullMark: 20 }
];

const RECENT_STUDENTS = [
  { id: 1, name: "Aarav Patel", semester: "5th", cgpa: "8.6", lastContact: "2 hours ago", status: "active", risk: "low" },
  { id: 2, name: "Emily Chen", semester: "7th", cgpa: "9.1", lastContact: "5 hours ago", status: "active", risk: "low" },
  { id: 3, name: "Mateo Rivera", semester: "3rd", cgpa: "7.8", lastContact: "1 day ago", status: "warning", risk: "medium" },
  { id: 4, name: "Sofia Martinez", semester: "4th", cgpa: "8.2", lastContact: "2 days ago", status: "active", risk: "low" },
  { id: 5, name: "James Wilson", semester: "6th", cgpa: "8.9", lastContact: "3 days ago", status: "active", risk: "low" }
];

const AT_RISK_STUDENTS = [
  { id: 1, name: "Alex Johnson", semester: "3rd", cgpa: "6.8", reason: "Declining grades", priority: "high" },
  { id: 2, name: "Sarah Kim", semester: "4th", cgpa: "7.1", reason: "Missed assignments", priority: "medium" },
  { id: 3, name: "David Lee", semester: "2nd", cgpa: "6.9", reason: "Low attendance", priority: "high" }
];

const AI_RECOMMENDATIONS = [
  { id: 1, type: "intervention", student: "Alex Johnson", message: "Schedule intervention meeting - CGPA dropped 0.5 points", priority: "high" },
  { id: 2, type: "opportunity", student: "Emily Chen", message: "Recommend research opportunities - exceptional performance", priority: "medium" },
  { id: 3, type: "resource", student: "Mateo Rivera", message: "Suggest tutoring resources for mathematics", priority: "medium" }
];

const UPCOMING_MEETINGS = [
  { id: 1, student: "Aarav Patel", time: "10:00 AM", date: "Today", type: "Follow-up", duration: "30 min" },
  { id: 2, student: "Emily Chen", time: "2:30 PM", date: "Today", type: "Career Planning", duration: "45 min" },
  { id: 3, student: "Sofia Martinez", time: "11:00 AM", date: "Tomorrow", type: "Academic Review", duration: "30 min" },
  { id: 4, student: "James Wilson", time: "3:00 PM", date: "Tomorrow", type: "Course Selection", duration: "30 min" }
];

const StatCard = ({
  title,
  value,
  icon,
  trend,
  color,
  glow
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
  glow?: boolean;
}) => {
  const getIconBg = (colorClass: string) => {
    if (colorClass.includes("red")) return {
      bg: "bg-gradient-to-br from-red-600 via-red-500 to-red-700",
      shadow: "shadow-red-600/50"
    };
    return {
      bg: "bg-gradient-to-br from-red-600 via-red-500 to-red-700",
      shadow: "shadow-red-600/50"
    };
  };

  const iconStyles = getIconBg(color);

  return (
    <div className={`group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl transition-all duration-300 hover:border-red-500/50 hover:shadow-red-900/20 ${glow ? 'ring-1 ring-red-500/30' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-red-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
          <p className={`mt-3 text-4xl font-bold ${color} drop-shadow-lg`}>{value}</p>
          {trend && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-500">
              {trend.includes("↑") ? (
                <ArrowTrendingUpIcon className="h-3 w-3 text-red-400" />
              ) : trend.includes("↓") ? (
                <ArrowTrendingDownIcon className="h-3 w-3 text-red-600" />
              ) : null}
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-xl ${iconStyles.bg} p-4 shadow-xl ${iconStyles.shadow} ring-1 ring-white/10`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
};

const RiskBadge = ({ risk }: { risk: string }) => {
  const colors = {
    low: "bg-red-900/40 text-red-300 border-red-700/50",
    medium: "bg-red-800/50 text-red-400 border-red-600/60",
    high: "bg-red-900/60 text-red-400 border-red-700/70"
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${colors[risk as keyof typeof colors] || colors.low}`}>
      {risk.toUpperCase()}
    </span>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("authToken");
      const isAuthenticated = localStorage.getItem("advisor_authenticated");
      if (!authToken && isAuthenticated !== "true") {
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("advisor_authenticated");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Animated background gradient with red */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),rgba(185,28,28,0.1),transparent_70%)]" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-black/90 backdrop-blur-xl shadow-2xl shadow-red-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-2 shadow-xl shadow-red-600/50 ring-1 ring-white/10">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-red-500">
                    Advisor Command Center
                  </h1>
                  <p className="text-sm text-gray-400">AI-Powered Student Analytics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 rounded-lg border border-gray-700/50 bg-gray-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>
              <button
                onClick={() => router.push("/chat")}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-red-600/30 transition hover:bg-red-700 hover:shadow-2xl hover:shadow-red-600/40 ring-1 ring-white/10"
              >
                View Sessions
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800/50 hover:text-red-400 hover:border-red-500/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={STATS.totalStudents}
            icon={<UserGroupIcon className="h-7 w-7" />}
            trend="↑ +3 this month"
            color="text-red-400"
            glow
          />
          <StatCard
            title="Active Sessions"
            value={STATS.activeSessions}
            icon={<ClockIcon className="h-7 w-7" />}
            trend="12 ongoing"
            color="text-red-500"
          />
          <StatCard
            title="At Risk Students"
            value={STATS.atRiskStudents}
            icon={<ExclamationTriangleIcon className="h-7 w-7" />}
            trend="↓ 2 resolved"
            color="text-red-600"
          />
          <StatCard
            title="Average CGPA"
            value={STATS.averageCGPA}
            icon={<ChartBarIcon className="h-7 w-7" />}
            trend="↑ +0.2 from last term"
            color="text-red-500"
          />
        </div>

        {/* Priority Alerts */}
        {AT_RISK_STUDENTS.length > 0 && (
          <div className="mb-8 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-900/40 p-2 ring-1 ring-red-700/30">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Priority Alerts</h2>
                  <p className="text-sm text-gray-400">Students requiring immediate attention</p>
                </div>
              </div>
              <button className="text-sm font-medium text-red-400 hover:text-red-300">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {AT_RISK_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 shadow-lg hover:border-red-500/50 hover:shadow-red-900/20 transition cursor-pointer"
                  onClick={() => router.push("/chat")}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-white">{student.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      student.priority === "high" ? "bg-red-900/60 text-red-400" : "bg-red-800/50 text-red-400"
                    }`}>
                      {student.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-gray-400">{student.semester} · CGPA: {student.cgpa}</p>
                  <p className="text-xs text-red-400">{student.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mb-8 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-red-600/40 to-red-500/40 p-2 ring-1 ring-red-700/30">
                <SparklesIcon className="h-6 w-6 text-red-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
                <p className="text-sm text-gray-400">Personalized insights powered by AI</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {AI_RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 shadow-lg hover:border-red-500/50 hover:shadow-red-900/20 transition"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    rec.type === "intervention" ? "bg-red-900/60 text-red-400" :
                    rec.type === "opportunity" ? "bg-red-800/50 text-red-300" :
                    "bg-red-800/50 text-red-400"
                  }`}>
                    {rec.type.toUpperCase()}
                  </span>
                  <span className={`text-xs font-semibold ${
                    rec.priority === "high" ? "text-red-400" : "text-red-500"
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="mb-1 font-semibold text-white">{rec.student}</p>
                <p className="text-sm text-gray-400">{rec.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Performance Trend */}
          <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold text-white">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={PERFORMANCE_TREND}>
                <defs>
                  <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#b91c1c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#991b1b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cgpa"
                  stroke="#dc2626"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCgpa)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CGPA Distribution */}
          <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold text-white">CGPA Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CGPA_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="count" fill="#dc2626" radius={[8, 8, 0, 0]}>
                  {CGPA_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#991b1b"][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interest Distribution and Recent Students */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Interest Distribution */}
          <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold text-white">Top Interests</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={INTEREST_DISTRIBUTION}>
                <PolarGrid stroke="#374151" strokeOpacity={0.5} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 20]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />
                <Radar
                  name="Students"
                  dataKey="value"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Students */}
          <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <button
                onClick={() => router.push("/chat")}
                className="flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300"
              >
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {RECENT_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="group flex items-center justify-between rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 shadow-lg transition hover:border-red-500/50 hover:shadow-red-900/20 cursor-pointer"
                  onClick={() => router.push("/chat")}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white shadow-xl ${
                      student.risk === "low" ? "bg-gradient-to-br from-red-400 to-red-500" :
                      student.risk === "medium" ? "bg-gradient-to-br from-red-500 to-red-600" :
                      "bg-gradient-to-br from-red-600 to-red-700"
                    }`}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{student.name}</p>
                        <RiskBadge risk={student.risk} />
                      </div>
                      <p className="text-sm text-gray-400">
                        {student.semester} · CGPA: {student.cgpa}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{student.lastContact}</p>
                    <ArrowRightIcon className="mt-1 h-4 w-4 text-gray-600 opacity-0 transition group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-8 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-red-600/40 to-red-500/40 p-2 ring-1 ring-red-700/30">
                <CalendarIcon className="h-6 w-6 text-red-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Upcoming Meetings</h2>
                <p className="text-sm text-gray-400">Your scheduled appointments</p>
              </div>
            </div>
            <button className="text-sm font-medium text-red-400 hover:text-red-300">
              View Calendar
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UPCOMING_MEETINGS.map((meeting) => (
              <div
                key={meeting.id}
                className="group rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 shadow-lg transition hover:border-red-500/50 hover:shadow-red-900/20 cursor-pointer"
                onClick={() => router.push("/chat")}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-red-900/60 px-2 py-1 text-xs font-semibold text-red-300">
                    {meeting.type}
                  </span>
                  <span className="text-xs font-medium text-gray-400">{meeting.date}</span>
                </div>
                <p className="mb-2 font-semibold text-white">{meeting.student}</p>
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1 text-sm text-gray-400">
                    <ClockIcon className="h-4 w-4" />
                    {meeting.time}
                  </p>
                  <span className="text-xs text-gray-500">{meeting.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-6 shadow-2xl">
          <h2 className="mb-4 text-lg font-bold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => router.push("/chat")}
              className="group flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 text-left shadow-lg transition hover:border-red-500/50 hover:shadow-red-900/20"
            >
              <div className="rounded-lg bg-gradient-to-br from-red-600/40 to-red-500/40 p-2 ring-1 ring-red-700/30">
                <AcademicCapIcon className="h-6 w-6 text-red-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Start New Session</p>
                <p className="text-xs text-gray-400">Begin advising a student</p>
              </div>
            </button>
            <button className="group flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 text-left shadow-lg transition hover:border-red-500/50 hover:shadow-red-900/20">
              <div className="rounded-lg bg-gradient-to-br from-red-600/40 to-red-500/40 p-2 ring-1 ring-red-700/30">
                <ChartBarIcon className="h-6 w-6 text-red-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Generate Report</p>
                <p className="text-xs text-gray-400">Export student analytics</p>
              </div>
            </button>
            <button className="group flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 text-left shadow-lg transition hover:border-red-500/50 hover:shadow-red-900/20">
              <div className="rounded-lg bg-gradient-to-br from-red-600/40 to-red-500/40 p-2 ring-1 ring-red-700/30">
                <CalendarIcon className="h-6 w-6 text-red-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Schedule Meeting</p>
                <p className="text-xs text-gray-400">Book an appointment</p>
              </div>
            </button>
            <button className="group flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 text-left shadow-lg transition hover:border-red-500/50 hover:shadow-red-900/20">
              <div className="rounded-lg bg-gradient-to-br from-red-600/40 to-red-500/40 p-2 ring-1 ring-red-700/30">
                <BellIcon className="h-6 w-6 text-red-300" />
              </div>
              <div>
                <p className="font-semibold text-white">View Alerts</p>
                <p className="text-xs text-gray-400">Check pending items</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
