"use client";
import { useState } from "react";
import {
  Home,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const vpnData = [
  {
    timestamp: "2025-10-14T10:56:40",
    sourceIP: "172.16.2.44",
    username: "john",
    outcome: "success",
    host: "WEB-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-14T10:01:40",
    sourceIP: "172.16.2.44",
    username: "root",
    outcome: "failure",
    host: "SERVER-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-14T06:54:40",
    sourceIP: "192.168.1.45",
    username: "john",
    outcome: "success",
    host: "WORKSTATION-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-14T06:11:40",
    sourceIP: "10.1.1.100",
    username: "neha",
    outcome: "failure",
    host: "WORKSTATION-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-14T04:43:40",
    sourceIP: "198.51.100.33",
    username: "bob",
    outcome: "failure",
    host: "SERVER-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-14T03:46:40",
    sourceIP: "14.192.32.101",
    username: "root",
    outcome: "success",
    host: "WORKSTATION-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-14T03:22:40",
    sourceIP: "172.16.2.44",
    username: "svc_account",
    outcome: "success",
    host: "SERVER-02",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-14T01:54:40",
    sourceIP: "14.192.32.101",
    username: "root",
    outcome: "failure",
    host: "SERVER-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-13T23:32:40",
    sourceIP: "203.0.113.22",
    username: "raj",
    outcome: "success",
    host: "WORKSTATION-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-13T23:05:40",
    sourceIP: "14.192.32.101",
    username: "bob",
    outcome: "success",
    host: "WORKSTATION-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-13T21:04:40",
    sourceIP: "172.16.2.44",
    username: "bob",
    outcome: "success",
    host: "SERVER-02",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-13T17:54:40",
    sourceIP: "10.1.1.100",
    username: "john",
    outcome: "failure",
    host: "SERVER-01",
    action: "vpn_connect",
  },
  {
    timestamp: "2025-10-13T12:39:40",
    sourceIP: "198.51.100.33",
    username: "john",
    outcome: "success",
    host: "DB-01",
    action: "vpn_connect",
  },
];

const ReportInput = ({ onGenerate }: { onGenerate: (q?: string) => void }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (loading) return;
    if (!query.trim()) {
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 5000));
    onGenerate(query || "show VPN logins");
    setQuery("");
    setLoading(false);
  };

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGenerate();
            }
          }}
          placeholder="Enter query (e.g., show VPN logins)..."
          className="flex-1 bg-gray-900 text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500"
        />
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
          disabled={loading || !query.trim()}
        >
          <BarChart3 size={16} />
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </div>
  );
};

const ReportSummary = () => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 space-y-2">
      <p>
        <strong className="text-gray-200">Query:</strong> show VPN logins
      </p>
      <p>
        <strong className="text-gray-200">Source:</strong> openvpn.log
      </p>
      <p>
        <strong className="text-gray-200">Date Range:</strong> 2025-10-13 to
        2025-10-14
      </p>
    </div>
  );
};

