"use client"
import React, { useState } from 'react';
import { 
  Clock, Filter, User, Globe, Server, Database, 
  Bookmark, History, RotateCcw, X, ChevronDown, 
  ChevronRight, Calendar, Search, Tag, Shield
} from 'lucide-react';

interface ContextScope {
  timeRange: string;
  startTime?: string;
  endTime?: string;
  assets: string[];
  users: string[];
  entities: Entity[];
}

interface Entity {
  type: 'ip' | 'user' | 'hash' | 'domain' | 'host';
  value: string;
}

interface SavedQuery {
  id: string;
  name: string;
  query: string;
  timestamp: Date;
}

interface ConversationTurn {
  id: string;
  timestamp: Date;
  userMessage: string;
  assistantSummary: string;
  context: ContextScope;
}

const ContextManagerHistory: React.FC = () => {
  const [activeScope, setActiveScope] = useState<ContextScope>({
    timeRange: 'Last 24 hours',
    startTime: '2025-10-11T14:00:00Z',
    endTime: '2025-10-12T14:00:00Z',
    assets: ['VPN Cluster', 'Web Servers'],
    users: ['alice@example.com'],
    entities: [
      { type: 'ip', value: '203.0.113.42' },
      { type: 'user', value: 'admin@example.com' }
    ]
  });

  const [expandedSection, setExpandedSection] = useState<string>('context');
  const [searchTerm, setSearchTerm] = useState('');

  const savedQueries: SavedQuery[] = [
    {
      id: '1',
      name: 'Failed Login Attempts',
      query: 'event.category: "authentication" AND event.outcome: "failure"',
      timestamp: new Date('2025-10-12T10:30:00Z')
    },
    {
      id: '2',
      name: 'Outbound Connections',
      query: 'event.category: "network" AND network.direction: "outbound"',
      timestamp: new Date('2025-10-12T09:15:00Z')
    },
    {
      id: '3',
      name: 'Malware Detections',
      query: 'event.category: "malware" AND event.outcome: "success"',
      timestamp: new Date('2025-10-11T16:45:00Z')
    }
  ];

  const conversationHistory: ConversationTurn[] = [
    {
      id: '1',
      timestamp: new Date('2025-10-12T14:30:00Z'),
      userMessage: 'Show me failed login attempts in the last 24 hours',
      assistantSummary: 'Found 15 failed login attempts, primarily from IP 203.0.113.42',
      context: {
        timeRange: 'Last 24 hours',
        assets: ['VPN Cluster'],
        users: [],
        entities: []
      }
    },
    {
      id: '2',
      timestamp: new Date('2025-10-12T14:25:00Z'),
      userMessage: 'Investigate suspicious network connections from alice@example.com',
      assistantSummary: 'Analyzed 47 network connections, identified 2 potentially malicious destinations',
      context: {
        timeRange: 'Last 24 hours',
        assets: ['Web Servers'],
        users: ['alice@example.com'],
        entities: []
      }
    },
    {
      id: '3',
      timestamp: new Date('2025-10-12T14:20:00Z'),
      userMessage: 'Generate monthly malware report',
      assistantSummary: 'Created report with 234 malware detections across 45 hosts',
      context: {
        timeRange: 'Last 30 days',
        assets: [],
        users: [],
        entities: []
      }
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const removeEntity = (entity: Entity) => {
    setActiveScope({
      ...activeScope,
      entities: activeScope.entities.filter(e => e.value !== entity.value)
    });
  };

  const removeFilter = (type: 'asset' | 'user', value: string) => {
    if (type === 'asset') {
      setActiveScope({
        ...activeScope,
        assets: activeScope.assets.filter(a => a !== value)
      });
    } else {
      setActiveScope({
        ...activeScope,
        users: activeScope.users.filter(u => u !== value)
      });
    }
  };

  const restoreContext = (turn: ConversationTurn) => {
    setActiveScope(turn.context);
    console.log('Restored context from:', turn.timestamp);
  };

  const clearContext = () => {
    setActiveScope({
      timeRange: 'Last 24 hours',
      assets: [],
      users: [],
      entities: []
    });
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'ip': return <Globe size={12} />;
      case 'user': return <User size={12} />;
      case 'host': return <Server size={12} />;
      case 'hash': return <Tag size={12} />;
      case 'domain': return <Shield size={12} />;
      default: return null;
    }
  };

  const getEntityColor = (type: string) => {
    switch (type) {
      case 'ip': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'user': return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'host': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'hash': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'domain': return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <div className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-screen text-gray-200">
      {/* Header */}
      <div className="flex-none px-4 py-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Database size={18} className="mr-2 text-green-500" />
          Investigation Context
        </h3>
        <p className="text-xs text-gray-400 mt-1">Active scope and history</p>
      </div>

      {/* Search */}
      <div className="flex-none px-4 py-3 border-b border-gray-800">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search context..."
            className="w-full bg-gray-800 text-gray-200 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Active Context Section */}
        <div className="border-b border-gray-800">
          <button
            onClick={() => toggleSection('context')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-green-500" />
              <span className="text-sm font-semibold text-white">Active Context</span>
            </div>
            {expandedSection === 'context' ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'context' && (
            <div className="px-4 pb-4 space-y-4">
              {/* Time Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Time Range</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded p-2 border border-gray-700">
                  <p className="text-sm text-white font-medium">{activeScope.timeRange}</p>
                  {activeScope.startTime && (
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      {new Date(activeScope.startTime).toLocaleString()} - {new Date(activeScope.endTime!).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Assets */}
              {activeScope.assets.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Server size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Scope: Assets</span>
                  </div>
                  <div className="space-y-1">
                    {activeScope.assets.map((asset, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded px-2 py-1.5 border border-gray-700">
                        <span className="text-sm text-gray-300">{asset}</span>
                        <button
                          onClick={() => removeFilter('asset', asset)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {activeScope.users.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Scope: Users</span>
                  </div>
                  <div className="space-y-1">
                    {activeScope.users.map((user, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded px-2 py-1.5 border border-gray-700">
                        <span className="text-sm text-green-400 font-mono">{user}</span>
                        <button
                          onClick={() => removeFilter('user', user)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Entities */}
              {activeScope.entities.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Entities Under Investigation</span>
                  </div>
                  <div className="space-y-1">
                    {activeScope.entities.map((entity, i) => (
                      <div key={i} className={`flex items-center justify-between rounded px-2 py-1.5 border text-sm ${getEntityColor(entity.type)}`}>
                        <div className="flex items-center space-x-2">
                          {getEntityIcon(entity.type)}
                          <span className="font-mono">{entity.value}</span>
                        </div>
                        <button
                          onClick={() => removeEntity(entity)}
                          className="hover:opacity-70 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Context Button */}
              <button
                onClick={clearContext}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors border border-red-500/30 text-sm"
              >
                <X size={14} />
                <span>Clear Context</span>
              </button>
            </div>
          )}
        </div>

        {/* Saved Queries Section */}
        <div className="border-b border-gray-800">
          <button
            onClick={() => toggleSection('queries')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Bookmark size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-white">Saved Queries</span>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{savedQueries.length}</span>
            </div>
            {expandedSection === 'queries' ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'queries' && (
            <div className="px-4 pb-4 space-y-2">
              {savedQueries.map((query) => (
                <button
                  key={query.id}
                  className="w-full bg-gray-800/50 hover:bg-gray-800 rounded p-3 text-left transition-colors border border-gray-700 hover:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{query.name}</h4>
                    <span className="text-xs text-gray-500">{query.timestamp.toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-mono text-gray-400 line-clamp-2">{query.query}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conversation History Section */}
        <div className="border-b border-gray-800">
          <button
            onClick={() => toggleSection('history')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <History size={16} className="text-purple-500" />
              <span className="text-sm font-semibold text-white">Conversation History</span>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{conversationHistory.length}</span>
            </div>
            {expandedSection === 'history' ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'history' && (
            <div className="px-4 pb-4 space-y-3">
              {conversationHistory.map((turn) => (
                <div
                  key={turn.id}
                  className="bg-gray-800/50 rounded p-3 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar size={10} className="mr-1" />
                      {turn.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-xs text-gray-400 mb-1">Query:</p>
                    <p className="text-sm text-white line-clamp-2">{turn.userMessage}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Result:</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{turn.assistantSummary}</p>
                  </div>

                  {/* Context Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                      {turn.context.timeRange}
                    </span>
                    {turn.context.assets.map((asset, i) => (
                      <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">
                        {asset}
                      </span>
                    ))}
                    {turn.context.users.map((user, i) => (
                      <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/40">
                        {user}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => restoreContext(turn)}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded transition-colors border border-green-500/30 text-xs"
                  >
                    <RotateCcw size={12} />
                    <span>Restore Context</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex-none px-4 py-3 border-t border-gray-800 bg-gray-900/50">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Active Filters:</span>
            <span className="text-white font-semibold">
              {activeScope.assets.length + activeScope.users.length + activeScope.entities.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Session Duration:</span>
            <span className="text-white font-mono">24m 15s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextManagerHistory;