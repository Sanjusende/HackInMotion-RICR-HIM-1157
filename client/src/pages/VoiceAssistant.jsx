import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarm } from '../context/FarmContext';
import { sendVoiceQuery, getVoiceHistory } from '../services/voiceService';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Send,
  Trash2,
  Sprout,
  RotateCcw,
  CloudSun,
  TrendingUp,
  HeartPulse,
  Droplets,
  Play,
} from 'lucide-react';
import Button from '../components/ui/Button';

const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'en-US', label: 'English' },
  { code: 'hi-EN', label: 'Hinglish' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'gu-IN', label: 'Gujarati' },
];

const QUICK_ACTIONS = [
  { label: 'Weather', icon: CloudSun, query: 'Aaj ka weather batao.' },
  { label: 'Market', icon: TrendingUp, query: 'Aaj wheat ka mandi rate kya hai?' },
  { label: 'Crop Health', icon: HeartPulse, query: 'Meri crop ki health kaisi hai?' },
  { label: 'Irrigation', icon: Droplets, query: 'Fasal ko paani kab dena hai?' },
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
    if (
      lower.includes('open dashboard') ||
      lower.includes('dashboard kholo') ||
      lower.includes('go to dashboard')
    ) {
      navigate('/dashboard');
      return true;
    }
    if (
      lower.includes('open crop health') ||
      lower.includes('crop health dikhao') ||
      lower.includes('go to crop health')
    ) {
      navigate('/crop-health');
      return true;
    }
    if (
      lower.includes('open irrigation') ||
      lower.includes('irrigation dekho') ||
      lower.includes('go to irrigation')
    ) {
      navigate('/irrigation');
      return true;
    }
    if (
      lower.includes('open market') ||
      lower.includes('market analysis') ||
      lower.includes('go to market')
    ) {
      navigate('/market');
      return true;
    }
    if (
      lower.includes('open weather') ||
      lower.includes('weather report') ||
      lower.includes('go to weather')
    ) {
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
        setChatMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'krishiMitra', text: fallbackText },
        ]);
        speakText(fallbackText, selectedLang);
        setVoiceState('error');
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      const fallbackText = "KrishiMitra couldn't process that request.";
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'krishiMitra', text: fallbackText },
      ]);
      setVoiceState('error');
    }
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      let speechLang = lang || selectedLang;
      if (speechLang === 'hi-EN') {
        speechLang = 'hi-IN';
      }
      utterance.lang = speechLang;
      utterance.onstart = () => setVoiceState('speaking');
      utterance.onend = () => setVoiceState('idle');
      utterance.onerror = () => setVoiceState('idle');
      window.speechSynthesis.speak(utterance);
    } else {
      setVoiceState('idle');
    }
  };

  const latestUserMsg = [...chatMessages].reverse().find((m) => m.sender === 'user');
  const latestBotMsg = [...chatMessages].reverse().find((m) => m.sender === 'krishiMitra');

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* 1 & 2. PAGE HEADER SECTION */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full shadow-2xs">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>KrishiMitra</span>
          <span className="text-[10px] text-emerald-600">•</span>
          <span className="flex items-center gap-1 font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          KrishiMitra
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
          Your AI Farming Companion
        </p>

        {/* Farm Telemetry Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-1 rounded-2xl text-xs font-semibold text-slate-600 shadow-2xs mt-1">
          <span>
            🌾 Active Crop: <strong>{farm?.currentCrop || 'Wheat'}</strong>
          </span>
          <span>•</span>
          <span>
            Land:{' '}
            <strong>
              {farm?.landSize?.value || 5} {farm?.landSize?.unit || 'Acres'}
            </strong>
          </span>
          <span>•</span>
          <span>
            📍 <strong>{farm?.location?.display || 'Indore, Madhya Pradesh'}</strong>
          </span>
        </div>
      </div>

      {/* LANGUAGE SELECTOR BAR */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedLang === lang.code
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* 3, 4, 5, 6. MAIN VOICE MICROPHONE SECTION */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-4 max-w-2xl mx-auto">
        {/* Centered Medium 80px Microphone Button */}
        <div className="flex justify-center relative">
          <button
            type="button"
            onClick={toggleListening}
            aria-label="Ask KrishiMitra microphone"
            disabled={voiceState === 'processing'}
            className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
              voiceState === 'listening'
                ? 'bg-rose-600 ring-4 ring-rose-200 animate-pulse text-white scale-[1.03]'
                : voiceState === 'processing'
                  ? 'bg-amber-500 text-white opacity-90 cursor-not-allowed'
                  : voiceState === 'speaking'
                    ? 'bg-emerald-700 ring-4 ring-emerald-200 text-white'
                    : voiceState === 'error'
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.03] text-white shadow-emerald-600/20'
            }`}
          >
            {voiceState === 'listening' && <MicOff className="w-8 h-8" />}
            {voiceState === 'processing' && <Loader2 className="w-8 h-8 animate-spin" />}
            {voiceState === 'speaking' && <Volume2 className="w-8 h-8" />}
            {voiceState === 'error' && <RotateCcw className="w-8 h-8" />}
            {voiceState === 'idle' && <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Dynamic Voice State Status Text & Waveforms */}
        <div className="space-y-1">
          {voiceState === 'idle' && (
            <>
              <p className="text-lg font-bold text-slate-900">Ask KrishiMitra</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Tap the microphone and speak naturally
              </p>
            </>
          )}

          {voiceState === 'listening' && (
            <>
              <p className="text-lg font-bold text-rose-600">Listening...</p>
              {/* Subtle Waveform */}
              <div className="flex gap-1 justify-center items-center py-1.5">
                <span
                  className="w-1 h-3.5 bg-rose-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-1 h-6 bg-rose-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1 h-8 bg-rose-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
                <span
                  className="w-1 h-6 bg-rose-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1 h-3.5 bg-rose-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Speak your question</p>
            </>
          )}

          {voiceState === 'processing' && (
            <>
              <p className="text-lg font-bold text-amber-600">Thinking...</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                KrishiMitra is processing your request
              </p>
            </>
          )}

          {voiceState === 'speaking' && (
            <>
              <p className="text-lg font-bold text-emerald-700">Speaking...</p>
              {/* Waveform */}
              <div className="flex gap-1 justify-center items-center py-1.5">
                <span
                  className="w-1 h-3 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-1 h-6 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: '200ms' }}
                />
                <span
                  className="w-1 h-8 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: '400ms' }}
                />
                <span
                  className="w-1 h-5 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: '200ms' }}
                />
                <span
                  className="w-1 h-3 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
              </div>
              <button
                onClick={handleStopSpeaking}
                aria-label="Stop speaking"
                className="mt-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition inline-flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <VolumeX size={12} />
                <span>Stop</span>
              </button>
            </>
          )}

          {voiceState === 'error' && (
            <>
              <p className="text-lg font-bold text-rose-600">Something went wrong</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Please try again.</p>
              <button
                onClick={() => setVoiceState('idle')}
                className="mt-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>

      {/* 7 & 18. CONVERSATION MESSAGES AREA */}
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Empty State */}
        {chatMessages.length === 0 && voiceState === 'idle' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center space-y-1.5 shadow-2xs">
            <span className="text-2xl">🌱</span>
            <p className="text-sm font-bold text-slate-900">How can I help?</p>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              Ask KrishiMitra about weather, market prices, crop health or irrigation.
            </p>
          </div>
        )}

        {/* Conversation Thread */}
        {latestUserMsg && (
          <div className="space-y-3">
            {/* User Message */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                You
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800">
                "{latestUserMsg.text}"
              </div>
            </div>

            {/* Assistant Response */}
            {latestBotMsg && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    🌱 KrishiMitra
                  </span>
                  {voiceState === 'speaking' ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Volume2 size={13} className="animate-pulse" /> Speaking
                    </span>
                  ) : (
                    <button
                      onClick={() => speakText(latestBotMsg.text, selectedLang)}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play size={12} /> Play Voice
                    </button>
                  )}
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {latestBotMsg.text}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 8. QUICK ACTIONS */}
      <div className="max-w-2xl mx-auto space-y-2 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Quick actions
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {QUICK_ACTIONS.map((action, idx) => {
            const ActionIcon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setTextInput(action.query);
                  handleProcessQuery(action.query);
                }}
                className="px-3.5 py-2 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ActionIcon size={14} className="text-emerald-600 shrink-0" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. BOTTOM CONTROL AREA */}
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs font-bold">
          {voiceState === 'listening' ? (
            <button
              onClick={toggleListening}
              aria-label="Stop listening"
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <MicOff size={15} />
              <span>Stop Listening</span>
            </button>
          ) : voiceState === 'speaking' ? (
            <button
              onClick={handleStopSpeaking}
              aria-label="Stop speaking"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <VolumeX size={15} />
              <span>Stop Speaking</span>
            </button>
          ) : (
            <button
              onClick={toggleListening}
              aria-label="Ask KrishiMitra"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Mic size={15} />
              <span>🎙 Ask KrishiMitra</span>
            </button>
          )}

          {chatMessages.length > 0 && (
            <button
              onClick={handleClearChat}
              aria-label="Clear conversation"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1 cursor-pointer border border-slate-200 shrink-0"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Compact Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessQuery(textInput);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type your question here..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
          <Button
            type="submit"
            disabled={voiceState === 'processing' || !textInput.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shrink-0"
          >
            <Send size={14} />
          </Button>
        </form>
      </div>

      {/* 12. RECENT CONVERSATIONS */}
      <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Recent
        </span>

        {history.length > 0 ? (
          <div className="space-y-2 text-xs">
            {history.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1"
              >
                <p className="font-bold text-slate-900">You: "{item.query}"</p>
                <p className="text-emerald-900 font-semibold text-[11px]">
                  KrishiMitra: {item.responseText}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium text-center py-2">
            No recent conversations
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
