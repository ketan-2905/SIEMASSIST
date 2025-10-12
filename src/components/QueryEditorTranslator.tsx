"use client"
import React, { useState } from 'react';
import { Play, Save, Copy, Check, AlertCircle, Database, Zap, Clock, X, Search, ChevronRight } from 'lucide-react';

interface QueryMetadata {
  estimatedResults: number;
  indicesSearched: string[];
  executionTimeEstimate: string;
  aggregationCost: 'low' | 'medium' | 'high';
  warnings: string[];
}

interface IndexField {
  name: string;
  type: string;
  description: string;
}

const QueryEditorTranslator: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [queryLanguage, setQueryLanguage] = useState<'KQL' | 'DSL'>('KQL');
  const [query, setQuery] = useState(`event.category: "authentication" AND event.outcome: "failure"
| stats count by user.name, source.ip
| where count > 3`);
  const [copied, setCopied] = useState(false);
  const [showIndexBrowser, setShowIndexBrowser] = useState(false);
  const [searchField, setSearchField] = useState('');

  const metadata: QueryMetadata = {
    estimatedResults: 1247,
    indicesSearched: ['logs-endpoint-*', 'logs-system-*', 'logs-network-*'],
    executionTimeEstimate: '~250ms',
    aggregationCost: 'medium',
    warnings: [
      'Consider adding time range filter for better performance',
      'Large aggregation may impact cluster performance'
    ]
  };

  const indexFields: IndexField[] = [
    { name: 'event.category', type: 'keyword', description: 'Event category (authentication, network, process, etc.)' },
    { name: 'event.outcome', type: 'keyword', description: 'Outcome of the event (success, failure, unknown)' },
    { name: 'user.name', type: 'keyword', description: 'Username associated with the event' },
    { name: 'source.ip', type: 'ip', description: 'Source IP address' },
    { name: 'destination.ip', type: 'ip', description: 'Destination IP address' },
    { name: 'process.name', type: 'keyword', description: 'Name of the process' },
    { name: 'file.hash.sha256', type: 'keyword', description: 'SHA256 hash of the file' },
    { name: '@timestamp', type: 'date', description: 'Event timestamp' },
    { name: 'host.name', type: 'keyword', description: 'Hostname' },
    { name: 'network.protocol', type: 'keyword', description: 'Network protocol (http, dns, tls, etc.)' }
  ];

  const filteredFields = indexFields.filter(field =>
    field.name.toLowerCase().includes(searchField.toLowerCase()) ||
    field.description.toLowerCase().includes(searchField.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    console.log('Saving query:', query);
    // Implement save functionality
  };

  const handleRun = () => {
    console.log('Running query:', query);
    // Implement run functionality
  };

  const insertField = (fieldName: string) => {
    setQuery(prev => prev + `${prev.endsWith('\n') ? '' : '\n'}${fieldName}: `);
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const syntaxHighlight = (code: string) => {
    // Simple syntax highlighting for demo
    return code
      .split('\n')
      .map((line, i) => {
        let highlighted = line;
        
        // Keywords
        highlighted = highlighted.replace(
          /\b(AND|OR|NOT|stats|where|by|count)\b/g,
          '<span class="text-purple-400 font-semibold">$1</span>'
        );
        
        // Strings
        highlighted = highlighted.replace(
          /"([^"]*)"/g,
          '<span class="text-green-400">"$1"</span>'
        );
        
        // Numbers
        highlighted = highlighted.replace(
          /\b(\d+)\b/g,
          '<span class="text-blue-400">$1</span>'
        );
        
        // Field names
        highlighted = highlighted.replace(
          /\b([a-z_]+\.[a-z_]+)\b/gi,
          '<span class="text-cyan-400">$1</span>'
        );

        return (
          <div key={i} className="flex">
            <span className="text-gray-600 select-none mr-4 text-right w-8 flex-shrink-0">{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        );
      });
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-gray-200 border-l border-gray-800">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Database size={18} className="mr-2 text-green-500" />
            Query Editor
          </h3>
          <p className="text-xs text-gray-400 mt-1">Edit and optimize your query</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Language Selector */}
      <div className="flex-none px-6 py-3 border-b border-gray-800 flex items-center space-x-2">
        <span className="text-sm text-gray-400">Language:</span>
        <button
          onClick={() => setQueryLanguage('KQL')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            queryLanguage === 'KQL'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          KQL
        </button>
        <button
          onClick={() => setQueryLanguage('DSL')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            queryLanguage === 'DSL'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Elasticsearch DSL
        </button>
      </div>

      {/* Query Editor */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-[#0d0d0d] rounded-lg border border-gray-800 overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRun}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                >
                  <Play size={12} />
                  <span>Run</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
                >
                  <Save size={12} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <button
                onClick={() => setShowIndexBrowser(!showIndexBrowser)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs rounded transition-colors border border-blue-500/30"
              >
                <Search size={12} />
                <span>Field Browser</span>
              </button>
            </div>

            {/* Editor Area */}
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-transparent caret-gray-200 p-4 font-mono text-sm resize-none focus:outline-none"
                style={{ minHeight: '300px' }}
                spellCheck={false}
              />
              <div className="absolute inset-0 p-4 font-mono text-sm pointer-events-none overflow-auto">
                {syntaxHighlight(query)}
              </div>
            </div>
          </div>

          {/* Performance Hints */}
          <div className="mt-4 bg-gray-800/50 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center mb-3">
              <Zap size={16} className="text-yellow-400 mr-2" />
              <h4 className="text-sm font-semibold text-white">Performance Preview</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Database size={14} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Estimated Results</p>
                  <p className="text-sm font-semibold text-white">{metadata.estimatedResults.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Execution Time</p>
                  <p className="text-sm font-semibold text-white">{metadata.executionTimeEstimate}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Indices Searched:</p>
              <div className="flex flex-wrap gap-2">
                {metadata.indicesSearched.map((index, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-700 text-xs font-mono text-gray-300 rounded"
                  >
                    {index}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs text-gray-400">Aggregation Cost:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${getCostColor(metadata.aggregationCost)}`}>
                {metadata.aggregationCost.toUpperCase()}
              </span>
            </div>

            {metadata.warnings.length > 0 && (
              <div className="space-y-2">
                {metadata.warnings.map((warning, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Index Field Browser (Slide-out) */}
      {showIndexBrowser && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0d0d0d] border-l border-gray-800 shadow-2xl flex flex-col z-10">
          <div className="flex-none px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Field Browser</h4>
            <button
              onClick={() => setShowIndexBrowser(false)}
              className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-400 hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-none px-4 py-3 border-b border-gray-800">
            <input
              type="text"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              placeholder="Search fields..."
              className="w-full bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-gray-700 placeholder-gray-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="space-y-1">
              {filteredFields.map((field, i) => (
                <button
                  key={i}
                  onClick={() => insertField(field.name)}
                  className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono text-cyan-400">{field.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{field.type}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{field.description}</p>
                  <div className="flex items-center text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                    <ChevronRight size={12} className="mr-1" />
                    Click to insert
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryEditorTranslator;