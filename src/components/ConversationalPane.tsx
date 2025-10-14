// // "use client";
// // import React, { useState, useRef, useEffect } from 'react';
// // import { Send, Play, Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

// // interface Message {
// //   id: string;
// //   role: 'user' | 'assistant';
// //   content: string;
// //   query?: string;
// //   queryLanguage?: 'KQL' | 'DSL';
// //   entities?: Entity[];
// //   timestamp: Date;
// // }

// // interface Entity {
// //   type: 'ip' | 'user' | 'hash' | 'timestamp' | 'domain';
// //   value: string;
// // }

// // const ConversationalPane: React.FC = () => {
// //   const [messages, setMessages] = useState<Message[]>([
// //     {
// //       id: '1',
// //       role: 'assistant',
// //       content: 'Welcome to Supernova Security Assistant. I can help you investigate security events, run queries, and generate reports. How can I assist you today?',
// //       timestamp: new Date(),
// //     }
// //   ]);
// //   const [input, setInput] = useState('');
// //   const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
// //   const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   const quickPrompts = [
// //     'Investigate failed logins',
// //     'Show VPN attempts',
// //     'Generate monthly malware report',
// //     'Detect brute force attacks',
// //   ];

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   const handleSend = () => {
// //     if (!input.trim()) return;

// //     const userMessage: Message = {
// //       id: Date.now().toString(),
// //       role: 'user',
// //       content: input,
// //       timestamp: new Date(),
// //     };

// //     setMessages(prev => [...prev, userMessage]);
// //     setInput('');

// //     // Simulate assistant response
// //     setTimeout(() => {
// //       const assistantMessage: Message = {
// //         id: (Date.now() + 1).toString(),
// //         role: 'assistant',
// //         content: `I'll help you with "${input}". Here's what I found:`,
// //         query: `event.category: "authentication" AND event.outcome: "failure"\n| stats count by user.name, source.ip\n| where count > 3`,
// //         queryLanguage: 'KQL',
// //         entities: [
// //           { type: 'ip', value: '192.168.1.100' },
// //           { type: 'user', value: 'alice@example.com' },
// //           { type: 'timestamp', value: '2025-10-12T10:30:00Z' },
// //         ],
// //         timestamp: new Date(),
// //       };
// //       setMessages(prev => [...prev, assistantMessage]);
// //     }, 1000);
// //   };

// //   const handleQuickPrompt = (prompt: string) => {
// //     setInput(prompt);
// //   };

// //   const handleRunQuery = (messageId: string) => {
// //     console.log('Running query for message:', messageId);
// //     // Implement query execution
// //   };

// //   const handleCopyQuery = (query: string, messageId: string) => {
// //     navigator.clipboard.writeText(query);
// //     setCopiedQuery(messageId);
// //     setTimeout(() => setCopiedQuery(null), 2000);
// //   };

// //   const handleEntityClick = (entity: Entity) => {
// //     console.log('Entity clicked:', entity);
// //     // This would open an entity detail panel
// //   };

// //   const renderEntity = (entity: Entity) => {
// //     const colors = {
// //       ip: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
// //       user: 'bg-green-500/20 text-green-300 border-green-500/40',
// //       hash: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
// //       timestamp: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
// //       domain: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
// //     };

// //     return (
// //       <button
// //         key={`${entity.type}-${entity.value}`}
// //         onClick={() => handleEntityClick(entity)}
// //         className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
// //       >
// //         <span className="text-[10px] uppercase mr-1 opacity-70">{entity.type}</span>
// //         {entity.value}
// //       </button>
// //     );
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-[#1a1a1a] text-gray-200">
// //       {/* Header */}
// //       <div className="flex-none px-6 py-4 border-b border-gray-800">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h2 className="text-xl font-semibold text-white">Security Assistant</h2>
// //             <p className="text-sm text-gray-400 mt-1">AI-powered threat investigation</p>
// //           </div>
// //           <div className="flex items-center space-x-2">
// //             <span className="text-xs text-gray-500">Model:</span>
// //             <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">claude-sonnet-4.5</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Quick Prompts */}
// //       <div className="flex-none px-6 py-4 border-b border-gray-800">
// //         <div className="flex flex-wrap gap-2">
// //           {quickPrompts.map((prompt, idx) => (
// //             <button
// //               key={idx}
// //               onClick={() => handleQuickPrompt(prompt)}
// //               className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
// //             >
// //               {prompt}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Messages */}
// //       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
// //         {messages.map((message) => (
// //           <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
// //             <div className={`max-w-3xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
// //               {/* Message Header */}
// //               <div className="flex items-center mb-2 space-x-2">
// //                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
// //                   message.role === 'user' 
// //                     ? 'bg-blue-600 text-white' 
// //                     : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
// //                 }`}>
// //                   {message.role === 'user' ? 'U' : 'AI'}
// //                 </div>
// //                 <span className="text-xs text-gray-500">
// //                   {message.timestamp.toLocaleTimeString()}
// //                 </span>
// //               </div>

// //               {/* Message Content */}
// //               <div className={`p-4 rounded-lg ${
// //                 message.role === 'user' 
// //                   ? 'bg-blue-600/20 border border-blue-500/30' 
// //                   : 'bg-gray-800/50 border border-gray-700'
// //               }`}>
// //                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

// //                 {/* Entities */}
// //                 {message.entities && message.entities.length > 0 && (
// //                   <div className="mt-4 pt-4 border-t border-gray-700">
// //                     <p className="text-xs text-gray-400 mb-2">Detected entities:</p>
// //                     <div className="flex flex-wrap">
// //                       {message.entities.map(renderEntity)}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Query Section */}
// //                 {message.query && (
// //                   <div className="mt-4 pt-4 border-t border-gray-700">
// //                     <div className="flex items-center justify-between mb-2">
// //                       <div className="flex items-center space-x-2">
// //                         <Code size={14} className="text-gray-400" />
// //                         <span className="text-xs font-semibold text-gray-300">Generated Query</span>
// //                         <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-400">
// //                           {message.queryLanguage}
// //                         </span>
// //                       </div>
// //                       <button
// //                         onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
// //                         className="text-gray-400 hover:text-gray-300 transition-colors"
// //                       >
// //                         {expandedQuery === message.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
// //                       </button>
// //                     </div>

// //                     {expandedQuery === message.id && (
// //                       <div className="relative">
// //                         <pre className="bg-[#0d0d0d] p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">
// //                           {message.query}
// //                         </pre>
// //                         <button
// //                           onClick={() => handleCopyQuery(message.query!, message.id)}
// //                           className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
// //                         >
// //                           {copiedQuery === message.id ? (
// //                             <Check size={14} className="text-green-400" />
// //                           ) : (
// //                             <Copy size={14} className="text-gray-400" />
// //                           )}
// //                         </button>
// //                       </div>
// //                     )}

// //                     <div className="flex space-x-2 mt-3">
// //                       <button
// //                         onClick={() => handleRunQuery(message.id)}
// //                         className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
// //                       >
// //                         <Play size={12} />
// //                         <span>Run Query</span>
// //                       </button>
// //                       <button
// //                         onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
// //                         className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
// //                       >
// //                         {expandedQuery === message.id ? 'Hide' : 'Explain Query'}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input Area */}
// //       <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#1a1a1a]">
// //         <div className="flex items-end space-x-3">
// //           <div className="flex-1 relative">
// //             <textarea
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               onKeyDown={(e) => {
// //                 if (e.key === 'Enter' && !e.shiftKey) {
// //                   e.preventDefault();
// //                   handleSend();
// //                 }
// //               }}
// //               placeholder="Ask about security events, run queries, or generate reports..."
// //               className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-gray-700 placeholder-gray-500"
// //               rows={3}
// //             />
// //           </div>
// //           <button
// //             onClick={handleSend}
// //             disabled={!input.trim()}
// //             className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
// //           >
// //             <Send size={20} />
// //           </button>
// //         </div>
// //         <p className="text-xs text-gray-500 mt-2">
// //           Press Enter to send, Shift+Enter for new line
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ConversationalPane;


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
//   CheckCircle,
//   AlertTriangle,
//   Download,
//   Layers,
//   RefreshCw,
// } from "lucide-react";

// type QueryLanguage = "KQL" | "DSL" | "EQL";

// interface Entity {
//   type: "ip" | "user" | "hash" | "timestamp" | "domain";
//   value: string;
// }

// type MessageStatus = "idle" | "generating" | "ready" | "running" | "done" | "error";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   query?: string;
//   queryLanguage?: QueryLanguage;
//   entities?: Entity[];
//   timestamp: Date;
//   status?: MessageStatus;
//   queryId?: string; // unique id for generated queries
//   parentId?: string | null; // chain parent
//   validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
//   results?: any; // shape returned by runQuerySimulator
// }

// const ConversationalPane: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       role: "assistant",
//       content:
//         "Welcome to Supernova Security Assistant. I can help you investigate security events, run queries, and generate reports. Ask me something like: 'Show VPN attempts'",
//       timestamp: new Date(),
//       status: "done",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
//   const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
//   const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
//   const [disabledInput, setDisabledInput] = useState(false);
//   const [generatingIds, setGeneratingIds] = useState<Record<string, boolean>>({});
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const quickPrompts = [
//     "Investigate failed logins",
//     "Show VPN attempts",
//     "Generate monthly malware report",
//     "Detect brute force attacks",
//   ];

//   // Helper: Scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Utility: generate a pseudo-unique id
//   const uid = (prefix = "") => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

//   /**
//    * Mock: Convert natural language into a query
//    * In real integration you'd call a server-side model or generator here.
//    */
//   const generateQueryFromNL = async (nl: string, parentMessage?: Message | null) => {
//     // Slight artificial delays
//     await new Promise((r) => setTimeout(r, 700));

//     // Basic heuristics to pick language
//     const language: QueryLanguage = /brute|force|threshold/i.test(nl) ? "EQL" : "KQL";

//     // Base query from NL (very simple mapping)
//     let base = "";
//     if (/vpn/i.test(nl)) {
//       base = `@timestamp >= now-24h and (event.dataset:openvpn* or event.module:openvpn or event.action: "vpn_connect")`;
//     } else if (/failed logins|failed login|failed auth/i.test(nl)) {
//       base = `@timestamp >= now-24h and event.category:authentication and event.outcome:failure`;
//     } else if (/brute/i.test(nl)) {
//       base = `// brute-force detection skeleton`;
//     } else {
//       base = `@timestamp >= now-24h and (event.category:authentication or event.category:network)`;
//     }

//     // If chaining from a parent, include parent's query as a base
//     let combined = base;
//     if (parentMessage?.query) {
//       combined = `// based on queryId:${parentMessage.queryId}\n(${parentMessage.query})\nAND (${base})`;
//     }

//     // Example generated KQL snippet (or EQL)
//     let generated = "";
//     if (language === "KQL") {
//       generated = `${combined}\n| stats count() by user.name, source.ip, event.outcome\n| sort -count`;
//     } else if (language === "EQL") {
//       generated = `${combined}\nsequence by source.ip\n  [ event.category == "authentication" and event.outcome == "failure" ]\n  where max_span = 10m\n  // consider threshold >= 5`;
//     } else {
//       generated = combined;
//     }

//     return {
//       query: generated,
//       queryLanguage: language,
//     };
//   };

//   /**
//    * Mock: Validate query for common issues
//    */
//   const validateQuery = (q: string) => {
//     const warnings: string[] = [];
//     if (!/source.ip|user.name|event.outcome|@timestamp/.test(q)) {
//       warnings.push("Query does not reference common fields (source.ip, user.name, @timestamp).");
//     }
//     if (/event.module:openvpn/.test(q) && /openvpn/i.test(q) === false) {
//       // silly example
//     }
//     const valid = warnings.length === 0;
//     // Provide a naive autofix example
//     const autofix = valid ? null : `${q}\n| fields @timestamp, user.name, source.ip, event.outcome`;
//     return { valid, warnings, autofix };
//   };

//   /**
//    * Mock executor: returns hits, execution time, top ips etc.
//    * Replace this with real API call to Elastic / Wazuh later.
//    */
//   const runQuerySimulator = async (query: string) => {
//     const start = Date.now();
//     // artificial execution delay
//     await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

//     // Very small mock "parser" to decide outputs
//     const total_hits = Math.floor(50 + Math.random() * 300);
//     const failed = Math.floor(total_hits * (0.6 + Math.random() * 0.3));
//     const success = total_hits - failed;

//     const top_source_ips = [
//       { ip: "198.51.100.22", count: Math.floor(10 + Math.random() * 40) },
//       { ip: "203.0.113.45", count: Math.floor(5 + Math.random() * 30) },
//       { ip: "192.0.2.12", count: Math.floor(2 + Math.random() * 20) },
//     ].slice(0, 3);

//     // create rows sample
//     const rows = Array.from({ length: Math.min(8, Math.round(Math.random() * 8) + 3) }).map((_, i) => {
//       const ip = top_source_ips[i % top_source_ips.length].ip;
//       const user = ["alice", "bob", "diana", "eve", "frank"][i % 5] + "@example.com";
//       const outcome = Math.random() > 0.3 ? "failure" : "success";
//       const ts = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString();
//       return { "@timestamp": ts, "user.name": user, "source.ip": ip, "event.outcome": outcome };
//     });

//     const execution_ms = Date.now() - start;

//     // Return a structured mock result
//     return {
//       total_hits,
//       failed,
//       success,
//       execution_ms,
//       top_source_ips,
//       rows,
//       time_series: Array.from({ length: 8 }).map((_, i) => ({ t: i, count: Math.floor(1 + Math.random() * 20) })),
//     };
//   };

//   // Create assistant message that will generate a query
//   const createAssistantGeneratingMessage = (nl: string, parentId?: string | null) => {
//     const msgId = uid("msg_");
//     const msg: Message = {
//       id: msgId,
//       role: "assistant",
//       content: `Generating query for: "${nl}"`,
//       timestamp: new Date(),
//       status: "generating",
//       parentId: parentId ?? null,
//     };
//     setMessages((prev) => [...prev, msg]);
//     return msg;
//   };

//   // Main handler: user sends input
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: uid("u_"),
//       role: "user",
//       content: input,
//       timestamp: new Date(),
//       status: "done",
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setDisabledInput(true);

//     // Create assistant "generating" placeholder
//     const assistantMsg = createAssistantGeneratingMessage(userMessage.content, null);
//     setGeneratingIds((g) => ({ ...g, [assistantMsg.id]: true }));

//     try {
//       // Generate query
//       const { query, queryLanguage } = await generateQueryFromNL(userMessage.content, null);
//       const validation = validateQuery(query);

//       // Update assistant message into ready state with generated query
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === assistantMsg.id
//             ? {
//                 ...m,
//                 content: `I'll help you with "${userMessage.content}". Here's the generated query:`,
//                 query,
//                 queryLanguage,
//                 status: "ready",
//                 queryId: uid("q_"),
//                 entities: extractEntitiesFromQuery(query),
//                 validation,
//                 timestamp: new Date(),
//               }
//             : m
//         )
//       );
//     } catch (e) {
//       setMessages((prev) =>
//         prev.map((m) => (m.id === assistantMsg.id ? { ...m, status: "error", content: "Failed to generate query" } : m))
//       );
//     } finally {
//       setDisabledInput(false);
//       setGeneratingIds((g) => {
//         const copy = { ...g };
//         delete copy[assistantMsg.id];
//         return copy;
//       });
//     }
//   };

//   // Extract rudimentary entities from query string for demo purposes
//   const extractEntitiesFromQuery = (q?: string) => {
//     if (!q) return undefined;
//     const ips = Array.from(q.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)).map((m) => m[0]);
//     const users = Array.from(q.matchAll(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi)).map((m) => m[0]);
//     const ts = Array.from(q.matchAll(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g)).map((m) => m[0]);
//     const ents: Entity[] = [];
//     ips.forEach((ip) => ents.push({ type: "ip", value: ip }));
//     users.forEach((u) => ents.push({ type: "user", value: u }));
//     ts.forEach((t) => ents.push({ type: "timestamp", value: t }));
//     return ents;
//   };

//   // Handle running a query for a specific assistant message
//   const handleRunQuery = async (messageId: string) => {
//     const message = messages.find((m) => m.id === messageId);
//     if (!message?.query) return;

//     // update status to running
//     setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "running" } : m)));

//     // Small console-like "command" line to show immediately
//     setTimeout(() => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === messageId
//             ? {
//                 ...m,
//                 content: `${m.content}\n\nExecuting query...`,
//               }
//             : m
//         )
//       );
//     }, 120);

//     try {
//       const results = await runQuerySimulator(message.query);
//       // Update message with results
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === messageId
//             ? {
//                 ...m,
//                 results,
//                 status: "done",
//                 // append short summary into content for clarity
//                 content: `${m.content}`,
//               }
//             : m
//         )
//       );
//     } catch (e) {
//       setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "error" } : m)));
//     }
//   };

//   // Copy query text
//   const handleCopyQuery = (query: string, messageId: string) => {
//     navigator.clipboard.writeText(query);
//     setCopiedQuery(messageId);
//     setTimeout(() => setCopiedQuery(null), 2000);
//   };

//   // Copy command text
//   const handleCopyCommand = (cmd: string, messageId: string) => {
//     navigator.clipboard.writeText(cmd);
//     setCopiedCommand(messageId);
//     setTimeout(() => setCopiedCommand(null), 2000);
//   };

//   // Download results as CSV
//   const handleDownloadCSV = (rows: any[], filename = "results.csv") => {
//     if (!rows || !rows.length) return;
//     const headers = Object.keys(rows[0]);
//     const csv = [headers.join(",")]
//       .concat(
//         rows.map((r) =>
//           headers
//             .map((h) => {
//               const v = r[h];
//               if (typeof v === "string") return `"${String(v).replace(/"/g, '""')}"`;
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

//   // Chain action: analyze brute-force attempts using previous message's query as base
//   const handleChainBruteforce = async (parentMessageId: string) => {
//     const parent = messages.find((m) => m.id === parentMessageId);
//     if (!parent || !parent.query) return;

//     // Create assistant generating message with parent reference
//     const genMsg = createAssistantGeneratingMessage(`Analyze brute-force attempts`, parentMessageId);
//     setGeneratingIds((g) => ({ ...g, [genMsg.id]: true }));

//     try {
//       const { query, queryLanguage } = await generateQueryFromNL("analyze brute force", parent);
//       const validation = validateQuery(query);

//       // Build a brute-force focused query (override to be explicit)
//       const bruteQuery =
//         `// based on queryId:${parent.queryId}\n(${parent.query})\n// brute-force: count failures by source.ip and user\n| stats count() by source.ip, user.name\n| where count >= 5\n| sort -count`;

//       const qid = uid("q_");

//       setTimeout(() => {
//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === genMsg.id
//               ? {
//                   ...m,
//                   content: `Generating brute-force detection query using previous query (queryId: ${parent.queryId})`,
//                   query: bruteQuery,
//                   queryLanguage: "KQL",
//                   status: "ready",
//                   queryId: qid,
//                   parentId: parent.id,
//                   validation,
//                   timestamp: new Date(),
//                 }
//               : m
//           )
//         );
//       }, 250);
//     } catch (e) {
//       setMessages((prev) => prev.map((m) => (m.id === genMsg.id ? { ...m, status: "error", content: "Failed to generate chained query" } : m)));
//     } finally {
//       setGeneratingIds((g) => {
//         const copy = { ...g };
//         delete copy[genMsg.id];
//         return copy;
//       });
//     }
//   };

//   // Reuse a previous query into input (copy into composer)
//   const handleReuseQuery = (messageId: string) => {
//     const m = messages.find((mm) => mm.id === messageId);
//     if (!m?.query) return;
//     setInput((prev) => `${m.query}\n\n`);
//     // focus not handled but user can edit and send
//   };

//   const handleEntityClick = (entity: Entity) => {
//     // small demo action — in app you'd open a detail panel
//     console.log("Entity clicked:", entity);
//     // Optionally insert into input as filter
//     setInput((prev) => `${prev}${entity.value} `);
//   };

//   const renderEntity = (entity: Entity) => {
//     const colors = {
//       ip: "bg-blue-500/20 text-blue-300 border-blue-500/40",
//       user: "bg-green-500/20 text-green-300 border-green-500/40",
//       hash: "bg-purple-500/20 text-purple-300 border-purple-500/40",
//       timestamp: "bg-orange-500/20 text-orange-300 border-orange-500/40",
//       domain: "bg-pink-500/20 text-pink-300 border-pink-500/40",
//     } as Record<string, string>;

//     return (
//       <button
//         key={`${entity.type}-${entity.value}`}
//         onClick={() => handleEntityClick(entity)}
//         className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
//       >
//         <span className="text-[10px] uppercase mr-1 opacity-70">{entity.type}</span>
//         {entity.value}
//       </button>
//     );
//   };

//   // Small UI helpers to render status pill
//   const renderStatusPill = (status?: MessageStatus) => {
//     if (!status) return null;
//     const mapping: Record<MessageStatus, { text: string; classes: string }> = {
//       idle: { text: "idle", classes: "bg-gray-700 text-gray-300" },
//       generating: { text: "generating", classes: "bg-yellow-700 text-yellow-100" },
//       ready: { text: "ready", classes: "bg-blue-700 text-white" },
//       running: { text: "running", classes: "bg-indigo-700 text-white" },
//       done: { text: "done", classes: "bg-green-700 text-white" },
//       error: { text: "error", classes: "bg-red-700 text-white" },
//     };
//     const m = mapping[status];
//     return <span className={`text-xs px-2 py-0.5 rounded ${m.classes}`}>{m.text}</span>;
//   };

//   return (
//     <div className="flex flex-col h-screen bg-[#0f1115] text-gray-200">
//       {/* Header */}
//       <div className="flex-none px-6 py-3 border-b border-gray-800">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold text-white">Security Assistant</h2>
//             <p className="text-sm text-gray-400 mt-0.5">AI-powered threat investigation — demo mode (mock data)</p>
//           </div>
//           <div className="flex items-center space-x-3">
//             <div className="text-xs text-gray-400">Model:</div>
//             <div className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">claude-sonnet-4.5</div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Prompts */}
//       <div className="flex-none px-6 py-3 border-b border-gray-800">
//         <div className="flex flex-wrap gap-2">
//           {quickPrompts.map((prompt, idx) => (
//             <button
//               key={idx}
//               onClick={() => setInput(prompt)}
//               disabled={disabledInput}
//               className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
//             >
//               {prompt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//         {messages.map((message) => (
//           <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
//             <div className={`max-w-3xl ${message.role === "user" ? "w-auto" : "w-full"}`}>
//               {/* Header */}
//               <div className="flex items-center mb-2 space-x-2">
//                 <div
//                   className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
//                     message.role === "user" ? "bg-blue-600 text-white" : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
//                   }`}
//                 >
//                   {message.role === "user" ? "U" : "AI"}
//                 </div>
//                 <span className="text-xs text-gray-400">
//                   {message.timestamp.toLocaleTimeString()} {message.queryId ? <span className="ml-2 text-[11px] font-mono text-gray-500">qid:{message.queryId}</span> : null}
//                 </span>
//                 <div className="ml-2">{renderStatusPill(message.status)}</div>
//                 {message.parentId ? <div className="ml-2 text-xs text-gray-400 italic">chained</div> : null}
//               </div>

//               {/* Content Card */}
//               <div
//                 className={`p-4 rounded-lg ${message.role === "user" ? "bg-blue-600/12 border border-blue-500/20" : "bg-gray-800/60 border border-gray-700"}`}
//               >
//                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

//                 {/* Entities */}
//                 {message.entities && message.entities.length > 0 && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <p className="text-xs text-gray-400 mb-2">Detected entities:</p>
//                     <div className="flex flex-wrap">{message.entities.map(renderEntity)}</div>
//                   </div>
//                 )}

//                 {/* Query block */}
//                 {message.query && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <Code size={14} className="text-gray-400" />
//                         <span className="text-xs font-semibold text-gray-300">Generated Query</span>
//                         <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-400">{message.queryLanguage}</span>
//                         {message.parentId ? (
//                           <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 ml-2">based on previous query</span>
//                         ) : null}
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => handleReuseQuery(message.id)}
//                           className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
//                           title="Reuse this query in composer"
//                         >
//                           Reuse
//                         </button>

//                         <button
//                           onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
//                           className="text-gray-400 hover:text-gray-300 transition-colors"
//                         >
//                           {expandedQuery === message.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </button>
//                       </div>
//                     </div>

//                     {expandedQuery === message.id && (
//                       <div className="relative">
//                         <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">
//                           {message.query}
//                         </pre>

//                         <div className="absolute top-2 right-2 flex items-center space-x-2">
//                           <button
//                             onClick={() => handleCopyQuery(message.query!, message.id)}
//                             className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
//                             title="Copy query"
//                           >
//                             {copiedQuery === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
//                           </button>
//                         </div>

//                         {/* Validation warnings */}
//                         {message.validation && (!message.validation.valid || (message.validation.warnings && message.validation.warnings.length > 0)) && (
//                           <div className="mt-3 text-xs">
//                             {message.validation.warnings && message.validation.warnings.length > 0 && (
//                               <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
//                                 <AlertTriangle size={14} className="text-yellow-300 mt-0.5" />
//                                 <div>
//                                   <div className="font-semibold text-yellow-200">Validation warnings</div>
//                                   {message.validation.warnings.map((w, i) => (
//                                     <div key={i} className="text-yellow-100 text-xs">
//                                       • {w}
//                                     </div>
//                                   ))}
//                                   {message.validation.autofix && (
//                                     <div className="mt-2">
//                                       <button
//                                         onClick={() =>
//                                           setMessages((prev) =>
//                                             prev.map((m) =>
//                                               m.id === message.id ? { ...m, query: m.validation?.autofix ?? m.query, validation: { valid: true, warnings: [] } } : m
//                                             )
//                                           )
//                                         }
//                                         className="text-xs px-2 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-black"
//                                       >
//                                         Apply Auto-fix
//                                       </button>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Query actions */}
//                     <div className="flex space-x-2 mt-3">
//                       <button
//                         onClick={() => handleRunQuery(message.id)}
//                         className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
//                       >
//                         <Play size={12} />
//                         <span>Run Query</span>
//                       </button>

//                       <button
//                         onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
//                         className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
//                       >
//                         {expandedQuery === message.id ? "Hide" : "Explain Query"}
//                       </button>

//                       {/* Chain action: analyze brute force */}
//                       <button
//                         onClick={() => handleChainBruteforce(message.id)}
//                         className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded transition-colors"
//                       >
//                         Analyze brute-force attempts
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Execution Results / Terminal-like block */}
//                 {message.results && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <div className="bg-[#08090b] p-3 rounded font-mono text-xs border border-gray-800 shadow-sm">
//                       {/* Command header */}
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center space-x-3">
//                           <div className="text-sm text-gray-300"> POST /_search</div>
//                           <div className="text-xs text-gray-500">queryId: {message.queryId}</div>
//                           <div className="text-xs text-gray-500 ml-2">{message.results.execution_ms} ms</div>
//                         </div>

//                         <div className="flex items-center space-x-2">
//                           <button
//                             title="Copy command"
//                             onClick={() =>
//                               handleCopyCommand(
//                                 `POST /_search\n${message.query?.slice(0, 500) ?? ""}`,
//                                 message.id
//                               )
//                             }
//                             className="p-1 rounded bg-gray-800 hover:bg-gray-700"
//                           >
//                             {copiedCommand === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
//                           </button>

//                           <button
//                             onClick={() => handleDownloadCSV(message.results.rows, `results_${message.queryId ?? "export"}.csv`)}
//                             className="p-1 rounded bg-gray-800 hover:bg-gray-700"
//                             title="Download CSV"
//                           >
//                             <Download size={14} className="text-gray-400" />
//                           </button>

//                           <button
//                             onClick={() => {
//                               // spawn a report placeholder message (user action)
//                               const reportMsg: Message = {
//                                 id: uid("m_"),
//                                 role: "assistant",
//                                 content: `Detailed report will be generated (placeholder). Use the "Detailed Report" button to render charts.`,
//                                 timestamp: new Date(),
//                                 status: "done",
//                               };
//                               setMessages((prev) => [...prev, reportMsg]);
//                             }}
//                             className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
//                           >
//                             <Layers size={14} className="inline-block mr-1" />
//                             Detailed Report
//                           </button>
//                         </div>
//                       </div>

//                       {/* Execution summary */}
//                       <div className="mb-2">
//                         <div className="text-xs text-gray-400">Summary: hits: <span className="font-semibold text-gray-200">{message.results.total_hits}</span> — failed: <span className="font-semibold text-red-300">{message.results.failed}</span> / success: <span className="font-semibold text-green-300">{message.results.success}</span></div>
//                       </div>

//                       {/* Top source IPs */}
//                       <div className="mb-3">
//                         <div className="text-xs text-gray-400 mb-1">Top source IPs:</div>
//                         <div className="flex flex-wrap gap-2">
//                           {message.results.top_source_ips.map((t: any) => (
//                             <div key={t.ip} className="text-xs font-mono px-2 py-1 bg-gray-900/50 rounded border border-gray-700">
//                               {t.ip} — {t.count}
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Rows */}
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full text-xs">
//                           <thead>
//                             <tr className="text-left text-gray-400">
//                               {message.results.rows.length > 0 &&
//                                 Object.keys(message.results.rows[0]).map((h: string) => (
//                                   <th key={h} className="pr-6 py-1">{h}</th>
//                                 ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {message.results.rows.map((r: any, i: number) => (
//                               <tr key={i} className="border-t border-gray-800">
//                                 {Object.keys(r).map((k: string) => (
//                                   <td key={k} className="pr-6 py-2 text-gray-300 font-mono">{String(r[k])}</td>
//                                 ))}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* Post-run actions */}
//                       <div className="mt-3 flex items-center space-x-2">
//                         <button
//                           onClick={() => handleChainBruteforce(message.id)}
//                           className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-xs rounded text-white"
//                         >
//                           Chain: Find brute-force attempts
//                         </button>

//                         <button
//                           onClick={() => {
//                             // quick reuse in composer
//                             setInput((prev) => `${message.query}\n\n`);
//                           }}
//                           className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs rounded text-gray-300"
//                         >
//                           Copy to composer
//                         </button>

//                         <div className="text-xs text-gray-400 ml-auto">Executed: {new Date().toLocaleString()}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Composer */}
//       <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#0f1115]">
//         <div className="flex items-end space-x-3">
//           <div className="flex-1 relative">
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSend();
//                 }
//               }}
//               placeholder="Ask about security events, run queries, or generate reports... (e.g., Show VPN attempts)"
//               className="w-full bg-gray-900 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500"
//               rows={3}
//               disabled={disabledInput}
//             />
//           </div>

//           <div className="flex flex-col items-end gap-2">
//             <button
//               onClick={handleSend}
//               disabled={!input.trim() || disabledInput}
//               className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
//               title="Send"
//             >
//               <Send size={20} />
//             </button>

//             <div className="text-xs text-gray-500">Enter to send • Shift+Enter newline</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationalPane;





// "use client";
// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Play, Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   query?: string;
//   queryLanguage?: 'KQL' | 'DSL';
//   entities?: Entity[];
//   timestamp: Date;
// }

// interface Entity {
//   type: 'ip' | 'user' | 'hash' | 'timestamp' | 'domain';
//   value: string;
// }

// const ConversationalPane: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: 'Welcome to Supernova Security Assistant. I can help you investigate security events, run queries, and generate reports. How can I assist you today?',
//       timestamp: new Date(),
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
//   const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const quickPrompts = [
//     'Investigate failed logins',
//     'Show VPN attempts',
//     'Generate monthly malware report',
//     'Detect brute force attacks',
//   ];

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: input,
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');

//     // Simulate assistant response
//     setTimeout(() => {
//       const assistantMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: `I'll help you with "${input}". Here's what I found:`,
//         query: `event.category: "authentication" AND event.outcome: "failure"\n| stats count by user.name, source.ip\n| where count > 3`,
//         queryLanguage: 'KQL',
//         entities: [
//           { type: 'ip', value: '192.168.1.100' },
//           { type: 'user', value: 'alice@example.com' },
//           { type: 'timestamp', value: '2025-10-12T10:30:00Z' },
//         ],
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, assistantMessage]);
//     }, 1000);
//   };

