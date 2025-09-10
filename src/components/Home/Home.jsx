import React, { useState } from "react";
import {
  MdListAlt,
  MdHourglassEmpty,
  MdBuild,
  MdCheckCircle,
  MdLocalShipping,
} from "react-icons/md";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getSessionData } from "../Common/UseFetch";

export default function Home() {
  const session=getSessionData()
  console.log(session);
  
  
  const orders = [
    { id: 1, status: "not_started" },
    { id: 2, status: "not_started" },
    { id: 3, status: "in_repair" },
    { id: 4, status: "repaired" },
    { id: 5, status: "handover" },
    { id: 6, status: "repaired" },
    { id: 7, status: "not_started" },
    { id: 8, status: "in_repair" },
    { id: 9, status: "handover" },
    { id: 10, status: "repaired" },
  ];

  const statusTabs = [
    { key: "all", label: "Total", icon: <MdListAlt /> },
    { key: "not_started", label: "Not Started", icon: <MdHourglassEmpty /> },
    { key: "in_repair", label: "In Repair", icon: <MdBuild /> },
    { key: "repaired", label: "Repaired", icon: <MdCheckCircle /> },
    { key: "handover", label: "Handover", icon: <MdLocalShipping /> },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const getCount = (status) =>
    status === "all" ? orders.length : orders.filter((o) => o.status === status).length;

  const chartData = [
    { name: "Not Started", value: orders.filter((o) => o.status === "not_started").length },
    { name: "In Repair", value: orders.filter((o) => o.status === "in_repair").length },
    { name: "Repaired", value: orders.filter((o) => o.status === "repaired").length },
    { name: "Handover", value: orders.filter((o) => o.status === "handover").length },
  ];

  const COLORS = ["var(--secondary)", "var(--primary)", "var(--primary)", "var(--secondary)"];

  const filteredChartData =
    activeTab === "all"
      ? chartData
      : chartData.filter((d) => d.name.toLowerCase().replace(" ", "_") === activeTab);

  return (
    <div className="w-full h-[calc(100vh-100px)] p-6 bg-white rounded-sm overflow-x-auto">
      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statusTabs.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`rounded-xl border p-4 shadow-sm flex items-center justify-between gap-3 transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gray-50 shadow-md scale-[1.02]"
                : "hover:bg-gray-50"
            }`}
            style={{ borderColor: "var(--primary)" }}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl" style={{ color: "var(--primary)" }}>
                {tab.icon}
              </div>
              <div className="flex flex-col">
                {/* Label */}
                <div className="text-sm font-semibold text-gray-500 uppercase">
                  {tab.label}
                </div>
                {/* Count */}
                <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                  {getCount(tab.key)}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            {activeTab === "all"
              ? "Overall Status"
              : statusTabs.find((t) => t.key === activeTab).label}
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={filteredChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                innerRadius={40}
                label
              >
                {filteredChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            {activeTab === "all"
              ? "Status Distribution"
              : statusTabs.find((t) => t.key === activeTab).label}
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filteredChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {filteredChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
