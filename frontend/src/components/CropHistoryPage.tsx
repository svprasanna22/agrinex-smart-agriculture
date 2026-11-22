import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Calendar, 
  ArrowUpDown, 
  Scan, 
  X, 
  ShieldCheck, 
  AlertCircle,
  Download,
  Info
} from 'lucide-react';
import { CropHistoryEntry } from '../types';
import { getCropHistory, deleteCropHistoryEntry, clearCropHistory } from '../services/storage';

interface CropHistoryPageProps {
  onNavigateToCheck: () => void;
}

export const CropHistoryPage: React.FC<CropHistoryPageProps> = ({ onNavigateToCheck }) => {
  const [history, setHistory] = useState<CropHistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'diseased' | 'unknown'>('all');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedEntry, setSelectedEntry] = useState<CropHistoryEntry | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadHistory = () => {
    setHistory(getCropHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCropHistoryEntry(id);
    loadHistory();
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  const handleClearAll = () => {
    clearCropHistory();
    loadHistory();
    setSelectedEntry(null);
    setShowClearConfirm(false);
  };

  // Distinct crop names for filter
  const distinctCrops = Array.from(new Set(history.map(h => h.cropName))).filter(Boolean);

  // Filtered and sorted items
  const filteredItems = history
    .filter(item => {
      // Search
      const matchSearch = 
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      // Crop
      const matchCrop = cropFilter === 'all' || item.cropName === cropFilter;

      return matchSearch && matchStatus && matchCrop;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Local Activity Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            My Crop History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View, search, and manage your previous crop photograph evaluations and pathology records.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToCheck}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-950/40 transition flex items-center space-x-1.5"
          >
            <Scan className="w-4 h-4" />
            <span>Check New Photo</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Storage Information Notice */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-white">Browser Storage Privacy Guarantee</p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            All evaluated crop photos, disease classifications, and Grad-CAM activation maps are saved strictly in your local browser storage. Zero private farm photos or diagnosis logs are uploaded to any external database. Clearing your browser cache or switching devices will reset this history.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search crop or disease..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-[11px] font-semibold text-slate-400 shrink-0">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-emerald-500 transition"
            >
              <option value="all">All Conditions ({history.length})</option>
              <option value="healthy">Healthy Only</option>
              <option value="diseased">Diseased Only</option>
              <option value="unknown">Uncertain / Low Confidence</option>
            </select>
          </div>

          {/* Crop Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-[11px] font-semibold text-slate-400 shrink-0">Crop:</label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-emerald-500 transition"
            >
              <option value="all">All Crops</option>
              {distinctCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center space-x-2">
            <label className="text-[11px] font-semibold text-slate-400 shrink-0">Sort:</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center justify-between transition"
            >
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* History Grid / Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
            <Scan className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Diagnosis Records Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || cropFilter !== 'all'
                ? 'No evaluations match your current search or filters. Try clearing your search parameters.'
                : 'You have not checked any crop photos yet. Upload a leaf photo to begin tracking disease diagnostics.'}
            </p>
          </div>
          <button
            onClick={onNavigateToCheck}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition"
          >
            Check Your First Crop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedEntry(item)}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between space-y-4 cursor-pointer group transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-emerald-950/20"
            >
              <div className="space-y-3">
                {/* Image Thumbnail + Status Badge */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-950 border border-slate-800 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.cropName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <Scan className="w-8 h-8 text-slate-600" />
                  )}

                  <div className="absolute top-2 left-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md ${
                      item.status === 'healthy'
                        ? 'bg-emerald-600 text-white'
                        : item.status === 'diseased'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}>
                      {item.status === 'healthy' ? 'Healthy' : (item.status === 'diseased' ? 'Diseased' : 'Uncertain')}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                    {item.confidence}%
                  </div>
                </div>

                {/* Headings */}
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {item.cropName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5 line-clamp-1">
                    {item.diseaseName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{item.dateFormatted}</span>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedEntry(item)}
                    className="p-1 rounded text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[10px]">Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Diagnosis Details • {selectedEntry.dateFormatted}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {selectedEntry.cropName} — {selectedEntry.diseaseName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Images & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo Preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 block">Saved Crop Photograph:</span>
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                  <img
                    src={selectedEntry.thumbnail}
                    alt={selectedEntry.cropName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Metrics & Pathological Info */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Model Confidence</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {selectedEntry.confidence}%
                  </div>
                  <p className="text-[11px] text-slate-400">MobileNetV3 PlantVillage Deep Classifier</p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Diagnosis Status</span>
                  <p className="text-xs font-bold text-white capitalize">{selectedEntry.status}</p>
                  <p className="text-[11px] text-slate-300">{selectedEntry.message}</p>
                </div>
              </div>
            </div>

            {/* Description & Treatment Guidance */}
            {selectedEntry.description && (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5 text-xs">
                <span className="font-bold text-white block">Agronomic Symptom Description:</span>
                <p className="text-slate-300 leading-relaxed">{selectedEntry.description}</p>
              </div>
            )}

            {selectedEntry.recommendations && selectedEntry.recommendations.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Recommended Treatment & Management:</span>
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {selectedEntry.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              <button
                onClick={(e) => handleDelete(selectedEntry.id, e)}
                className="px-4 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Entry</span>
              </button>

              <button
                onClick={() => setSelectedEntry(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-red-400 font-bold text-base">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Clear History</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove all saved crop evaluations from this browser? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