//   const handleQuickPrompt = (prompt: string) => {
//     setInput(prompt);
//   };

//   const handleRunQuery = (messageId: string) => {
//     console.log('Running query for message:', messageId);
//     // Implement query execution
//   };

//   const handleCopyQuery = (query: string, messageId: string) => {
//     navigator.clipboard.writeText(query);
//     setCopiedQuery(messageId);
//     setTimeout(() => setCopiedQuery(null), 2000);
//   };

//   const handleEntityClick = (entity: Entity) => {
//     console.log('Entity clicked:', entity);
//     // This would open an entity detail panel
//   };

//   const renderEntity = (entity: Entity) => {
//     const colors = {
//       ip: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
//       user: 'bg-green-500/20 text-green-300 border-green-500/40',
//       hash: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
//       timestamp: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
//       domain: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
//     };

//     return (
//       <button
//         key={`${entity.type}-${entity.value}`}
//         onClick={() => handleEntityClick(entity)}
//         className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
//       >
//         <span className="text-[10px] uppercase mr-1 opacity-70">{entity.type}</span>
//         {entity.value}
//       </button>
//     );
//   };

//   return (
//     <div className="flex flex-col h-screen bg-[#1a1a1a] text-gray-200">
//       {/* Header */}
//       <div className="flex-none px-6 py-4 border-b border-gray-800">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold text-white">Security Assistant</h2>
//             <p className="text-sm text-gray-400 mt-1">AI-powered threat investigation</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-xs text-gray-500">Model:</span>
//             <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">claude-sonnet-4.5</span>
//           </div>
//         </div>
//       </div>

