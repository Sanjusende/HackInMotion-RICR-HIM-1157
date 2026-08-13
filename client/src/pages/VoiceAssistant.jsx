import React, { useState, useEffect, useRef } from 'react';
import { useFarm } from '../context/FarmContext';
import { sendVoiceQuery, getVoiceHistory } from '../services/voiceService';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw, Send, CheckCircle2, MessageSquare, Play, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'en-US', label: 'English' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' }
];

const QUICK_QUESTIONS = [
  'Aaj paani dena chahiye?',
  'Kal baarish hogi kya?',
  'Meri crop mein problem hai?',
  'Wheat ka price kya hai?',
  'Kaunsi crop lagani chahiye?'
];

const VoiceAssistant = () => {
  const { farm } = useFarm();
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchHistory();
    setupSpeechRecognition();
  }, [selectedLang]);

  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setTranscript(text);
        setTextInput(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getVoiceHistory();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use text input below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setTextInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleProcessQuery = async (queryText) => {
    const queryToSubmit = queryText || textInput || transcript;
    if (!queryToSubmit) return;

    setProcessing(true);
    setCurrentResponse(null);

    try {
      const res = await sendVoiceQuery(queryToSubmit, selectedLang);
      if (res.success) {
        setCurrentResultAndSpeak(res.data);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const setCurrentResultAndSpeak = (data) => {
    setCurrentResponse(data);
    speakText(data.responseText, data.language);
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang || selectedLang;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header (Section 17.5) */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
          Ask SmartFarm
        </h1>
        <p className="text-slate-600 text-sm">Talk to your farm advisor in your language.</p>

        {/* Farm Context Line */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800">
          <span>🌱 {farm?.currentCrop || 'Wheat'}</span>
          <span>•</span>
          <span>{farm?.landSize?.value || 5} {farm?.landSize?.unit || 'Acres'}</span>
          <span>•</span>
          <span>📍 {farm?.location?.display || 'Indore, MP'}</span>
        </div>
      </div>

      {/* Language Selector (Section 17.6) */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              selectedLang === lang.code
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Main Voice Interaction Area (Section 17.7 & 17.8) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={toggleListening}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all transform shadow-2xl ${
              isListening
                ? 'bg-red-500 text-white animate-pulse scale-110 shadow-red-500/40'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white hover:scale-105 shadow-emerald-600/30'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            <span className="text-[10px] font-bold uppercase mt-1">
              {isListening ? 'Stop' : 'Tap Mic'}
            </span>
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-base font-bold text-slate-800">
            {isListening ? '🎙️ Listening to your question...' : 'Tap microphone to speak'}
          </p>
          <p className="text-xs text-slate-500">
            Ask about weather, irrigation, crop health or mandi prices
          </p>
        </div>

        {/* Live Transcript / Fallback Text Input (Section 17.9 & 17.17) */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type your question here..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <Button
              onClick={() => handleProcessQuery(textInput)}
              disabled={processing || !textInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Voice Questions Chips (Section 17.13) */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Try asking</p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTextInput(q);
                  handleProcessQuery(q);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Processing State Checklist (Section 17.10) */}
      {processing && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 text-center space-y-3 animate-pulse">
          <span className="font-bold text-emerald-900 text-sm">SmartFarm is thinking...</span>
          <div className="flex justify-center gap-4 text-xs font-semibold text-emerald-700">
            <span>✓ Farm Profile</span>
            <span>✓ Weather Forecast</span>
            <span>✓ Market Rates</span>
          </div>
        </div>
      )}

      {/* Spoken Voice Response Card (Section 17.11) */}
      {currentResponse && !processing && (
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
              SmartFarm Spoken Advice
            </span>
            {isPlayingAudio && (
              <span className="text-xs text-amber-300 font-bold animate-pulse">🔊 Playing audio...</span>
            )}
          </div>

          <p className="text-lg font-medium leading-relaxed bg-white/10 p-4 rounded-2xl border border-white/10">
            "{currentResponse.responseText}"
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => speakText(currentResponse.responseText, currentResponse.language)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        </div>
      )}

      {/* Conversation History (Section 17.12) */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-600" />
            Recent Farm Q&A History
          </h3>

          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <p className="font-bold text-slate-900 text-sm">❓ "{item.query}"</p>
                <p className="text-emerald-800 font-medium leading-relaxed">💡 {item.responseText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
