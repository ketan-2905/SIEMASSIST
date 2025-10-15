// "use client";
// import {
//   Download,
//   BarChart3,
//   PieChart as PieChartIcon,
//   Home,
// } from "lucide-react";
// import dynamic from "next/dynamic";
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { useReportData } from "@/context/ReportDataContext";
// import Link from "next/link";

// const ReportSummary = () => {
//   const { vpnData } = useReportData();

//   // Calculate date range from data
//   const getDateRange = () => {
//     if (vpnData.length === 0) return "No data available";

//     const timestamps = vpnData.map((d) => new Date(d.timestamp));
//     const minDate = new Date(Math.min(...timestamps.map((d) => d.getTime())));
//     const maxDate = new Date(Math.max(...timestamps.map((d) => d.getTime())));

//     return `${minDate.toISOString().split("T")[0]} to ${
//       maxDate.toISOString().split("T")[0]
//     }`;
//   };

//   return (
//     <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 space-y-2">
//       <p>
//         <strong className="text-gray-200">Report Type:</strong> VPN Login
//         Activity
//       </p>
//       <p>
//         <strong className="text-gray-200">Source:</strong> openvpn.log
//       </p>
//       <p>
//         <strong className="text-gray-200">Date Range:</strong> {getDateRange()}
//       </p>
//       <p>
//         <strong className="text-gray-200">Total Records:</strong>{" "}
//         {vpnData.length}
//       </p>
//     </div>
//   );
// };

// const ReportTable = () => {
//   const { vpnData } = useReportData();

//   const successCount = vpnData.filter((d) => d.outcome === "success").length;
//   const failureCount = vpnData.filter((d) => d.outcome === "failure").length;

//   if (vpnData.length === 0) {
//     return (
//       <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 text-center">
//         <p className="text-gray-400">No VPN data available for display</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-4">
//         <div className="text-xs text-gray-400">
//           Total Logins:{" "}
//           <span className="font-semibold text-white">{vpnData.length}</span>
//         </div>
//         <div className="text-xs text-gray-400">
//           Success:{" "}
//           <span className="font-semibold text-green-400">{successCount}</span>
//         </div>
//         <div className="text-xs text-gray-400">
//           Failed:{" "}
//           <span className="font-semibold text-red-400">{failureCount}</span>
//         </div>
//       </div>

