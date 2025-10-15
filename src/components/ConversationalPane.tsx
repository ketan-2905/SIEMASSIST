// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Send,
//   Play,
//   Code,
//   ChevronDown,
//   ChevronUp,
//   Copy,
//   Check,
//   AlertTriangle,
//   Download,
//   Layers,
//   Plus,
//   Loader,
//   BarChart3,
//   Home,
// } from "lucide-react";
// import { useDashboard } from "@/context/DashboardContext";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useReportData } from "@/context/ReportDataContext";

// type QueryLanguage = "KQL" | "DSL" | "EQL";

// interface Entity {
//   type: "ip" | "user" | "hash" | "timestamp" | "domain" | "host";
//   value: string;
// }

// type MessageStatus =
//   | "idle"
//   | "generating"
//   | "ready"
//   | "running"
//   | "done"
//   | "error";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   query?: string;
//   queryLanguage?: QueryLanguage;
//   entities?: Entity[];
//   timestamp: Date;
//   status?: MessageStatus;
//   queryId?: string;
//   parentId?: string | null;
//   validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
//   results?: any;
//   analysis?: string;
// }

// interface Conversation {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: Date;
// }

// const uid = (prefix = "") =>
//   `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}`;

// const generateRealisticTimestamp = (minutesAgo: number) => {
//   const date = new Date(Date.now() - minutesAgo * 60 * 1000);
//   return date.toISOString();
// };

// const ConversationalPaneWithSidebar: React.FC = () => {
//   const [conversations, setConversations] = useState<Conversation[]>([
//     {
//       id: "convo_initial",
//       title: "Security Investigation",
//       messages: [],
//       createdAt: new Date(),
//     },
//   ]);
//   const [activeConvoId, setActiveConvoId] = useState<string>("convo_initial");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
//   const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
//   const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
//   const [disabledInput, setDisabledInput] = useState(false);
//   const [showAnalysis, setShowAnalysis] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const [isgeneratingReport, setIsgeneratingReport] = useState<{
//     id: string;
//     isGenerateing: boolean;
//   } | null>(null);

//   const { setLogs } = useDashboard();
//   const { setVpnData } = useReportData();
//   const router = useRouter();

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     const convo = conversations.find((c) => c.id === activeConvoId);
//     if (convo) setMessages(convo.messages);
//   }, [activeConvoId, conversations]);

//   const updateConversationMessages = (newMessages: Message[]) => {
//     setConversations((prev) =>
//       prev.map((c) =>
//         c.id === activeConvoId ? { ...c, messages: newMessages } : c
//       )
//     );
//   };

//   // Enhanced query generation with chaining logic
//   const generateQueryFromNL = async (
//     nl: string,
//     parentMessage?: Message | null
//   ): Promise<{
//     query: string;
//     queryLanguage: QueryLanguage;
//     analysis?: string;
//   }> => {
//     await new Promise((r) => setTimeout(r, 5000 + Math.random() * 5000));

//     let baseQuery = "";
//     let filters = "";
//     let analysis = "";
//     const language: QueryLanguage = "DSL";

//     // Extract entities from previous query for chaining
//     const parentEntities = parentMessage?.entities || [];
//     const parentIps = parentEntities
//       .filter((e) => e.type === "ip")
//       .map((e) => e.value);
//     const parentUsers = parentEntities
//       .filter((e) => e.type === "user")
//       .map((e) => e.value);
//     const parentHosts = parentEntities
//       .filter((e) => e.type === "host")
//       .map((e) => e.value);

//     // Query 1: Initial VPN/Failed Logins detection
//     if (/vpn/i.test(nl) && !parentMessage) {
//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { range: { "@timestamp": { gte: "now-24h" } } },
//                 {
//                   bool: {
//                     should: [
//                       { wildcard: { "event.dataset": "openvpn*" } },
//                       { term: { "event.module": "openvpn" } },
//                       { term: { "event.action": "vpn_connect" } },
//                     ],
//                   },
//                 },
//               ],
//             },
//           },
//           _source: ["@timestamp", "source.ip", "user.name", "event.outcome"],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis =
//         "This query searches for all VPN connection attempts in the last 24 hours. It will help identify suspicious VPN activities and potential unauthorized access attempts.";
//     }
//     // Query 2: Chain from VPN to find failed attempts
//     else if (
//       (/failed logins?|failed auth|failure/i.test(nl) && parentMessage) ||
//       (/filter.*failed|only.*failed/i.test(nl) && parentMessage)
//     ) {
//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { range: { "@timestamp": { gte: "now-24h" } } },
//                 {
//                   bool: {
//                     should: [
//                       { wildcard: { "event.dataset": "openvpn*" } },
//                       { term: { "event.module": "openvpn" } },
//                       { term: { "event.action": "vpn_connect" } },
//                     ],
//                   },
//                 },
//                 { term: { "event.outcome": "failure" } },
//               ],
//             },
//           },
//           _source: ["@timestamp", "source.ip", "user.name", "event.outcome"],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis =
//         "Chained from previous VPN query - now filtering only FAILED login attempts. This helps identify potential brute-force attacks or unauthorized access attempts from specific IP addresses.";
//     }
//     // Query 3: Chain to find successful logins from suspicious IPs
//     else if (
//       (/successful|success.*login/i.test(nl) && parentMessage) ||
//       (/check.*success/i.test(nl) && parentMessage)
//     ) {
//       const ips =
//         parentIps.length > 0
//           ? parentIps.slice(0, 3)
//           : ["192.168.1.10", "192.168.1.15", "203.0.113.2"];

//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { term: { "event.type": "ssh_login" } },
//                 { term: { "event.outcome": "success" } },
//                 { terms: { "source.ip": ips } },
//               ],
//             },
//           },
//           _source: ["@timestamp", "source.ip", "user.name", "host.name"],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis = `Chained query checking if previously identified suspicious IPs [${ips.join(
//         ", "
//       )}] had successful SSH logins. This detects potential brute-force attack successes.`;
//     }
//     // Query 4: Malware detection on compromised hosts
//     else if (
//       (/malware|virus|threat/i.test(nl) && parentMessage) ||
//       (/check.*malware/i.test(nl) && parentMessage)
//     ) {
//       const hosts =
//         parentHosts.length > 0
//           ? parentHosts.slice(0, 3)
//           : ["SERVER-02", "WEB-03", "DB-01"];

//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { term: { "event.type": "malware_alert" } },
//                 { terms: { "host.name": hosts } },
//               ],
//             },
//           },
//           _source: [
//             "@timestamp",
//             "host.name",
//             "malware.name",
//             "severity",
//             "event.action",
//           ],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis = `Chained malware detection query on hosts [${hosts.join(
//         ", "
//       )}] that showed suspicious login activity. This helps identify if compromised credentials led to malware infections.`;
//     }
//     // Default security investigation query
//     else {
//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { range: { "@timestamp": { gte: "now-24h" } } },
//                 {
//                   bool: {
//                     should: [
//                       { term: { "event.category": "authentication" } },
//                       { term: { "event.category": "network" } },
//                     ],
//                   },
//                 },
//               ],
//             },
//           },
//           _source: [
//             "@timestamp",
//             "source.ip",
//             "user.name",
//             "event.outcome",
//             "host.name",
//           ],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis =
//         "General security investigation query covering authentication and network events from the last 24 hours. Use this as a starting point for security analysis.";
//     }

//     return { query: baseQuery, queryLanguage: language, analysis };
//   };

//   const validateQuery = (q: string) => {
//     const warnings: string[] = [];
//     try {
//       const parsed = JSON.parse(q);
//       if (!parsed.query) {
//         warnings.push("Query missing 'query' field.");
//       }
//       if (!parsed._source || !Array.isArray(parsed._source)) {
//         warnings.push("Query missing valid '_source' field.");
//       }
//     } catch (e) {
//       warnings.push("Invalid JSON format.");
//     }
//     const valid = warnings.length === 0;
//     return { valid, warnings, autofix: null };
//   };

//   // Enhanced mock data generation for security scenarios
//   const generateMockLogs = (queryType: string, parentResults?: any) => {
//     const users = [
//       "john",
//       "admin",
//       "neha",
//       "raj",
//       "alice",
//       "bob",
//       "diana",
//       "root",
//       "svc_account",
//     ];
//     const ips = [
//       "192.168.1.45",
//       "203.0.113.22",
//       "14.192.32.101",
//       "172.16.2.44",
//       "198.51.100.33",
//       "10.1.1.100",
//     ];
//     const hosts = [
//       "SERVER-01",
//       "SERVER-02",
//       "WEB-01",
//       "DB-01",
//       "WORKSTATION-01",
//     ];
//     const malwareNames = [
//       "Trojan.Generic",
//       "Backdoor.Agent",
//       "Ransomware.Crypto",
//       "Spyware.Keylogger",
//     ];

//     let numLogs = 8 + Math.floor(Math.random() * 12);
//     const logs = [];

//     // Chain logic: if we have parent results, use their data
//     let sourceIps = ips;
//     let targetHosts = hosts;

//     if (parentResults?.suspicious_ips) {
//       sourceIps = parentResults.suspicious_ips;
//     }
//     if (parentResults?.compromised_hosts) {
//       targetHosts = parentResults.compromised_hosts;
//     }

//     for (let i = 0; i < numLogs; i++) {
//       const minutesAgo = Math.floor(Math.random() * 1440);
//       const baseLog: any = {
//         "@timestamp": generateRealisticTimestamp(minutesAgo),
//         "source.ip": sourceIps[Math.floor(Math.random() * sourceIps.length)],
//         "user.name": users[Math.floor(Math.random() * users.length)],
//       };

//       if (queryType === "vpn" || queryType === "auth") {
//         logs.push({
//           ...baseLog,
//           "event.dataset": queryType === "vpn" ? "openvpn.log" : "auth.log",
//           "event.outcome": Math.random() > 0.3 ? "success" : "failure",
//           "event.action": queryType === "vpn" ? "vpn_connect" : "user_login",
//           "host.name": hosts[Math.floor(Math.random() * hosts.length)],
//         });
//       } else if (queryType === "malware") {
//         logs.push({
//           ...baseLog,
//           "event.type": "malware_alert",
//           "malware.name":
//             malwareNames[Math.floor(Math.random() * malwareNames.length)],
//           severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"][
//             Math.floor(Math.random() * 4)
//           ],
//           "host.name":
//             targetHosts[Math.floor(Math.random() * targetHosts.length)],
//           "event.action": "detected",
//         });
//       }
//     }

//     return logs.sort(
//       (a, b) =>
//         new Date(b["@timestamp"]).getTime() -
//         new Date(a["@timestamp"]).getTime()
//     );
//   };

//   const handleCopyCommand = (cmd: string, messageId: string) => {
//     navigator.clipboard.writeText(cmd);
//     setCopiedCommand(messageId);
//     setTimeout(() => setCopiedCommand(null), 2000);
//   };

//   const runQuerySimulator = async (
//     query: string,
//     queryType: string,
//     parentMessage?: Message
//   ) => {
//     await new Promise((r) => setTimeout(r, 10000 + Math.random() * 4000));

//     const parentResults = parentMessage?.results;
//     const rows = generateMockLogs(queryType, parentResults);

//     const total_hits = rows.length;
//     const failed = rows.filter((r) => r["event.outcome"] === "failure").length;
//     const success = total_hits - failed;

//     // Enhanced analysis data
//     const ipCounts: Record<string, number> = {};
//     const userCounts: Record<string, number> = {};
//     const hostCounts: Record<string, number> = {};

//     rows.forEach((r) => {
//       ipCounts[r["source.ip"]] = (ipCounts[r["source.ip"]] || 0) + 1;
//       if (r["user.name"])
//         userCounts[r["user.name"]] = (userCounts[r["user.name"]] || 0) + 1;
//       if (r["host.name"])
//         hostCounts[r["host.name"]] = (hostCounts[r["host.name"]] || 0) + 1;
//     });

