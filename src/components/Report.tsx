"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardProps {
  severityData: { severity: string; count: number }[];
  eventTypeData: { type: string; count: number }[];
  eventsOverTimeData: { hour: string; count: number }[];
  geoData: { city: string; country: string; count: number }[];
  serverData: { server: string; type: string; count: number }[];
  endpointData: { device: string; os: string; count: number }[];
  correlationData: { source: string; user: string; destination: string; count: number }[];
}

const COLORS = {
  Critical: "red-500",
  High: "orange-500",
  Medium: "yellow-500",
  Low: "blue-500",
};

const Dashboard: React.FC<DashboardProps> = ({
  severityData,
  eventTypeData,
  eventsOverTimeData,
  geoData,
  serverData,
  endpointData,
  correlationData,
}) => {
  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Severity */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Events by Severity</h4>
        <div className="space-y-3">
          {severityData.map((item) => (
            <div key={item.severity} className="flex items-center space-x-3">
              <span className="text-xs text-gray-400 w-16">{item.severity}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full bg-${COLORS[item.severity as keyof typeof COLORS]}`}
                  style={{ width: `${item.count}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-12 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Event Types */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Top Event Types</h4>
        <div className="space-y-2">
          {eventTypeData.map((item) => (
            <div key={item.type} className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
              <span className="text-xs font-mono text-gray-300">{item.type}</span>
              <span className="text-sm font-semibold text-green-400">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events Over Time */}
      <div className="col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Events Over Time</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={eventsOverTimeData}>
            <XAxis dataKey="hour" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Geo Attack Map (simplified as bar for now) */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Geo Attack Overview</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={geoData}>
            <XAxis dataKey="city" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            <Bar dataKey="count" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Server Attack Overview */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Server Attack Overview</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={serverData}>
            <XAxis dataKey="server" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Endpoint / OS Insights */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Endpoint / OS Insights</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={endpointData}
              dataKey="count"
              nameKey="device"
              innerRadius={30}
              outerRadius={60}
              fill="#22c55e"
              label
            >
              {endpointData.map((entry, index) => (
                <Cell key={index} fill={["#22c55e", "#f59e0b", "#3b82f6", "#ef4444"][index % 4]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ color: "#aaa" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Event Correlations (simplified as stacked bar) */}
      <div className="col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Event Correlations</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={correlationData}>
            <XAxis dataKey="source" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            <Bar dataKey="count" stackId="a" fill="#f43f5e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