//       <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-xs text-gray-300 overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             <tr className="text-left text-gray-400 border-b border-gray-800">
//               <th className="pr-4 py-3 font-semibold">Timestamp (UTC)</th>
//               <th className="pr-4 py-3 font-semibold">Source IP</th>
//               <th className="pr-4 py-3 font-semibold">Username</th>
//               <th className="pr-4 py-3 font-semibold">Event Outcome</th>
//               <th className="pr-4 py-3 font-semibold">Host</th>
//               <th className="pr-4 py-3 font-semibold">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {vpnData.map((row, i) => (
//               <tr
//                 key={i}
//                 className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors"
//               >
//                 <td className="pr-4 py-2 font-mono">{row.timestamp}</td>
//                 <td className="pr-4 py-2 font-mono">{row.sourceIP}</td>
//                 <td className="pr-4 py-2 font-mono">{row.username}</td>
//                 <td className="pr-4 py-2">
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-semibold ${
//                       row.outcome === "success"
//                         ? "bg-green-900/30 text-green-300"
//                         : "bg-red-900/30 text-red-300"
//                     }`}
//                   >
//                     {row.outcome === "success" ? "✅" : "❌"} {row.outcome}
//                   </span>
//                 </td>
//                 <td className="pr-4 py-2 font-mono">{row.host}</td>
//                 <td className="pr-4 py-2 font-mono">{row.action}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const AnalyticalInsights = () => {
//   const { vpnData } = useReportData();

//   const successCount = vpnData.filter((d) => d.outcome === "success").length;
//   const failureCount = vpnData.filter((d) => d.outcome === "failure").length;

//   // Get unique users
//   const users = Array.from(new Set(vpnData.map((d) => d.username)));
//   const uniqueIPs = Array.from(new Set(vpnData.map((d) => d.sourceIP)));
//   const uniqueHosts = Array.from(new Set(vpnData.map((d) => d.host)));

//   // Calculate success rate
//   const successRate =
//     vpnData.length > 0
//       ? ((successCount / vpnData.length) * 100).toFixed(1)
//       : "0";

//   return (
//     <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-sm text-gray-300 space-y-4">
//       <h3 className="text-gray-200 font-semibold text-base">
//         Analytical Insights
//       </h3>

//       <div className="space-y-2 text-xs">
//         <p>
//           <strong className="text-gray-200">Total VPN login events:</strong>{" "}
//           {vpnData.length}
//         </p>
//         <p>
//           <strong className="text-gray-200">Successful logins:</strong>{" "}
//           {successCount} <span className="text-gray-400">|</span>{" "}
//           <strong className="text-gray-200">Failed logins:</strong>{" "}
//           {failureCount}
//           <span className="text-gray-400"> | </span>
//           <strong className="text-gray-200">Success Rate:</strong> {successRate}
//           %
//         </p>
//       </div>

//       <div className="space-y-2 text-xs">
//         <p>
//           <strong className="text-gray-200">Users involved:</strong>{" "}
//           {users.join(", ")}
//         </p>
//         <p>
//           <strong className="text-gray-200">Source IPs:</strong>{" "}
//           {uniqueIPs.length} unique addresses
//         </p>
//         <p>
//           <strong className="text-gray-200">Target Hosts:</strong>{" "}
//           {uniqueHosts.join(", ")}
//         </p>
//       </div>

//       {vpnData.length > 0 && (
//         <div className="space-y-2 text-xs border-t border-gray-700 pt-3">
//           <h4 className="text-gray-200 font-semibold">Activity Patterns</h4>
//           <p>
//             The data shows login attempts from {uniqueIPs.length} different IP
//             addresses targeting {uniqueHosts.length} different hosts.
//           </p>
//           <p>
//             {failureCount > 0
//               ? `There were ${failureCount} failed login attempts that may require security review.`
//               : "All login attempts were successful during this period."}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// const ReportCharts = () => {
//   const { vpnData } = useReportData();

//   // Build userLoginData
//   const userLoginData = vpnData.reduce((acc: any[], d) => {
//     const existing = acc.find((u) => u.name === d.username);
//     if (existing) {
//       existing.logins += 1;
//     } else {
//       acc.push({ name: d.username, logins: 1 });
//     }
//     return acc;
//   }, []);

//   // Outcome counts
//   const successCount = vpnData.filter((d) => d.outcome === "success").length;
//   const failureCount = vpnData.filter((d) => d.outcome === "failure").length;

//   // Host activity data
//   const hostActivityData = vpnData.reduce((acc: any[], d) => {
//     const existing = acc.find((h) => h.name === d.host);
//     if (existing) {
//       existing.attempts += 1;
//     } else {
//       acc.push({ name: d.host, attempts: 1 });
//     }
//     return acc;
//   }, []);

//   // Plotly dark theme config
//   const darkLayout = {
//     paper_bgcolor: "#08090b",
//     plot_bgcolor: "#1a1d22",
//     font: {
//       color: "#9ca3af",
//       family: "system-ui, -apple-system, sans-serif",
//       size: 12,
//     },
//     margin: { l: 50, r: 30, t: 40, b: 40 },
//     xaxis: {
//       showgrid: true,
//       gridcolor: "#374151",
//       linecolor: "#4b5563",
//     },
//     yaxis: {
//       showgrid: true,
//       gridcolor: "#374151",
//       linecolor: "#4b5563",
//     },
//   };

//   if (vpnData.length === 0) {
//     return (
//       <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 text-center">
//         <p className="text-gray-400">No data available for charts</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Logins per user - Bar Chart */}
//         <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
//           <div className="flex items-center gap-2 mb-4">
//             <BarChart3 size={16} className="text-emerald-400" />
//             <h3 className="text-sm font-semibold text-gray-200">
//               Logins per User
//             </h3>
//           </div>

//           {userLoginData.length === 0 ? (
//             <div className="text-gray-400 text-sm p-4 border border-gray-800 rounded">
//               No user login data available for chart.
//             </div>
//           ) : (
//             <Plot
//               data={[
//                 {
//                   x: userLoginData.map((d) => d.name),
//                   y: userLoginData.map((d) => d.logins),
//                   type: "bar",
//                   marker: { color: "#10b981" },
//                   hovertemplate: "<b>%{x}</b><br>Logins: %{y}<extra></extra>",
//                 },
//               ]}
//               layout={{
//                 ...darkLayout,
//                 height: 300,
//                 showlegend: false,
//               }}
//               config={{ responsive: true, displayModeBar: false }}
//               style={{ width: "100%", height: "300px" }}
//             />
//           )}

//           {/* Explanation for User Login Chart */}
//           <div className="mt-4 p-3 bg-gray-800/30 rounded border border-gray-700">
//             <h4 className="text-xs font-semibold text-gray-200 mb-2">Analysis Insight</h4>
//             <p className="text-xs text-gray-400">
//               This chart displays VPN login distribution across users.
//               {userLoginData.length > 0 && (
//                 <>
//                   {" "}User <strong className="text-emerald-400">{userLoginData.reduce((max, user) => user.logins > max.logins ? user : max).name}</strong> has the highest number of login attempts ({userLoginData.reduce((max, user) => user.logins > max.logins ? user : max).logins}),
//                   which may indicate regular usage or require further investigation for unusual activity patterns.
//                 </>
//               )}
//             </p>
//           </div>
//         </div>

//         {/* Success/Failure Pie Chart */}
//         <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
//           <div className="flex items-center gap-2 mb-4">
//             <PieChartIcon size={16} className="text-emerald-400" />
//             <h3 className="text-sm font-semibold text-gray-200">
//               Success/Failure Ratio
//             </h3>
//           </div>

//           {successCount + failureCount === 0 ? (
//             <div className="text-gray-400 text-sm p-4 border border-gray-800 rounded">
//               No outcome data available for chart.
//             </div>
//           ) : (
//             <Plot
//               data={[
//                 {
//                   labels: ["Success", "Failure"],
//                   values: [successCount, failureCount],
//                   type: "pie",
//                   marker: { colors: ["#10b981", "#ef4444"] },
//                   textposition: "inside",
//                   textinfo: "label+percent",
//                   hovertemplate:
//                     "<b>%{label}</b><br>Count: %{value}<extra></extra>",
//                 },
//               ]}
//               layout={{
//                 ...darkLayout,
//                 height: 300,
//                 showlegend: true,
//                 margin: { l: 0, r: 0, t: 0, b: 0 },
//               }}
//               config={{ responsive: true, displayModeBar: false }}
//               style={{ width: "100%", height: "300px" }}
//             />
//           )}

//           {/* Explanation for Success/Failure Chart */}
//           <div className="mt-4 p-3 bg-gray-800/30 rounded border border-gray-700">
//             <h4 className="text-xs font-semibold text-gray-200 mb-2">Security Assessment</h4>
//             <p className="text-xs text-gray-400">
//               The success/failure ratio provides critical security insights.
//               {failureCount > 0 ? (
//                 <>
//                   {" "}With <strong className="text-red-400">{failureCount} failed attempts</strong>,
//                   there may be potential security concerns such as brute force attacks or credential issues
//                   that require monitoring and investigation.
//                 </>
//               ) : (
//                 <>
//                   {" "}All login attempts were successful, indicating stable VPN connectivity
//                   and proper authentication during this reporting period.
//                 </>
//               )}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Host Activity Chart */}

//       {/* Overall Security Summary */}
//       <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
//         <h3 className="text-gray-200 font-semibold text-base mb-3">
//           Security Summary
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
//           <div>
//             <h4 className="text-gray-200 font-medium mb-2">Key Observations</h4>
//             <ul className="space-y-1 text-xs">
//               <li>• Total unique users accessing VPN: <strong>{userLoginData.length}</strong></li>
//               <li>• Success rate: <strong>{((successCount / vpnData.length) * 100).toFixed(1)}%</strong></li>
//               <li>• Most active host: <strong>{hostActivityData.length > 0 ? hostActivityData.reduce((max, host) => host.attempts > max.attempts ? host : max).name : 'N/A'}</strong></li>
//               <li>• Failed login ratio: <strong>{((failureCount / vpnData.length) * 100).toFixed(1)}%</strong></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-gray-200 font-medium mb-2">Recommendations</h4>
//             <ul className="space-y-1 text-xs">
//               {failureCount > 5 && (
//                 <li>• Investigate repeated failed login attempts</li>
//               )}
//               {userLoginData.some(user => user.logins > 10) && (
//                 <li>• Review high-frequency user access patterns</li>
//               )}
//               <li>• Monitor unusual access times and locations</li>
//               <li>• Consider implementing MFA for critical systems</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const handleDownloadPDF = async () => {
//   const element = document.getElementById("report-content");
//   if (!element) {
//     alert("Report content not found!");
//     return;
//   }

//   element.style.maxHeight = "none";

//   try {
//     const plotlyCanvases = element.querySelectorAll(".js-plotly-plot");
//     await Promise.all(
//       Array.from(plotlyCanvases).map(
//         (plot: any) =>
//           new Promise((resolve) => {
//             if (plot._fullLayout) resolve(true);
//             else setTimeout(resolve, 300);
//           })
//       )
//     );

//     const clonedElement = element.cloneNode(true) as HTMLElement;
//     clonedElement.style.position = "fixed";
//     clonedElement.style.top = "0";
//     clonedElement.style.left = "0";
//     clonedElement.style.width = `${element.scrollWidth}px`;
//     clonedElement.style.height = `${element.scrollHeight}px`;
//     clonedElement.style.opacity = "1";
//     clonedElement.style.zIndex = "-1";
//     clonedElement.style.pointerEvents = "none";
//     clonedElement.style.background = "#0f1115";
//     document.body.appendChild(clonedElement);

//     await new Promise((r) => setTimeout(r, 500));

//     clonedElement.querySelectorAll("*").forEach((el) => {
//       const style = window.getComputedStyle(el);
//       const bg = style.backgroundColor;
//       const color = style.color;

//       if (bg.includes("lab(") || bg.includes("lch(")) {
//         (el as HTMLElement).style.backgroundColor = "#0f1115";
//       }
//       if (color.includes("lab(") || color.includes("lch(")) {
//         (el as HTMLElement).style.color = "#e5e7eb";
//       }
//     });

//     const canvas = await html2canvas(clonedElement, {
//       scale: 2,
//       backgroundColor: "#0f1115",
//       useCORS: true,
//       foreignObjectRendering: true,
//       logging: false,
//       allowTaint: true,
//       windowWidth: clonedElement.scrollWidth,
//       windowHeight: clonedElement.scrollHeight,
//     });

//     document.body.removeChild(clonedElement);

//     const imgData = canvas.toDataURL("image/png", 1.0);
//     const pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: "a4",
//     });

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save("vpn-report.pdf");
//   } catch (err) {
//     console.error("PDF generation failed:", err);
//     alert("PDF generation failed. Check console for details.");
//   }
// };

// export default function ReportGenerator() {
//   const { vpnData, isLoading } = useReportData();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
//         <div className="text-gray-400">Loading report data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0f1115] text-gray-200 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white mb-2">
//               VPN Login Activity Report
//             </h1>
//             <p className="text-gray-400">
//               Comprehensive analysis of VPN connection attempts and security
//               events
//             </p>
//           </div>

//           {vpnData.length > 0 && (
//             <button
//               onClick={handleDownloadPDF}
//               className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
//             >
//               <Download size={18} />
//               Download PDF Report
//             </button>
//           )}

//           <Link href="/">
//             <Home size={16} className="inline-block mr-1" />
//           </Link>
//         </div>

//         {/* Report Content */}
//         <div id="report-content" className="space-y-6">
//           <ReportSummary />

//           {vpnData.length > 0 ? (
//             <>
//               <ReportTable />
//               <AnalyticalInsights />
//               <ReportCharts />
//             </>
//           ) : (
//             <div className="bg-gray-900/50 p-12 rounded-lg border border-gray-800 text-center">
//               <div className="text-6xl mb-4">📊</div>
//               <h3 className="text-xl font-semibold text-white mb-2">
//                 No Data Available
//               </h3>
//               <p className="text-gray-400 max-w-md mx-auto">
//                 No VPN activity data has been loaded. Data should be provided
//                 through the context from other components.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import {
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Home,
} from "lucide-react";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import type { PlotlyHTMLElement } from "plotly.js";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReportData } from "@/context/ReportDataContext";
import Link from "next/link";