//     const suspiciousIPs = Object.entries(ipCounts)
//       .filter(([_, count]) => count >= 3)
//       .map(([ip]) => ip);

//     const topUsers = Object.entries(userCounts)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([user]) => user);

//     const compromisedHosts = Object.entries(hostCounts)
//       .filter(([_, count]) => count >= 2)
//       .map(([host]) => host);

//     return {
//       total_hits,
//       failed,
//       success,
//       execution_ms: 20234 + Math.floor(Math.random() * 5000),
//       rows,
//       suspicious_ips: suspiciousIPs,
//       top_users: topUsers,
//       compromised_hosts: compromisedHosts,
//       analysis: {
//         total_events: total_hits,
//         failure_rate:
//           total_hits > 0 ? ((failed / total_hits) * 100).toFixed(1) : "0",
//         top_suspicious_ips: suspiciousIPs,
//         most_active_users: topUsers,
//         affected_hosts: compromisedHosts,
//       },
//     };
//   };

//   const extractEntitiesFromQuery = (q?: string) => {
//     if (!q) return undefined;
//     try {
//       const parsed = JSON.parse(q);
//       const entities: Entity[] = [];

//       // Extract IPs from terms queries
//       if (parsed.query?.bool?.must) {
//         parsed.query.bool.must.forEach((condition: any) => {
//           if (condition.terms?.["source.ip"]) {
//             condition.terms["source.ip"].forEach((ip: string) => {
//               entities.push({ type: "ip", value: ip });
//             });
//           }
//           if (condition.terms?.["host.name"]) {
//             condition.terms["host.name"].forEach((host: string) => {
//               entities.push({ type: "host", value: host });
//             });
//           }
//         });
//       }

//       return entities.length > 0 ? entities : undefined;
//     } catch {
//       return undefined;
//     }
//   };

//   const determineQueryType = (query: string): string => {
//     if (/openvpn|vpn/i.test(query)) return "vpn";
//     if (/malware/i.test(query)) return "malware";
//     return "auth";
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: uid("u_"),
//       role: "user",
//       content: input,
//       timestamp: new Date(),
//       status: "done",
//     };

//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);
//     updateConversationMessages(newMessages);

//     const userInput = input;
//     setInput("");
//     setDisabledInput(true);

//     // Find if this is a chained query
//     const lastAssistantMsg = [...messages]
//       .reverse()
//       .find((m) => m.role === "assistant" && m.query);
//     const isChained =
//       lastAssistantMsg &&
//       (/filter|narrow|only|check|success|malware|chain/i.test(userInput) ||
//         /failed|brute|suspicious/i.test(userInput));

//     const assistantMsgId = uid("a_");
//     const generatingMsg: Message = {
//       id: assistantMsgId,
//       role: "assistant",
//       content: `Generating ${
//         isChained ? "chained " : ""
//       }query for: "${userInput}"`,
//       timestamp: new Date(),
//       status: "generating",
//       parentId: isChained ? lastAssistantMsg.id : null,
//     };

//     const withGenerating = [...newMessages, generatingMsg];
//     setMessages(withGenerating);
//     updateConversationMessages(withGenerating);

//     try {
//       const { query, queryLanguage, analysis } = await generateQueryFromNL(
//         userInput,
//         isChained ? lastAssistantMsg : null
//       );
//       const validation = validateQuery(query);
//       const qid = uid("q_");

//       const readyMsg: Message = {
//         ...generatingMsg,
//         content: `I'll help you with "${userInput}". Here's the generated Elasticsearch DSL query:`,
//         query,
//         queryLanguage,
//         status: "ready",
//         queryId: qid,
//         entities: extractEntitiesFromQuery(query),
//         validation,
//         analysis,
//         timestamp: new Date(),
//       };

//       const withReady = withGenerating.map((m) =>
//         m.id === assistantMsgId ? readyMsg : m
//       );
//       setMessages(withReady);
//       updateConversationMessages(withReady);
//       setTimeout(() => handleRunQuery(readyMsg.id), 2000);
//     } catch (e) {
//       const errorMsg = withGenerating.map((m) =>
//         m.id === assistantMsgId
//           ? {
//               ...m,
//               status: "error" as MessageStatus,
//               content: "Failed to generate query",
//             }
//           : m
//       );
//       setMessages(errorMsg);
//       updateConversationMessages(errorMsg);
//     } finally {
//       setDisabledInput(false);
//     }
//   };

//   const handleRunQuery = async (messageId: string) => {
//     console.log(messageId + "From handleRunQuery");

//     const message = messages.find((m) => m.id === messageId);
//     console.log(message + " message From handleRunQuery");
//     console.log(messages + " messages From handleRunQuery");
//     if (!message?.query) return;

//     const parentMessage = message.parentId
//       ? messages.find((m) => m.id === message.parentId)
//       : undefined;
//     const queryType = determineQueryType(message.query);

//     const runningMsgs = messages.map((m) =>
//       m.id === messageId ? { ...m, status: "running" as MessageStatus } : m
//     );
//     setMessages(runningMsgs);
//     updateConversationMessages(runningMsgs);

//     try {
//       const results = await runQuerySimulator(
//         message.query,
//         queryType,
//         parentMessage
//       );
//       const doneMsgs = messages.map((m) =>
//         m.id === messageId
//           ? { ...m, results, status: "done" as MessageStatus }
//           : m
//       );
//       setMessages(doneMsgs);
//       updateConversationMessages(doneMsgs);
//     } catch (e) {
//       const errorMsgs = messages.map((m) =>
//         m.id === messageId ? { ...m, status: "error" as MessageStatus } : m
//       );
//       setMessages(errorMsgs);
//       updateConversationMessages(errorMsgs);
//     }
//   };

//   const handleCopyQuery = (query: string, messageId: string) => {
//     navigator.clipboard.writeText(query);
//     setCopiedQuery(messageId);
//     setTimeout(() => setCopiedQuery(null), 2000);
//   };

//   const handleDownloadCSV = (rows: any[], filename = "results.csv") => {
//     if (!rows || !rows.length) return;
//     const headers = Object.keys(rows[0]);
//     const csv = [headers.join(",")]
//       .concat(
//         rows.map((r) =>
//           headers
//             .map((h) => {
//               const v = r[h];
//               if (typeof v === "string")
//                 return `"${String(v).replace(/"/g, '""')}"`;
//               return v === undefined || v === null ? "" : JSON.stringify(v);
//             })
//             .join(",")
//         )
//       )
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const renderStatusPill = (status?: MessageStatus) => {
//     if (!status) return null;
//     const mapping: Record<MessageStatus, { text: string; classes: string }> = {
//       idle: { text: "idle", classes: "bg-gray-700 text-gray-300" },
//       generating: {
//         text: "generating",
//         classes: "bg-yellow-700 text-yellow-100 animate-pulse",
//       },
//       ready: { text: "ready", classes: "bg-blue-700 text-white" },
//       running: {
//         text: "running",
//         classes: "bg-indigo-700 text-white animate-pulse",
//       },
//       done: { text: "done", classes: "bg-green-700 text-white" },
//       error: { text: "error", classes: "bg-red-700 text-white" },
//     };
//     const m = mapping[status];
//     return (
//       <span className={`text-[10px] px-2 py-0.5 rounded ${m.classes}`}>
//         {m.text}
//       </span>
//     );
//   };

//   const renderEntity = (entity: Entity) => {
//     const colors = {
//       ip: "bg-blue-500/20 text-blue-300 border-blue-500/40",
//       user: "bg-green-500/20 text-green-300 border-green-500/40",
//       hash: "bg-purple-500/20 text-purple-300 border-purple-500/40",
//       timestamp: "bg-orange-500/20 text-orange-300 border-orange-500/40",
//       domain: "bg-pink-500/20 text-pink-300 border-pink-500/40",
//       host: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
//     } as Record<string, string>;

//     return (
//       <button
//         key={`${entity.type}-${entity.value}`}
//         onClick={() => setInput((prev) => `${prev}${entity.value} `)}
//         className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${
//           colors[entity.type]
//         } hover:brightness-110 transition-all mr-2 mb-2`}
//       >
//         <span className="text-[10px] uppercase mr-1 opacity-70">
//           {entity.type}
//         </span>
//         {entity.value}
//       </button>
//     );
//   };

//   const createNewConversation = () => {
//     const newConvo: Conversation = {
//       id: uid("convo_"),
//       title: "New Investigation",
//       messages: [],
//       createdAt: new Date(),
//     };
//     setConversations((prev) => [newConvo, ...prev]);
//     setActiveConvoId(newConvo.id);
//     setMessages([]);
//   };

//   const toggleAnalysis = (messageId: string) => {
//     setShowAnalysis((prev) => ({
//       ...prev,
//       [messageId]: !prev[messageId],
//     }));
//   };

//   const renderAnalysis = (message: Message) => {
//     if (!message.analysis && !message.results?.analysis) return null;

//     return (
//       <div className="mt-4 pt-4 border-t border-gray-700">
//         <button
//           onClick={() => toggleAnalysis(message.id)}
//           className="flex items-center space-x-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-2"
//         >
//           <BarChart3 size={16} />
//           <span>Security Analysis</span>
//           <ChevronDown
//             size={16}
//             className={`transform transition-transform ${
//               showAnalysis[message.id] ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {showAnalysis[message.id] && (
//           <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
//             {message.analysis && (
//               <div className="mb-4">
//                 <h4 className="text-sm font-semibold text-gray-300 mb-2">
//                   Query Purpose:
//                 </h4>
//                 <p className="text-sm text-gray-400 leading-relaxed">
//                   {message.analysis}
//                 </p>
//               </div>
//             )}

//             {message.results?.analysis && (
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-300 mb-2">
//                   Results Analysis:
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4 text-xs">
//                   <div className="bg-gray-800/50 p-3 rounded">
//                     <div className="text-gray-400">Total Events</div>
//                     <div className="text-white font-mono">
//                       {message.results.analysis.total_events}
//                     </div>
//                   </div>
//                   <div className="bg-gray-800/50 p-3 rounded">
//                     <div className="text-gray-400">Failure Rate</div>
//                     <div className="text-red-400 font-mono">
//                       {message.results.analysis.failure_rate}%
//                     </div>
//                   </div>

//                   {message.results.analysis.most_active_users?.length > 0 && (
//                     <div className="col-span-2 bg-gray-800/50 p-3 rounded">
//                       <div className="text-gray-400">Most Active Users</div>
//                       <div className="text-cyan-400 font-mono text-xs mt-1">
//                         {message.results.analysis.most_active_users.join(", ")}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* AI-generated insights */}
//                 {/* <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
//                                     <h5 className="text-xs font-semibold text-blue-300 mb-1">AI Insights:</h5>
//                                     <p className="text-xs text-blue-200">
//                                         {message.results.analysis.top_suspicious_ips?.length > 0
//                                             ? `Detected ${message.results.analysis.top_suspicious_ips.length} suspicious IP addresses with multiple failed attempts. Recommend blocking these IPs and investigating associated user accounts.`
//                                             : `Analysis shows ${message.results.analysis.failure_rate}% failure rate. Monitor for patterns and consider implementing additional security controls.`
//                                         }
//                                     </p>
//                                 </div> */}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-[#0f1115] text-gray-200">
//       {/* Sidebar remains the same */}
//       <aside className="w-72 border-r border-gray-800 p-4 flex flex-col gap-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">Conversations</h3>
//             <p className="text-xs text-gray-400">Query chains & threads</p>
//           </div>
//           <button
//             className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-white transition-colors"
//             onClick={createNewConversation}
//           >
//             <Plus size={14} />
//             New
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto space-y-2">
//           {conversations.map((c) => (
//             <div
//               key={c.id}
//               onClick={() => setActiveConvoId(c.id)}
//               className={`p-3 rounded cursor-pointer transition-colors ${
//                 c.id === activeConvoId
//                   ? "bg-gray-800/80 border border-emerald-500/30"
//                   : "hover:bg-gray-800/40 border border-transparent"
//               }`}
//             >
//               <div className="flex items-center justify-between mb-1">
//                 <div className="text-sm font-medium truncate">{c.title}</div>
//                 <div className="text-xs text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">
//                   {c.messages.length}
//                 </div>
//               </div>
//               <div className="text-xs text-gray-500">
//                 {c.messages.length
//                   ? `Last: ${c.messages[
//                       c.messages.length - 1
//                     ].timestamp.toLocaleTimeString()}`
//                   : "Empty conversation"}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
//           💡 Tip:Ask based on previous query yo Chain queries
//         </div>
//       </aside>

//       <div className="flex-1 flex flex-col">
//         <div className="flex-none px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-emerald-900/10 to-blue-900/10">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-white">
//                 Security Assistant
//               </h2>
//               <p className="text-sm text-gray-400 mt-1">
//                 AI-powered SIEM investigation • Elasticsearch DSL • Query
//                 chaining
//               </p>
//             </div>
//             <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded">
//               <Link href="/">
//                 <Home size={16} className="inline-block mr-1" />
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//           {messages.length === 0 && (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center max-w-md">
//                 <div className="text-6xl mb-4">🔍</div>
//                 <h3 className="text-xl font-semibold mb-2">
//                   Start Your Security Investigation
//                 </h3>
//                 <p className="text-gray-400 text-sm mb-4">
//                   Ask me to search for security events, analyze logs, or
//                   generate Elasticsearch DSL queries with chaining.
//                 </p>
//               </div>
//             </div>
//           )}

//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${
//                 message.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-3xl ${
//                   message.role === "user" ? "w-auto" : "w-full"
//                 }`}
//               >
//                 <div className="flex items-center mb-2 space-x-2">
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
//                       message.role === "user"
//                         ? "bg-blue-600 text-white"
//                         : "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
//                     }`}
//                   >
//                     {message.role === "user" ? "U" : "SOC"}
//                   </div>
//                   <span className="text-xs text-gray-400">
//                     {message.timestamp.toLocaleTimeString()}
//                   </span>
//                   {message.queryId && (
//                     <span className="text-[11px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
//                       qid:{message.queryId}
//                     </span>
//                   )}
//                   <div className="ml-2">{renderStatusPill(message.status)}</div>
//                   {message.parentId && (
//                     <div className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded flex items-center gap-1">
//                       <Layers size={10} />
//                       chained
//                     </div>
//                   )}
//                 </div>

//                 <div
//                   className={`p-4 rounded-lg ${
//                     message.role === "user"
//                       ? "bg-blue-600/12 border border-blue-500/20"
//                       : "bg-gray-800/60 border border-gray-700"
//                   }`}
//                 >
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                     {message.content}
//                   </p>

//                   {message.entities && message.entities.length > 0 && (
//                     <div className="mt-3 flex flex-wrap">
//                       {message.entities.map(renderEntity)}
//                     </div>
//                   )}

//                   {renderAnalysis(message)}

//                   {message.query && (
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center space-x-2">
//                           <Code size={14} className="text-emerald-400" />
//                           <span className="text-xs font-semibold text-gray-300">
//                             Generated Query
//                           </span>
//                           <span className="text-xs font-mono bg-emerald-700/30 px-2 py-0.5 rounded text-emerald-300">
//                             {message.queryLanguage}
//                           </span>
//                           {message.parentId && (
//                             <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
//                               ⛓️ based on previous
//                             </span>
//                           )}
//                         </div>

//                         <button
//                           onClick={() =>
//                             setExpandedQuery(
//                               expandedQuery === message.id ? null : message.id
//                             )
//                           }
//                           className="text-gray-400 hover:text-gray-300 transition-colors"
//                         >
//                           {expandedQuery === message.id ? (
//                             <ChevronUp size={16} />
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                       </div>

//                       {expandedQuery === message.id && (
//                         <div className="relative">
//                           <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-emerald-300 overflow-x-auto border border-gray-700">
//                             {message.query}
//                           </pre>

//                           <div className="absolute top-2 right-2">
//                             <button
//                               onClick={() =>
//                                 handleCopyQuery(message.query!, message.id)
//                               }
//                               className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
//                               title="Copy query"
//                             >
//                               {copiedQuery === message.id ? (
//                                 <Check size={14} className="text-green-400" />
//                               ) : (
//                                 <Copy size={14} className="text-gray-400" />
//                               )}
//                             </button>
//                           </div>

//                           {message.validation &&
//                             (!message.validation.valid ||
//                               (message.validation.warnings &&
//                                 message.validation.warnings.length > 0)) && (
//                               <div className="mt-3">
//                                 <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
//                                   <AlertTriangle
//                                     size={14}
//                                     className="text-yellow-300 mt-0.5"
//                                   />
//                                   <div className="flex-1">
//                                     <div className="font-semibold text-yellow-200 text-xs">
//                                       Validation warnings
//                                     </div>
//                                     {message.validation.warnings?.map(
//                                       (w, i) => (
//                                         <div
//                                           key={i}
//                                           className="text-yellow-100 text-xs mt-1"
//                                         >
//                                           • {w}
//                                         </div>
//                                       )
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       )}