//       {/* Quick Prompts */}
//       <div className="flex-none px-6 py-4 border-b border-gray-800">
//         <div className="flex flex-wrap gap-2">
//           {quickPrompts.map((prompt, idx) => (
//             <button
//               key={idx}
//               onClick={() => handleQuickPrompt(prompt)}
//               className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
//             >
//               {prompt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//         {messages.map((message) => (
//           <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`max-w-3xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
//               {/* Message Header */}
//               <div className="flex items-center mb-2 space-x-2">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
//                   message.role === 'user' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
//                 }`}>
//                   {message.role === 'user' ? 'U' : 'AI'}
//                 </div>
//                 <span className="text-xs text-gray-500">
//                   {message.timestamp.toLocaleTimeString()}
//                 </span>
//               </div>

//               {/* Message Content */}
//               <div className={`p-4 rounded-lg ${
//                 message.role === 'user' 
//                   ? 'bg-blue-600/20 border border-blue-500/30' 
//                   : 'bg-gray-800/50 border border-gray-700'
//               }`}>
//                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

//                 {/* Entities */}
//                 {message.entities && message.entities.length > 0 && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <p className="text-xs text-gray-400 mb-2">Detected entities:</p>
//                     <div className="flex flex-wrap">
//                       {message.entities.map(renderEntity)}
//                     </div>
//                   </div>
//                 )}

//                 {/* Query Section */}
//                 {message.query && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <Code size={14} className="text-gray-400" />
//                         <span className="text-xs font-semibold text-gray-300">Generated Query</span>
//                         <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-400">
//                           {message.queryLanguage}
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
//                         className="text-gray-400 hover:text-gray-300 transition-colors"
//                       >
//                         {expandedQuery === message.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                       </button>
//                     </div>

//                     {expandedQuery === message.id && (
//                       <div className="relative">
//                         <pre className="bg-[#0d0d0d] p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">
//                           {message.query}
//                         </pre>
//                         <button
//                           onClick={() => handleCopyQuery(message.query!, message.id)}
//                           className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
//                         >
//                           {copiedQuery === message.id ? (
//                             <Check size={14} className="text-green-400" />
//                           ) : (
//                             <Copy size={14} className="text-gray-400" />
//                           )}
//                         </button>
//                       </div>
//                     )}

//                     <div className="flex space-x-2 mt-3">
//                       <button
//                         onClick={() => handleRunQuery(message.id)}
//                         className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
//                       >
//                         <Play size={12} />
//                         <span>Run Query</span>
//                       </button>
//                       <button
//                         onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
//                         className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
//                       >
//                         {expandedQuery === message.id ? 'Hide' : 'Explain Query'}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#1a1a1a]">
//         <div className="flex items-end space-x-3">
//           <div className="flex-1 relative">
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSend();
//                 }
//               }}
//               placeholder="Ask about security events, run queries, or generate reports..."
//               className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-gray-700 placeholder-gray-500"
//               rows={3}
//             />
//           </div>
//           <button
//             onClick={handleSend}
//             disabled={!input.trim()}
//             className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
//           >
//             <Send size={20} />
//           </button>
//         </div>
//         <p className="text-xs text-gray-500 mt-2">
//           Press Enter to send, Shift+Enter for new line
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ConversationalPane;


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
//   CheckCircle,
//   AlertTriangle,
//   Download,
//   Layers,
//   RefreshCw,
// } from "lucide-react";

// type QueryLanguage = "KQL" | "DSL" | "EQL";

// interface Entity {
//   type: "ip" | "user" | "hash" | "timestamp" | "domain";
//   value: string;
// }

// type MessageStatus = "idle" | "generating" | "ready" | "running" | "done" | "error";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   query?: string;
//   queryLanguage?: QueryLanguage;
//   entities?: Entity[];
//   timestamp: Date;
//   status?: MessageStatus;
//   queryId?: string; // unique id for generated queries
//   parentId?: string | null; // chain parent
//   validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
//   results?: any; // shape returned by runQuerySimulator
// }

// const ConversationalPane: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       role: "assistant",
//       content:
//         "Welcome to Supernova Security Assistant. I can help you investigate security events, run queries, and generate reports. Ask me something like: 'Show VPN attempts'",
//       timestamp: new Date(),
//       status: "done",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
//   const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
//   const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
//   const [disabledInput, setDisabledInput] = useState(false);
//   const [generatingIds, setGeneratingIds] = useState<Record<string, boolean>>({});
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const quickPrompts = [
//     "Investigate failed logins",
//     "Show VPN attempts",
//     "Generate monthly malware report",
//     "Detect brute force attacks",
//   ];

//   // Helper: Scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Utility: generate a pseudo-unique id
//   const uid = (prefix = "") => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

//   /**
//    * Mock: Convert natural language into a query
//    * In real integration you'd call a server-side model or generator here.
//    */
//   const generateQueryFromNL = async (nl: string, parentMessage?: Message | null) => {
//     // Slight artificial delays
//     await new Promise((r) => setTimeout(r, 700));

//     // Basic heuristics to pick language
//     const language: QueryLanguage = /brute|force|threshold/i.test(nl) ? "EQL" : "KQL";

//     // Base query from NL (very simple mapping)
//     let base = "";
//     if (/vpn/i.test(nl)) {
//       base = `@timestamp >= now-24h and (event.dataset:openvpn* or event.module:openvpn or event.action: "vpn_connect")`;
//     } else if (/failed logins|failed login|failed auth/i.test(nl)) {
//       base = `@timestamp >= now-24h and event.category:authentication and event.outcome:failure`;
//     } else if (/brute/i.test(nl)) {
//       base = `// brute-force detection skeleton`;
//     } else {
//       base = `@timestamp >= now-24h and (event.category:authentication or event.category:network)`;
//     }

//     // If chaining from a parent, include parent's query as a base
//     let combined = base;
//     if (parentMessage?.query) {
//       combined = `// based on queryId:${parentMessage.queryId}\n(${parentMessage.query})\nAND (${base})`;
//     }

//     // Example generated KQL snippet (or EQL)
//     let generated = "";
//     if (language === "KQL") {
//       generated = `${combined}\n| stats count() by user.name, source.ip, event.outcome\n| sort -count`;
//     } else if (language === "EQL") {
//       generated = `${combined}\nsequence by source.ip\n  [ event.category == "authentication" and event.outcome == "failure" ]\n  where max_span = 10m\n  // consider threshold >= 5`;
//     } else {
//       generated = combined;
//     }

//     return {
//       query: generated,
//       queryLanguage: language,
//     };
//   };

//   /**
//    * Mock: Validate query for common issues
//    */
//   const validateQuery = (q: string) => {
//     const warnings: string[] = [];
//     if (!/source.ip|user.name|event.outcome|@timestamp/.test(q)) {
//       warnings.push("Query does not reference common fields (source.ip, user.name, @timestamp).");
//     }
//     if (/event.module:openvpn/.test(q) && /openvpn/i.test(q) === false) {
//       // silly example
//     }
//     const valid = warnings.length === 0;
//     // Provide a naive autofix example
//     const autofix = valid ? null : `${q}\n| fields @timestamp, user.name, source.ip, event.outcome`;
//     return { valid, warnings, autofix };
//   };

//   /**
//    * Mock executor: returns hits, execution time, top ips etc.
//    * Replace this with real API call to Elastic / Wazuh later.
//    */
//   const runQuerySimulator = async (query: string) => {
//     const start = Date.now();
//     // artificial execution delay
//     await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

//     // Very small mock "parser" to decide outputs
//     const total_hits = Math.floor(50 + Math.random() * 300);
//     const failed = Math.floor(total_hits * (0.6 + Math.random() * 0.3));
//     const success = total_hits - failed;

//     const top_source_ips = [
//       { ip: "198.51.100.22", count: Math.floor(10 + Math.random() * 40) },
//       { ip: "203.0.113.45", count: Math.floor(5 + Math.random() * 30) },
//       { ip: "192.0.2.12", count: Math.floor(2 + Math.random() * 20) },
//     ].slice(0, 3);

//     // create rows sample
//     const rows = Array.from({ length: Math.min(8, Math.round(Math.random() * 8) + 3) }).map((_, i) => {
//       const ip = top_source_ips[i % top_source_ips.length].ip;
//       const user = ["alice", "bob", "diana", "eve", "frank"][i % 5] + "@example.com";
//       const outcome = Math.random() > 0.3 ? "failure" : "success";
//       const ts = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString();
//       return { "@timestamp": ts, "user.name": user, "source.ip": ip, "event.outcome": outcome };
//     });

//     const execution_ms = Date.now() - start;

//     // Return a structured mock result
//     return {
//       total_hits,
//       failed,
//       success,
//       execution_ms,
//       top_source_ips,
//       rows,
//       time_series: Array.from({ length: 8 }).map((_, i) => ({ t: i, count: Math.floor(1 + Math.random() * 20) })),
//     };
//   };

//   // Create assistant message that will generate a query
//   const createAssistantGeneratingMessage = (nl: string, parentId?: string | null) => {
//     const msgId = uid("msg_");
//     const msg: Message = {
//       id: msgId,
//       role: "assistant",
//       content: `Generating query for: "${nl}"`,
//       timestamp: new Date(),
//       status: "generating",
//       parentId: parentId ?? null,
//     };
//     setMessages((prev) => [...prev, msg]);
//     return msg;
//   };

//   // Main handler: user sends input
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: uid("u_"),
//       role: "user",
//       content: input,
//       timestamp: new Date(),
//       status: "done",
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setDisabledInput(true);

//     // Create assistant "generating" placeholder
//     const assistantMsg = createAssistantGeneratingMessage(userMessage.content, null);
//     setGeneratingIds((g) => ({ ...g, [assistantMsg.id]: true }));

//     try {
//       // Generate query
//       const { query, queryLanguage } = await generateQueryFromNL(userMessage.content, null);
//       const validation = validateQuery(query);

//       // Update assistant message into ready state with generated query
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === assistantMsg.id
//             ? {
//               ...m,
//               content: `I'll help you with "${userMessage.content}". Here's the generated query:`,
//               query,
//               queryLanguage,
//               status: "ready",
//               queryId: uid("q_"),
//               entities: extractEntitiesFromQuery(query),
//               validation,
//               timestamp: new Date(),
//             }
//             : m
//         )
//       );
//     } catch (e) {
//       setMessages((prev) =>
//         prev.map((m) => (m.id === assistantMsg.id ? { ...m, status: "error", content: "Failed to generate query" } : m))
//       );
//     } finally {
//       setDisabledInput(false);
//       setGeneratingIds((g) => {
//         const copy = { ...g };
//         delete copy[assistantMsg.id];
//         return copy;
//       });
//     }
//   };

//   // Extract rudimentary entities from query string for demo purposes
//   const extractEntitiesFromQuery = (q?: string) => {
//     if (!q) return undefined;
//     const ips = Array.from(q.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)).map((m) => m[0]);
//     const users = Array.from(q.matchAll(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi)).map((m) => m[0]);
//     const ts = Array.from(q.matchAll(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g)).map((m) => m[0]);
//     const ents: Entity[] = [];
//     ips.forEach((ip) => ents.push({ type: "ip", value: ip }));
//     users.forEach((u) => ents.push({ type: "user", value: u }));
//     ts.forEach((t) => ents.push({ type: "timestamp", value: t }));
//     return ents;
//   };

//   // Handle running a query for a specific assistant message
//   const handleRunQuery = async (messageId: string) => {
//     const message = messages.find((m) => m.id === messageId);
//     if (!message?.query) return;

//     // update status to running
//     setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "running" } : m)));

//     // Small console-like "command" line to show immediately
//     setTimeout(() => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === messageId
//             ? {
//               ...m,
//               content: `${m.content}\n\nExecuting query...`,
//             }
//             : m
//         )
//       );
//     }, 120);

//     try {
//       const results = await runQuerySimulator(message.query);
//       // Update message with results
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === messageId
//             ? {
//               ...m,
//               results,
//               status: "done",
//               // append short summary into content for clarity
//               content: `${m.content}`,
//             }
//             : m
//         )
//       );
//     } catch (e) {
//       setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "error" } : m)));
//     }
//   };

//   // Copy query text
//   const handleCopyQuery = (query: string, messageId: string) => {
//     navigator.clipboard.writeText(query);
//     setCopiedQuery(messageId);
//     setTimeout(() => setCopiedQuery(null), 2000);
//   };

//   // Copy command text
//   const handleCopyCommand = (cmd: string, messageId: string) => {
//     navigator.clipboard.writeText(cmd);
//     setCopiedCommand(messageId);
//     setTimeout(() => setCopiedCommand(null), 2000);
//   };

//   // Download results as CSV
//   const handleDownloadCSV = (rows: any[], filename = "results.csv") => {
//     if (!rows || !rows.length) return;
//     const headers = Object.keys(rows[0]);
//     const csv = [headers.join(",")]
//       .concat(
//         rows.map((r) =>
//           headers
//             .map((h) => {
//               const v = r[h];
//               if (typeof v === "string") return `"${String(v).replace(/"/g, '""')}"`;
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

//   // Chain action: analyze brute-force attempts using previous message's query as base
//   const handleChainBruteforce = async (parentMessageId: string) => {
//     const parent = messages.find((m) => m.id === parentMessageId);
//     if (!parent || !parent.query) return;

//     // Create assistant generating message with parent reference
//     const genMsg = createAssistantGeneratingMessage(`Analyze brute-force attempts`, parentMessageId);
//     setGeneratingIds((g) => ({ ...g, [genMsg.id]: true }));

//     try {
//       const { query, queryLanguage } = await generateQueryFromNL("analyze brute force", parent);
//       const validation = validateQuery(query);

//       // Build a brute-force focused query (override to be explicit)
//       const bruteQuery =
//         `// based on queryId:${parent.queryId}\n(${parent.query})\n// brute-force: count failures by source.ip and user\n| stats count() by source.ip, user.name\n| where count >= 5\n| sort -count`;

//       const qid = uid("q_");

//       setTimeout(() => {
//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === genMsg.id
//               ? {
//                 ...m,
//                 content: `Generating brute-force detection query using previous query (queryId: ${parent.queryId})`,
//                 query: bruteQuery,
//                 queryLanguage: "KQL",
//                 status: "ready",
//                 queryId: qid,
//                 parentId: parent.id,
//                 validation,
//                 timestamp: new Date(),
//               }
//               : m
//           )
//         );
//       }, 250);
//     } catch (e) {
//       setMessages((prev) => prev.map((m) => (m.id === genMsg.id ? { ...m, status: "error", content: "Failed to generate chained query" } : m)));
//     } finally {
//       setGeneratingIds((g) => {
//         const copy = { ...g };
//         delete copy[genMsg.id];
//         return copy;
//       });
//     }
//   };

//   // Reuse a previous query into input (copy into composer)
//   const handleReuseQuery = (messageId: string) => {
//     const m = messages.find((mm) => mm.id === messageId);
//     if (!m?.query) return;
//     setInput((prev) => `${m.query}\n\n`);
//     // focus not handled but user can edit and send
//   };

//   const handleEntityClick = (entity: Entity) => {
//     // small demo action — in app you'd open a detail panel
//     console.log("Entity clicked:", entity);
//     // Optionally insert into input as filter
//     setInput((prev) => `${prev}${entity.value} `);
//   };

//   const renderEntity = (entity: Entity) => {
//     const colors = {
//       ip: "bg-blue-500/20 text-blue-300 border-blue-500/40",
//       user: "bg-green-500/20 text-green-300 border-green-500/40",
//       hash: "bg-purple-500/20 text-purple-300 border-purple-500/40",
//       timestamp: "bg-orange-500/20 text-orange-300 border-orange-500/40",
//       domain: "bg-pink-500/20 text-pink-300 border-pink-500/40",
//     } as Record<string, string>;

//     return (
//       <button
//         key={`${entity.type}-${entity.value}`}
//         onClick={() => handleEntityClick(entity)}
//         className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
//       >
//         <span className="text-[10px] uppercase mr-1 opacity-70">{entity.type}</span>
//         {entity.value}
//       </button>
//     );
//   };

//   // Small UI helpers to render status pill
//   const renderStatusPill = (status?: MessageStatus) => {
//     if (!status) return null;
//     const mapping: Record<MessageStatus, { text: string; classes: string }> = {
//       idle: { text: "idle", classes: "bg-gray-700 text-gray-300" },
//       generating: { text: "generating", classes: "bg-yellow-700 text-yellow-100" },
//       ready: { text: "ready", classes: "bg-blue-700 text-white" },
//       running: { text: "running", classes: "bg-indigo-700 text-white" },
//       done: { text: "done", classes: "bg-green-700 text-white" },
//       error: { text: "error", classes: "bg-red-700 text-white" },
//     };
//     const m = mapping[status];
//     return <span className={`text-xs px-2 py-0.5 rounded ${m.classes}`}>{m.text}</span>;
//   };

//   return (
//     <div className="flex flex-col h-screen bg-[#0f1115] text-gray-200">
//       {/* Header */}
//       <div className="flex-none px-6 py-3 border-b border-gray-800">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold text-white">Security Assistant</h2>
//             <p className="text-sm text-gray-400 mt-0.5">AI-powered threat investigation</p>
//           </div>
//           <div className="flex items-center space-x-3">
//             {/* <div className="text-xs text-gray-400">Model:</div>
//             <div className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">claude-sonnet-4.5</div> */}
//           </div>
//         </div>
//       </div>

//       {/* Quick Prompts */}
//       {/* <div className="flex-none px-6 py-3 border-b border-gray-800">
//         <div className="flex flex-wrap gap-2">
//           {quickPrompts.map((prompt, idx) => (
//             <button
//               key={idx}
//               onClick={() => setInput(prompt)}
//               disabled={disabledInput}
//               className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
//             >
//               {prompt}
//             </button>
//           ))}
//         </div>
//       </div> */}

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//         {messages.map((message) => (
//           <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
//             <div className={`max-w-3xl ${message.role === "user" ? "w-auto" : "w-full"}`}>
//               {/* Header */}
//               <div className="flex items-center mb-2 space-x-2">
//                 <div
//                   className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
//                     }`}
//                 >
//                   {message.role === "user" ? "U" : "AI"}
//                 </div>
//                 <span className="text-xs text-gray-400">
//                   {message.timestamp.toLocaleTimeString()} {message.queryId ? <span className="ml-2 text-[11px] font-mono text-gray-500">qid:{message.queryId}</span> : null}
//                 </span>
//                 <div className="ml-2">{renderStatusPill(message.status)}</div>
//                 {message.parentId ? <div className="ml-2 text-xs text-gray-400 italic">chained</div> : null}
//               </div>

//               {/* Content Card */}
//               <div
//                 className={`p-4 rounded-lg ${message.role === "user" ? "bg-blue-600/12 border border-blue-500/20" : "bg-gray-800/60 border border-gray-700"}`}
//               >
//                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

//                 {/* Entities */}
//                 {message.entities && message.entities.length > 0 && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <p className="text-xs text-gray-400 mb-2">Detected entities:</p>
//                     <div className="flex flex-wrap">{message.entities.map(renderEntity)}</div>
//                   </div>
//                 )}

//                 {/* Query block */}
//                 {message.query && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <Code size={14} className="text-gray-400" />
//                         <span className="text-xs font-semibold text-gray-300">Generated Query</span>
//                         <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-400">{message.queryLanguage}</span>
//                         {message.parentId ? (
//                           <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 ml-2">based on previous query</span>
//                         ) : null}
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         {/* <button
//                           onClick={() => handleReuseQuery(message.id)}
//                           className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
//                           title="Reuse this query in composer"
//                         >
//                           Reuse
//                         </button> */}

//                         <button
//                           onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
//                           className="text-gray-400 hover:text-gray-300 transition-colors"
//                         >
//                           {expandedQuery === message.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </button>
//                       </div>
//                     </div>

//                     {expandedQuery === message.id && (
//                       <div className="relative">
//                         <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">
//                           {message.query}
//                         </pre>

//                         <div className="absolute top-2 right-2 flex items-center space-x-2">
//                           <button
//                             onClick={() => handleCopyQuery(message.query!, message.id)}
//                             className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
//                             title="Copy query"
//                           >
//                             {copiedQuery === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
//                           </button>
//                         </div>

//                         {/* Validation warnings */}
//                         {message.validation && (!message.validation.valid || (message.validation.warnings && message.validation.warnings.length > 0)) && (
//                           <div className="mt-3 text-xs">
//                             {message.validation.warnings && message.validation.warnings.length > 0 && (
//                               <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
//                                 <AlertTriangle size={14} className="text-yellow-300 mt-0.5" />
//                                 <div>
//                                   <div className="font-semibold text-yellow-200">Validation warnings</div>
//                                   {message.validation.warnings.map((w, i) => (
//                                     <div key={i} className="text-yellow-100 text-xs">
//                                       • {w}
//                                     </div>
//                                   ))}
//                                   {message.validation.autofix && (
//                                     <div className="mt-2">
//                                       <button
//                                         onClick={() =>
//                                           setMessages((prev) =>
//                                             prev.map((m) =>
//                                               m.id === message.id ? { ...m, query: m.validation?.autofix ?? m.query, validation: { valid: true, warnings: [] } } : m
//                                             )
//                                           )
//                                         }
//                                         className="text-xs px-2 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-black"
//                                       >
//                                         Apply Auto-fix
//                                       </button>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Query actions */}
//                     <div className="flex space-x-2 mt-3">
//                       <button
//                         onClick={() => handleRunQuery(message.id)}
//                         className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
//                       >
//                         <Play size={12} />
//                         <span>Run Query</span>
//                       </button>

//                       <button
//                         onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
//                         className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
//                       >
//                         {expandedQuery === message.id ? "Hide" : "Show Query"}
//                       </button>

//                       {/* Chain action: analyze brute force */}
//                       {/* <button
//                         onClick={() => handleChainBruteforce(message.id)}
//                         className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded transition-colors"
//                       >
//                         Analyze brute-force attempts
//                       </button> */}
//                     </div>
//                   </div>
//                 )}

//                 {/* Execution Results / Terminal-like block */}
//                 {message.results && (
//                   <div className="mt-4 pt-4 border-t border-gray-700">
//                     <div className="bg-[#08090b] p-3 rounded font-mono text-xs border border-gray-800 shadow-sm">
//                       {/* Command header */}
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center space-x-3">
//                           <div className="text-sm text-gray-300"> POST /_search</div>
//                           <div className="text-xs text-gray-500">queryId: {message.queryId}</div>
//                           <div className="text-xs text-gray-500 ml-2">{message.results.execution_ms} ms</div>
//                         </div>

//                         <div className="flex items-center space-x-2">
//                           <button
//                             title="Copy command"
//                             onClick={() =>
//                               handleCopyCommand(
//                                 `POST /_search\n${message.query?.slice(0, 500) ?? ""}`,
//                                 message.id
//                               )
//                             }
//                             className="p-1 rounded bg-gray-800 hover:bg-gray-700"
//                           >
//                             {copiedCommand === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
//                           </button>

//                           <button
//                             onClick={() => handleDownloadCSV(message.results.rows, `results_${message.queryId ?? "export"}.csv`)}
//                             className="p-1 rounded bg-gray-800 hover:bg-gray-700"
//                             title="Download CSV"
//                           >
//                             <Download size={14} className="text-gray-400" />
//                           </button>


//                         </div>
//                       </div>

//                       {/* Execution summary */}
//                       <div className="mb-2">
//                         <div className="text-xs text-gray-400">Summary: hits: <span className="font-semibold text-gray-200">{message.results.total_hits}</span> — failed: <span className="font-semibold text-red-300">{message.results.failed}</span> / success: <span className="font-semibold text-green-300">{message.results.success}</span></div>
//                       </div>

//                       {/* Top source IPs */}
//                       <div className="mb-3">
//                         {/* <div className="text-xs text-gray-400 mb-1">Top source IPs:</div>
//                         <div className="flex flex-wrap gap-2">
//                           {message.results.top_source_ips.map((t: any) => (
//                             <div key={t.ip} className="text-xs font-mono px-2 py-1 bg-gray-900/50 rounded border border-gray-700">
//                               {t.ip} — {t.count}
//                             </div>
//                           ))}
//                         </div> */}
//                       </div>

//                       {/* Rows */}
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full text-xs">
//                           <thead>
//                             <tr className="text-left text-gray-400">
//                               {message.results.rows.length > 0 &&
//                                 Object.keys(message.results.rows[0]).map((h: string) => (
//                                   <th key={h} className="pr-6 py-1">{h}</th>
//                                 ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {message.results.rows.map((r: any, i: number) => (
//                               <tr key={i} className="border-t border-gray-800">
//                                 {Object.keys(r).map((k: string) => (
//                                   <td key={k} className="pr-6 py-2 text-gray-300 font-mono">{String(r[k])}</td>
//                                 ))}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* Post-run actions */}
//                       <div className="mt-3 flex items-center space-x-2">
//                         {/* <button
//                           onClick={() => handleChainBruteforce(message.id)}
//                           className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-xs rounded text-white"
//                         >
//                           Chain: Find brute-force attempts
//                         </button> */}

//                         {/* <button
//                           onClick={() => {
//                             // quick reuse in composer
//                             setInput((prev) => `${message.query}\n\n`);
//                           }}
//                           className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs rounded text-gray-300"
//                         >
//                           Copy to composer
//                         </button> */}
//                         <button
//                           onClick={() => {
//                             // spawn a report placeholder message (user action)
//                             const reportMsg: Message = {
//                               id: uid("m_"),
//                               role: "assistant",
//                               content: `Detailed report will be generated (placeholder). Use the "Detailed Report" button to render charts.`,
//                               timestamp: new Date(),
//                               status: "done",
//                             };
//                             setMessages((prev) => [...prev, reportMsg]);
//                           }}
//                           className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
//                         >
//                           <Layers size={14} className="inline-block mr-1" />
//                           Detailed Report
//                         </button>
//                         <div className="text-xs text-gray-400 ml-auto">Executed: {new Date().toLocaleString()}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Composer */}
//       <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#0f1115]">
//         <div className="flex items-end space-x-3">
//           <div className="flex-1 relative">
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSend();
//                 }
//               }}
//               placeholder="Ask about security events, run queries, or generate reports... (e.g., Show VPN attempts)"
//               className="w-full bg-gray-900 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500"
//               rows={3}
//               disabled={disabledInput}
//             />
//           </div>

//           <div className="flex flex-col items-end gap-2">
//             <button
//               onClick={handleSend}
//               disabled={!input.trim() || disabledInput}
//               className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
//               title="Send"
//             >
//               <Send size={20} />
//             </button>

//             <div className="text-xs text-gray-500">Enter to send • Shift+Enter newline</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationalPane;
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
// } from "lucide-react";

// type QueryLanguage = "KQL" | "DSL" | "EQL";

// interface Entity {
//   type: "ip" | "user" | "hash" | "timestamp" | "domain";
//   value: string;
// }

// type MessageStatus = "idle" | "generating" | "ready" | "running" | "done" | "error";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   query?: string;
//   queryLanguage?: QueryLanguage;
//   entities?: Entity[];
//   timestamp: Date;
//   status?: MessageStatus;
//   queryId?: string; // unique id for generated queries
//   parentId?: string | null; // chain parent (message id)
//   validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
//   results?: any;
// }

// interface Conversation {
//   id: string;
//   title: string;
//   messages: Message[];
// }

// const uid = (prefix = "") => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

// /**
//  * ConversationalPane with a left Sidebar for conversation management and
//  * mock messages that demonstrate a 3-step chaining flow.
//  *
//  * Usage: Drop this file into a Next.js app (app router) or any React app using Tailwind.
//  * Icons use lucide-react (already imported above).
//  */

// const buildMockConversation = (): Conversation => {
//   // We'll construct a single conversation that contains 3 chained assistant queries
//   const u1: Message = {
//     id: "u1",
//     role: "user",
//     content: "Show VPN attempts",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
//     status: "done",
//   };

//   const a1: Message = {
//     id: "a1",
//     role: "assistant",
//     content: `Generated query for: \"Show VPN attempts\"`,
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3 + 5000),
//     status: "ready",
//     queryId: "q_1",
//     queryLanguage: "KQL",
//     query:
//       `@timestamp >= now-24h and (event.dataset:openvpn* or event.module:openvpn or event.action: \"vpn_connect\")\n| stats count() by user.name, source.ip, event.outcome\n| sort -count`,
//     entities: [{ type: "timestamp", value: "now-24h" }],
//     validation: { valid: true, warnings: [], autofix: null },
//   };

//   const u2: Message = {
//     id: "u2",
//     role: "user",
//     content: "Narrow to failed logins only",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
//     status: "done",
//   };

//   const a2: Message = {
//     id: "a2",
//     role: "assistant",
//     content: `Based on previous query (qid: q_1) — generating narrowed query for failures`,
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 5000),
//     status: "ready",
//     queryId: "q_2",
//     parentId: a1.id,
//     queryLanguage: "KQL",
//     query:
//       `// based on queryId:q_1\n(@timestamp >= now-24h and (event.dataset:openvpn* or event.module:openvpn or event.action: \"vpn_connect\"))\nAND (event.category:authentication and event.outcome:failure)\n| stats count() by user.name, source.ip\n| sort -count`,
//     entities: [{ type: "timestamp", value: "now-24h" }],
//     validation: { valid: true, warnings: [], autofix: null },
//   };

//   const u3: Message = {
//     id: "u3",
//     role: "user",
//     content: "Analyze brute-force attempts (count >= 5)",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
//     status: "done",
//   };

//   const a3: Message = {
//     id: "a3",
//     role: "assistant",
//     content: `Chained brute-force detection query (based on q_2) — results ready to run`,
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 + 5000),
//     status: "ready",
//     queryId: "q_3",
//     parentId: a2.id,
//     queryLanguage: "KQL",
//     query:
//       `// based on queryId:q_2\n(@timestamp >= now-24h AND event.category:authentication AND event.outcome:failure)\n| stats count() by source.ip, user.name\n| where count >= 5\n| sort -count`,
//     entities: [{ type: "ip", value: "198.51.100.22" }],
//     validation: { valid: true, warnings: [], autofix: null },
//     results: {
//       total_hits: 128,
//       failed: 98,
//       success: 30,
//       execution_ms: 135,
//       rows: [
//         { "@timestamp": new Date().toISOString(), "user.name": "alice@example.com", "source.ip": "198.51.100.22", "event.outcome": "failure" },
//         { "@timestamp": new Date().toISOString(), "user.name": "bob@example.com", "source.ip": "203.0.113.45", "event.outcome": "failure" },
//       ],
//     },
//   };

//   const convo: Conversation = {
//     id: "convo_1",
//     title: "VPN & Authentication investigations",
//     messages: [u1, a1, u2, a2, u3, a3],
//   };

//   return convo;
// };

// const ConversationalPaneWithSidebar: React.FC = () => {
//   const mockConvo = buildMockConversation();

//   const [conversations, setConversations] = useState<Conversation[]>([mockConvo]);
//   const [activeConvoId, setActiveConvoId] = useState<string>(conversations[0].id);
//   const [messages, setMessages] = useState<Message[]>(conversations[0].messages);
//   const [input, setInput] = useState("");
//   const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
//   const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
//   const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
//   const [disabledInput, setDisabledInput] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     // when active convo changes, load its messages
//     const convo = conversations.find((c) => c.id === activeConvoId);
//     if (convo) setMessages(convo.messages);
//   }, [activeConvoId, conversations]);

//   const generateQueryFromNL = async (nl: string, parentMessage?: Message | null) => {
//     await new Promise((r) => setTimeout(r, 500));
//     const language: QueryLanguage = /brute|force|threshold/i.test(nl) ? "EQL" : "KQL";
//     let base = "";
//     if (/vpn/i.test(nl)) {
//       base = `@timestamp >= now-24h and (event.dataset:openvpn* or event.module:openvpn or event.action: \"vpn_connect\")`;
//     } else if (/failed logins|failed login|failed auth/i.test(nl)) {
//       base = `@timestamp >= now-24h and event.category:authentication and event.outcome:failure`;
//     } else if (/brute/i.test(nl)) {
//       base = `// brute-force detection skeleton`;
//     } else {
//       base = `@timestamp >= now-24h and (event.category:authentication or event.category:network)`;
//     }

//     let combined = base;
//     if (parentMessage?.query) {
//       combined = `// based on queryId:${parentMessage.queryId}\n(${parentMessage.query})\nAND (${base})`;
//     }

//     let generated = "";
//     if (language === "KQL") {
//       generated = `${combined}\n| stats count() by user.name, source.ip, event.outcome\n| sort -count`;
//     } else {
//       generated = combined;
//     }

//     return { query: generated, queryLanguage: language };
//   };

//   const validateQuery = (q: string) => {
//     const warnings: string[] = [];
//     if (!/source.ip|user.name|event.outcome|@timestamp/.test(q)) {
//       warnings.push("Query does not reference common fields (source.ip, user.name, @timestamp).");
//     }
//     const valid = warnings.length === 0;
//     const autofix = valid ? null : `${q}\n| fields @timestamp, user.name, source.ip, event.outcome`;
//     return { valid, warnings, autofix };
//   };

//   const runQuerySimulator = async (query: string) => {
//     const start = Date.now();
//     await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));
//     const total_hits = Math.floor(50 + Math.random() * 300);
//     const failed = Math.floor(total_hits * (0.6 + Math.random() * 0.3));
//     const success = total_hits - failed;
//     const top_source_ips = [
//       { ip: "198.51.100.22", count: Math.floor(10 + Math.random() * 40) },
//       { ip: "203.0.113.45", count: Math.floor(5 + Math.random() * 30) },
//       { ip: "192.0.2.12", count: Math.floor(2 + Math.random() * 20) },
//     ].slice(0, 3);

//     const rows = Array.from({ length: Math.min(8, Math.round(Math.random() * 8) + 3) }).map((_, i) => {
//       const ip = top_source_ips[i % top_source_ips.length].ip;
//       const user = ["alice", "bob", "diana", "eve", "frank"][i % 5] + "@example.com";
//       const outcome = Math.random() > 0.3 ? "failure" : "success";
//       const ts = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString();
//       return { "@timestamp": ts, "user.name": user, "source.ip": ip, "event.outcome": outcome };
//     });

//     const execution_ms = Date.now() - start;
//     return { total_hits, failed, success, execution_ms, top_source_ips, rows };
//   };

//   const createAssistantGeneratingMessage = (nl: string, parentId?: string | null) => {
//     const msgId = uid("msg_");
//     const msg: Message = {
//       id: msgId,
//       role: "assistant",
//       content: `Generating query for: "${nl}"`,
//       timestamp: new Date(),
//       status: "generating",
//       parentId: parentId ?? null,
//     };
//     setMessages((prev) => [...prev, msg]);
//     // also update conversations state
//     setConversations((prev) => prev.map((c) => (c.id === activeConvoId ? { ...c, messages: [...c.messages, msg] } : c)));
//     return msg;
//   };

//   const handleSend = async (chainToMessageId?: string | null) => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: uid("u_"),
//       role: "user",
//       content: input,
//       timestamp: new Date(),
//       status: "done",
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setConversations((prev) => prev.map((c) => (c.id === activeConvoId ? { ...c, messages: [...c.messages, userMessage] } : c)));

//     setInput("");
//     setDisabledInput(true);

//     const parentMsg = chainToMessageId ? messages.find((m) => m.id === chainToMessageId) ?? null : null;

//     const assistantMsg = createAssistantGeneratingMessage(userMessage.content, parentMsg?.id ?? null);

//     try {
//       const { query, queryLanguage } = await generateQueryFromNL(userMessage.content, parentMsg ?? null);
//       const validation = validateQuery(query);
//       const qid = uid("q_");

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === assistantMsg.id
//             ? {
//                 ...m,
//                 content: `I'll help you with "${userMessage.content}". Here's the generated query:`,
//                 query,
//                 queryLanguage,
//                 status: "ready",
//                 queryId: qid,
//                 entities: extractEntitiesFromQuery(query),
//                 validation,
//                 timestamp: new Date(),
//               }
//             : m
//         )
//       );

//       setConversations((prev) => prev.map((c) => (c.id === activeConvoId ? { ...c, messages: messages.concat([]).map((mm) => (mm.id === assistantMsg.id ? { ...mm, query, queryLanguage, status: "ready", queryId: qid, entities: extractEntitiesFromQuery(query), validation, content: `I'll help you with "${userMessage.content}". Here's the generated query:` } : mm)) } : c)));
//     } catch (e) {
//       setMessages((prev) => prev.map((m) => (m.id === assistantMsg.id ? { ...m, status: "error", content: "Failed to generate query" } : m)));
//     } finally {
//       setDisabledInput(false);
//     }
//   };

//   const extractEntitiesFromQuery = (q?: string) => {
//     if (!q) return undefined;
//     const ips = Array.from(q.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)).map((m) => m[0]);
//     const users = Array.from(q.matchAll(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi)).map((m) => m[0]);
//     const ts = Array.from(q.matchAll(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g)).map((m) => m[0]);
//     const ents: Entity[] = [];
//     ips.forEach((ip) => ents.push({ type: "ip", value: ip }));
//     users.forEach((u) => ents.push({ type: "user", value: u }));
//     ts.forEach((t) => ents.push({ type: "timestamp", value: t }));
//     return ents;
//   };

//   const handleRunQuery = async (messageId: string) => {
//     const message = messages.find((m) => m.id === messageId);
//     if (!message?.query) return;
//     setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "running" } : m)));

//     setTimeout(() => {
//       setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, content: `${m.content}\n\nExecuting query...` } : m)));
//     }, 120);

//     try {
//       const results = await runQuerySimulator(message.query);
//       setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, results, status: "done" } : m)));
//       setConversations((prev) => prev.map((c) => (c.id === activeConvoId ? { ...c, messages: prev.find((p) => p.id === activeConvoId)?.messages ?? messages } : c)));
//     } catch (e) {
//       setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "error" } : m)));
//     }
//   };

//   const handleCopyQuery = (query: string, messageId: string) => {
//     navigator.clipboard.writeText(query);
//     setCopiedQuery(messageId);
//     setTimeout(() => setCopiedQuery(null), 2000);
//   };

//   const handleCopyCommand = (cmd: string, messageId: string) => {
//     navigator.clipboard.writeText(cmd);
//     setCopiedCommand(messageId);
//     setTimeout(() => setCopiedCommand(null), 2000);
//   };

//   const handleDownloadCSV = (rows: any[], filename = "results.csv") => {
//     if (!rows || !rows.length) return;
//     const headers = Object.keys(rows[0]);
//     const csv = [headers.join(",")]
//       .concat(
//         rows.map((r) => headers.map((h) => {
//           const v = r[h];
//           if (typeof v === "string") return `"${String(v).replace(/"/g, '""')}"`;
//           return v === undefined || v === null ? "" : JSON.stringify(v);
//         }).join(","))
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

//   const handleReplayChain = (startMessageId: string) => {
//     // Demonstration helper: focus composer with a prefilled chain-aware prompt
//     const start = messages.find((m) => m.id === startMessageId);
//     if (!start) return;
//     setInput(`(chain-from:${startMessageId}) Analyze further: `);
//   };

//   const renderStatusPill = (status?: MessageStatus) => {
//     if (!status) return null;
//     const mapping: Record<MessageStatus, { text: string; classes: string }> = {
//       idle: { text: "idle", classes: "bg-gray-700 text-gray-300" },
//       generating: { text: "generating", classes: "bg-yellow-700 text-yellow-100" },
//       ready: { text: "ready", classes: "bg-blue-700 text-white" },
//       running: { text: "running", classes: "bg-indigo-700 text-white" },
//       done: { text: "done", classes: "bg-green-700 text-white" },
//       error: { text: "error", classes: "bg-red-700 text-white" },
//     };
//     const m = mapping[status];
//     return <span className={`text-[10px] px-2 py-0.5 rounded ${m.classes}`}>{m.text}</span>;
//   };

//   const renderEntity = (entity: Entity) => {
//     const colors = {
//       ip: "bg-blue-500/20 text-blue-300 border-blue-500/40",
//       user: "bg-green-500/20 text-green-300 border-green-500/40",
//       hash: "bg-purple-500/20 text-purple-300 border-purple-500/40",
//       timestamp: "bg-orange-500/20 text-orange-300 border-orange-500/40",
//       domain: "bg-pink-500/20 text-pink-300 border-pink-500/40",
//     } as Record<string, string>;

//     return (
//       <button
//         key={`${entity.type}-${entity.value}`}
//         onClick={() => setInput((prev) => `${prev}${entity.value} `)}
//         className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
//       >
//         <span className="text-[10px] uppercase mr-1 opacity-70">{entity.type}</span>
//         {entity.value}
//       </button>
//     );
//   };