interface PlotlyHTMLElementWithLayout extends PlotlyHTMLElement {
  _fullLayout?: object;
}


// Define proper TypeScript interfaces
interface VpnData {
  timestamp: string;
  sourceIP: string;
  username: string;
  outcome: "success" | "failure";
  host: string;
  action: string;
}

interface UserLoginData {
  name: string;
  logins: number;
}

interface HostActivityData {
  name: string;
  attempts: number;
}

const ReportSummary = () => {
  const { vpnData } = useReportData();

  // Calculate date range from data
  const getDateRange = (): string => {
    if (vpnData.length === 0) return "No data available";

    try {
      const timestamps = vpnData
        .map((d: VpnData) => new Date(d.timestamp).getTime())
        .filter((ts) => !isNaN(ts));

      if (timestamps.length === 0) return "Invalid date data";

      const minDate = new Date(Math.min(...timestamps));
      const maxDate = new Date(Math.max(...timestamps));

      return `${minDate.toISOString().split("T")[0]} to ${
        maxDate.toISOString().split("T")[0]
      }`;
    } catch (error) {
      console.error("Error calculating date range:", error);
      return "Date calculation error";
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 space-y-2">
      <p>
        <strong className="text-gray-200">Report Type:</strong> VPN Login
        Activity
      </p>
      <p>
        <strong className="text-gray-200">Source:</strong> openvpn.log
      </p>
      <p>
        <strong className="text-gray-200">Date Range:</strong> {getDateRange()}
      </p>
      <p>
        <strong className="text-gray-200">Total Records:</strong>{" "}
        {vpnData.length}
      </p>
    </div>
  );
};

const ReportTable = () => {
  const { vpnData } = useReportData();

  const successCount = vpnData.filter(
    (d: VpnData) => d.outcome === "success"
  ).length;
  const failureCount = vpnData.filter(
    (d: VpnData) => d.outcome === "failure"
  ).length;

  if (vpnData.length === 0) {
    return (
      <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 text-center">
        <p className="text-gray-400">No VPN data available for display</p>
      </div>
    );
  }

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
            {vpnData.map((row: VpnData, i: number) => (
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
  const { vpnData } = useReportData();

  const successCount = vpnData.filter(
    (d: VpnData) => d.outcome === "success"
  ).length;
  const failureCount = vpnData.filter(
    (d: VpnData) => d.outcome === "failure"
  ).length;

  // Get unique users
  const users = Array.from(new Set(vpnData.map((d: VpnData) => d.username)));
  const uniqueIPs = Array.from(
    new Set(vpnData.map((d: VpnData) => d.sourceIP))
  );
  const uniqueHosts = Array.from(new Set(vpnData.map((d: VpnData) => d.host)));

  // Calculate success rate
  const successRate =
    vpnData.length > 0
      ? ((successCount / vpnData.length) * 100).toFixed(1)
      : "0";

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-sm text-gray-300 space-y-4">
      <h3 className="text-gray-200 font-semibold text-base">
        Analytical Insights
      </h3>

      <div className="space-y-2 text-xs">
        <p>
          <strong className="text-gray-200">Total VPN login events:</strong>{" "}
          {vpnData.length}
        </p>
        <p>
          <strong className="text-gray-200">Successful logins:</strong>{" "}
          {successCount} <span className="text-gray-400">|</span>{" "}
          <strong className="text-gray-200">Failed logins:</strong>{" "}
          {failureCount}
          <span className="text-gray-400"> | </span>
          <strong className="text-gray-200">Success Rate:</strong> {successRate}
          %
        </p>
      </div>

      <div className="space-y-2 text-xs">
        <p>
          <strong className="text-gray-200">Users involved:</strong>{" "}
          {users.join(", ")}
        </p>
        <p>
          <strong className="text-gray-200">Source IPs:</strong>{" "}
          {uniqueIPs.length} unique addresses
        </p>
        <p>
          <strong className="text-gray-200">Target Hosts:</strong>{" "}
          {uniqueHosts.join(", ")}
        </p>
      </div>

      {vpnData.length > 0 && (
        <div className="space-y-2 text-xs border-t border-gray-700 pt-3">
          <h4 className="text-gray-200 font-semibold">Activity Patterns</h4>
          <p>
            The data shows login attempts from {uniqueIPs.length} different IP
            addresses targeting {uniqueHosts.length} different hosts.
          </p>
          <p>
            {failureCount > 0
              ? `There were ${failureCount} failed login attempts that may require security review.`
              : "All login attempts were successful during this period."}
          </p>
        </div>
      )}
    </div>
  );
};

const ReportCharts = () => {
  const { vpnData } = useReportData();

  // Build userLoginData with proper typing
  const userLoginData: UserLoginData[] = vpnData.reduce(
    (acc: UserLoginData[], d: VpnData) => {
      const existing = acc.find((u) => u.name === d.username);
      if (existing) {
        existing.logins += 1;
      } else {
        acc.push({ name: d.username, logins: 1 });
      }
      return acc;
    },
    []
  );

  // Outcome counts
  const successCount = vpnData.filter(
    (d: VpnData) => d.outcome === "success"
  ).length;
  const failureCount = vpnData.filter(
    (d: VpnData) => d.outcome === "failure"
  ).length;

  // Host activity data with proper typing
  const hostActivityData: HostActivityData[] = vpnData.reduce(
    (acc: HostActivityData[], d: VpnData) => {
      const existing = acc.find((h) => h.name === d.host);
      if (existing) {
        existing.attempts += 1;
      } else {
        acc.push({ name: d.host, attempts: 1 });
      }
      return acc;
    },
    []
  );

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

  if (vpnData.length === 0) {
    return (
      <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 text-center">
        <p className="text-gray-400">No data available for charts</p>
      </div>
    );
  }

  // Find most active user and host safely
  const mostActiveUser =
    userLoginData.length > 0
      ? userLoginData.reduce((max, user) =>
          user.logins > max.logins ? user : max
        )
      : null;

  const mostActiveHost =
    hostActivityData.length > 0
      ? hostActivityData.reduce((max, host) =>
          host.attempts > max.attempts ? host : max
        )
      : null;

  return (
    <div className="space-y-8">
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
                  x: userLoginData.map((d: UserLoginData) => d.name),
                  y: userLoginData.map((d: UserLoginData) => d.logins),
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

          {/* Explanation for User Login Chart */}
          <div className="mt-4 p-3 bg-gray-800/30 rounded border border-gray-700">
            <h4 className="text-xs font-semibold text-gray-200 mb-2">
              Analysis Insight
            </h4>
            <p className="text-xs text-gray-400">
              This chart displays VPN login distribution across users.
              {mostActiveUser && (
                <>
                  {" "}
                  User{" "}
                  <strong className="text-emerald-400">
                    {mostActiveUser.name}
                  </strong>{" "}
                  has the highest number of login attempts (
                  {mostActiveUser.logins}), which may indicate regular usage or
                  require further investigation for unusual activity patterns.
                </>
              )}
            </p>
          </div>
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

          {/* Explanation for Success/Failure Chart */}
          <div className="mt-4 p-3 bg-gray-800/30 rounded border border-gray-700">
            <h4 className="text-xs font-semibold text-gray-200 mb-2">
              Security Assessment
            </h4>
            <p className="text-xs text-gray-400">
              The success/failure ratio provides critical security insights.
              {failureCount > 0 ? (
                <>
                  {" "}
                  With{" "}
                  <strong className="text-red-400">
                    {failureCount} failed attempts
                  </strong>
                  , there may be potential security concerns such as brute force
                  attacks or credential issues that require monitoring and
                  investigation.
                </>
              ) : (
                <>
                  {" "}
                  All login attempts were successful, indicating stable VPN
                  connectivity and proper authentication during this reporting
                  period.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Overall Security Summary */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
        <h3 className="text-gray-200 font-semibold text-base mb-3">
          Security Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="text-gray-200 font-medium mb-2">Key Observations</h4>
            <ul className="space-y-1 text-xs">
              <li>
                • Total unique users accessing VPN:{" "}
                <strong>{userLoginData.length}</strong>
              </li>
              <li>
                • Success rate:{" "}
                <strong>
                  {vpnData.length > 0
                    ? ((successCount / vpnData.length) * 100).toFixed(1)
                    : "0"}
                  %
                </strong>
              </li>
              <li>
                • Most active host:{" "}
                <strong>{mostActiveHost ? mostActiveHost.name : "N/A"}</strong>
              </li>
              <li>
                • Failed login ratio:{" "}
                <strong>
                  {vpnData.length > 0
                    ? ((failureCount / vpnData.length) * 100).toFixed(1)
                    : "0"}
                  %
                </strong>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-200 font-medium mb-2">Recommendations</h4>
            <ul className="space-y-1 text-xs">
              {failureCount > 5 && (
                <li>• Investigate repeated failed login attempts</li>
              )}
              {userLoginData.some(
                (user: UserLoginData) => user.logins > 10
              ) && <li>• Review high-frequency user access patterns</li>}
              <li>• Monitor unusual access times and locations</li>
              <li>• Consider implementing MFA for critical systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const handleDownloadPDF = async (): Promise<void> => {
  const element = document.getElementById("report-content");
  if (!element) {
    alert("Report content not found!");
    return;
  }

  element.style.maxHeight = "none";

  try {
    const plotlyCanvases = element.querySelectorAll(".js-plotly-plot");


// Extend the existing Plotly type

await Promise.all(
  Array.from(plotlyCanvases).map(
    (plot) =>
      new Promise((resolve) => {
        const plotEl = plot as PlotlyHTMLElementWithLayout;
        if (plotEl._fullLayout) resolve(true);
        else setTimeout(resolve, 300);
      })
  )
);

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

    await new Promise((r) => setTimeout(r, 500));

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
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("PDF generation failed. Check console for details.");
  } finally {
    element.style.maxHeight = "";
  }
};

export default function ReportGenerator() {
  const { vpnData, isLoading } = useReportData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="text-gray-400">Loading report data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              VPN Login Activity Report
            </h1>
            <p className="text-gray-400">
              Comprehensive analysis of VPN connection attempts and security
              events
            </p>
          </div>

          {vpnData.length > 0 && (
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              <Download size={18} />
              Download PDF Report
            </button>
          )}

        <Link href="/">
                        <div className="text-xs text-gray-500 bg-gray-800 h-9 px-4 rounded flex items-center border border-gray-700 hover:border-gray-500 transition-colors">
                          <Home size={16} className="inline-block mr-1" />
                        </div>
                      </Link>
        </div>

        {/* Report Content */}
        <div id="report-content" className="space-y-6">
          <ReportSummary />

          {vpnData.length > 0 ? (
            <>
              <ReportTable />
              <AnalyticalInsights />
              <ReportCharts />
            </>
          ) : (
            <div className="bg-gray-900/50 p-12 rounded-lg border border-gray-800 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Data Available
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                No VPN activity data has been loaded. Data should be provided
                through the context from other components.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
