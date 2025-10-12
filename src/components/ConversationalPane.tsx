"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  query?: string;
  queryLanguage?: 'KQL' | 'DSL';
  entities?: Entity[];
  timestamp: Date;
}

interface Entity {
  type: 'ip' | 'user' | 'hash' | 'timestamp' | 'domain';
  value: string;
}

const ConversationalPane: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Supernova Security Assistant. I can help you investigate security events, run queries, and generate reports. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Investigate failed logins',
    'Show VPN attempts',
    'Generate monthly malware report',
    'Detect brute force attacks',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you with "${input}". Here's what I found:`,
        query: `event.category: "authentication" AND event.outcome: "failure"\n| stats count by user.name, source.ip\n| where count > 3`,
        queryLanguage: 'KQL',
        entities: [
          { type: 'ip', value: '192.168.1.100' },
          { type: 'user', value: 'alice@example.com' },
          { type: 'timestamp', value: '2025-10-12T10:30:00Z' },
        ],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleRunQuery = (messageId: string) => {
    console.log('Running query for message:', messageId);
    // Implement query execution
  };

  const handleCopyQuery = (query: string, messageId: string) => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(messageId);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleEntityClick = (entity: Entity) => {
    console.log('Entity clicked:', entity);
    // This would open an entity detail panel
  };

  const renderEntity = (entity: Entity) => {
    const colors = {
      ip: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      user: 'bg-green-500/20 text-green-300 border-green-500/40',
      hash: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      timestamp: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      domain: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    };

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

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-gray-200">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Security Assistant</h2>
            <p className="text-sm text-gray-400 mt-1">AI-powered threat investigation</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Model:</span>
            <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">claude-sonnet-4.5</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex-none px-6 py-4 border-b border-gray-800">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
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
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
              {/* Message Header */}
              <div className="flex items-center mb-2 space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                }`}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {/* Message Content */}
              <div className={`p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600/20 border border-blue-500/30' 
                  : 'bg-gray-800/50 border border-gray-700'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                {/* Entities */}
                {message.entities && message.entities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Detected entities:</p>
                    <div className="flex flex-wrap">
                      {message.entities.map(renderEntity)}
                    </div>
                  </div>
                )}

                {/* Query Section */}
                {message.query && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Code size={14} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-300">Generated Query</span>
                        <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-400">
                          {message.queryLanguage}
                        </span>
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
                        <pre className="bg-[#0d0d0d] p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">
                          {message.query}
                        </pre>
                        <button
                          onClick={() => handleCopyQuery(message.query!, message.id)}
                          className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                        >
                          {copiedQuery === message.id ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    )}

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
                        {expandedQuery === message.id ? 'Hide' : 'Explain Query'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none px-6 py-4 border-t border-gray-800 bg-[#1a1a1a]">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about security events, run queries, or generate reports..."
              className="w-full bg-gray-800 text-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-gray-700 placeholder-gray-500"
              rows={3}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ConversationalPane;