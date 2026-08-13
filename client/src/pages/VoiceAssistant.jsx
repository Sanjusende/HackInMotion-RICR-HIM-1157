import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarm } from '../context/FarmContext';
import { sendVoiceQuery, getVoiceHistory } from '../services/voiceService';
import { getCurrentWeather } from '../services/weatherService';
import { analyzeIrrigation } from '../services/irrigationService';
import { getCropHealthHistory } from '../services/cropHealthService';
import { getMarketCurrent } from '../services/marketService';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle2,
  MessageSquare,
  Play,
  Square,
  Trash2,
  Sprout,
  Navigation,
  Compass
} from 'lucide-react';
import Button from '../components/ui/Button';

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'en-US', label: 'English' },
  { code: 'hi-EN', label: 'Hinglish' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' }
];

const COMMAND_CATEGORIES = [
  {
    category: 'Weather',
    commands: ['Aaj ka weather batao.', 'Will it rain today?', 'Temperature kya hai?']
  },
  {
    category: 'Market',
    commands: ['Aaj wheat ka mandi rate kya hai?', 'Which market has the highest wheat price?', 'Market trend kya hai?']
  },
  {
    category: 'Crop Health',
    commands: ['Meri crop ki health kaisi hai?', 'Any disease detected?', 'Show crop health.']
  },
  {
    category: 'Irrigation',
    commands: ['Fasal ko paani kab dena hai?', 'Show irrigation status.']
  },
  {
    category: 'Navigation',
    commands: ['Open dashboard.', 'Open crop health.', 'Open irrigation.', 'Open market analysis.', 'Open weather.']
  }
];

const VoiceAssistant = () => {
  const { farm } = useFarm();
  const navigate = useNavigate();

  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [history, setHistory] = useState([]);

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
      recognition.lang = selectedLang === 'hi-EN' ? 'hi-IN' : selectedLang;

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setTranscript(text);
        setTextInput(text);
      };

      recognition.onend = () => {
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setVoiceState('error');
      };

      recognitionRef.current = recognition;
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getVoiceHistory();
      if (res && res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load voice history:', err);
    }
  };

  // Handle direct navigation commands
  const handleNavigationCommand = (query) => {
    const lower = query.toLowerCase();
    if (lower.includes('open dashboard') || lower.includes('dashboard kholo') || lower.includes('go to dashboard')) {
      navigate('/dashboard');
      return true;
    }
    if (lower.includes('open crop health') || lower.includes('crop health dikhao') || lower.includes('go to crop health')) {
      navigate('/crop-health');
      return true;
    }
    if (lower.includes('open irrigation') || lower.includes('irrigation dekho') || lower.includes('go to irrigation')) {
      navigate('/irrigation');
      return true;
    }
    if (lower.includes('open market') || lower.includes('market analysis') || lower.includes('go to market')) {
      navigate('/market');
      return true;
    }
    if (lower.includes('open weather') || lower.includes('weather report') || lower.includes('go to weather')) {
      navigate('/weather');
      return true;
    }
    return false;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please type your query below.');
      return;
    }

    if (voiceState === 'listening') {
      recognitionRef.current.stop();
      setVoiceState('idle');
    } else {
      setTranscript('');
      setTextInput('');
      try {
        recognitionRef.current.start();
        setVoiceState('listening');
      } catch (err) {
        setVoiceState('idle');
      }
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('idle');
  };

  const handleClearChat = () => {
    handleStopSpeaking();
    setChatMessages([]);
    setTranscript('');
    setTextInput('');
  };

  const handleProcessQuery = async (queryText) => {
    const queryToSubmit = queryText || textInput || transcript;
    if (!queryToSubmit.trim()) return;

    // Check navigation command first
    const wasNavigated = handleNavigationCommand(queryToSubmit);
    if (wasNavigated) return;

    // Add user message to conversation thread
    const userMsg = { id: Date.now(), sender: 'user', text: queryToSubmit };
    setChatMessages((prev) => [...prev, userMsg]);
    setTextInput('');
    setTranscript('');

    setVoiceState('processing');

    try {
      const res = await sendVoiceQuery(queryToSubmit, selectedLang);
      if (res && res.success && res.data) {
        const botMsg = { id: Date.now() + 1, sender: 'krishiMitra', text: res.data.responseText };
        setChatMessages((prev) => [...prev, botMsg]);
        speakText(res.data.responseText, res.data.language);
        fetchHistory();
      } else {
        const fallbackText = "I couldn't retrieve the latest data right now.";
        setChatMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'krishiMitra', text: fallbackText }]);
        speakText(fallbackText, selectedLang);
        setVoiceState('error');
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      const fallbackText = "KrishiMitra couldn't process that request.";
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'krishiMitra', text: fallbackText }]);
      setVoiceState('error');
    }
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang || selectedLang;
      utterance.onstart = () => setVoiceState('speaking');
      utterance.onend = () => setVoiceState('idle');
      utterance.onerror = () => setVoiceState('idle');
      window.speechSynthesis.speak(utterance);
    } else {
      setVoiceState('idle');
    }
  };

  // State Banner Description
  const stateLabelMap = {
    idle: 'KrishiMitra is ready',
    listening: 'KrishiMitra is listening...',
    processing: 'KrishiMitra is thinking...',
    speaking: 'KrishiMitra is speaking...',
    error: "KrishiMitra couldn't process that request."
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* 1 & 2. KRISHIMITRA HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>🌱 KrishiMitra • AI farming companion • 🎙 Ask KrishiMitra</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2.5">
          <span>KrishiMitra</span>
          <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg">AI</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-md mx-auto">
          Ask anything about your farm — weather, market prices, crop health, or irrigation.
        </p>

        {/* Farm Telemetry Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs">
          <span>🌾 Active Crop: <strong>{farm?.currentCrop || 'Wheat'}</strong></span>
          <span>•</span>
          <span>Land: <strong>{farm?.landSize?.value || 5} {farm?.landSize?.unit || 'Acres'}</strong></span>
          <span>•</span>
          <span>📍 <strong>{farm?.location?.display || 'Indore, Madhya Pradesh'}</strong></span>
        </div>
      </div>

      {/* LANGUAGE SELECTOR */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
              selectedLang === lang.code
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* 3 & 5. MAIN VOICE INTERACTION CARD */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs text-center space-y-6 relative overflow-hidden hover:border-emerald-200 transition">
        
        {/* Voice State Status Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700">
          <span className={`w-2 h-2 rounded-full ${
            voiceState === 'listening' ? 'bg-rose-500 animate-ping' :
            voiceState === 'processing' ? 'bg-amber-500 animate-pulse' :
            voiceState === 'speaking' ? 'bg-emerald-500 animate-bounce' : 'bg-emerald-600'
          }`} />
          <span>{stateLabelMap[voiceState]}</span>
        </div>

        {/* Primary Microphone CTA Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={toggleListening}
            aria-label="Ask KrishiMitra microphone"
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all transform shadow-md cursor-pointer ${
              voiceState === 'listening'
                ? 'bg-rose-600 text-white animate-pulse scale-105 shadow-rose-600/30'
                : voiceState === 'processing'
                ? 'bg-amber-500 text-white animate-pulse shadow-amber-500/30'
                : voiceState === 'speaking'
                ? 'bg-emerald-700 text-white shadow-emerald-700/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-emerald-600/30'
            }`}
          >
            {voiceState === 'listening' ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            <span className="text-[10px] font-black uppercase tracking-wider mt-1">
              {voiceState === 'listening' ? 'Listening...' :
               voiceState === 'processing' ? 'Thinking...' :
               voiceState === 'speaking' ? 'Speaking...' : 'Ask KrishiMitra'}
            </span>
          </button>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-center gap-3 text-xs font-bold">
          <button
            onClick={toggleListening}
            aria-label="Ask KrishiMitra"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Mic size={14} />
            <span>🎙 Ask KrishiMitra</span>
          </button>

          {voiceState === 'speaking' && (
            <button
              onClick={handleStopSpeaking}
              aria-label="Stop KrishiMitra"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Square size={14} />
              <span>Stop</span>
            </button>
          )}

          {chatMessages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Text Input / Fallback Query */}
        <div className="max-w-md mx-auto pt-2 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcessQuery(textInput)}
              placeholder="Or type your question (e.g. Aaj wheat ka mandi rate kya hai?)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-800"
            />
            <Button
              onClick={() => handleProcessQuery(textInput)}
              disabled={voiceState === 'processing' || !textInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* 4. CONVERSATION UI THREAD */}
      {chatMessages.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Conversation with KrishiMitra
          </h3>

          <div className="space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl text-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-slate-100 border border-slate-200 text-slate-900 max-w-lg ml-auto'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-950 max-w-xl'
                }`}
              >
                <div className="flex items-center justify-between font-extrabold text-[11px]">
                  <span className={msg.sender === 'user' ? 'text-slate-700' : 'text-emerald-800'}>
                    {msg.sender === 'user' ? '👤 You' : '🌱 KrishiMitra'}
                  </span>
                  {msg.sender === 'krishiMitra' && (
                    <button
                      onClick={() => speakText(msg.text, selectedLang)}
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Volume2 size={12} /> Play
                    </button>
                  )}
                </div>
                <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8 & 9. VOICE COMMAND CHIPS BY CATEGORY */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-emerald-200 transition">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            Supported Voice Commands (English • Hindi • Hinglish)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMAND_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                {cat.category}
              </span>
              <div className="space-y-1.5">
                {cat.commands.map((cmd, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => {
                      setTextInput(cmd);
                      handleProcessQuery(cmd);
                    }}
                    className="w-full text-left p-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer block truncate"
                  >
                    💬 "{cmd}"
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT VOICE Q&A HISTORY */}
      {history.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-emerald-200 transition">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <MessageSquare className="w-4 h-4 text-slate-600" />
            Recent Telemetry Q&A History
          </h2>

          <div className="space-y-2 text-xs">
            {history.slice(0, 5).map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">❓ "{item.query}"</p>
                <p className="text-emerald-900 font-medium text-[11px] leading-relaxed">💡 {item.responseText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default VoiceAssistant;
