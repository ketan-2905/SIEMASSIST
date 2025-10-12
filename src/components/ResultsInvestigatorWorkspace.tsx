"use client"
import React, { useState } from 'react';
import { 
  Table2, Clock, BarChart3, MapPin, Network, 
  ChevronDown, ChevronRight, X, AlertTriangle, 
  FileText, Plus, PlayCircle, ExternalLink, Copy,
  Shield, User, Globe, Hash, Calendar
} from 'lucide-react';

interface Event {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  eventType: string;
  sourceIp: string;
  destIp?: string;
  user: string;
  action: string;
  outcome: 'success' | 'failure';
  details: Record<string, any>;
}

type ViewMode = 'table' | 'timeline' | 'charts' | 'map' | 'graph';

const ResultsInvestigatorWorkspace: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockEvents: Event[] = [
    {
      id: '1',
      timestamp: '2025-10-12T14:32:15Z',
      severity: 'critical',
      eventType: 'authentication.failure',
      sourceIp: '203.0.113.42',
      user: 'admin@example.com',
      action: 'login_attempt',
      outcome: 'failure',
      details: {
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'geo_location': 'Moscow, RU',
        'failure_reason': 'Invalid credentials',
        'attempt_count': 15
      }
    },
    {
      id: '2',
      timestamp: '2025-10-12T14:31:48Z',
      severity: 'high',
      eventType: 'network.connection',
      sourceIp: '192.168.1.100',
      destIp: '185.220.101.23',
      user: 'alice@example.com',
      action: 'outbound_connection',
      outcome: 'success',
      details: {
        'protocol': 'TCP',
        'port': '443',
        'bytes_sent': 2048,
        'threat_intel': 'Known malicious IP'
      }
    },
    {
      id: '3',
      timestamp: '2025-10-12T14:30:22Z',
      severity: 'medium',
      eventType: 'file.modification',
      sourceIp: '192.168.1.55',
      user: 'bob@example.com',
      action: 'file_write',
      outcome: 'success',
      details: {
        'file_path': '/etc/passwd',
        'file_hash': 'a1b2c3d4e5f6...',
        'process_name': 'vim'
      }
    },
    {
      id: '4',
      timestamp: '2025-10-12T14:29:10Z',
      severity: 'low',
      eventType: 'process.start',
      sourceIp: '192.168.1.78',
      user: 'system',
      action: 'process_creation',
      outcome: 'success',
      details: {
        'process_name': 'powershell.exe',
        'command_line': 'powershell -enc ...',
        'parent_process': 'cmd.exe'
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const handleRowClick = (event: Event) => {
    setExpandedRow(expandedRow === event.id ? null : event.id);
  };

  const handleEventDetail = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCreateTicket = (event: Event) => {
    console.log('Creating ticket for event:', event.id);
  };

  const handleAddToCase = (event: Event) => {
    console.log('Adding to case:', event.id);
  };

  const handleRunEnrichment = (event: Event) => {
    console.log('Running enrichment for:', event.id);
  };

  const handleRunPlaybook = (event: Event) => {
    console.log('Running playbook for:', event.id);
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800/50 sticky top-0 z-10">
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-12"></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Timestamp</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Severity</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Event Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Source IP</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Outcome</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockEvents.map((event) => (
            <React.Fragment key={event.id}>
              <tr
                className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors cursor-pointer"
                onClick={() => handleRowClick(event)}
              >
                <td className="px-4 py-3">
                  {expandedRow === event.id ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded border ${getSeverityColor(event.severity)}`}>
                    {event.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300 font-mono">{event.eventType}</td>
                <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{event.sourceIp}</td>
                <td className="px-4 py-3 text-sm text-green-400">{event.user}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{event.action}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    event.outcome === 'success' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {event.outcome}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventDetail(event);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
              {expandedRow === event.id && (
                <tr className="bg-gray-900/50 border-b border-gray-800">
                  <td colSpan={9} className="px-4 py-4">
                    <div className="flex space-x-4">
                      {/* Event Details */}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                          <FileText size={14} className="mr-2" />
                          Event Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="bg-gray-800/50 p-2 rounded">
                              <p className="text-xs text-gray-400 mb-1">{key.replace(/_/g, ' ')}</p>
                              <p className="text-sm text-gray-200 font-mono break-all">{String(value)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="w-64 space-y-2">
                        <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
                        <button
                          onClick={() => handleCreateTicket(event)}
                          className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors border border-blue-500/30"
                        >
                          <Plus size={14} />
                          <span className="text-sm">Create Ticket</span>
                        </button>
                        <button
                          onClick={() => handleAddToCase(event)}
                          className="w-full flex items-center space-x-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded transition-colors border border-purple-500/30"
                        >
                          <FileText size={14} />
                          <span className="text-sm">Add to Case</span>
                        </button>
                        <button
                          onClick={() => handleRunEnrichment(event)}
                          className="w-full flex items-center space-x-2 px-3 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded transition-colors border border-orange-500/30"
                        >
                          <Shield size={14} />
                          <span className="text-sm">Run Enrichment</span>
                        </button>
                        <button
                          onClick={() => handleRunPlaybook(event)}
                          className="w-full flex items-center space-x-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded transition-colors border border-green-500/30"
                        >
                          <PlayCircle size={14} />
                          <span className="text-sm">Run Playbook</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTimelineView = () => (
    <div className="p-6 space-y-4">
      {mockEvents.map((event, index) => (
        <div key={event.id} className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${
              event.severity === 'critical' ? 'bg-red-500' :
              event.severity === 'high' ? 'bg-orange-500' :
              event.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            {index < mockEvents.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-700 min-h-[60px]" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getSeverityColor(event.severity)}`}>
                  {event.severity}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">{event.eventType}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className="flex items-center">
                  <User size={12} className="mr-1" />
                  {event.user}
                </span>
                <span className="flex items-center">
                  <Globe size={12} className="mr-1" />
                  {event.sourceIp}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChartsView = () => (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Events by Severity</h4>
        <div className="space-y-3">
          {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
            <div key={severity} className="flex items-center space-x-3">
              <span className="text-xs text-gray-400 w-16">{severity}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full ${
                    severity === 'Critical' ? 'bg-red-500' :
                    severity === 'High' ? 'bg-orange-500' :
                    severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.random() * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-12 text-right">{Math.floor(Math.random() * 100)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Top Event Types</h4>
        <div className="space-y-2">
          {['authentication.failure', 'network.connection', 'file.modification', 'process.start'].map((type) => (
            <div key={type} className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
              <span className="text-xs font-mono text-gray-300">{type}</span>
              <span className="text-sm font-semibold text-green-400">{Math.floor(Math.random() * 500)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Events Over Time</h4>
        <div className="h-48 flex items-end space-x-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 bg-green-500/30 rounded-t hover:bg-green-500/50 transition-colors" style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-200">
      {/* Main Results Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with View Tabs */}
        <div className="flex-none px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white">Investigation Results</h3>
            <span className="text-sm text-gray-400">
              {mockEvents.length} events found
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                viewMode === 'table' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Table2 size={16} />
              <span className="text-sm">Table</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                viewMode === 'timeline' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Clock size={16} />
              <span className="text-sm">Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                viewMode === 'charts' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <BarChart3 size={16} />
              <span className="text-sm">Charts</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <MapPin size={16} />
              <span className="text-sm">Map</span>
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                viewMode === 'graph' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Network size={16} />
              <span className="text-sm">Graph</span>
            </button>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'table' && renderTableView()}
          {viewMode === 'timeline' && renderTimelineView()}
          {viewMode === 'charts' && renderChartsView()}
          {viewMode === 'map' && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                <p>Geo-IP Map View</p>
                <p className="text-sm mt-2">Map visualization would appear here</p>
              </div>
            </div>
          )}
          {viewMode === 'graph' && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Network size={48} className="mx-auto mb-4 opacity-50" />
                <p>Entity Relationship Graph</p>
                <p className="text-sm mt-2">Graph visualization would appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex-none px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, mockEvents.length)} of {mockEvents.length}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-300 disabled:text-gray-600 rounded transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Event Detail Flyout */}
      {selectedEvent && (
        <div className="w-96 border-l border-gray-800 bg-[#0d0d0d] flex flex-col">
          <div className="flex-none px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Event Details</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-400 hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Severity Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1.5 text-sm font-semibold rounded border ${getSeverityColor(selectedEvent.severity)}`}>
                {selectedEvent.severity.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400 font-mono">{selectedEvent.id}</span>
            </div>

            {/* Key Info */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Event Type</p>
                <p className="text-sm font-mono text-white">{selectedEvent.eventType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                <p className="text-sm font-mono text-white">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">User</p>
                <p className="text-sm text-green-400">{selectedEvent.user}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Source IP</p>
                <p className="text-sm font-mono text-cyan-400">{selectedEvent.sourceIp}</p>
              </div>
            </div>

            {/* Raw JSON */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Raw Event Data</h4>
              <pre className="bg-gray-900 p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            </div>

            {/* Recommended Actions */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Recommended Next Steps</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Investigate source IP reputation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Shield size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Check for other events from this user</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileText size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Review authentication logs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsInvestigatorWorkspace;