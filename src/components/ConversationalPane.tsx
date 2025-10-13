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
  CheckCircle,
  AlertTriangle,
  Download,
  Layers,
  RefreshCw,
} from "lucide-react";

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
  queryId?: string; // unique id for generated queries
  parentId?: string | null; // chain parent
  validation?: { valid: boolean; warnings?: string[]; autofix?: string | null };
  results?: any; // shape returned by runQuerySimulator
}

const ConversationalPane: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to Supernova Security Assistant. I can help you investigate security events, run queries, and generate reports. Ask me something like: 'Show VPN attempts'",
      timestamp: new Date(),
      status: "done",
    },
  ]);
  const [input, setInput] = useState("");
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [generatingIds, setGeneratingIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "Investigate failed logins",
    "Show VPN attempts",
    "Generate monthly malware report",
    "Detect brute force attacks",
  ];

  // Helper: Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Utility: generate a pseudo-unique id
  const uid = (prefix = "") => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

  /**
   * Mock: Convert natural language into a query
   * In real integration you'd call a server-side model or generator here.
   */
  const generateQueryFromNL = async (nl: string, parentMessage?: Message | null) => {
    // Slight artificial delays
    await new Promise((r) => setTimeout(r, 700));

    // Basic heuristics to pick language
    const language: QueryLanguage = /brute|force|threshold/i.test(nl) ? "EQL" : "KQL";

    // Base query from NL (very simple mapping)
    let base = "";
    if (/vpn/i.test(nl)) {
      base = `@timestamp >= now-24h and (event.dataset:openvpn* or event.module:openvpn or event.action: "vpn_connect")`;
    } else if (/failed logins|failed login|failed auth/i.test(nl)) {
      base = `@timestamp >= now-24h and event.category:authentication and event.outcome:failure`;
    } else if (/brute/i.test(nl)) {
      base = `// brute-force detection skeleton`;
    } else {
      base = `@timestamp >= now-24h and (event.category:authentication or event.category:network)`;
    }

    // If chaining from a parent, include parent's query as a base
    let combined = base;
    if (parentMessage?.query) {
      combined = `// based on queryId:${parentMessage.queryId}\n(${parentMessage.query})\nAND (${base})`;
    }

    // Example generated KQL snippet (or EQL)
    let generated = "";
    if (language === "KQL") {
      generated = `${combined}\n| stats count() by user.name, source.ip, event.outcome\n| sort -count`;
    } else if (language === "EQL") {
      generated = `${combined}\nsequence by source.ip\n  [ event.category == "authentication" and event.outcome == "failure" ]\n  where max_span = 10m\n  // consider threshold >= 5`;
    } else {
      generated = combined;
    }

    return {
      query: generated,
      queryLanguage: language,
    };
  };

  /**
   * Mock: Validate query for common issues
   */
  const validateQuery = (q: string) => {
    const warnings: string[] = [];
    if (!/source.ip|user.name|event.outcome|@timestamp/.test(q)) {
      warnings.push("Query does not reference common fields (source.ip, user.name, @timestamp).");
    }
    if (/event.module:openvpn/.test(q) && /openvpn/i.test(q) === false) {
      // silly example
    }
    const valid = warnings.length === 0;
    // Provide a naive autofix example
    const autofix = valid ? null : `${q}\n| fields @timestamp, user.name, source.ip, event.outcome`;
    return { valid, warnings, autofix };
  };

  /**
   * Mock executor: returns hits, execution time, top ips etc.
   * Replace this with real API call to Elastic / Wazuh later.
   */
  const runQuerySimulator = async (query: string) => {
    const start = Date.now();
    // artificial execution delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

    // Very small mock "parser" to decide outputs
    const total_hits = Math.floor(50 + Math.random() * 300);
    const failed = Math.floor(total_hits * (0.6 + Math.random() * 0.3));
    const success = total_hits - failed;

    const top_source_ips = [
      { ip: "198.51.100.22", count: Math.floor(10 + Math.random() * 40) },
      { ip: "203.0.113.45", count: Math.floor(5 + Math.random() * 30) },
      { ip: "192.0.2.12", count: Math.floor(2 + Math.random() * 20) },
    ].slice(0, 3);

    // create rows sample
    const rows = Array.from({ length: Math.min(8, Math.round(Math.random() * 8) + 3) }).map((_, i) => {
      const ip = top_source_ips[i % top_source_ips.length].ip;
      const user = ["alice", "bob", "diana", "eve", "frank"][i % 5] + "@example.com";
      const outcome = Math.random() > 0.3 ? "failure" : "success";
      const ts = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString();
      return { "@timestamp": ts, "user.name": user, "source.ip": ip, "event.outcome": outcome };
    });

    const execution_ms = Date.now() - start;

    // Return a structured mock result
    return {
      total_hits,
      failed,
      success,
      execution_ms,
      top_source_ips,
      rows,
      time_series: Array.from({ length: 8 }).map((_, i) => ({ t: i, count: Math.floor(1 + Math.random() * 20) })),
    };
  };

  // Create assistant message that will generate a query
  const createAssistantGeneratingMessage = (nl: string, parentId?: string | null) => {
    const msgId = uid("msg_");
    const msg: Message = {
      id: msgId,
      role: "assistant",
      content: `Generating query for: "${nl}"`,
      timestamp: new Date(),
      status: "generating",
      parentId: parentId ?? null,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  // Main handler: user sends input
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uid("u_"),
      role: "user",
      content: input,
      timestamp: new Date(),
      status: "done",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setDisabledInput(true);

    // Create assistant "generating" placeholder
    const assistantMsg = createAssistantGeneratingMessage(userMessage.content, null);
    setGeneratingIds((g) => ({ ...g, [assistantMsg.id]: true }));

    try {
      // Generate query
      const { query, queryLanguage } = await generateQueryFromNL(userMessage.content, null);
      const validation = validateQuery(query);

      // Update assistant message into ready state with generated query
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                content: `I'll help you with "${userMessage.content}". Here's the generated query:`,
                query,
                queryLanguage,
                status: "ready",
                queryId: uid("q_"),
                entities: extractEntitiesFromQuery(query),
                validation,
                timestamp: new Date(),
              }
            : m
        )
      );
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsg.id ? { ...m, status: "error", content: "Failed to generate query" } : m))
      );
    } finally {
      setDisabledInput(false);
      setGeneratingIds((g) => {
        const copy = { ...g };
        delete copy[assistantMsg.id];
        return copy;
      });
    }
  };

  // Extract rudimentary entities from query string for demo purposes
  const extractEntitiesFromQuery = (q?: string) => {
    if (!q) return undefined;
    const ips = Array.from(q.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)).map((m) => m[0]);
    const users = Array.from(q.matchAll(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi)).map((m) => m[0]);
    const ts = Array.from(q.matchAll(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g)).map((m) => m[0]);
    const ents: Entity[] = [];
    ips.forEach((ip) => ents.push({ type: "ip", value: ip }));
    users.forEach((u) => ents.push({ type: "user", value: u }));
    ts.forEach((t) => ents.push({ type: "timestamp", value: t }));
    return ents;
  };

  // Handle running a query for a specific assistant message
  const handleRunQuery = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message?.query) return;

    // update status to running
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "running" } : m)));

    // Small console-like "command" line to show immediately
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                content: `${m.content}\n\nExecuting query...`,
              }
            : m
        )
      );
    }, 120);

    try {
      const results = await runQuerySimulator(message.query);
      // Update message with results
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                results,
                status: "done",
                // append short summary into content for clarity
                content: `${m.content}`,
              }
            : m
        )
      );
    } catch (e) {
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status: "error" } : m)));
    }
  };

  // Copy query text
  const handleCopyQuery = (query: string, messageId: string) => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(messageId);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  // Copy command text
  const handleCopyCommand = (cmd: string, messageId: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(messageId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  // Download results as CSV
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

  // Chain action: analyze brute-force attempts using previous message's query as base
  const handleChainBruteforce = async (parentMessageId: string) => {
    const parent = messages.find((m) => m.id === parentMessageId);
    if (!parent || !parent.query) return;

    // Create assistant generating message with parent reference
    const genMsg = createAssistantGeneratingMessage(`Analyze brute-force attempts`, parentMessageId);
    setGeneratingIds((g) => ({ ...g, [genMsg.id]: true }));

    try {
      const { query, queryLanguage } = await generateQueryFromNL("analyze brute force", parent);
      const validation = validateQuery(query);

      // Build a brute-force focused query (override to be explicit)
      const bruteQuery =
        `// based on queryId:${parent.queryId}\n(${parent.query})\n// brute-force: count failures by source.ip and user\n| stats count() by source.ip, user.name\n| where count >= 5\n| sort -count`;

      const qid = uid("q_");

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === genMsg.id
              ? {
                  ...m,
                  content: `Generating brute-force detection query using previous query (queryId: ${parent.queryId})`,
                  query: bruteQuery,
                  queryLanguage: "KQL",
                  status: "ready",
                  queryId: qid,
                  parentId: parent.id,
                  validation,
                  timestamp: new Date(),
                }
              : m
          )
        );
      }, 250);
    } catch (e) {
      setMessages((prev) => prev.map((m) => (m.id === genMsg.id ? { ...m, status: "error", content: "Failed to generate chained query" } : m)));
    } finally {
      setGeneratingIds((g) => {
        const copy = { ...g };
        delete copy[genMsg.id];
        return copy;
      });
    }
  };

  // Reuse a previous query into input (copy into composer)
  const handleReuseQuery = (messageId: string) => {
    const m = messages.find((mm) => mm.id === messageId);
    if (!m?.query) return;
    setInput((prev) => `${m.query}\n\n`);
    // focus not handled but user can edit and send
  };

  const handleEntityClick = (entity: Entity) => {
    // small demo action — in app you'd open a detail panel
    console.log("Entity clicked:", entity);
    // Optionally insert into input as filter
    setInput((prev) => `${prev}${entity.value} `);
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
        onClick={() => handleEntityClick(entity)}
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${colors[entity.type]} hover:brightness-110 transition-all mr-2 mb-2`}
      >
        <span className="text-[10px] uppercase mr-1 opacity-70">{entity.type}</span>
        {entity.value}
      </button>
    );
  };

  // Small UI helpers to render status pill
  const renderStatusPill = (status?: MessageStatus) => {
    if (!status) return null;
    const mapping: Record<MessageStatus, { text: string; classes: string }> = {
      idle: { text: "idle", classes: "bg-gray-700 text-gray-300" },
      generating: { text: "generating", classes: "bg-yellow-700 text-yellow-100" },
      ready: { text: "ready", classes: "bg-blue-700 text-white" },
      running: { text: "running", classes: "bg-indigo-700 text-white" },
      done: { text: "done", classes: "bg-green-700 text-white" },
      error: { text: "error", classes: "bg-red-700 text-white" },
    };
    const m = mapping[status];
    return <span className={`text-xs px-2 py-0.5 rounded ${m.classes}`}>{m.text}</span>;
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f1115] text-gray-200">
      {/* Header */}
      <div className="flex-none px-6 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Security Assistant</h2>
            <p className="text-sm text-gray-400 mt-0.5">AI-powered threat investigation — demo mode (mock data)</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-400">Model:</div>
            <div className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">claude-sonnet-4.5</div>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex-none px-6 py-3 border-b border-gray-800">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInput(prompt)}
              disabled={disabledInput}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-3xl ${message.role === "user" ? "w-auto" : "w-full"}`}>
              {/* Header */}
              <div className="flex items-center mb-2 space-x-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                  }`}
                >
                  {message.role === "user" ? "U" : "AI"}
                </div>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()} {message.queryId ? <span className="ml-2 text-[11px] font-mono text-gray-500">qid:{message.queryId}</span> : null}
                </span>
                <div className="ml-2">{renderStatusPill(message.status)}</div>
                {message.parentId ? <div className="ml-2 text-xs text-gray-400 italic">chained</div> : null}
              </div>

              {/* Content Card */}
              <div
                className={`p-4 rounded-lg ${message.role === "user" ? "bg-blue-600/12 border border-blue-500/20" : "bg-gray-800/60 border border-gray-700"}`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                {/* Entities */}
                {message.entities && message.entities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Detected entities:</p>
                    <div className="flex flex-wrap">{message.entities.map(renderEntity)}</div>
                  </div>
                )}

                {/* Query block */}
                {message.query && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Code size={14} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-300">Generated Query</span>
                        <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-400">{message.queryLanguage}</span>
                        {message.parentId ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 ml-2">based on previous query</span>
                        ) : null}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReuseQuery(message.id)}
                          className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                          title="Reuse this query in composer"
                        >
                          Reuse
                        </button>

                        <button
                          onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {expandedQuery === message.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {expandedQuery === message.id && (
                      <div className="relative">
                        <pre className="bg-[#06070a] p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">
                          {message.query}
                        </pre>

                        <div className="absolute top-2 right-2 flex items-center space-x-2">
                          <button
                            onClick={() => handleCopyQuery(message.query!, message.id)}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                            title="Copy query"
                          >
                            {copiedQuery === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
                          </button>
                        </div>

                        {/* Validation warnings */}
                        {message.validation && (!message.validation.valid || (message.validation.warnings && message.validation.warnings.length > 0)) && (
                          <div className="mt-3 text-xs">
                            {message.validation.warnings && message.validation.warnings.length > 0 && (
                              <div className="flex items-start space-x-2 bg-yellow-900/30 border border-yellow-700 rounded p-2">
                                <AlertTriangle size={14} className="text-yellow-300 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-yellow-200">Validation warnings</div>
                                  {message.validation.warnings.map((w, i) => (
                                    <div key={i} className="text-yellow-100 text-xs">
                                      • {w}
                                    </div>
                                  ))}
                                  {message.validation.autofix && (
                                    <div className="mt-2">
                                      <button
                                        onClick={() =>
                                          setMessages((prev) =>
                                            prev.map((m) =>
                                              m.id === message.id ? { ...m, query: m.validation?.autofix ?? m.query, validation: { valid: true, warnings: [] } } : m
                                            )
                                          )
                                        }
                                        className="text-xs px-2 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-black"
                                      >
                                        Apply Auto-fix
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Query actions */}
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleRunQuery(message.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                      >
                        <Play size={12} />
                        <span>Run Query</span>
                      </button>

                      <button
                        onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
                      >
                        {expandedQuery === message.id ? "Hide" : "Explain Query"}
                      </button>

                      {/* Chain action: analyze brute force */}
                      <button
                        onClick={() => handleChainBruteforce(message.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded transition-colors"
                      >
                        Analyze brute-force attempts
                      </button>
                    </div>
                  </div>
                )}

                {/* Execution Results / Terminal-like block */}
                {message.results && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="bg-[#08090b] p-3 rounded font-mono text-xs border border-gray-800 shadow-sm">
                      {/* Command header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm text-gray-300"> POST /_search</div>
                          <div className="text-xs text-gray-500">queryId: {message.queryId}</div>
                          <div className="text-xs text-gray-500 ml-2">{message.results.execution_ms} ms</div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            title="Copy command"
                            onClick={() =>
                              handleCopyCommand(
                                `POST /_search\n${message.query?.slice(0, 500) ?? ""}`,
                                message.id
                              )
                            }
                            className="p-1 rounded bg-gray-800 hover:bg-gray-700"
                          >
                            {copiedCommand === message.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
                          </button>

                          <button
                            onClick={() => handleDownloadCSV(message.results.rows, `results_${message.queryId ?? "export"}.csv`)}
                            className="p-1 rounded bg-gray-800 hover:bg-gray-700"
                            title="Download CSV"
                          >
                            <Download size={14} className="text-gray-400" />
                          </button>

                          <button
                            onClick={() => {
                              // spawn a report placeholder message (user action)
                              const reportMsg: Message = {
                                id: uid("m_"),
                                role: "assistant",
                                content: `Detailed report will be generated (placeholder). Use the "Detailed Report" button to render charts.`,
                                timestamp: new Date(),
                                status: "done",
                              };
                              setMessages((prev) => [...prev, reportMsg]);
                            }}
                            className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                          >
                            <Layers size={14} className="inline-block mr-1" />
                            Detailed Report
                          </button>
                        </div>
                      </div>

                      {/* Execution summary */}
                      <div className="mb-2">
                        <div className="text-xs text-gray-400">Summary: hits: <span className="font-semibold text-gray-200">{message.results.total_hits}</span> — failed: <span className="font-semibold text-red-300">{message.results.failed}</span> / success: <span className="font-semibold text-green-300">{message.results.success}</span></div>
                      </div>

                      {/* Top source IPs */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Top source IPs:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.results.top_source_ips.map((t: any) => (
                            <div key={t.ip} className="text-xs font-mono px-2 py-1 bg-gray-900/50 rounded border border-gray-700">
                              {t.ip} — {t.count}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rows */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="text-left text-gray-400">
                              {message.results.rows.length > 0 &&
                                Object.keys(message.results.rows[0]).map((h: string) => (
                                  <th key={h} className="pr-6 py-1">{h}</th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {message.results.rows.map((r: any, i: number) => (
                              <tr key={i} className="border-t border-gray-800">
                                {Object.keys(r).map((k: string) => (
                                  <td key={k} className="pr-6 py-2 text-gray-300 font-mono">{String(r[k])}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Post-run actions */}
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={() => handleChainBruteforce(message.id)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-xs rounded text-white"
                        >
                          Chain: Find brute-force attempts
                        </button>

                        <button
                          onClick={() => {
                            // quick reuse in composer
                            setInput((prev) => `${message.query}\n\n`);
                          }}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs rounded text-gray-300"
                        >
                          Copy to composer
                        </button>

                        <div className="text-xs text-gray-400 ml-auto">Executed: {new Date().toLocaleString()}</div>
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

      {/* Composer */}
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
              placeholder="Ask about security events, run queries, or generate reports... (e.g., Show VPN attempts)"
              className="w-full bg-gray-900 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border border-gray-800 placeholder-gray-500"
              rows={3}
              disabled={disabledInput}
            />
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabledInput}
              className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              title="Send"
            >
              <Send size={20} />
            </button>

            <div className="text-xs text-gray-500">Enter to send • Shift+Enter newline</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalPane;
