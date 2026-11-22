import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Info,
  Check
} from 'lucide-react';
import { diagnoseCropFile } from '../services/api';
import { saveCropDiagnosis } from '../services/storage';

export const FarmerHealthChecker: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [savedToHistory, setSavedToHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    setResult(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setError('Please select a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    // Validate file size (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      setError('Image file is too large. Please select a photo smaller than 15MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setSavedToHistory(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleDiagnose = async () => {
    if (!selectedFile) {
      setError('Please upload or capture a photo of your crop first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedToHistory(false);

    try {
      const response = await diagnoseCropFile(selectedFile);
      setResult(response);

      // Auto-save successful evaluation to browser local history
      if (response && response.status === 'success') {
        try {
          await saveCropDiagnosis({
            cropName: response.crop_name || 'Plant Leaf',
            diseaseName: response.disease_name || (response.category === 'healthy' ? 'Healthy Foliage' : 'Ambiguous Condition'),
            status: response.category === 'healthy' ? 'healthy' : (response.category === 'diseased' ? 'diseased' : 'unknown'),
            confidence: response.confidence_percentage || 0,
            imageSource: selectedFile,
            message: response.message || '',
            description: response.description,
            recommendations: response.recommendations,
            gradCamOverlay: response.grad_cam_overlay_base64
          });
          setSavedToHistory(true);
        } catch (saveErr) {
          console.warn('Could not auto-save to local history:', saveErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to connect to the disease detection service. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AgriNex AI Plant Doctor • Instant Crop Analysis</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Check Your Crop Health
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Upload a photo of your crop or leaf and discover whether it is healthy or affected by disease.
        </p>

        {/* 3 Simple Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-xl mx-auto text-xs text-slate-400">
          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">1</span>
            <span>Take or upload photo</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">2</span>
            <span>Click Check Crop Health</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">3</span>
            <span>Get treatment advice</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/70 border border-red-500/40 rounded-2xl text-xs sm:text-sm text-red-300 flex items-center space-x-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-white">Upload Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Upload Card */}
      {!result && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-black/40">
          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {!previewUrl ? (
            /* Upload Drop Area */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-950/50 hover:bg-slate-950/90 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-emerald-950/40">
                  <Upload className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Upload Your Crop Photo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Drag and drop your crop photo here, or browse from your device
                  </p>
                </div>

                {/* Upload Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Browse Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4 text-sky-400" />
                    <span>Take Photo</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 font-mono pt-2">
                  Supported formats: JPG, JPEG, PNG, WEBP (Max 15MB)
                </p>
              </div>
            </div>
          ) : (
            /* Image Preview Card */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs sm:text-sm font-bold text-white">Image Ready for Health Analysis</span>
                </div>

                <button
                  onClick={handleRemoveImage}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 hover:bg-red-900/60 hover:text-white text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>

              {/* Centered Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-96 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Crop Preview"
                  className="w-full max-h-96 object-contain"
                />
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="truncate max-w-xs text-slate-300 font-medium">{selectedFile?.name}</span>
                <span className="font-mono text-emerald-400">{((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              {/* Large Green Check Button */}
              <button
                onClick={handleDiagnose}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-950/60 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin text-white" />
                    <span>Analyzing Crop Health with AI Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 text-emerald-100" />
                    <span>Check Crop Health</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Diagnostic Result Screen */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {savedToHistory && (
            <div className="flex items-center justify-between p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 shadow-md">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Diagnostic record and photo safely saved to <strong>My Crop History</strong>.</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">localStorage Demo Storage</span>
            </div>
          )}

          {/* Result Card: Healthy */}
          {result.category === 'healthy' && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/60 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-950/40">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Health Status: Normal
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                      {result.message}
                    </h2>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-right sm:text-center">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {result.confidence_percentage}%
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Model Confidence</span>
                </div>
              </div>

              {/* Grid: Image + Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Uploaded Image */}
                <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 max-h-80 flex items-center justify-center">
                  <img
                    src={result.uploaded_image_base64 || previewUrl}
                    alt="Healthy Crop"
                    className="w-full max-h-80 object-cover"
                  />
                </div>

                {/* Farmer Guidance */}
                <div className="space-y-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Identified Crop:</span>
                    <h3 className="text-xl font-bold text-white capitalize">{result.crop_name}</h3>
                    <p className="text-xs text-slate-300">
                      No foliar fungal, bacterial, or viral disease symptoms detected. The foliage shows uniform color and healthy vigor.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                    <span className="font-bold text-white flex items-center space-x-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Best Practices to Keep It Healthy:</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {result.recommendations?.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleRemoveImage}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition flex items-center space-x-2 shadow-lg shadow-emerald-950/50"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Another Crop Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Result Card: Diseased */}
          {result.category === 'diseased' && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-red-950/40 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-red-950/40">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-red-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                      Disease Detected • Action Recommended
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                      {result.crop_name} — <span className="text-red-400">{result.disease_name}</span>
                    </h2>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-red-500/30 px-4 py-2.5 rounded-2xl text-right sm:text-center">
                  <div className="text-2xl font-black text-red-400 font-mono">
                    {result.confidence_percentage}%
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Confidence</span>
                </div>
              </div>

              {/* Images Section: Uploaded vs Grad-CAM Attention Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Uploaded Photo */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">Your Uploaded Crop Photo:</span>
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                    <img
                      src={result.uploaded_image_base64 || previewUrl}
                      alt="Uploaded Crop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Grad-CAM Attention Map */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-red-300">AI Lesion Attention Map (Grad-CAM):</span>
                    <span className="text-[10px] text-slate-400 font-mono">Highlighted in Red</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-red-500/40 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                    <img
                      src={result.grad_cam_overlay_base64 || result.uploaded_image_base64 || previewUrl}
                      alt="Grad-CAM Lesion Heatmap"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>Healthy Tissue</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span>Infected Disease Focus</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Disease Information & Treatment Recommendations */}
              <div className="space-y-4">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Info className="w-4 h-4 text-sky-400" />
                    <span>What is {result.disease_name}?</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {result.description}
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Recommended Next Steps & Treatment:</span>
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations?.map((step: string, idx: number) => (
                      <div key={idx} className="bg-slate-850 p-3 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs sm:text-sm">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-200 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleRemoveImage}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition flex items-center space-x-2 shadow-lg shadow-red-950/50"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Another Crop Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Result Card: Unknown / Low Confidence */}
          {result.category === 'unknown' && (
            <div className="bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Condition Uncertain
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {result.message}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-80 flex items-center justify-center">
                  <img
                    src={result.uploaded_image_base64 || previewUrl}
                    alt="Uncertain Crop Photo"
                    className="w-full max-h-80 object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
                    <p className="font-semibold text-white">Why was this image not recognized?</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The image was either too blurry, taken from too far away, poorly illuminated, or does not clearly show an individual leaf or crop surface.
                    </p>
                  </div>

                  <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-white block">Tips for a Clear Photo:</span>
                    <ul className="space-y-1.5 text-slate-300">
                      <li>• Move camera closer so the leaf fills most of the frame.</li>
                      <li>• Take the photo in bright daylight (avoid dark shadows).</li>
                      <li>• Ensure camera lens is focused and not moving.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleRemoveImage}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition flex items-center space-x-2 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again With a Clearer Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Result Card: Unavailable */}
          {result.category === 'unavailable' && (
            <div className="p-6 bg-slate-900 border border-amber-500/40 rounded-3xl text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">{result.message}</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Please verify that the model checkpoint exists at C:\agri\backend\models\plant_village.pth.
              </p>
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-slate-800 text-slate-200 text-xs rounded-xl"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