//                       <div className="flex space-x-2 mt-3">
//                         {message.status === "ready" ||
//                         message.status === "running" ? (
//                           <button
//                             onClick={() => handleRunQuery(message.id)}
//                             disabled={message.status === "running"}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
//                           >
//                             <span>
//                               {message.status === "running"
//                                 ? "Running..."
//                                 : "Run query"}
//                             </span>
//                           </button>
//                         ) : (
//                           ""
//                         )}
//                         {message.status === "running" ? (
//                           ""
//                         ) : (
//                           <button
//                             onClick={() =>
//                               setExpandedQuery(
//                                 expandedQuery === message.id ? null : message.id
//                               )
//                             }
//                             className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
//                           >
//                             {expandedQuery === message.id ? "Hide" : "Edit"}{" "}
//                             Query
//                           </button>
//                         )}

//                         {message.status === "running" ? (
//                           ""
//                         ) : (
//                           <button
//                             onClick={() => {
//                               setIsgeneratingReport({
//                                 id: message.id,
//                                 isGenerateing: false,
//                               });

//                               setTimeout(() => {
//                                 console.log(message.results.rows);

//                                 setVpnData(message.results.rows);
//                                 router.push(`/report/${message.id}`);
//                                 setIsgeneratingReport(null);
//                               }, 2000);
//                             }}
//                             className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
//                           >
//                             <Layers size={14} className="inline-block mr-1" />
//                             {isgeneratingReport?.id === message.id
//                               ? "Generating Report..."
//                               : "Generate Report"}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {message.results && (
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center space-x-3">
//                             <div className="text-sm font-mono text-emerald-400">
//                               POST /_search
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               qid: {message.queryId}
//                             </div>
//                             <div className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
//                               {message.results.execution_ms} ms
//                             </div>
//                           </div>

//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() =>
//                                 handleCopyCommand(
//                                   `POST /_search\n${
//                                     message.query?.slice(0, 500) ?? ""
//                                   }`,
//                                   message.id
//                                 )
//                               }
//                               className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
//                               title="Copy command"
//                             >
//                               {copiedCommand === message.id ? (
//                                 <Check size={14} className="text-green-400" />
//                               ) : (
//                                 <Copy size={14} className="text-gray-400" />
//                               )}
//                             </button>

//                             <button
//                               onClick={() =>
//                                 handleDownloadCSV(
//                                   message.results.rows,
//                                   `results_${message.queryId ?? "export"}.csv`
//                                 )
//                               }
//                               className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
//                               title="Download CSV"
//                             >
//                               <Download size={14} className="text-gray-400" />
//                             </button>
//                           </div>
//                         </div>

//                         <div className="mb-3 flex items-center space-x-4">
//                           <div className="text-xs text-gray-400">
//                             Total hits:{" "}
//                             <span className="font-semibold text-white">
//                               {message.results.total_hits}
//                             </span>
//                           </div>
//                           <div className="text-xs text-gray-400">
//                             Failed:{" "}
//                             <span className="font-semibold text-red-400">
//                               {message.results.failed}
//                             </span>
//                           </div>
//                           <div className="text-xs text-gray-400">
//                             Success:{" "}
//                             <span className="font-semibold text-green-400">
//                               {message.results.success}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="overflow-x-auto max-h-96">
//                           {/* <table className="min-w-full text-xs">
//                             <thead>
//                               <tr className="text-left text-gray-400 border-b border-gray-800">
//                                 {message.results.rows.length > 0 &&
//                                   Object.keys(message.results.rows[0]).map((h: string) => (
//                                     <th key={h} className="pr-6 py-2 font-semibold">
//                                       {h}
//                                     </th>
//                                   ))}
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {message.results.rows.map((r: any, i: number) => (
//                                 <tr key={i} className="border-t border-gray-800 hover:bg-gray-800/30">
//                                   {Object.keys(r).map((k: string) => (
//                                     <td key={k} className="pr-6 py-2 text-gray-300 font-mono">
//                                       {k === "event.outcome" ? (
//                                         <span
//                                           className={`px-2 py-0.5 rounded text-xs ${r[k] === "failure"
//                                             ? "bg-red-900/30 text-red-300"
//                                             : "bg-green-900/30 text-green-300"
//                                             }`}
//                                         >
//                                           {String(r[k])}
//                                         </span>
//                                       ) : k === "severity" ? (
//                                         <span
//                                           className={`px-2 py-0.5 rounded text-xs ${r[k] === "CRITICAL" ? "bg-red-900/30 text-red-300" :
//                                             r[k] === "HIGH" ? "bg-orange-900/30 text-orange-300" :
//                                               r[k] === "MEDIUM" ? "bg-yellow-900/30 text-yellow-300" :
//                                                 "bg-gray-700 text-gray-300"
//                                             }`}
//                                         >
//                                           {String(r[k])}
//                                         </span>
//                                       ) : (
//                                         String(r[k])
//                                       )}
//                                     </td>
//                                   ))}
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table> */}
//                           <div className="overflow-x-auto max-h-96">
//                             <pre className="text-xs text-gray-300 bg-gray-900/50 p-3 rounded overflow-x-auto">
//                               {JSON.stringify(message.results.rows, null, 2)}
//                             </pre>
//                           </div>
//                         </div>

//                         <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
//                           <div className="text-xs text-gray-500">
//                             Executed: {new Date().toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div ref={messagesEndRef} />
//         </div>

//         <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#0f1115]">
//           <div className="flex items-end space-x-3">
//             <div className="flex-1 relative">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSend();
//                   }
//                 }}
//                 placeholder="Ask about security events, generate queries, or chain investigations... (e.g., Show VPN attempts)"
//                 className="w-full bg-gray-900 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500"
//                 rows={3}
//                 disabled={disabledInput}
//               />
//               {disabledInput && (
//                 <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
//                   <div className="text-xs text-gray-400 animate-pulse">
//                     Generating query...
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col items-end gap-2">
//               <button
//                 onClick={() => handleSend()}
//                 disabled={!input.trim() || disabledInput}
//                 className="flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg"
//                 title="Send message"
//               >
//                 <Send size={20} />
//               </button>
//               <div className="text-xs text-gray-500">Enter to send</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationalPaneWithSidebar;
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Send,
//   Code,
//   ChevronDown,
//   ChevronUp,
//   Copy,
//   Check,
//   AlertTriangle,
//   Download,
//   Layers,
//   Plus,
//   BarChart3,
//   Home,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useReportData } from "@/context/ReportDataContext";

// type QueryLanguage = "KQL" | "DSL" | "EQL";

// interface Entity {
//   type: "ip" | "user" | "hash" | "timestamp" | "domain" | "host";
//   value: string;
// }

// type MessageStatus =
//   | "idle"
//   | "generating"
//   | "ready"
//   | "running"
//   | "done"
//   | "error";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   query?: string;
//   queryLanguage?: QueryLanguage;
//   entities?: Entity[];
//   timestamp: string; // ISO string for safety
//   status?: MessageStatus;
//   queryId?: string;
//   parentId?: string | null;
//   validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
//   results?: any;
//   analysis?: string;
// }

// interface Conversation {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: string; // ISO
// }

// const uid = (prefix = "") =>
//   `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}`;

// const generateRealisticTimestamp = (minutesAgo: number) => {
//   const date = new Date(Date.now() - minutesAgo * 60 * 1000);
//   return date.toISOString();
// };

// const ConversationalPaneWithSidebar: React.FC = () => {
//   const [conversations, setConversations] = useState<Conversation[]>([
//     {
//       id: "convo_initial",
//       title: "Security Investigation",
//       messages: [],
//       createdAt: new Date().toISOString(),
//     },
//   ]);
//   const [activeConvoId, setActiveConvoId] = useState<string>("convo_initial");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
//   const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
//   const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
//   const [disabledInput, setDisabledInput] = useState(false);
//   const [showAnalysis, setShowAnalysis] = useState<Record<string, boolean>>({});
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const [isgeneratingReport, setIsgeneratingReport] = useState<{
//     id: string;
//     isGenerateing: boolean;
//   } | null>(null);

//   // assume context hooks return objects; keep them loosely typed here to avoid build issues
//   const { setVpnData } = useReportData()
//   const router = useRouter();

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     const convo = conversations.find((c) => c.id === activeConvoId);
//     if (convo) setMessages(convo.messages);
//   }, [activeConvoId, conversations]);

//   const updateConversationMessages = (newMessages: Message[]) => {
//     setConversations((prev) =>
//       prev.map((c) =>
//         c.id === activeConvoId ? { ...c, messages: newMessages } : c
//       )
//     );
//   };

//   // Enhanced query generation with chaining logic
//   const generateQueryFromNL = async (
//     nl: string,
//     parentMessage?: Message | null
//   ): Promise<{
//     query: string;
//     queryLanguage: QueryLanguage;
//     analysis?: string;
//   }> => {
//     // simulate latency
//     await new Promise<void>((r) =>
//       setTimeout(() => {
//         r();
//       }, 5000 + Math.random() * 5000)
//     );

//     let baseQuery = "";
//     let analysis = "";
//     const language: QueryLanguage = "DSL";

//     // Extract entities from previous query for chaining
//     const parentEntities = parentMessage?.entities || [];
//     const parentIps = parentEntities
//       .filter((e) => e.type === "ip")
//       .map((e) => e.value);
//     const parentUsers = parentEntities
//       .filter((e) => e.type === "user")
//       .map((e) => e.value);
//     const parentHosts = parentEntities
//       .filter((e) => e.type === "host")
//       .map((e) => e.value);

//     // Query 1: Initial VPN/Failed Logins detection
//     if (/vpn/i.test(nl) && !parentMessage) {
//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { range: { "@timestamp": { gte: "now-24h" } } },
//                 {
//                   bool: {
//                     should: [
//                       { wildcard: { "event.dataset": "openvpn*" } },
//                       { term: { "event.module": "openvpn" } },
//                       { term: { "event.action": "vpn_connect" } },
//                     ],
//                   },
//                 },
//               ],
//             },
//           },
//           _source: ["@timestamp", "source.ip", "user.name", "event.outcome"],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis =
//         "This query searches for all VPN connection attempts in the last 24 hours. It will help identify suspicious VPN activities and potential unauthorized access attempts.";
//     }
//     // Query 2: Chain from VPN to find failed attempts
//     else if (
//       (/failed logins?|failed auth|failure/i.test(nl) && parentMessage) ||
//       (/filter.*failed|only.*failed/i.test(nl) && parentMessage)
//     ) {
//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { range: { "@timestamp": { gte: "now-24h" } } },
//                 {
//                   bool: {
//                     should: [
//                       { wildcard: { "event.dataset": "openvpn*" } },
//                       { term: { "event.module": "openvpn" } },
//                       { term: { "event.action": "vpn_connect" } },
//                     ],
//                   },
//                 },
//                 { term: { "event.outcome": "failure" } },
//               ],
//             },
//           },
//           _source: ["@timestamp", "source.ip", "user.name", "event.outcome"],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis =
//         "Chained from previous VPN query - now filtering only FAILED login attempts. This helps identify potential brute-force attacks or unauthorized access attempts from specific IP addresses.";
//     }
//     // Query 3: Chain to find successful logins from suspicious IPs
//     else if (
//       (/successful|success.*login/i.test(nl) && parentMessage) ||
//       (/check.*success/i.test(nl) && parentMessage)
//     ) {
//       const ips =
//         parentIps.length > 0
//           ? parentIps.slice(0, 3)
//           : ["192.168.1.10", "192.168.1.15", "203.0.113.2"];

//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { term: { "event.type": "ssh_login" } },
//                 { term: { "event.outcome": "success" } },
//                 { terms: { "source.ip": ips } },
//               ],
//             },
//           },
//           _source: ["@timestamp", "source.ip", "user.name", "host.name"],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis = `Chained query checking if previously identified suspicious IPs [${ips.join(
//         ", "
//       )}] had successful SSH logins. This detects potential brute-force attack successes.`;
//     }
//     // Query 4: Malware detection on compromised hosts
//     else if (
//       (/malware|virus|threat/i.test(nl) && parentMessage) ||
//       (/check.*malware/i.test(nl) && parentMessage)
//     ) {
//       const hosts =
//         parentHosts.length > 0
//           ? parentHosts.slice(0, 3)
//           : ["SERVER-02", "WEB-03", "DB-01"];

//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { term: { "event.type": "malware_alert" } },
//                 { terms: { "host.name": hosts } },
//               ],
//             },
//           },
//           _source: [
//             "@timestamp",
//             "host.name",
//             "malware.name",
//             "severity",
//             "event.action",
//           ],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis = `Chained malware detection query on hosts [${hosts.join(
//         ", "
//       )}] that showed suspicious login activity. This helps identify if compromised credentials led to malware infections.`;
//     }
//     // Default security investigation query
//     else {
//       baseQuery = JSON.stringify(
//         {
//           query: {
//             bool: {
//               must: [
//                 { range: { "@timestamp": { gte: "now-24h" } } },
//                 {
//                   bool: {
//                     should: [
//                       { term: { "event.category": "authentication" } },
//                       { term: { "event.category": "network" } },
//                     ],
//                   },
//                 },
//               ],
//             },
//           },
//           _source: [
//             "@timestamp",
//             "source.ip",
//             "user.name",
//             "event.outcome",
//             "host.name",
//           ],
//           size: 100,
//         },
//         null,
//         2
//       );

//       analysis =
//         "General security investigation query covering authentication and network events from the last 24 hours. Use this as a starting point for security analysis.";
//     }

//     return { query: baseQuery, queryLanguage: language, analysis };
//   };

//   const validateQuery = (q: string) => {
//     const warnings: string[] = [];
//     try {
//       const parsed = JSON.parse(q);
//       if (!parsed.query) {
//         warnings.push("Query missing 'query' field.");
//       }
//       if (!parsed._source || !Array.isArray(parsed._source)) {
//         warnings.push("Query missing valid '_source' field.");
//       }
//     } catch (e) {
//       warnings.push("Invalid JSON format.");
//     }
//     const valid = warnings.length === 0;
//     return { valid, warnings, autofix: null };
//   };

//   // Enhanced mock data generation for security scenarios
//   const generateMockLogs = (queryType: string, parentResults?: any) => {
//     const users = [
//       "john",
//       "admin",
//       "neha",
//       "raj",
//       "alice",
//       "bob",
//       "diana",
//       "root",
//       "svc_account",
//     ];
//     const ips = [
//       "192.168.1.45",
//       "203.0.113.22",
//       "14.192.32.101",
//       "172.16.2.44",
//       "198.51.100.33",
//       "10.1.1.100",
//     ];
//     const hosts = [
//       "SERVER-01",
//       "SERVER-02",
//       "WEB-01",
//       "DB-01",
//       "WORKSTATION-01",
//     ];
//     const malwareNames = [
//       "Trojan.Generic",
//       "Backdoor.Agent",
//       "Ransomware.Crypto",
//       "Spyware.Keylogger",
//     ];

//     let numLogs = 8 + Math.floor(Math.random() * 12);
//     const logs: any[] = [];

//     // Chain logic: if we have parent results, use their data
//     let sourceIps = ips;
//     let targetHosts = hosts;

//     if (parentResults?.suspicious_ips) {
//       sourceIps = parentResults.suspicious_ips;
//     }
//     if (parentResults?.compromised_hosts) {
//       targetHosts = parentResults.compromised_hosts;
//     }

//     for (let i = 0; i < numLogs; i++) {
//       const minutesAgo = Math.floor(Math.random() * 1440);
//       const baseLog: any = {
//         "@timestamp": generateRealisticTimestamp(minutesAgo),
//         "source.ip": sourceIps[Math.floor(Math.random() * sourceIps.length)],
//         "user.name": users[Math.floor(Math.random() * users.length)],
//       };

//       if (queryType === "vpn" || queryType === "auth") {
//         logs.push({
//           ...baseLog,
//           "event.dataset": queryType === "vpn" ? "openvpn.log" : "auth.log",
//           "event.outcome": Math.random() > 0.3 ? "success" : "failure",
//           "event.action": queryType === "vpn" ? "vpn_connect" : "user_login",
//           "host.name": hosts[Math.floor(Math.random() * hosts.length)],
//         });
//       } else if (queryType === "malware") {
//         logs.push({
//           ...baseLog,
//           "event.type": "malware_alert",
//           "malware.name":
//             malwareNames[Math.floor(Math.random() * malwareNames.length)],
//           severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"][
//             Math.floor(Math.random() * 4)
//           ],
//           "host.name":
//             targetHosts[Math.floor(Math.random() * targetHosts.length)],
//           "event.action": "detected",
//         });
//       }
//     }

//     return logs.sort(
//       (a, b) =>
//         new Date(b["@timestamp"]).getTime() - new Date(a["@timestamp"]).getTime()
//     );
//   };

//   const handleCopyCommand = (cmd: string, messageId: string) => {
//     if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
//       navigator.clipboard.writeText(cmd).catch(() => {});
//     }
//     setCopiedCommand(messageId);
//     setTimeout(() => setCopiedCommand(null), 2000);
//   };

//   const runQuerySimulator = async (
//     query: string,
//     queryType: string,
//     parentMessage?: Message
//   ) => {
//     await new Promise<void>((r) =>
//       setTimeout(() => {
//         r();
//       }, 10000 + Math.random() * 4000)
//     );

//     const parentResults = parentMessage?.results;
//     const rows = generateMockLogs(queryType, parentResults);

//     const total_hits = rows.length;
//     const failed = rows.filter((r) => r["event.outcome"] === "failure").length;
//     const success = total_hits - failed;

//     // Enhanced analysis data
//     const ipCounts: Record<string, number> = {};
//     const userCounts: Record<string, number> = {};
//     const hostCounts: Record<string, number> = {};

//     rows.forEach((r) => {
//       ipCounts[r["source.ip"]] = (ipCounts[r["source.ip"]] || 0) + 1;
//       if (r["user.name"])
//         userCounts[r["user.name"]] = (userCounts[r["user.name"]] || 0) + 1;
//       if (r["host.name"]) hostCounts[r["host.name"]] = (hostCounts[r["host.name"]] || 0) + 1;
//     });

//     const suspiciousIPs = Object.entries(ipCounts)
//       .filter(([_, count]) => count >= 3)
//       .map(([ip]) => ip);

//     const topUsers = Object.entries(userCounts)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([user]) => user);

//     const compromisedHosts = Object.entries(hostCounts)
//       .filter(([_, count]) => count >= 2)
//       .map(([host]) => host);

//     return {
//       total_hits,
//       failed,
//       success,
//       execution_ms: 20234 + Math.floor(Math.random() * 5000),
//       rows,
//       suspicious_ips: suspiciousIPs,
//       top_users: topUsers,
//       compromised_hosts: compromisedHosts,
//       analysis: {
//         total_events: total_hits,
//         failure_rate:
//           total_hits > 0 ? ((failed / total_hits) * 100).toFixed(1) : "0",
//         top_suspicious_ips: suspiciousIPs,
//         most_active_users: topUsers,
//         affected_hosts: compromisedHosts,
//       },
//     };
//   };

//   const extractEntitiesFromQuery = (q?: string) => {
//     if (!q) return undefined;
//     try {
//       const parsed = JSON.parse(q);
//       const entities: Entity[] = [];

//       // Extract IPs from terms queries
//       if (parsed.query?.bool?.must && Array.isArray(parsed.query.bool.must)) {
//         parsed.query.bool.must.forEach((condition: any) => {
//           if (condition.terms?.["source.ip"]) {
//             (condition.terms["source.ip"] as string[]).forEach((ip: string) => {
//               entities.push({ type: "ip", value: ip });
//             });
//           }
//           if (condition.terms?.["host.name"]) {
//             (condition.terms["host.name"] as string[]).forEach((host: string) => {
//               entities.push({ type: "host", value: host });
//             });
//           }
//         });
//       }

//       return entities.length > 0 ? entities : undefined;
//     } catch {
//       return undefined;
//     }
//   };

//   const determineQueryType = (query: string): string => {
//     if (/openvpn|vpn/i.test(query)) return "vpn";
//     if (/malware/i.test(query)) return "malware";
//     return "auth";
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: uid("u_"),
//       role: "user",
//       content: input,
//       timestamp: new Date().toISOString(),
//       status: "done",
//     };

//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);
//     updateConversationMessages(newMessages);

//     const userInput = input;
//     setInput("");
//     setDisabledInput(true);

//     // Find if this is a chained query
//     const lastAssistantMsg = [...messages]
//       .reverse()
//       .find((m) => m.role === "assistant" && m.query);
//     const isChained =
//       !!lastAssistantMsg &&
//       (/filter|narrow|only|check|success|malware|chain/i.test(userInput) ||
//         /failed|brute|suspicious/i.test(userInput));

//     const assistantMsgId = uid("a_");
//     const generatingMsg: Message = {
//       id: assistantMsgId,
//       role: "assistant",
//       content: `Generating ${isChained ? "chained " : ""}query for: "${userInput}"`,
//       timestamp: new Date().toISOString(),
//       status: "generating",
//       parentId: isChained ? lastAssistantMsg?.id ?? null : null,
//     };

//     const withGenerating = [...newMessages, generatingMsg];
//     setMessages(withGenerating);
//     updateConversationMessages(withGenerating);

//     try {
//       const { query, queryLanguage, analysis } = await generateQueryFromNL(
//         userInput,
//         isChained ? lastAssistantMsg : null
//       );
//       const validation = validateQuery(query);
//       const qid = uid("q_");

//       const readyMsg: Message = {
//         ...generatingMsg,
//         content: `I'll help you with "${userInput}". Here's the generated Elasticsearch DSL query:`,
//         query,
//         queryLanguage,
//         status: "ready",
//         queryId: qid,
//         entities: extractEntitiesFromQuery(query),
//         validation,
//         analysis,
//         timestamp: new Date().toISOString(),
//       };

//       const withReady = withGenerating.map((m) =>
//         m.id === assistantMsgId ? readyMsg : m
//       );
//       setMessages(withReady);
//       updateConversationMessages(withReady);
//       setTimeout(() => handleRunQuery(readyMsg.id), 2000);
//     } catch (e) {
//       const errorMsg = withGenerating.map((m) =>
//         m.id === assistantMsgId
//           ? {
//               ...m,
//               status: "error" as MessageStatus,
//               content: "Failed to generate query",
//             }
//           : m
//       );
//       setMessages(errorMsg);
//       updateConversationMessages(errorMsg);
//     } finally {
//       setDisabledInput(false);
//     }
//   };

//   const handleRunQuery = async (messageId: string) => {
//     const message = messages.find((m) => m.id === messageId);
//     if (!message?.query) return;

//     const parentMessage = message.parentId
//       ? messages.find((m) => m.id === message.parentId)
//       : undefined;
//     const queryType = determineQueryType(message.query);

//     const runningMsgs = messages.map((m) =>
//       m.id === messageId ? { ...m, status: "running" as MessageStatus } : m
//     );
//     setMessages(runningMsgs);
//     updateConversationMessages(runningMsgs);

//     try {
//       const results = await runQuerySimulator(message.query, queryType, parentMessage);
//       const doneMsgs = messages.map((m) =>
//         m.id === messageId ? { ...m, results, status: "done" as MessageStatus } : m
//       );
//       setMessages(doneMsgs);
//       updateConversationMessages(doneMsgs);
//     } catch (e) {
//       const errorMsgs = messages.map((m) =>
//         m.id === messageId ? { ...m, status: "error" as MessageStatus } : m
//       );
//       setMessages(errorMsgs);
//       updateConversationMessages(errorMsgs);
//     }
//   };

//   const handleCopyQuery = (query: string, messageId: string) => {
//     if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
//       navigator.clipboard.writeText(query).catch(() => {});
//     }
//     setCopiedQuery(messageId);
//     setTimeout(() => setCopiedQuery(null), 2000);
//   };

//   const handleDownloadCSV = (rows: any[], filename = "results.csv") => {
//     if (!rows || !rows.length) return;
//     const headers = Object.keys(rows[0]);
//     const csv = [headers.join(",")]
//       .concat(
//         rows.map((r) =>
//           headers
//             .map((h) => {
//               const v = r[h];
//               if (typeof v === "string")
//                 return `"${String(v).replace(/"/g, '""')}"`;
//               return v === undefined || v === null ? "" : JSON.stringify(v);
//             })
//             .join(",")
//         )
//       )
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const renderStatusPill = (status?: MessageStatus) => {
//     if (!status) return null;
//     const mapping: Record<MessageStatus, { text: string; classes: string }> = {
//       idle: { text: "idle", classes: "bg-gray-700 text-gray-300" },
//       generating: {
//         text: "generating",
//         classes: "bg-yellow-700 text-yellow-100 animate-pulse",
//       },
//       ready: { text: "ready", classes: "bg-blue-700 text-white" },
//       running: {
//         text: "running",
//         classes: "bg-indigo-700 text-white animate-pulse",
//       },
//       done: { text: "done", classes: "bg-green-700 text-white" },
//       error: { text: "error", classes: "bg-red-700 text-white" },
//     };
//     const m = mapping[status];
//     return (
//       <span className={`text-[10px] px-2 py-0.5 rounded ${m.classes}`}>
//         {m.text}
//       </span>
//     );
//   };

//   const renderEntity = (entity: Entity) => {
//     const colors = {
//       ip: "bg-blue-500/20 text-blue-300 border-blue-500/40",
//       user: "bg-green-500/20 text-green-300 border-green-500/40",
//       hash: "bg-purple-500/20 text-purple-300 border-purple-500/40",
//       timestamp: "bg-orange-500/20 text-orange-300 border-orange-500/40",
//       domain: "bg-pink-500/20 text-pink-300 border-pink-500/40",
//       host: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
//     } as Record<string, string>;

//     return (
//       <button
//         key={`${entity.type}-${entity.value}`}
//         onClick={() => setInput((prev) => `${prev}${entity.value} `)}
//         className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
//       >
//         <span className="text-[10px] uppercase mr-1 opacity-70">
//           {entity.type}
//         </span>
//         {entity.value}
//       </button>
//     );
//   };

//   const createNewConversation = () => {
//     const newConvo: Conversation = {
//       id: uid("convo_"),
//       title: "New Investigation",
//       messages: [],
//       createdAt: new Date().toISOString(),
//     };
//     setConversations((prev) => [newConvo, ...prev]);
//     setActiveConvoId(newConvo.id);
//     setMessages([]);
//   };

//   const toggleAnalysis = (messageId: string) => {
//     setShowAnalysis((prev) => ({
//       ...prev,
//       [messageId]: !prev[messageId],
//     }));
//   };

//   const renderAnalysis = (message: Message) => {
//     if (!message.analysis && !message.results?.analysis) return null;

//     return (
//       <div className="mt-4 pt-4 border-t border-gray-700">
//         <button
//           onClick={() => toggleAnalysis(message.id)}
//           className="flex items-center space-x-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-2"
//         >
//           <BarChart3 size={16} />
//           <span>Security Analysis</span>
//           <ChevronDown
//             size={16}
//             className={`transform transition-transform ${
//               showAnalysis[message.id] ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {showAnalysis[message.id] && (
//           <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
//             {message.analysis && (
//               <div className="mb-4">
//                 <h4 className="text-sm font-semibold text-gray-300 mb-2">
//                   Query Purpose:
//                 </h4>
//                 <p className="text-sm text-gray-400 leading-relaxed">
//                   {message.analysis}
//                 </p>
//               </div>
//             )}

//             {message.results?.analysis && (
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-300 mb-2">
//                   Results Analysis:
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4 text-xs">
//                   <div className="bg-gray-800/50 p-3 rounded">
//                     <div className="text-gray-400">Total Events</div>
//                     <div className="text-white font-mono">
//                       {message.results.analysis.total_events}
//                     </div>
//                   </div>
//                   <div className="bg-gray-800/50 p-3 rounded">
//                     <div className="text-gray-400">Failure Rate</div>
//                     <div className="text-red-400 font-mono">
//                       {message.results.analysis.failure_rate}%
//                     </div>
//                   </div>

//                   {message.results.analysis.most_active_users?.length > 0 && (
//                     <div className="col-span-2 bg-gray-800/50 p-3 rounded">
//                       <div className="text-gray-400">Most Active Users</div>
//                       <div className="text-cyan-400 font-mono text-xs mt-1">
//                         {message.results.analysis.most_active_users.join(", ")}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-[#0f1115] text-gray-200">
//       {/* Sidebar */}
//       <aside className="w-72 border-r border-gray-800 p-4 flex flex-col gap-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">Conversations</h3>
//             <p className="text-xs text-gray-400">Query chains & threads</p>
//           </div>
//           <button
//             className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-white transition-colors"
//             onClick={createNewConversation}
//           >
//             <Plus size={14} />
//             New
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto space-y-2">
//           {conversations.map((c) => (
//             <div
//               key={c.id}
//               onClick={() => setActiveConvoId(c.id)}
//               className={`p-3 rounded cursor-pointer transition-colors ${
//                 c.id === activeConvoId
//                   ? "bg-gray-800/80 border border-emerald-500/30"
//                   : "hover:bg-gray-800/40 border border-transparent"
//               }`}
//             >
//               <div className="flex items-center justify-between mb-1">
//                 <div className="text-sm font-medium truncate">{c.title}</div>
//                 <div className="text-xs text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">
//                   {c.messages.length}
//                 </div>
//               </div>
//               <div className="text-xs text-gray-500">
//                 {c.messages.length
//                   ? `Last: ${new Date(
//                       c.messages[c.messages.length - 1].timestamp
//                     ).toLocaleTimeString()}`
//                   : "Empty conversation"}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
//           💡 Tip:Ask based on previous query to Chain queries
//         </div>
//       </aside>

//       <div className="flex-1 flex flex-col">
//         <div className="flex-none px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-emerald-900/10 to-blue-900/10">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-white">Security Assistant</h2>
//               <p className="text-sm text-gray-400 mt-1">
//                 AI-powered SIEM investigation • Elasticsearch DSL • Query chaining
//               </p>
//             </div>
//             <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded">
//               <Link href="/">
//                 <Home size={16} className="inline-block mr-1" />
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//           {messages.length === 0 && (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center max-w-md">
//                 <div className="text-6xl mb-4">🔍</div>
//                 <h3 className="text-xl font-semibold mb-2">
//                   Start Your Security Investigation
//                 </h3>
//                 <p className="text-gray-400 text-sm mb-4">
//                   Ask me to search for security events, analyze logs, or generate
//                   Elasticsearch DSL queries with chaining.
//                 </p>
//               </div>
//             </div>
//           )}

//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${
//                 message.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-3xl ${
//                   message.role === "user" ? "w-auto" : "w-full"
//                 }`}
//               >
//                 <div className="flex items-center mb-2 space-x-2">
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
//                       message.role === "user"
//                         ? "bg-blue-600 text-white"
//                         : "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
//                     }`}
//                   >
//                     {message.role === "user" ? "U" : "SOC"}
//                   </div>
//                   <span className="text-xs text-gray-400">
//                     {new Date(message.timestamp).toLocaleTimeString()}
//                   </span>
//                   {message.queryId && (
//                     <span className="text-[11px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
//                       qid:{message.queryId}
//                     </span>
//                   )}
//                   <div className="ml-2">{renderStatusPill(message.status)}</div>
//                   {message.parentId && (
//                     <div className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded flex items-center gap-1">
//                       <Layers size={10} />
//                       chained
//                     </div>
//                   )}
//                 </div>

//                 <div
//                   className={`p-4 rounded-lg ${
//                     message.role === "user"
//                       ? "bg-blue-600/12 border border-blue-500/20"
//                       : "bg-gray-800/60 border border-gray-700"
//                   }`}
//                 >
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                     {message.content}
//                   </p>

//                   {message.entities && message.entities.length > 0 && (
//                     <div className="mt-3 flex flex-wrap">
//                       {message.entities.map(renderEntity)}
//                     </div>
//                   )}

//                   {renderAnalysis(message)}

//                   {message.query && (
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center space-x-2">
//                           <Code size={14} className="text-emerald-400" />
//                           <span className="text-xs font-semibold text-gray-300">
//                             Generated Query
//                           </span>
//                           <span className="text-xs font-mono bg-emerald-700/30 px-2 py-0.5 rounded text-emerald-300">
//                             {message.queryLanguage}
//                           </span>
//                           {message.parentId && (
//                             <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
//                               ⛓️ based on previous
//                             </span>
//                           )}
//                         </div>

//                         <button
//                           onClick={() =>
//                             setExpandedQuery(expandedQuery === message.id ? null : message.id)
//                           }
//                           className="text-gray-400 hover:text-gray-300 transition-colors"
//                         >
//                           {expandedQuery === message.id ? (
//                             <ChevronUp size={16} />
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                       </div>

//                       {expandedQuery === message.id && (
//                         <div className="relative">
//                           <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-emerald-300 overflow-x-auto border border-gray-700">
//                             {message.query}
//                           </pre>

//                           <div className="absolute top-2 right-2">
//                             <button
//                               onClick={() => handleCopyQuery(message.query!, message.id)}
//                               className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
//                               title="Copy query"
//                             >
//                               {copiedQuery === message.id ? (
//                                 <Check size={14} className="text-green-400" />
//                               ) : (
//                                 <Copy size={14} className="text-gray-400" />
//                               )}
//                             </button>
//                           </div>

//                           {message.validation &&
//                             (!message.validation.valid ||
//                               (message.validation.warnings &&
//                                 message.validation.warnings.length > 0)) && (
//                               <div className="mt-3">
//                                 <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
//                                   <AlertTriangle size={14} className="text-yellow-300 mt-0.5" />
//                                   <div className="flex-1">
//                                     <div className="font-semibold text-yellow-200 text-xs">
//                                       Validation warnings
//                                     </div>
//                                     {message.validation.warnings?.map((w, i) => (
//                                       <div key={i} className="text-yellow-100 text-xs mt-1">
//                                         • {w}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       )}

//                       <div className="flex space-x-2 mt-3">
//                         {message.status === "ready" || message.status === "running" ? (
//                           <button
//                             onClick={() => handleRunQuery(message.id)}
//                             disabled={message.status === "running"}
//                             className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
//                           >
//                             <span>{message.status === "running" ? "Running..." : "Run query"}</span>
//                           </button>
//                         ) : (
//                           ""
//                         )}
//                         {message.status === "running" ? (
//                           ""
//                         ) : (
//                           <button
//                             onClick={() =>
//                               setExpandedQuery(expandedQuery === message.id ? null : message.id)
//                             }
//                             className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
//                           >
//                             {expandedQuery === message.id ? "Hide" : "Edit"} Query
//                           </button>
//                         )}

//                         {message.status === "running" ? (
//                           ""
//                         ) : (
//                           <button
//                             onClick={() => {
//                               setIsgeneratingReport({ id: message.id, isGenerateing: false });
//                               setTimeout(() => {
//                                 if (message.results?.rows && setVpnData) {
//                                   setVpnData(message.results.rows);
//                                 }
//                                 router.push(`/report/${message.id}`);
//                                 setIsgeneratingReport(null);
//                               }, 2000);
//                             }}
//                             className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
//                           >
//                             <Layers size={14} className="inline-block mr-1" />
//                             {isgeneratingReport?.id === message.id ? "Generating Report..." : "Generate Report"}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {message.results && (
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center space-x-3">
//                             <div className="text-sm font-mono text-emerald-400">POST /_search</div>
//                             <div className="text-xs text-gray-500">qid: {message.queryId}</div>
//                             <div className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
//                               {message.results.execution_ms} ms
//                             </div>
//                           </div>

//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() =>
//                                 handleCopyCommand(`POST /_search\n${message.query?.slice(0, 500) ?? ""}`, message.id)
//                               }
//                               className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
//                               title="Copy command"
//                             >
//                               {copiedCommand === message.id ? (
//                                 <Check size={14} className="text-green-400" />
//                               ) : (
//                                 <Copy size={14} className="text-gray-400" />
//                               )}
//                             </button>

//                             <button
//                               onClick={() =>
//                                 handleDownloadCSV(message.results.rows, `results_${message.queryId ?? "export"}.csv`)
//                               }
//                               className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
//                               title="Download CSV"
//                             >
//                               <Download size={14} className="text-gray-400" />
//                             </button>
//                           </div>
//                         </div>

//                         <div className="mb-3 flex items-center space-x-4">
//                           <div className="text-xs text-gray-400">
//                             Total hits:{" "}
//                             <span className="font-semibold text-white">{message.results.total_hits}</span>
//                           </div>
//                           <div className="text-xs text-gray-400">
//                             Failed: <span className="font-semibold text-red-400">{message.results.failed}</span>
//                           </div>
//                           <div className="text-xs text-gray-400">
//                             Success: <span className="font-semibold text-green-400">{message.results.success}</span>
//                           </div>
//                         </div>

//                         <div className="overflow-x-auto max-h-96">
//                           <div className="overflow-x-auto max-h-96">
//                             <pre className="text-xs text-gray-300 bg-gray-900/50 p-3 rounded overflow-x-auto">
//                               {JSON.stringify(message.results.rows, null, 2)}
//                             </pre>
//                           </div>
//                         </div>

//                         <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
//                           <div className="text-xs text-gray-500">Executed: {new Date().toLocaleString()}</div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div ref={messagesEndRef} />
//         </div>

//         <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#0f1115]">
//           <div className="flex items-end space-x-3">
//             <div className="flex-1 relative">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSend();
//                   }
//                 }}
//                 placeholder="Ask about security events, generate queries, or chain investigations... (e.g., Show VPN attempts)"
//                 className="w-full bg-gray-900 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500"
//                 rows={3}
//                 disabled={disabledInput}
//               />
//               {disabledInput && (
//                 <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
//                   <div className="text-xs text-gray-400 animate-pulse">Generating query...</div>
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col items-end gap-2">
//               <button
//                 onClick={() => handleSend()}
//                 disabled={!input.trim() || disabledInput}
//                 className="flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg"
//                 title="Send message"
//               >
//                 <Send size={20} />
//               </button>
//               <div className="text-xs text-gray-500">Enter to send</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationalPaneWithSidebar;

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Code,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  Download,
  Layers,
  Plus,
  BarChart3,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RawVPNData, useReportData } from "@/context/ReportDataContext";

type QueryLanguage = "KQL" | "DSL" | "EQL";

interface Entity {
  type: "ip" | "user" | "hash" | "timestamp" | "domain" | "host";
  value: string;
}

type MessageStatus =
  | "idle"
  | "generating"
  | "ready"
  | "running"
  | "done"
  | "error";

interface LogRow {
  "@timestamp": string;
  "source.ip": string;
  "user.name": string;
  "event.dataset"?: string;
  "event.outcome"?: string;
  "event.action"?: string;
  "event.type"?: string;
  "host.name"?: string;
  "malware.name"?: string;
  severity?: string;
}

interface QueryResults {
  total_hits: number;
  failed: number;
  success: number;
  execution_ms: number;
  rows: LogRow[];
  suspicious_ips: string[];
  top_users: string[];
  compromised_hosts: string[];
  analysis: {
    total_events: number;
    failure_rate: string;
    top_suspicious_ips: string[];
    most_active_users: string[];
    affected_hosts: string[];
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  query?: string;
  queryLanguage?: QueryLanguage;
  entities?: Entity[];
  timestamp: string;
  status?: MessageStatus;
  queryId?: string;
  parentId?: string | null;
  validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
  results?: QueryResults;
  analysis?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

interface ElasticsearchQuery {
  query: {
    bool: {
      must?: Array<Record<string, unknown>>;
      should?: Array<Record<string, unknown>>;
    };
  };
  _source?: string[];
  size?: number;
}

const uid = (prefix = "") =>
  `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}`;

const generateRealisticTimestamp = (minutesAgo: number) => {
  const date = new Date(Date.now() - minutesAgo * 60 * 1000);
  return date.toISOString();
};

const ConversationalPaneWithSidebar: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "convo_initial",
      title: "Security Investigation",
      messages: [],
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeConvoId, setActiveConvoId] = useState<string>("convo_initial");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isgeneratingReport, setIsgeneratingReport] = useState<{
    id: string;
    isGenerateing: boolean;
  } | null>(null);

  const { setVpnData } = useReportData();
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const convo = conversations.find((c) => c.id === activeConvoId);
    if (convo) setMessages(convo.messages);
  }, [activeConvoId, conversations]);

  const updateConversationMessages = (newMessages: Message[]) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvoId ? { ...c, messages: newMessages } : c
      )
    );
  };

  const generateQueryFromNL = async (
    nl: string,
    parentMessage?: Message | null
  ): Promise<{
    query: string;
    queryLanguage: QueryLanguage;
    analysis?: string;
  }> => {
    await new Promise<void>((r) =>
      setTimeout(() => {
        r();
      }, 5000 + Math.random() * 5000)
    );

    let baseQuery = "";
    let analysis = "";
    const language: QueryLanguage = "DSL";

    const parentEntities = parentMessage?.entities || [];
    const parentIps = parentEntities
      .filter((e) => e.type === "ip")
      .map((e) => e.value);
    const parentUsers = parentEntities
      .filter((e) => e.type === "user")
      .map((e) => e.value);
    const parentHosts = parentEntities
      .filter((e) => e.type === "host")
      .map((e) => e.value);

    if (/vpn/i.test(nl) && !parentMessage) {
      baseQuery = JSON.stringify(
        {
          query: {
            bool: {
              must: [
                { range: { "@timestamp": { gte: "now-24h" } } },
                {
                  bool: {
                    should: [
                      { wildcard: { "event.dataset": "openvpn*" } },
                      { term: { "event.module": "openvpn" } },
                      { term: { "event.action": "vpn_connect" } },
                    ],
                  },
                },
              ],
            },
          },
          _source: ["@timestamp", "source.ip", "user.name", "event.outcome"],
          size: 100,
        },
        null,
        2
      );

      analysis =
        "This query searches for all VPN connection attempts in the last 24 hours. It will help identify suspicious VPN activities and potential unauthorized access attempts.";
    } else if (
      (/failed logins?|failed auth|failure/i.test(nl) && parentMessage) ||
      (/filter.*failed|only.*failed/i.test(nl) && parentMessage)
    ) {
      baseQuery = JSON.stringify(
        {
          query: {
            bool: {
              must: [
                { range: { "@timestamp": { gte: "now-24h" } } },
                {
                  bool: {
                    should: [
                      { wildcard: { "event.dataset": "openvpn*" } },
                      { term: { "event.module": "openvpn" } },
                      { term: { "event.action": "vpn_connect" } },
                    ],
                  },
                },
                { term: { "event.outcome": "failure" } },
              ],
            },
          },
          _source: ["@timestamp", "source.ip", "user.name", "event.outcome"],
          size: 100,
        },
        null,
        2
      );

      analysis =
        "Chained from previous VPN query - now filtering only FAILED login attempts. This helps identify potential brute-force attacks or unauthorized access attempts from specific IP addresses.";
    } else if (
      (/successful|success.*login/i.test(nl) && parentMessage) ||
      (/check.*success/i.test(nl) && parentMessage)
    ) {
      const ips =
        parentIps.length > 0
          ? parentIps.slice(0, 3)
          : ["192.168.1.10", "192.168.1.15", "203.0.113.2"];

      baseQuery = JSON.stringify(
        {
          query: {
            bool: {
              must: [
                { term: { "event.type": "ssh_login" } },
                { term: { "event.outcome": "success" } },
                { terms: { "source.ip": ips } },
              ],
            },
          },
          _source: ["@timestamp", "source.ip", "user.name", "host.name"],
          size: 100,
        },
        null,
        2
      );

      analysis = `Chained query checking if previously identified suspicious IPs [${ips.join(
        ", "
      )}] had successful SSH logins. This detects potential brute-force attack successes.`;
    } else if (
      (/malware|virus|threat/i.test(nl) && parentMessage) ||
      (/check.*malware/i.test(nl) && parentMessage)
    ) {
      const hosts =
        parentHosts.length > 0
          ? parentHosts.slice(0, 3)
          : ["SERVER-02", "WEB-03", "DB-01"];

      baseQuery = JSON.stringify(
        {
          query: {
            bool: {
              must: [
                { term: { "event.type": "malware_alert" } },
                { terms: { "host.name": hosts } },
              ],
            },
          },
          _source: [
            "@timestamp",
            "host.name",
            "malware.name",
            "severity",
            "event.action",
          ],
          size: 100,
        },
        null,
        2
      );

      analysis = `Chained malware detection query on hosts [${hosts.join(
        ", "
      )}] that showed suspicious login activity. This helps identify if compromised credentials led to malware infections.`;
    } else {
      baseQuery = JSON.stringify(
        {
          query: {
            bool: {
              must: [
                { range: { "@timestamp": { gte: "now-24h" } } },
                {
                  bool: {
                    should: [
                      { term: { "event.category": "authentication" } },
                      { term: { "event.category": "network" } },
                    ],
                  },
                },
              ],
            },
          },
          _source: [
            "@timestamp",
            "source.ip",
            "user.name",
            "event.outcome",
            "host.name",
          ],
          size: 100,
        },
        null,
        2
      );

      analysis =
        "General security investigation query covering authentication and network events from the last 24 hours. Use this as a starting point for security analysis.";
    }

    return { query: baseQuery, queryLanguage: language, analysis };
  };

  const validateQuery = (q: string) => {
    const warnings: string[] = [];
    try {
      const parsed: ElasticsearchQuery = JSON.parse(q);
      if (!parsed.query) {
        warnings.push("Query missing 'query' field.");
      }
      if (!parsed._source || !Array.isArray(parsed._source)) {
        warnings.push("Query missing valid '_source' field.");
      }
    } catch (e) {
      warnings.push("Invalid JSON format.");
    }
    const valid = warnings.length === 0;
    return { valid, warnings, autofix: null };
  };

  const generateMockLogs = (
    queryType: string,
    parentResults?: QueryResults
  ): LogRow[] => {
    const users = [
      "john",
      "admin",
      "neha",
      "raj",
      "alice",
      "bob",
      "diana",
      "root",
      "svc_account",
    ];
    const ips = [
      "192.168.1.45",
      "203.0.113.22",
      "14.192.32.101",
      "172.16.2.44",
      "198.51.100.33",
      "10.1.1.100",
    ];
    const hosts = [
      "SERVER-01",
      "SERVER-02",
      "WEB-01",
      "DB-01",
      "WORKSTATION-01",
    ];
    const malwareNames = [
      "Trojan.Generic",
      "Backdoor.Agent",
      "Ransomware.Crypto",
      "Spyware.Keylogger",
    ];

    const numLogs = 8 + Math.floor(Math.random() * 12);
    const logs: LogRow[] = [];

    let sourceIps = ips;
    let targetHosts = hosts;

    if (parentResults?.suspicious_ips) {
      sourceIps = parentResults.suspicious_ips;
    }
    if (parentResults?.compromised_hosts) {
      targetHosts = parentResults.compromised_hosts;
    }

    for (let i = 0; i < numLogs; i++) {
      const minutesAgo = Math.floor(Math.random() * 1440);
      const baseLog: LogRow = {
        "@timestamp": generateRealisticTimestamp(minutesAgo),
        "source.ip": sourceIps[Math.floor(Math.random() * sourceIps.length)],
        "user.name": users[Math.floor(Math.random() * users.length)],
      };

      if (queryType === "vpn" || queryType === "auth") {
        logs.push({
          ...baseLog,
          "event.dataset": queryType === "vpn" ? "openvpn.log" : "auth.log",
          "event.outcome": Math.random() > 0.3 ? "success" : "failure",
          "event.action": queryType === "vpn" ? "vpn_connect" : "user_login",
          "host.name": hosts[Math.floor(Math.random() * hosts.length)],
        });
      } else if (queryType === "malware") {
        logs.push({
          ...baseLog,
          "event.type": "malware_alert",
          "malware.name":
            malwareNames[Math.floor(Math.random() * malwareNames.length)],
          severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"][
            Math.floor(Math.random() * 4)
          ],
          "host.name":
            targetHosts[Math.floor(Math.random() * targetHosts.length)],
          "event.action": "detected",
        });
      }
    }

    return logs.sort(
      (a, b) =>
        new Date(b["@timestamp"]).getTime() -
        new Date(a["@timestamp"]).getTime()
    );
  };

  const handleCopyCommand = (cmd: string, messageId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setCopiedCommand(messageId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const runQuerySimulator = async (
    query: string,
    queryType: string,
    parentMessage?: Message
  ): Promise<QueryResults> => {
    await new Promise<void>((r) =>
      setTimeout(() => {
        r();
      }, 10000 + Math.random() * 4000)
    );

    const parentResults = parentMessage?.results;
    const rows = generateMockLogs(queryType, parentResults);

    const total_hits = rows.length;
    const failed = rows.filter((r) => r["event.outcome"] === "failure").length;
    const success = total_hits - failed;

    const ipCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};
    const hostCounts: Record<string, number> = {};

    rows.forEach((r) => {
      ipCounts[r["source.ip"]] = (ipCounts[r["source.ip"]] || 0) + 1;
      if (r["user.name"])
        userCounts[r["user.name"]] = (userCounts[r["user.name"]] || 0) + 1;
      if (r["host.name"])
        hostCounts[r["host.name"]] = (hostCounts[r["host.name"]] || 0) + 1;
    });

    const suspiciousIPs = Object.entries(ipCounts)
      .filter(([_, count]) => count >= 3)
      .map(([ip]) => ip);

    const topUsers = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([user]) => user);

    const compromisedHosts = Object.entries(hostCounts)
      .filter(([_, count]) => count >= 2)
      .map(([host]) => host);

    return {
      total_hits,
      failed,
      success,
      execution_ms: 20234 + Math.floor(Math.random() * 5000),
      rows,
      suspicious_ips: suspiciousIPs,
      top_users: topUsers,
      compromised_hosts: compromisedHosts,
      analysis: {
        total_events: total_hits,
        failure_rate:
          total_hits > 0 ? ((failed / total_hits) * 100).toFixed(1) : "0",
        top_suspicious_ips: suspiciousIPs,
        most_active_users: topUsers,
        affected_hosts: compromisedHosts,
      },
    };
  };

  const extractEntitiesFromQuery = (q?: string): Entity[] | undefined => {
    if (!q) return undefined;
    try {
      const parsed: ElasticsearchQuery = JSON.parse(q);
      const entities: Entity[] = [];

      if (parsed.query?.bool?.must && Array.isArray(parsed.query.bool.must)) {
        parsed.query.bool.must.forEach((condition: Record<string, unknown>) => {
          const termsCondition = condition.terms as
            | Record<string, string[]>
            | undefined;
          if (termsCondition?.["source.ip"]) {
            termsCondition["source.ip"].forEach((ip: string) => {
              entities.push({ type: "ip", value: ip });
            });
          }
          if (termsCondition?.["host.name"]) {
            termsCondition["host.name"].forEach((host: string) => {
              entities.push({ type: "host", value: host });
            });
          }
        });
      }

      return entities.length > 0 ? entities : undefined;
    } catch {
      return undefined;
    }
  };

  const determineQueryType = (query: string): string => {
    if (/openvpn|vpn/i.test(query)) return "vpn";
    if (/malware/i.test(query)) return "malware";
    return "auth";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uid("u_"),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      status: "done",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateConversationMessages(newMessages);

    const userInput = input;
    setInput("");
    setDisabledInput(true);

    const lastAssistantMsg = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.query);
    const isChained =
      !!lastAssistantMsg &&
      (/filter|narrow|only|check|success|malware|chain/i.test(userInput) ||
        /failed|brute|suspicious/i.test(userInput));

    const assistantMsgId = uid("a_");
    const generatingMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: `Generating ${
        isChained ? "chained " : ""
      }query for: "${userInput}"`,
      timestamp: new Date().toISOString(),
      status: "generating",
      parentId: isChained ? lastAssistantMsg?.id ?? null : null,
    };

    const withGenerating = [...newMessages, generatingMsg];
    setMessages(withGenerating);
    updateConversationMessages(withGenerating);

    try {
      const { query, queryLanguage, analysis } = await generateQueryFromNL(
        userInput,
        isChained ? lastAssistantMsg : null
      );
      const validation = validateQuery(query);
      const qid = uid("q_");

      const readyMsg: Message = {
        ...generatingMsg,
        content: `I'll help you with "${userInput}". Here's the generated Elasticsearch DSL query:`,
        query,
        queryLanguage,
        status: "ready",
        queryId: qid,
        entities: extractEntitiesFromQuery(query),
        validation,
        analysis,
        timestamp: new Date().toISOString(),
      };

      const withReady = withGenerating.map((m) =>
        m.id === assistantMsgId ? readyMsg : m
      );
      setMessages(withReady);
      updateConversationMessages(withReady);
      setTimeout(() => handleRunQuery(readyMsg.id), 2000);
    } catch (e) {
      const errorMsg = withGenerating.map((m) =>
        m.id === assistantMsgId
          ? {
              ...m,
              status: "error" as MessageStatus,
              content: "Failed to generate query",
            }
          : m
      );
      setMessages(errorMsg);
      updateConversationMessages(errorMsg);
    } finally {
      setDisabledInput(false);
    }
  };

  const handleRunQuery = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message?.query) return;

    const parentMessage = message.parentId
      ? messages.find((m) => m.id === message.parentId)
      : undefined;
    const queryType = determineQueryType(message.query);

    const runningMsgs = messages.map((m) =>
      m.id === messageId ? { ...m, status: "running" as MessageStatus } : m
    );
    setMessages(runningMsgs);
    updateConversationMessages(runningMsgs);

    try {
      const results = await runQuerySimulator(
        message.query,
        queryType,
        parentMessage
      );
      const doneMsgs = messages.map((m) =>
        m.id === messageId
          ? { ...m, results, status: "done" as MessageStatus }
          : m
      );
      setMessages(doneMsgs);
      updateConversationMessages(doneMsgs);
    } catch (e) {
      const errorMsgs = messages.map((m) =>
        m.id === messageId ? { ...m, status: "error" as MessageStatus } : m
      );
      setMessages(errorMsgs);
      updateConversationMessages(errorMsgs);
    }
  };

  const handleCopyQuery = (query: string, messageId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(query).catch(() => {});
    }
    setCopiedQuery(messageId);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleDownloadCSV = (rows: LogRow[], filename = "results.csv") => {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(",")]
      .concat(
        rows.map((r) =>
          headers
            .map((h) => {
              const v = r[h as keyof LogRow];
              if (typeof v === "string")
                return `"${String(v).replace(/"/g, '""')}"`;
              return v === undefined || v === null ? "" : JSON.stringify(v);
            })
            .join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStatusPill = (status?: MessageStatus) => {
    if (!status) return null;
    const mapping: Record<MessageStatus, { text: string; classes: string }> = {
      idle: { text: "idle", classes: "bg-gray-700 text-gray-300" },
      generating: {
        text: "generating",
        classes: "bg-yellow-700 text-yellow-100 animate-pulse",
      },
      ready: { text: "ready", classes: "bg-blue-700 text-white" },
      running: {
        text: "running",
        classes: "bg-indigo-700 text-white animate-pulse",
      },
      done: { text: "done", classes: "bg-green-700 text-white" },
      error: { text: "error", classes: "bg-red-700 text-white" },
    };
    const m = mapping[status];
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded ${m.classes}`}>
        {m.text}
      </span>
    );
  };

  const renderEntity = (entity: Entity) => {
    const colors = {
      ip: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      user: "bg-green-500/20 text-green-300 border-green-500/40",
      hash: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      timestamp: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      domain: "bg-pink-500/20 text-pink-300 border-pink-500/40",
      host: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    } as Record<string, string>;

    return (
      <button
        key={`${entity.type}-${entity.value}`}
        onClick={() => setInput((prev) => `${prev}${entity.value} `)}
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${
          colors[entity.type]
        } hover:brightness-110 transition-all mr-2 mb-2`}
      >
        <span className="text-[10px] uppercase mr-1 opacity-70">
          {entity.type}
        </span>
        {entity.value}
      </button>
    );
  };

  const createNewConversation = () => {
    const newConvo: Conversation = {
      id: uid("convo_"),
      title: "New Investigation",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveConvoId(newConvo.id);
    setMessages([]);
  };

  const toggleAnalysis = (messageId: string) => {
    setShowAnalysis((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const renderAnalysis = (message: Message) => {
    if (!message.analysis && !message.results?.analysis) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={() => toggleAnalysis(message.id)}
          className="flex items-center space-x-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-2"
        >
          <BarChart3 size={16} />
          <span>Security Analysis</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              showAnalysis[message.id] ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAnalysis[message.id] && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            {message.analysis && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Query Purpose:
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {message.analysis}
                </p>
              </div>
            )}

            {message.results?.analysis && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Results Analysis:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-gray-400">Total Events</div>
                    <div className="text-white font-mono">
                      {message.results.analysis.total_events}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-gray-400">Failure Rate</div>
                    <div className="text-red-400 font-mono">
                      {message.results.analysis.failure_rate}%
                    </div>
                  </div>

                  {message.results.analysis.most_active_users?.length > 0 && (
                    <div className="col-span-2 bg-gray-800/50 p-3 rounded">
                      <div className="text-gray-400">Most Active Users</div>
                      <div className="text-cyan-400 font-mono text-xs mt-1">
                        {message.results.analysis.most_active_users.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-gray-200">
      <aside className="w-72 border-r border-gray-800 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Conversations</h3>
            <p className="text-xs text-gray-400">Query chains & threads</p>
          </div>
          <button
            className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-white transition-colors"
            onClick={createNewConversation}
          >
            <Plus size={14} />
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveConvoId(c.id)}
              className={`p-3 rounded cursor-pointer transition-colors ${
                c.id === activeConvoId
                  ? "bg-gray-800/80 border border-emerald-500/30"
                  : "hover:bg-gray-800/40 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium truncate">{c.title}</div>
                <div className="text-xs text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">
                  {c.messages.length}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {c.messages.length
                  ? `Last: ${new Date(
                      c.messages[c.messages.length - 1].timestamp
                    ).toLocaleTimeString()}`
                  : "Empty conversation"}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
          💡 Tip:Ask based on previous query to Chain queries
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="flex-none px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-emerald-900/10 to-blue-900/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Security Assistant
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                AI-powered SIEM investigation • Elasticsearch DSL • Query
                chaining
              </p>
            </div>

            <div className="flex justify-between items-center gap-2">
              <select
                className="bg-gray-800 text-gray-300 text-sm rounded-md px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="soc">SOC Analyst</option>
                <option value="ciso">CISO</option>
                <option value="ir">Incident Responder</option>
                <option value="audit">Compliance / Audit Officer</option>
              </select>
              <Link href="/">
                <div className="text-xs text-gray-500 bg-gray-800 h-9 px-4 rounded flex items-center border border-gray-700 hover:border-gray-500 transition-colors">
                  <Home size={16} className="inline-block mr-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  Start Your Security Investigation
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Ask me to search for security events, analyze logs, or
                  generate Elasticsearch DSL queries with chaining.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl ${
                  message.role === "user" ? "w-auto" : "w-full"
                }`}
              >
                <div className="flex items-center mb-2 space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                    }`}
                  >
                    {message.role === "user" ? "U" : "SOC"}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.queryId && (
                    <span className="text-[11px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                      qid:{message.queryId}
                    </span>
                  )}
                  <div className="ml-2">{renderStatusPill(message.status)}</div>
                  {message.parentId && (
                    <div className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <Layers size={10} />
                      chained
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600/12 border border-blue-500/20"
                      : "bg-gray-800/60 border border-gray-700"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {message.entities && message.entities.length > 0 && (
                    <div className="mt-3 flex flex-wrap">
                      {message.entities.map(renderEntity)}
                    </div>
                  )}

                  {renderAnalysis(message)}

                  {message.query && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Code size={14} className="text-emerald-400" />
                          <span className="text-xs font-semibold text-gray-300">
                            Generated Query
                          </span>
                          <span className="text-xs font-mono bg-emerald-700/30 px-2 py-0.5 rounded text-emerald-300">
                            {message.queryLanguage}
                          </span>
                          {message.parentId && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                              ⛓️ based on previous
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            setExpandedQuery(
                              expandedQuery === message.id ? null : message.id
                            )
                          }
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {expandedQuery === message.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>

                      {expandedQuery === message.id && (
                        <div className="relative">
                          <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-emerald-300 overflow-x-auto border border-gray-700">
                            {message.query}
                          </pre>

                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() =>
                                handleCopyQuery(message.query!, message.id)
                              }
                              className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                              title="Copy query"
                            >
                              {copiedQuery === message.id ? (
                                <Check size={14} className="text-green-400" />
                              ) : (
                                <Copy size={14} className="text-gray-400" />
                              )}
                            </button>
                          </div>

                          {message.validation &&
                            (!message.validation.valid ||
                              (message.validation.warnings &&
                                message.validation.warnings.length > 0)) && (
                              <div className="mt-3">
                                <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
                                  <AlertTriangle
                                    size={14}
                                    className="text-yellow-300 mt-0.5"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold text-yellow-200 text-xs">
                                      Validation warnings
                                    </div>
                                    {message.validation.warnings?.map(
                                      (w, i) => (
                                        <div
                                          key={i}
                                          className="text-yellow-100 text-xs mt-1"
                                        >
                                          • {w}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      <div className="flex space-x-2 mt-3">
                        {message.status === "ready" ||
                        message.status === "running" ? (
                          <button
                            onClick={() => handleRunQuery(message.id)}
                            disabled={message.status === "running"}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                          >
                            <span>
                              {message.status === "running"
                                ? "Running..."
                                : "Run query"}
                            </span>
                          </button>
                        ) : (
                          ""
                        )}
                        {message.status === "running" ? (
                          ""
                        ) : (
                          <button
                            onClick={() =>
                              setExpandedQuery(
                                expandedQuery === message.id ? null : message.id
                              )
                            }
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
                          >
                            {expandedQuery === message.id ? "Hide" : "Edit"}{" "}
                            Query
                          </button>
                        )}

                        {message.status === "running" ? (
                          ""
                        ) : (
                          <button
                            onClick={() => {
                              setIsgeneratingReport({
                                id: message.id,
                                isGenerateing: false,
                              });
                              setTimeout(() => {
                                if (message.results?.rows && setVpnData) {
                                  setVpnData(
                                    message.results.rows as RawVPNData[]
                                  );
                                }
                                router.push(`/report/${message.id}`);
                                setIsgeneratingReport(null);
                              }, 2000);
                            }}
                            className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                            disabled={
                              message.status !== "done" ||
                              isgeneratingReport?.isGenerateing
                            }
                          >
                            <Layers size={14} className="inline-block mr-1" />
                            {isgeneratingReport?.id === message.id
                              ? "Generating Report..."
                              : "Generate Report"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {message.results && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-mono text-emerald-400">
                              POST /_search
                            </div>
                            <div className="text-xs text-gray-500">
                              qid: {message.queryId}
                            </div>
                            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                              {message.results.execution_ms} ms
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleCopyCommand(
                                  `POST /_search\n${
                                    message.query?.slice(0, 500) ?? ""
                                  }`,
                                  message.id
                                )
                              }
                              className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                              title="Copy command"
                            >
                              {copiedCommand === message.id ? (
                                <Check size={14} className="text-green-400" />
                              ) : (
                                <Copy size={14} className="text-gray-400" />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                handleDownloadCSV(
                                  message.results!.rows,
                                  `results_${message.queryId ?? "export"}.csv`
                                )
                              }
                              className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                              title="Download CSV"
                            >
                              <Download size={14} className="text-gray-400" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-3 flex items-center space-x-4">
                          <div className="text-xs text-gray-400">
                            Total hits:{" "}
                            <span className="font-semibold text-white">
                              {message.results.total_hits}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Failed:{" "}
                            <span className="font-semibold text-red-400">
                              {message.results.failed}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Success:{" "}
                            <span className="font-semibold text-green-400">
                              {message.results.success}
                            </span>
                          </div>
                        </div>

                        <div className="overflow-x-auto max-h-96">
                          <div className="overflow-x-auto max-h-96">
                            <pre className="text-xs text-gray-300 bg-gray-900/50 p-3 rounded overflow-x-auto">
                              {JSON.stringify(message.results.rows, null, 2)}
                            </pre>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Executed: {new Date().toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#0f1115]">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about security events, generate queries, or chain investigations... (e.g., Show VPN attempts)"
                className="w-full bg-gray-900 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500"
                rows={3}
                disabled={disabledInput}
              />
              {disabledInput && (
                <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                  <div className="text-xs text-gray-400 animate-pulse">
                    Generating query...
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || disabledInput}
                className="flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg"
                title="Send message"
              >
                <Send size={20} />
              </button>
              <div className="text-xs text-gray-500">Enter to send</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalPaneWithSidebar;