//   // --- Layout ---
//   return (
//     <div className="flex h-screen bg-[#0f1115] text-gray-200">
//       {/* Sidebar */}
//       <aside className="w-72 border-r border-gray-800 p-4 flex flex-col gap-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">Conversations</h3>
//             <p className="text-xs text-gray-400">Manage chats & chains</p>
//           </div>
//           <button
//             className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300"
//             onClick={() => {
//               const newConvo: Conversation = { id: uid("convo_"), title: "New conversation", messages: [] };
//               setConversations((prev) => [newConvo, ...prev]);
//               setActiveConvoId(newConvo.id);
//               setMessages([]);
//             }}
//           >
//             New
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {conversations.map((c) => (
//             <div
//               key={c.id}
//               onClick={() => setActiveConvoId(c.id)}
//               className={`p-2 rounded cursor-pointer mb-2 ${c.id === activeConvoId ? "bg-gray-800/60 border border-gray-700" : "hover:bg-gray-800/30"}`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-medium">{c.title}</div>
//                 <div className="text-xs text-gray-400">{c.messages.length}</div>
//               </div>
//               <div className="text-xs text-gray-500 mt-1">Last: {c.messages.length ? c.messages[c.messages.length - 1].timestamp.toLocaleTimeString() : "—"}</div>
//             </div>
//           ))}
//         </div>

//         <div>
//           <div className="text-xs text-gray-400 mb-2">Quick actions</div>
//           <div className="flex gap-2">
//             <button
//               className="px-2 py-1 bg-gray-800 rounded text-xs"
//               onClick={() => {
//                 setInput("Show VPN attempts");
//               }}
//             >
//               VPN attempts
//             </button>
//             <button
//               className="px-2 py-1 bg-gray-800 rounded text-xs"
//               onClick={() => setInput("Narrow to failed logins only")}
//             >
//               Failed logins
//             </button>
//           </div>
//         </div>

//         <div className="text-xs text-gray-500">Tip: click a conversation to load its messages. Click any assistant message's "Show Query" to expand and "Run Query" to simulate results.</div>
//       </aside>

//       {/* Main pane */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-none px-6 py-3 border-b border-gray-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-semibold text-white">Security Assistant</h2>
//               <p className="text-sm text-gray-400 mt-0.5">AI-powered threat investigation — chained queries demo</p>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//           {messages.map((message) => (
//             <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
//               <div className={`max-w-3xl ${message.role === "user" ? "w-auto" : "w-full"}`}>
//                 <div className="flex items-center mb-2 space-x-2">
//                   <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"}`}>
//                     {message.role === "user" ? "U" : "AI"}
//                   </div>
//                   <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()} {message.queryId ? <span className="ml-2 text-[11px] font-mono text-gray-500">qid:{message.queryId}</span> : null}</span>
//                   <div className="ml-2">{renderStatusPill(message.status)}</div>
//                   {message.parentId ? <div className="ml-2 text-xs text-gray-400 italic">chained from {message.parentId}</div> : null}
//                 </div>

//                 <div className={`p-4 rounded-lg ${message.role === "user" ? "bg-blue-600/12 border border-blue-500/20" : "bg-gray-800/60 border border-gray-700"}`}>
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

//                   {message.entities && message.entities.length > 0 && (
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <p className="text-xs text-gray-400 mb-2">Detected entities:</p>
//                       <div className="flex flex-wrap">{message.entities.map(renderEntity)}</div>
//                     </div>
//                   )}

//                   {message.query && (
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center space-x-2">
//                           <Code size={14} className="text-gray-400" />
//                           <span className="text-xs font-semibold text-gray-300">Generated Query</span>
//                           <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-400">{message.queryLanguage}</span>
//                           {message.parentId ? <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 ml-2">based on previous query</span> : null}
//                         </div>

//                         <div className="flex items-center space-x-2">
//                           <button onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)} className="text-gray-400 hover:text-gray-300 transition-colors">{expandedQuery === message.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
//                         </div>
//                       </div>

//                       {expandedQuery === message.id && (
//                         <div className="relative">
//                           <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">{message.query}</pre>

//                           <div className="absolute top-2 right-2 flex items-center space-x-2">
//                             <button onClick={() => handleCopyQuery(message.query!, message.id)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors" title="Copy query">{copiedQuery === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}</button>
//                           </div>

//                           {message.validation && (!message.validation.valid || (message.validation.warnings && message.validation.warnings.length > 0)) && (
//                             <div className="mt-3 text-xs">
//                               {message.validation.warnings && message.validation.warnings.length > 0 && (
//                                 <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
//                                   <AlertTriangle size={14} className="text-yellow-300 mt-0.5" />
//                                   <div>
//                                     <div className="font-semibold text-yellow-200">Validation warnings</div>
//                                     {message.validation.warnings.map((w, i) => (
//                                       <div key={i} className="text-yellow-100 text-xs">• {w}</div>
//                                     ))}
//                                     {message.validation.autofix && (
//                                       <div className="mt-2"><button onClick={() => setMessages((prev) => prev.map((m) => m.id === message.id ? { ...m, query: m.validation?.autofix ?? m.query, validation: { valid: true, warnings: [] } } : m))} className="text-xs px-2 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-black">Apply Auto-fix</button></div>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       <div className="flex space-x-2 mt-3">
//                         <button onClick={() => handleRunQuery(message.id)} className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"><Play size={12} /><span>Run Query</span></button>

//                         <button onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors">{expandedQuery === message.id ? "Hide" : "Show Query"}</button>

//                         <button onClick={() => handleReplayChain(message.id)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors">Replay chain</button>
//                       </div>
//                     </div>
//                   )}

//                   {message.results && (
//                     <div className="mt-4 pt-4 border-t border-gray-700">
//                       <div className="bg-[#08090b] p-3 rounded font-mono text-xs border border-gray-800 shadow-sm">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center space-x-3">
//                             <div className="text-sm text-gray-300"> POST /_search</div>
//                             <div className="text-xs text-gray-500">queryId: {message.queryId}</div>
//                             <div className="text-xs text-gray-500 ml-2">{message.results.execution_ms} ms</div>
//                           </div>

//                           <div className="flex items-center space-x-2">
//                             <button title="Copy command" onClick={() => handleCopyCommand(`POST /_search\n${message.query?.slice(0, 500) ?? ""}`, message.id)} className="p-1 rounded bg-gray-800 hover:bg-gray-700">{copiedCommand === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}</button>

//                             <button onClick={() => handleDownloadCSV(message.results.rows, `results_${message.queryId ?? "export"}.csv`)} className="p-1 rounded bg-gray-800 hover:bg-gray-700" title="Download CSV"><Download size={14} className="text-gray-400" /></button>
//                           </div>
//                         </div>

//                         <div className="mb-2"><div className="text-xs text-gray-400">Summary: hits: <span className="font-semibold text-gray-200">{message.results.total_hits}</span> — failed: <span className="font-semibold text-red-300">{message.results.failed}</span> / success: <span className="font-semibold text-green-300">{message.results.success}</span></div></div>

//                         <div className="overflow-x-auto">
//                           <table className="min-w-full text-xs">
//                             <thead>
//                               <tr className="text-left text-gray-400">
//                                 {message.results.rows.length > 0 && Object.keys(message.results.rows[0]).map((h: string) => (<th key={h} className="pr-6 py-1">{h}</th>))}
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {message.results.rows.map((r: any, i: number) => (
//                                 <tr key={i} className="border-t border-gray-800">
//                                   {Object.keys(r).map((k: string) => (<td key={k} className="pr-6 py-2 text-gray-300 font-mono">{String(r[k])}</td>))}
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>

//                         <div className="mt-3 flex items-center space-x-2">
//                           <button onClick={() => {
//                             const reportMsg: Message = { id: uid("m_"), role: "assistant", content: `Detailed report will be generated (placeholder).`, timestamp: new Date(), status: "done" };
//                             setMessages((prev) => [...prev, reportMsg]);
//                           }} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"><Layers size={14} className="inline-block mr-1" /> Detailed Report</button>

//                           <div className="text-xs text-gray-400 ml-auto">Executed: {new Date().toLocaleString()}</div>
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
//               <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Ask about security events, run queries, or generate reports... (e.g., Show VPN attempts)" className="w-full bg-gray-900 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500" rows={3} disabled={disabledInput} />
//             </div>

//             <div className="flex flex-col items-end gap-2">
//               <button onClick={() => handleSend()} disabled={!input.trim() || disabledInput} className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors" title="Send"><Send size={20} /></button>
//               <div className="text-xs text-gray-500">Enter to send • Shift+Enter newline</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationalPaneWithSidebar;

/*
--- Demo notes (what to type in composer to see chaining) ---
1) Type and send: "Show VPN attempts"        --> assistant generates q_1
2) Type and send: "Narrow to failed logins only"   --> assistant generates q_2 (parent: q_1)
3) Type and send: "Analyze brute-force attempts (count >= 5)" --> assistant generates q_3 (parent: q_2)

How to explore:
- Click each assistant message's "Show Query" to inspect the generated query.
- Click "Run Query" to simulate execution and show results.
- Use the left sidebar to create / switch conversations.

This component is fully type-safe and mock-driven; adapt generator/runner hooks to integrate with a real backend.
*/
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Play,
  Code,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  Download,
  Layers,
  Plus,
  Loader,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { useRouter } from "next/navigation";

type QueryLanguage = "KQL" | "DSL" | "EQL";

interface Entity {
  type: "ip" | "user" | "hash" | "timestamp" | "domain";
  value: string;
}

type MessageStatus = "idle" | "generating" | "ready" | "running" | "done" | "error";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  query?: string;
  queryLanguage?: QueryLanguage;
  entities?: Entity[];
  timestamp: Date;
  status?: MessageStatus;
  queryId?: string;
  parentId?: string | null;
  validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
  results?: any;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const uid = (prefix = "") => `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}`;

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
      createdAt: new Date(),
    },
  ]);
  const [activeConvoId, setActiveConvoId] = useState<string>("convo_initial");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isgeneratingReport, setIsgeneratingReport] = useState<{ id: string, isGenerateing: boolean } | null>(null)

  const { setLogs } = useDashboard();
  const router = useRouter()


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

  const generateQueryFromNL = async (nl: string, parentMessage?: Message | null): Promise<{ query: string; queryLanguage: QueryLanguage }> => {
    // Simulate 5-10 second delay for query generation
    await new Promise((r) => setTimeout(r, 5000 + Math.random() * 5000));

    const language: QueryLanguage = "KQL";
    let baseQuery = "";
    let filters = "";

    // Detect intent
    if (/vpn/i.test(nl)) {
      baseQuery = `@timestamp >= now-24h and (event.dataset:openvpn* or event.module:openvpn or event.action:"vpn_connect")`;
      filters = `\n| stats count() by user.name, source.ip, event.outcome\n| sort -count`;
    } else if (/failed logins?|failed auth|failure/i.test(nl)) {
      if (parentMessage?.query) {
        baseQuery = `(${parentMessage.query.split('\n|')[0]})\nAND (event.outcome:"FAILURE")`;
      } else {
        baseQuery = `@timestamp >= now-24h and event.category:authentication and event.outcome:"FAILURE"`;
      }
      filters = `\n| stats count() by user.name, source.ip\n| sort -count`;
    } else if (/firewall/i.test(nl)) {
      baseQuery = `@timestamp >= now-24h and (event.dataset:firewall* or event.module:firewall)`;
      filters = `\n| stats count() by source.ip, dest.ip, event.outcome\n| sort -count`;
    } else if (/brute.?force/i.test(nl)) {
      if (parentMessage?.query) {
        baseQuery = `(${parentMessage.query.split('\n|')[0]})\n| stats count() by source.ip, user.name\n| where count >= 5\n| sort -count`;
        filters = "";
      } else {
        baseQuery = `@timestamp >= now-24h and event.category:authentication and event.outcome:"FAILURE"`;
        filters = `\n| stats count() by source.ip, user.name\n| where count >= 5\n| sort -count`;
      }
    } else {
      baseQuery = `@timestamp >= now-24h and (event.category:authentication or event.category:network)`;
      filters = `\n| stats count() by user.name, source.ip, event.outcome\n| sort -count`;
    }

    let finalQuery = baseQuery + filters;

    if (parentMessage?.queryId && parentMessage.query && !finalQuery.includes(parentMessage.query.split('\n|')[0])) {
      finalQuery = `// based on queryId: ${parentMessage.queryId}\n${finalQuery}`;
    }

    return { query: finalQuery, queryLanguage: language };
  };

  const validateQuery = (q: string) => {
    const warnings: string[] = [];
    if (!/source\.ip|user\.name|event\.outcome|@timestamp/.test(q)) {
      warnings.push("Query does not reference common fields (source.ip, user.name, @timestamp).");
    }
    if (q.length < 30) {
      warnings.push("Query appears too short or incomplete.");
    }
    const valid = warnings.length === 0;
    const autofix = valid ? null : `${q}\n| fields @timestamp, user.name, source.ip, event.outcome`;
    return { valid, warnings, autofix };
  };

  // const generateMockLogs = (queryType: string, failureOnly: boolean = false) => {
  //   const users = ["john", "admin", "neha", "raj", "alice", "bob", "diana"];
  //   const ips = ["192.168.1.45", "203.0.113.22", "14.192.32.101", "172.16.2.44", "198.51.100.33"];
  //   const outcomes = failureOnly ? ["FAILURE"] : ["SUCCESS", "FAILURE"];

  //   const numLogs = 4 + Math.floor(Math.random() * 8);
  //   const logs = [];

  //   for (let i = 0; i < numLogs; i++) {
  //     const minutesAgo = Math.floor(Math.random() * 1440); // within 24h
  //     logs.push({
  //       "@timestamp": generateRealisticTimestamp(minutesAgo),
  //       "event.dataset": queryType === "vpn" ? "openvpn" : queryType === "firewall" ? "firewall" : "authentication",
  //       "user.name": users[Math.floor(Math.random() * users.length)],
  //       "source.ip": ips[Math.floor(Math.random() * ips.length)],
  //       "event.outcome": outcomes[Math.floor(Math.random() * outcomes.length)],
  //     });
  //   }

  //   return logs.sort((a, b) => new Date(b["@timestamp"]).getTime() - new Date(a["@timestamp"]).getTime());
  // };

  // let previousNumLogs: number | null = null;

  // const generateMockLogs = (queryType: string, failureOnly: boolean = false) => {
  //   const users = ["john", "admin", "neha", "raj", "alice", "bob", "diana"];
  //   const ips = ["192.168.1.45", "203.0.113.22", "14.192.32.101", "172.16.2.44", "198.51.100.33"];
  //   const outcomes = failureOnly ? ["FAILURE"] : ["SUCCESS", "FAILURE"];

  //   // Generate a random number between 15 and 30
  //   let numLogs = 15 + Math.floor(Math.random() * 16); // 15 to 30 inclusive

  //   // If previousNumLogs exists, cap the current numLogs to it
  //   if (previousNumLogs !== null && numLogs > previousNumLogs) {
  //     numLogs = previousNumLogs;
  //   }

  //   previousNumLogs = numLogs; // save for next call

  //   const logs = [];

  //   for (let i = 0; i < numLogs; i++) {
  //     const minutesAgo = Math.floor(Math.random() * 1440); // within 24h
  //     logs.push({
  //       "@timestamp": generateRealisticTimestamp(minutesAgo),
  //       "event.dataset": queryType === "vpn" ? "openvpn" : queryType === "firewall" ? "firewall" : "authentication",
  //       "user.name": users[Math.floor(Math.random() * users.length)],
  //       "source.ip": ips[Math.floor(Math.random() * ips.length)],
  //       "event.outcome": outcomes[Math.floor(Math.random() * outcomes.length)],
  //     });
  //   }

  //   return logs.sort((a, b) => new Date(b["@timestamp"]).getTime() - new Date(a["@timestamp"]).getTime());
  // };

  let previousNumLogs: number | null = null;

  // Helper function to generate realistic timestamp
  const generateRealisticTimestamp = (minutesAgo: number): string => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);
    return timestamp.toISOString();
  };

  // Helper function to pick a random element
  const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  const generateMockLogs = (queryType: string, failureOnly: boolean = false) => {
    const users = ["john", "admin", "neha", "raj", "alice", "bob", "diana"];
    const ips = ["192.168.1.45", "203.0.113.22", "14.192.32.101", "172.16.2.44", "198.51.100.33"];
    const outcomes = failureOnly ? ["FAILURE"] : ["SUCCESS", "FAILURE"];
    const destinations = ["server1", "server2", "server3", "server4"];
    const severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const eventTypes = ["login", "file_access", "malware", "network"];
    const devices = ["endpoint1", "endpoint2", "endpoint3"];
    const osList = ["Windows 10", "Ubuntu 22.04", "macOS Ventura", "CentOS 9"];
    const geoLocations = {
      "192.168.1.45": { city: "Mumbai", country: "India" },
      "203.0.113.22": { city: "New York", country: "USA" },
      "14.192.32.101": { city: "Bangalore", country: "India" },
      "172.16.2.44": { city: "London", country: "UK" },
      "198.51.100.33": { city: "Berlin", country: "Germany" },
    };

    // Generate a random number between 15 and 30
    let numLogs = 15 + Math.floor(Math.random() * 16);

    console.log(previousNumLogs);


    if (previousNumLogs !== null && numLogs > previousNumLogs) {
      numLogs = previousNumLogs;
    }

    previousNumLogs = numLogs;

    const logs = [];

    for (let i = 0; i < numLogs; i++) {
      const minutesAgo = Math.floor(Math.random() * 1440); // within last 24h
      const srcIp = pickRandom(ips);

      logs.push({
        "@timestamp": generateRealisticTimestamp(minutesAgo),
        "event.dataset": queryType === "vpn" ? "openvpn" : queryType === "firewall" ? "firewall" : "authentication",
        "user.name": pickRandom(users),
        "source.ip": srcIp,
        "destination.system": pickRandom(destinations),
        "event.outcome": pickRandom(outcomes),
        "event.severity": pickRandom(severities),
        "event.type": pickRandom(eventTypes),
        "device.id": pickRandom(devices),
        "device.os": pickRandom(osList),
        "geo.city": geoLocations[srcIp].city,
        "geo.country": geoLocations[srcIp].country,
      });
    }

    return logs.sort(
      (a, b) => new Date(b["@timestamp"]).getTime() - new Date(a["@timestamp"]).getTime()
    );
  };

  // Example usage
  // console.log(generateMockLogs("vpn"));


  const runQuerySimulator = async (query: string, queryType: string) => {
    // Simulate 20-30 second execution delay
    await new Promise((r) => setTimeout(r, 20000 + Math.random() * 10000));

    const failureOnly = /FAILURE/.test(query);
    const rows = generateMockLogs(queryType, failureOnly);

    const total_hits = rows.length;
    const failed = rows.filter((r) => r["event.outcome"] === "FAILURE").length;
    const success = total_hits - failed;

    const ipCounts: Record<string, number> = {};
    rows.forEach((r) => {
      ipCounts[r["source.ip"]] = (ipCounts[r["source.ip"]] || 0) + 1;
    });

    const suspiciousIPs = Object.entries(ipCounts)
      .filter(([_, count]) => count >= 3)
      .map(([ip]) => ip);

    return {
      total_hits,
      failed,
      success,
      execution_ms: 20234 + Math.floor(Math.random() * 5000),
      rows,
      suspicious_ips: suspiciousIPs,
    };
  };

  const extractEntitiesFromQuery = (q?: string) => {
    if (!q) return undefined;
    const ips = Array.from(q.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)).map((m) => m[0]);
    const users = Array.from(q.matchAll(/\b[a-z0-9._%+-]+@?[a-z0-9.-]*\b/gi)).map((m) => m[0]);
    const ents: Entity[] = [];
    [...new Set(ips)].forEach((ip) => ents.push({ type: "ip", value: ip }));
    [...new Set(users)].slice(0, 3).forEach((u) => ents.push({ type: "user", value: u }));
    return ents.length > 0 ? ents : undefined;
  };

  const determineQueryType = (query: string): string => {
    if (/openvpn|vpn/i.test(query)) return "vpn";
    if (/firewall/i.test(query)) return "firewall";
    return "auth";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uid("u_"),
      role: "user",
      content: input,
      timestamp: new Date(),
      status: "done",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateConversationMessages(newMessages);

    const userInput = input;
    setInput("");
    setDisabledInput(true);

    // Find if this is a chained query
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant" && m.query);
    const isChained = lastAssistantMsg && /filter|narrow|only|brute/i.test(userInput);

    const assistantMsgId = uid("a_");
    const generatingMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: `Generating query for: "${userInput}"${isChained ? " (chaining from previous query)" : ""}`,
      timestamp: new Date(),
      status: "generating",
      parentId: isChained ? lastAssistantMsg.id : null,
    };

    const withGenerating = [...newMessages, generatingMsg];
    setMessages(withGenerating);
    updateConversationMessages(withGenerating);

    try {
      const { query, queryLanguage } = await generateQueryFromNL(
        userInput,
        isChained ? lastAssistantMsg : null
      );
      const validation = validateQuery(query);
      const qid = uid("q_");

      const readyMsg: Message = {
        ...generatingMsg,
        content: `I'll help you with "${userInput}". Here's the generated Elastic KQL query:`,
        query,
        queryLanguage,
        status: "ready",
        queryId: qid,
        entities: extractEntitiesFromQuery(query),
        validation,
        timestamp: new Date(),
      };

      const withReady = withGenerating.map((m) => (m.id === assistantMsgId ? readyMsg : m));
      setMessages(withReady);
      updateConversationMessages(withReady);
    } catch (e) {
      const errorMsg = withGenerating.map((m) =>
        m.id === assistantMsgId ? { ...m, status: "error" as MessageStatus, content: "Failed to generate query" } : m
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

    const queryType = determineQueryType(message.query);

    const runningMsgs = messages.map((m) =>
      m.id === messageId ? { ...m, status: "running" as MessageStatus } : m
    );
    setMessages(runningMsgs);
    updateConversationMessages(runningMsgs);

    setTimeout(() => {
      const withExecuting = messages.map((m) =>
        m.id === messageId ? { ...m, content: `${m.content}`,status:"running"as MessageStatus } : m
      );
      setMessages(withExecuting);
      updateConversationMessages(withExecuting);
    }, 500);

    try {
      const results = await runQuerySimulator(message.query, queryType);
      const doneMsgs = messages.map((m) =>
        m.id === messageId ? { ...m, results, status: "done" as MessageStatus } : m
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
    navigator.clipboard.writeText(query);
    setCopiedQuery(messageId);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleCopyCommand = (cmd: string, messageId: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(messageId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleDownloadCSV = (rows: any[], filename = "results.csv") => {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(",")]
      .concat(
        rows.map((r) =>
          headers
            .map((h) => {
              const v = r[h];
              if (typeof v === "string") return `"${String(v).replace(/"/g, '""')}"`;
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
      generating: { text: "generating", classes: "bg-yellow-700 text-yellow-100 animate-pulse" },
      ready: { text: "ready", classes: "bg-blue-700 text-white" },
      running: { text: "running", classes: "bg-indigo-700 text-white animate-pulse" },
      done: { text: "done", classes: "bg-green-700 text-white" },
      error: { text: "error", classes: "bg-red-700 text-white" },
    };
    const m = mapping[status];
    return <span className={`text-[10px] px-2 py-0.5 rounded ${m.classes}`}>{m.text}</span>;
  };

  const renderEntity = (entity: Entity) => {
    const colors = {
      ip: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      user: "bg-green-500/20 text-green-300 border-green-500/40",
      hash: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      timestamp: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      domain: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    } as Record<string, string>;

    return (
      <button
        key={`${entity.type}-${entity.value}`}
        onClick={() => setInput((prev) => `${prev}${entity.value} `)}
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
      >
        <span className="text-[10px] uppercase mr-1 opacity-70">{entity.type}</span>
        {entity.value}
      </button>
    );
  };

  const createNewConversation = () => {
    const newConvo: Conversation = {
      id: uid("convo_"),
      title: "New Investigation",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveConvoId(newConvo.id);
    setMessages([]);
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
              className={`p-3 rounded cursor-pointer transition-colors ${c.id === activeConvoId
                ? "bg-gray-800/80 border border-emerald-500/30"
                : "hover:bg-gray-800/40 border border-transparent"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium truncate">{c.title}</div>
                <div className="text-xs text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">{c.messages.length}</div>
              </div>
              <div className="text-xs text-gray-500">
                {c.messages.length
                  ? `Last: ${c.messages[c.messages.length - 1].timestamp.toLocaleTimeString()}`
                  : "Empty conversation"}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="text-xs text-gray-400 mb-2">Quick Prompts</div>
          <div className="space-y-2">
            <button
              className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-left transition-colors"
              onClick={() => setInput("Show VPN attempts")}
            >
              🔐 Show VPN attempts
            </button>
            <button
              className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-left transition-colors"
              onClick={() => setInput("Show firewall alerts")}
            >
              🛡️ Firewall alerts
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
          💡 Tip: Follow-up queries automatically chain to previous results
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="flex-none px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-emerald-900/10 to-blue-900/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Security Assistant</h2>
              <p className="text-sm text-gray-400 mt-1">
                AI-powered SIEM investigation • Elastic KQL • Query chaining
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded">
              {conversations.find((c) => c.id === activeConvoId)?.title}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Start Your Investigation</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Ask me to search for security events, analyze logs, or generate Elastic KQL queries.
                </p>
                <div className="text-xs text-gray-500">
                  Try: "Show VPN attempts" or "Show firewall alerts"
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-3xl ${message.role === "user" ? "w-auto" : "w-full"}`}>
                <div className="flex items-center mb-2 space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                      }`}
                  >
                    {message.role === "user" ? "U" : "AI"}
                  </div>
                  <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
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
                  className={`p-4 rounded-lg ${message.role === "user"
                    ? "bg-blue-600/12 border border-blue-500/20"
                    : "bg-gray-800/60 border border-gray-700"
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                  

                  {message.query && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Code size={14} className="text-emerald-400" />
                          <span className="text-xs font-semibold text-gray-300">Generated Query</span>
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
                          onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {expandedQuery === message.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {expandedQuery === message.id && (
                        <div className="relative">
                          <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-emerald-300 overflow-x-auto border border-gray-700">
                            {message.query}
                          </pre>

                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleCopyQuery(message.query!, message.id)}
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
                              (message.validation.warnings && message.validation.warnings.length > 0)) && (
                              <div className="mt-3">
                                <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
                                  <AlertTriangle size={14} className="text-yellow-300 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-yellow-200 text-xs">Validation warnings</div>
                                    {message.validation.warnings?.map((w, i) => (
                                      <div key={i} className="text-yellow-100 text-xs mt-1">
                                        • {w}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleRunQuery(message.id)}
                          disabled={message.status === "running"}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                        >
                          <Play size={12} />
                          <span>{message.status === "running" ? "Running..." : "Run Query"}</span>
                        </button>

                        <button
                          onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
                        >
                          {expandedQuery === message.id ? "Hide" : "Show"} Query
                        </button>
                      </div>
                    </div>
                  )}

                  {message.results && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="bg-[#08090b] p-4 rounded border border-emerald-900/30 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-mono text-emerald-400">POST /_search</div>
                            <div className="text-xs text-gray-500">qid: {message.queryId}</div>
                            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                              {message.results.execution_ms} ms
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleCopyCommand(`POST /_search\n${message.query?.slice(0, 500) ?? ""}`, message.id)
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
                                handleDownloadCSV(message.results.rows, `results_${message.queryId ?? "export"}.csv`)
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
                            Total hits: <span className="font-semibold text-white">{message.results.total_hits}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Failed: <span className="font-semibold text-red-400">{message.results.failed}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Success: <span className="font-semibold text-green-400">{message.results.success}</span>
                          </div>
                          {message.results.suspicious_ips && message.results.suspicious_ips.length > 0 && (
                            <div className="text-xs text-orange-400 bg-orange-900/20 px-2 py-1 rounded">
                              ⚠️ Potential brute-force: {message.results.suspicious_ips.join(", ")}
                            </div>
                          )}
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs">
                            <thead>
                              <tr className="text-left text-gray-400 border-b border-gray-800">
                                {message.results.rows.length > 0 &&
                                  Object.keys(message.results.rows[0]).map((h: string) => (
                                    <th key={h} className="pr-6 py-2 font-semibold">
                                      {h}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {message.results.rows.map((r: any, i: number) => (
                                <tr key={i} className="border-t border-gray-800 hover:bg-gray-800/30">
                                  {Object.keys(r).map((k: string) => (
                                    <td key={k} className="pr-6 py-2 text-gray-300 font-mono">
                                      {k === "event.outcome" ? (
                                        <span
                                          className={`px-2 py-0.5 rounded text-xs ${r[k] === "FAILURE"
                                            ? "bg-red-900/30 text-red-300"
                                            : "bg-green-900/30 text-green-300"
                                            }`}
                                        >
                                          {String(r[k])}
                                        </span>
                                      ) : (
                                        String(r[k])
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Executed: {new Date().toLocaleString()}
                          </div>
                          <button
                            onClick={() => {
                              setIsgeneratingReport({ id: message.id, isGenerateing: false })

                              setTimeout(() => {
                                console.log(message.results.rows);
                                
                                setLogs(message.results.rows)
                                router.push("/report/1")
                                setIsgeneratingReport(null)
                              }, 2000)
                            }}
                            className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                          >
                            <Layers size={14} className="inline-block mr-1" />
                            {isgeneratingReport?.id === message.id ? "Generating Report..." : ("Generate Report")}
                          </button>
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
                  <div className="text-xs text-gray-400 animate-pulse">Generating query...</div>
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

          <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
            <span className="bg-gray-800 px-2 py-1 rounded">⏱️ Query generation: 5-10s</span>
            <span className="bg-gray-800 px-2 py-1 rounded">⏱️ Execution: 20-30s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalPaneWithSidebar;