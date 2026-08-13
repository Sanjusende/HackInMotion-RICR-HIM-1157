import React, { useState, useEffect } from 'react';
import { analyzeCropHealth, getCropHealthHistory } from '../services/cropHealthService';
import { useFarm } from '../context/FarmContext';
import { Upload, Camera, Sprout, AlertCircle, CheckCircle2, History, Loader2, Info } from 'lucide-react';
import Button from '../components/ui/Button';

const CropHealth = () => {
  const { farm } = useFarm();
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHist, setLoadingHist] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await getCropHealthHistory();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHist(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('description', description);

      const res = await analyzeCropHealth(formData);
      if (res.success) {
        setCurrentResult(res.data);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Sprout className="w-8 h-8 text-emerald-600" />
          Crop Health & Pest Detection
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Upload a photo of your {farm?.currentCrop || 'crop'} leaf or describe symptoms to get decision-support guidance.
        </p>
      </div>

      {/* Quality Rule Disclaimer Alert */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p>
          <strong>Decision Support Note:</strong> Outputs provide possible-issue flags and preliminary check instructions. They represent decision-support guidance and should be confirmed with your local KVK or agronomy officer.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              1. Upload Leaf / Symptom Photo (Optional)
            </label>

            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 transition rounded-2xl p-6 text-center bg-slate-50 cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-sm object-cover" />
                  <p className="text-xs text-emerald-700 font-semibold">Click or drag to change image</p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Tap to select photo or open camera</p>
                  <p className="text-xs text-slate-400">Supports JPG, PNG, HEIC (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              2. Describe Crop Symptoms in Your Own Words
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Yellowing spots on lower wheat leaves, dark spots spreading on tips"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 text-sm placeholder-slate-400"
            />
          </div>

          <Button
            type="submit"
            disabled={analyzing}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Crop Observation...
              </>
            ) : (
              'Analyze Crop Observation'
            )}
          </Button>
        </form>
      </div>

      {/* Analysis Result Card */}
      {currentResult && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold">Analysis Result</h2>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold">POSSIBLE ISSUE IDENTIFIED</span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{currentResult.possibleIssue}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                Confidence: {currentResult.confidence}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-400 uppercase font-bold">WHAT TO CHECK IN YOUR FIELD</span>
              <p className="text-slate-700 mt-0.5">{currentResult.whatToCheck}</p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-400 uppercase font-bold">RECOMMENDED NEXT ACTION</span>
              <p className="text-slate-900 font-semibold mt-0.5">💡 {currentResult.nextAction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Observation History */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-600" />
            Previous Crop Health Log
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.map((log, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                <span className="text-slate-400 font-medium">{new Date(log.reportedAt).toLocaleDateString()}</span>
                <p className="font-bold text-slate-900 text-sm">{log.possibleIssue}</p>
                <p className="text-slate-600">{log.nextAction}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropHealth;