const ReportTable = () => {
  const successCount = vpnData.filter((d) => d.outcome === "success").length;
  const failureCount = vpnData.filter((d) => d.outcome === "failure").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-xs text-gray-400">
          Total Logins:{" "}
          <span className="font-semibold text-white">{vpnData.length}</span>
        </div>
        <div className="text-xs text-gray-400">
          Success:{" "}
          <span className="font-semibold text-green-400">{successCount}</span>
        </div>
        <div className="text-xs text-gray-400">
          Failed:{" "}
          <span className="font-semibold text-red-400">{failureCount}</span>
        </div>
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-xs text-gray-300 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pr-4 py-3 font-semibold">Timestamp (UTC)</th>
              <th className="pr-4 py-3 font-semibold">Source IP</th>
              <th className="pr-4 py-3 font-semibold">Username</th>
              <th className="pr-4 py-3 font-semibold">Event Outcome</th>
              <th className="pr-4 py-3 font-semibold">Host</th>
              <th className="pr-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {vpnData.map((row, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors"
              >
                <td className="pr-4 py-2 font-mono">{row.timestamp}</td>
                <td className="pr-4 py-2 font-mono">{row.sourceIP}</td>
                <td className="pr-4 py-2 font-mono">{row.username}</td>
                <td className="pr-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      row.outcome === "success"
                        ? "bg-green-900/30 text-green-300"
                        : "bg-red-900/30 text-red-300"
                    }`}
                  >
                    {row.outcome === "success" ? "✅" : "❌"} {row.outcome}
                  </span>
                </td>
                <td className="pr-4 py-2 font-mono">{row.host}</td>
                <td className="pr-4 py-2 font-mono">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AnalyticalInsights = () => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-sm text-gray-300 space-y-4">
      <h3 className="text-gray-200 font-semibold text-base">
        Analytical Insights
      </h3>

      <div className="space-y-2 text-xs">
        <p>
          <strong className="text-gray-200">Total VPN login events:</strong> 13
        </p>
        <p>
          <strong className="text-gray-200">Successful logins:</strong> 8{" "}
          <span className="text-gray-400">|</span>{" "}
          <strong className="text-gray-200">Failed logins:</strong> 5
        </p>
      </div>

      <div className="space-y-2 text-xs">
        <p>
          <strong className="text-gray-200">Users involved:</strong> john, root,
          bob, neha, raj, svc_account
        </p>
      </div>

      <div className="space-y-2 text-xs">
        <p>
          john had multiple login attempts from different IPs (192.168.1.45,
          198.51.100.33, 10.1.1.100), suggesting logins from different networks
          or locations.
        </p>

        <p>
          root account shows both success and failure across two hosts
          (SERVER-01 and WORKSTATION-01), which may indicate possible
          brute-force attempts or admin usage from varied machines.
        </p>

        <p>
          bob logged in successfully from multiple IPs; his failed attempt from
          198.51.100.33 stands out as possibly external.
        </p>
      </div>

      <div className="space-y-2 text-xs border-t border-gray-700 pt-3">
        <h4 className="text-gray-200 font-semibold">Host Activity Overview</h4>

        <p>
          SERVER-01 experienced 3 failed logins, mostly from external IPs
          (198.51.100.33, 14.192.32.101, 10.1.1.100).
        </p>

        <p>
          WORKSTATION-01 was a common access point, hosting both successes and
          failures.
        </p>

        <p>
          SERVER-02 saw only successful logins, indicating stable usage or
          trusted service accounts.
        </p>
      </div>

      <div className="space-y-2 text-xs border-t border-gray-700 pt-3">
        <h4 className="text-gray-200 font-semibold">Suspicious Indicators</h4>

        <p>
          Repeated login failures from 198.51.100.33 and 14.192.32.101 may
          suggest external probing or credential guessing.
        </p>

        <p>
          Root account activity from non-server machines (e.g., WORKSTATION-01)
          should be reviewed for compliance with access policies.
        </p>
      </div>
    </div>
  );
};

const ReportCharts = () => {
  // Build userLoginData
  const userLoginData = vpnData.reduce((acc: any[], d) => {
    const existing = acc.find((u) => u.name === d.username);
    if (existing) {
      existing.logins += 1;
    } else {
      acc.push({ name: d.username, logins: 1 });
    }
    return acc;
  }, []);

  // Outcome counts
  const successCount = vpnData.filter((d) => d.outcome === "success").length;
  const failureCount = vpnData.filter((d) => d.outcome === "failure").length;

  // Host activity data
  const hostActivityData = vpnData.reduce((acc: any[], d) => {
    const existing = acc.find((h) => h.name === d.host);
    if (existing) {
      existing.attempts += 1;
    } else {
      acc.push({ name: d.host, attempts: 1 });
    }
    return acc;
  }, []);

  // Plotly dark theme config
  const darkLayout = {
    paper_bgcolor: "#08090b",
    plot_bgcolor: "#1a1d22",
    font: {
      color: "#9ca3af",
      family: "system-ui, -apple-system, sans-serif",
      size: 12,
    },
    margin: { l: 50, r: 30, t: 40, b: 40 },
    xaxis: {
      showgrid: true,
      gridcolor: "#374151",
      linecolor: "#4b5563",
    },
    yaxis: {
      showgrid: true,
      gridcolor: "#374151",
      linecolor: "#4b5563",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Logins per user - Bar Chart */}
      <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-200">
            Logins per User
          </h3>
        </div>

        {userLoginData.length === 0 ? (
          <div className="text-gray-400 text-sm p-4 border border-gray-800 rounded">
            No user login data available for chart.
          </div>
        ) : (
          <Plot
            data={[
              {
                x: userLoginData.map((d) => d.name),
                y: userLoginData.map((d) => d.logins),
                type: "bar",
                marker: { color: "#10b981" },
                hovertemplate: "<b>%{x}</b><br>Logins: %{y}<extra></extra>",
              },
            ]}
            layout={{
              ...darkLayout,
              height: 300,
              showlegend: false,
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: "100%", height: "300px" }}
          />
        )}
      </div>

      {/* Success/Failure Pie Chart */}
      <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-200">
            Success/Failure Ratio
          </h3>
        </div>

        {successCount + failureCount === 0 ? (
          <div className="text-gray-400 text-sm p-4 border border-gray-800 rounded">
            No outcome data available for chart.
          </div>
        ) : (
          <Plot
            data={[
              {
                labels: ["Success", "Failure"],
                values: [successCount, failureCount],
                type: "pie",
                marker: { colors: ["#10b981", "#ef4444"] },
                textposition: "inside",
                textinfo: "label+percent",
                hovertemplate:
                  "<b>%{label}</b><br>Count: %{value}<extra></extra>",
              },
            ]}
            layout={{
              ...darkLayout,
              height: 300,
              showlegend: true,
              margin: { l: 0, r: 0, t: 0, b: 0 },
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: "100%", height: "300px" }}
          />
        )}
      </div>

      {/* Login attempts in last 10 hours - Line Chart (realistic zig-zag dummy data) */}
      <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-200">
            Login Attempts in Last 10 Hours
          </h3>
        </div>

        {(() => {
          // Static realistic zig-zag dummy data (touching 0 occasionally)
          const now = new Date("2025-10-14T11:00:00Z");
          const past10Hours = Array.from({ length: 10 }, (_, i) => {
            const hour = new Date(now.getTime() - (9 - i) * 60 * 60 * 1000);
            const hh = hour.getUTCHours().toString().padStart(2, "0");

            // Generate zig-zag pattern (touches 0 sometimes, peaks around 8)
            const pattern = [1, 2, 4, 2, 5, 8, 1, 6, 0, 4];
            return {
              hourLabel: `${hh}:00`,
              count: pattern[i % pattern.length],
            };
          });

          return (
            <Plot
              data={
                [
                  {
                    x: past10Hours.map((d) => d.hourLabel),
                    y: past10Hours.map((d) => d.count),
                    type: "scatter",
                    mode: "lines+markers",
                    line: { color: "#10b981", width: 2, shape: "spline" },
                    marker: { color: "#10b981", size: 6 },
                    hovertemplate:
                      "<b>Hour (UTC): %{x}</b><br>Attempts: %{y}<extra></extra>",
                  },
                ] as Partial<Plotly.Data>[]
              }
              layout={
                {
                  ...darkLayout,
                  height: 300,
                  showlegend: false,
                  xaxis: {
                    ...darkLayout.xaxis,
                    title: { text: "Hour (UTC)", font: { color: "#9ca3af" } },
                    tickmode: "array",
                  },
                  yaxis: {
                    ...darkLayout.yaxis,
                    title: {
                      text: "Login Attempts",
                      font: { color: "#9ca3af" },
                    },
                    rangemode: "tozero",
                  },
                } as Partial<Plotly.Layout>
              }
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "300px" }}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default function ReportGenerator() {
  const [showReport, setShowReport] = useState(false);

  const handleGenerate = () => {
    setShowReport(true);
  };
  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) {
      alert("Report content not found!");
      return;
    }

    element.style.maxHeight = "none"; // ensure everything (charts + insights) is visible

    try {
      // 🧩 Wait for all Plotly charts to finish rendering
      const plotlyCanvases = element.querySelectorAll(".js-plotly-plot");
      await Promise.all(
        Array.from(plotlyCanvases).map(
          (plot: any) =>
            new Promise((resolve) => {
              if (plot._fullLayout) resolve(true);
              else setTimeout(resolve, 300);
            })
        )
      );

      // ✅ Clone the full visible content
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.position = "fixed";
      clonedElement.style.top = "0";
      clonedElement.style.left = "0";
      clonedElement.style.width = `${element.scrollWidth}px`;
      clonedElement.style.height = `${element.scrollHeight}px`;
      clonedElement.style.opacity = "1";
      clonedElement.style.zIndex = "-1";
      clonedElement.style.pointerEvents = "none";
      clonedElement.style.background = "#0f1115";
      document.body.appendChild(clonedElement);

      // ✅ Small wait for DOM paint
      await new Promise((r) => setTimeout(r, 500));

      // ✅ Clean unsupported color functions
      clonedElement.querySelectorAll("*").forEach((el) => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        const color = style.color;

        if (bg.includes("lab(") || bg.includes("lch(")) {
          (el as HTMLElement).style.backgroundColor = "#0f1115";
        }
        if (color.includes("lab(") || color.includes("lch(")) {
          (el as HTMLElement).style.color = "#e5e7eb";
        }
      });

      // ✅ Use higher scale for better resolution
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        backgroundColor: "#0f1115",
        useCORS: true,
        foreignObjectRendering: true,
        logging: false,
        allowTaint: true,
        windowWidth: clonedElement.scrollWidth,
        windowHeight: clonedElement.scrollHeight,
      });

      document.body.removeChild(clonedElement);

      // ✅ Convert to image and export as PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 🔹 If the image is longer than one page, add multiple pages dynamically
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("vpn-report.pdf");
      console.log(
        "✅ Full PDF (with charts + insights) generated successfully!"
      );
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
      alert("PDF generation failed. Check console for details.");
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-gray-200">
      <aside className="w-72 border-r border-gray-800 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Report Generator</h3>
            <p className="text-xs text-gray-400">
              Security & compliance reports
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          <div className="p-3 rounded bg-gray-800/80 border border-emerald-500/30 cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium">VPN Activity</div>
              <div className="text-xs text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">
                1
              </div>
            </div>
            <div className="text-xs text-gray-500">Current Report</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
          💡 Tip: Use natural language queries to generate detailed security
          reports
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="flex-none px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-emerald-900/10 to-blue-900/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Report Generator
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Generate, visualize, and export analytical security reports.
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded">
              <a href="/" className="inline-flex items-center gap-1">
                <Home size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <ReportInput onGenerate={handleGenerate} />

          {showReport && (
            <div id="report-content" className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛰️</span>
                <h3 className="text-xl font-semibold text-white">
                  VPN Login Activity Report
                </h3>
              </div>

              <ReportSummary />
              <ReportTable />
              <AnalyticalInsights />
              <ReportCharts />

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                >
                  <Download size={14} />
                  Download as PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
