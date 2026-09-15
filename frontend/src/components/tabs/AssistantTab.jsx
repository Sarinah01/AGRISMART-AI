import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_LEAF_IMAGE } from '../../constants/data';
import { getStoredUser, computeInitials } from '../../utils/userStore';
import { askAssistant, processVoice } from '../../services/api';

const LANGUAGES = [
  { code: 'en', name: 'English', speechCode: 'en-IN', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी (Hindi)', speechCode: 'hi-IN', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', speechCode: 'pa-IN', flag: '🌾' },
  { code: 'mr', name: 'मराठी (Marathi)', speechCode: 'mr-IN', flag: '🚩' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', speechCode: 'gu-IN', flag: '🏛️' },
  { code: 'te', name: 'తెలుగు (Telugu)', speechCode: 'te-IN', flag: '🌿' },
  { code: 'ta', name: 'தமிழ் (Tamil)', speechCode: 'ta-IN', flag: '🌴' },
  { code: 'bn', name: 'বাংলা (Bengali)', speechCode: 'bn-IN', flag: '🐟' },
];

const PROMPTS_BY_LANG = {
  en: [
    { text: "What does this disease mean?", icon: "help" },
    { text: "What precautions should I take?", icon: "shield" },
    { text: "Explain this result simply", icon: "psychology" },
    { text: "How can I prevent this disease from spreading?", icon: "fence" }
  ],
  hi: [
    { text: "इस बीमारी का क्या मतलब है?", icon: "help" },
    { text: "मुझे क्या सावधानियां बरतनी चाहिए?", icon: "shield" },
    { text: "इसे आसान शब्दों में समझाइए", icon: "psychology" },
    { text: "बीमारी को फैलने से कैसे रोकें?", icon: "fence" }
  ],
  pa: [
    { text: "ਇਸ ਬਿਮਾਰੀ ਦਾ ਕੀ ਮਤਲਬ ਹੈ?", icon: "help" },
    { text: "ਮੈਨੂੰ ਕੀ ਸਾਵਧਾਨੀਆਂ ਵਰਤਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?", icon: "shield" },
    { text: "ਇਸਨੂੰ ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ", icon: "psychology" },
    { text: "ਬਿਮਾਰੀ ਨੂੰ ਫੈਲਣ ਤੋਂ ਕਿਵੇਂ ਰੋਕਿਆ ਜਾਵੇ?", icon: "fence" }
  ],
  mr: [
    { text: "या रोगाचा काय अर्थ आहे?", icon: "help" },
    { text: "मी कोणती काळजी घेतली पाहिजे?", icon: "shield" },
    { text: "सोप्या भाषेत स्पष्ट करा", icon: "psychology" },
    { text: "हा रोग पसरण्यापासून कसा रोखावा?", icon: "fence" }
  ],
  gu: [
    { text: "આ રોગનો અર્થ શું છે?", icon: "help" },
    { text: "મારે કઈ સાવચેતી રાખવી જોઈએ?", icon: "shield" },
    { text: "આને સરળ ભાષામાં સમજાવો", icon: "psychology" },
    { text: "આ રોગને ફેલાતો કેવી રીતે રોકવો?", icon: "fence" }
  ],
  te: [
    { text: "ఈ వ్యాధి అంటే ఏమిటి?", icon: "help" },
    { text: "నేను ఏ జాగ్రత్తలు తీసుకోవాలి?", icon: "shield" },
    { text: "దీనిని సులభంగా వివరించండి", icon: "psychology" },
    { text: "ఈ వ్యాధి వ్యాప్తిని ఎలా నివారించాలి?", icon: "fence" }
  ],
  ta: [
    { text: "இந்த நோயின் பொருள் என்ன?", icon: "help" },
    { text: "நான் என்ன முன்னெச்சரிக்கை நடவடிக்கைகளை எடுக்க வேண்டும்?", icon: "shield" },
    { text: "எளிய முறையில் விளக்கவும்", icon: "psychology" },
    { text: "நோய் பரவுவதை எவ்வாறு தடுப்பது?", icon: "fence" }
  ],
  bn: [
    { text: "এই রোগের অর্থ কী?", icon: "help" },
    { text: "আমার কী কী সতর্কতা নেওয়া উচিত?", icon: "shield" },
    { text: "সহজ ভাষায় বুঝিয়ে বলুন", icon: "psychology" },
    { text: "এই রোগ ছড়ানো কীভাবে রোধ করব?", icon: "fence" }
  ]
};

const WELCOME_MESSAGES = {
  en: "Namaste! I am your AgriSmart AI Agronomist. Ask me anything in your preferred language or talk to me using the microphone!",
  hi: "नमस्ते! मैं आपका एग्रीस्मार्ट एआई कृषि सलाहकार हूं। अपनी पसंदीदा भाषा में प्रश्न पूछें या माइक से बात करें!",
  pa: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਸਮਾਰਟ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਮਾਈਕ ਦੀ ਵਰਤੋਂ ਕਰੋ!",
  mr: "नमस्कार! मी तुमचा ॲग्रीस्मार्ट AI कृषी सल्लागार आहे. तुमच्या आवडीच्या भाषेत प्रश्न विचारा किंवा माइकद्वारे बोला!",
  gu: "નમસ્તે! હું તમારો એગ્રીસ્માર્ટ AI ખેતી સલાહકાર છું. તમારી પસંદગીની ભાષામાં પ્રશ્નો પૂછો અથવા માઇક વડે બોલો!",
  te: "నమస్కారం! నేను మీ అగ్రిస్మార్ట్ AI వ్యవసాయ సలహాదారుని. మీ ప్రాధాన్యత కలిగిన భాషలో నన్ను ఏదైనా అడగండి!",
  ta: "வணக்கம்! நான் உங்கள் அக்ரிஸ்மார்ட் AI வேளாண் ஆலோசகர். உங்கள் மொழியில் கேள்விகளைக் கேட்கலாம்!",
  bn: "নমস্কার! আমি আপনার এগ্রিসমার্ট AI কৃষি বিশেষজ্ঞ। আপনার নিজস্ব ভাষায় প্রশ্ন জিজ্ঞাসা করুন বা মাইক ব্যবহার করুন!"
};

export default function AssistantTab({ pendingPrompt, onClearPendingPrompt, scanResult, user }) {
  const activeUser = user || getStoredUser();
  const cropContext = scanResult?.crop || "Tomato";
  const diseaseContext = scanResult?.prediction || "Tomato Early Blight";
  const confidenceContext = scanResult?.confidence_percentage || "91%";

  const [selectedLang, setSelectedLang] = useState('en');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Voice STT / TTS state
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const chatFeedRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleSaveApiKey = (keyVal) => {
    setApiKey(keyVal);
    localStorage.setItem('gemini_api_key', keyVal.trim());
  };

  // Initialize welcome message when language or scan result changes
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: WELCOME_MESSAGES[selectedLang] || WELCOME_MESSAGES['en'],
        subtext: `Telemetry Context: ${cropContext} - ${diseaseContext} (${confidenceContext} confidence)`
      }
    ]);
  }, [selectedLang, cropContext, diseaseContext, confidenceContext]);

  useEffect(() => {
    if (pendingPrompt) {
      sendMessage(pendingPrompt);
      onClearPendingPrompt();
    }
  }, [pendingPrompt]);

  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages, isTyping, isListening]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentLangObj = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  const sendMessage = async (text, fromVoice = false) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const historyPayload = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response = await askAssistant(
        text,
        cropContext,
        diseaseContext,
        historyPayload,
        selectedLang,
        apiKey.trim() || undefined,
        userName
      );

      setIsTyping(false);
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply,
        subtext: response.subtext || `Source: ${response.source}`
      };

      setMessages((prev) => [...prev, aiReply]);

      if (autoSpeak || fromVoice) {
        speakText(aiReply.text, aiReply.id);
      }
    } catch (err) {
      setIsTyping(false);
      const errorReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `For ${diseaseContext}, key precautions include removing infected foliage, avoiding overhead watering, and keeping soil dry.`,
        subtext: `Fallback mode (${err.message})`
      };
      setMessages((prev) => [...prev, errorReply]);

      if (autoSpeak || fromVoice) {
        speakText(errorReply.text, errorReply.id);
      }
    }
  };

  // Text-To-Speech (TTS) handler
  const speakText = (text, msgId) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    if (speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLangObj.speechCode || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
  };

  // Speech-To-Text (STT) handler using browser Web Speech API with fallback
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: prompt mock microphone simulation
      setIsListening(true);
      setInterimTranscript("Listening (Simulation Mode)...");
      setTimeout(async () => {
        setIsListening(false);
        setInterimTranscript('');
        try {
          const voiceRes = await processVoice(
            "What precautions should I take for Early Blight?",
            selectedLang,
            cropContext,
            diseaseContext
          );
          sendMessage(voiceRes.transcription || "What precautions should I take?", true);
        } catch {
          sendMessage("What precautions should I take?", true);
        }
      }, 2500);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLangObj.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInterimTranscript(transcript);
        if (event.results[0].isFinal) {
          setIsListening(false);
          setInterimTranscript('');
          if (transcript.trim()) {
            sendMessage(transcript.trim(), true);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: WELCOME_MESSAGES[selectedLang] || WELCOME_MESSAGES['en'],
        subtext: `Telemetry Context: ${cropContext} - ${diseaseContext} (${confidenceContext} confidence)`
      }
    ]);
  };

  const activePrompts = PROMPTS_BY_LANG[selectedLang] || PROMPTS_BY_LANG['en'];
  const userInitials = activeUser?.initials || computeInitials(activeUser?.name) || "HP";

  return (
    <section className="tab-content space-y-6" id="tab-AI Farmer Assistant">
      {/* Header Banner & Language Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-[#112117] p-5 rounded-3xl border border-[#14532d]/15 dark:border-emerald-800/30 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-label-sm font-label-sm mb-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="material-symbols-outlined text-sm" data-icon="record_voice_over">record_voice_over</span>
            <span>Multi-Lingual Voice Assistant · Active</span>
          </div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface dark:text-[#ecfdf5] font-extrabold flex items-center gap-2">
            <span>AI Farmer Assistant & Voice</span>
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant dark:text-emerald-200/80">
            Ask questions about crop diseases, precautions, fertilizers, or talk directly in your native language.
          </p>
        </div>

        {/* Multi-Lingual Controls & Context */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-2 bg-[#f4f7f4] dark:bg-[#162a1e] px-3.5 py-2 rounded-2xl border border-outline-variant/30 dark:border-emerald-700/40 shadow-sm">
            <span className="text-lg">{currentLangObj.flag}</span>
            <select
              className="bg-transparent text-label-md font-label-md text-on-surface dark:text-[#ecfdf5] focus:outline-none cursor-pointer font-bold"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-[#112117] text-stone-900 dark:text-emerald-100">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Speak Toggle */}
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-label-sm font-label-sm transition-all shadow-sm ${
              autoSpeak
                ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-[#f4f7f4] dark:bg-[#162a1e] text-on-surface-variant dark:text-emerald-200 border-outline-variant/30 dark:border-emerald-700/40 hover:bg-emerald-50 dark:hover:bg-[#1d3827]'
            }`}
            title="Automatically speak AI responses out loud"
          >
            <span className="material-symbols-outlined text-base" data-icon={autoSpeak ? "volume_up" : "volume_off"}>
              {autoSpeak ? "volume_up" : "volume_off"}
            </span>
            <span className="font-semibold">{autoSpeak ? "Voice Auto-Play ON" : "Voice Auto-Play OFF"}</span>
          </button>

          {/* Gemini API Key Settings Button */}
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-label-sm font-label-sm transition-all shadow-sm ${
              apiKey
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/30'
                : 'bg-[#f4f7f4] dark:bg-[#162a1e] text-stone-600 dark:text-emerald-300 border-outline-variant/30 dark:border-emerald-700/40 hover:bg-emerald-50 dark:hover:bg-[#1d3827]'
            }`}
            title="Configure Gemini LLM API Key"
          >
            <span className="material-symbols-outlined text-base" data-icon="key">key</span>
            <span className="font-semibold">{apiKey ? "Gemini LLM Key Active" : "Add LLM Key"}</span>
          </button>

          {/* Clear Chat Button */}
          <button
            type="button"
            onClick={clearChat}
            className="p-2.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#162a1e] text-stone-600 dark:text-emerald-300 hover:text-red-600 dark:hover:text-red-400 border border-outline-variant/30 dark:border-emerald-700/40 transition-colors shadow-sm"
            title="Reset Chat"
          >
            <span className="material-symbols-outlined text-lg" data-icon="refresh">refresh</span>
          </button>

          {/* Active Context Card */}
          <div className="group bg-emerald-950/40 dark:bg-[#15271c] border border-emerald-500/30 rounded-2xl p-2 px-3 flex items-center gap-2.5 shadow-sm">
            <div className="relative overflow-hidden rounded-xl w-8 h-8 ring-2 ring-emerald-500/20">
              <img
                alt="Attached Context"
                className="w-full h-full object-cover"
                src={DEFAULT_LEAF_IMAGE}
              />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-400">Active Telemetry</p>
              <p className="text-xs font-semibold text-white truncate max-w-[140px]">{diseaseContext}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable API Key Drawer */}
      {showKeyInput && (
        <div className="bg-emerald-950/90 dark:bg-[#152a1d] p-4 rounded-2xl border border-amber-500/40 shadow-lg animate-fade-in-up space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="material-symbols-outlined text-base" data-icon="key">key</span>
              <span>Gemini LLM API Key (Optional)</span>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-300 underline hover:text-white"
            >
              Get Free Key from Google AI Studio
            </a>
          </div>
          <p className="text-xs text-emerald-200/80">
            Paste your Google Gemini API key to enable 100% live unseeded generative AI responses for any custom question.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#0b160f] border border-emerald-700/50 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            />
            {apiKey && (
              <button
                type="button"
                onClick={() => handleSaveApiKey('')}
                className="px-3 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold"
              >
                Clear Key
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl border border-[#14532d]/15 dark:border-emerald-800/30 shadow-md flex flex-col h-[580px] overflow-hidden transition-colors duration-200">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" id="chat-feed" ref={chatFeedRef}>
          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
              {msg.sender === 'ai' ? (
                <div className="flex items-start gap-3 max-w-2xl animate-fade-in-up">
                  <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-container to-[#14532d] text-on-primary flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-emerald-500/30 dark:ring-emerald-400/30">
                    <span className="material-symbols-outlined text-xl" data-icon="smart_toy">smart_toy</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#112117]"></span>
                  </div>

                  <div className="relative group p-4 rounded-2xl rounded-tl-none bg-[#f4f7f4] dark:bg-[#15271c] border border-[#14532d]/10 dark:border-emerald-800/30 space-y-2 text-on-surface dark:text-[#ecfdf5] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-body-sm font-body-sm leading-relaxed whitespace-pre-line font-medium pr-6">
                        {msg.text}
                      </p>
                      
                      {/* Audio Speaker Play Button */}
                      <button
                        type="button"
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
                          speakingMsgId === msg.id
                            ? 'bg-emerald-500 text-white animate-pulse shadow-md ring-2 ring-emerald-400/50'
                            : 'bg-stone-200/70 dark:bg-emerald-900/50 text-stone-700 dark:text-emerald-200 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title={speakingMsgId === msg.id ? "Stop Voice" : "Listen in Native Voice"}
                      >
                        <span className="material-symbols-outlined text-lg" data-icon={speakingMsgId === msg.id ? "volume_up" : "campaign"}>
                          {speakingMsgId === msg.id ? "volume_up" : "campaign"}
                        </span>
                      </button>
                    </div>

                    {msg.subtext && (
                      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/15 dark:border-emerald-800/20">
                        <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/80 text-xs">
                          {msg.subtext}
                        </p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                          {currentLangObj.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 max-w-2xl ml-auto flex-row-reverse animate-fade-in-up">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-[#064e3b] text-on-primary flex items-center justify-center flex-shrink-0 font-bold text-label-md shadow-md ring-2 ring-emerald-400/40">
                    {userInitials}
                  </div>
                  <div className="p-4 rounded-2xl rounded-tr-none bg-gradient-to-r from-emerald-800 to-emerald-900 dark:from-emerald-700 dark:to-emerald-800 text-white space-y-1 shadow-[0_4px_14px_rgba(6,95,70,0.25)]">
                    <p className="text-body-sm font-body-sm leading-relaxed font-medium">{msg.text}</p>
                    <span className="text-[10px] text-emerald-200/80 block text-right">Just now</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Dynamic Voice Recording / Listening Overlay */}
          {isListening && (
            <div className="p-4 rounded-2xl bg-emerald-950/90 text-white border border-emerald-500/40 flex items-center justify-between gap-4 animate-pulse shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white ring-4 ring-red-500/30 animate-bounce">
                  <span className="material-symbols-outlined text-xl" data-icon="mic">mic</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-300">Listening to your voice ({currentLangObj.name})...</p>
                  <p className="text-xs text-stone-300 italic">{interimTranscript || "Speak clearly into your microphone..."}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={stopListening}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all"
              >
                Stop
              </button>
            </div>
          )}

          {/* Dynamic AI typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 animate-fade-in-up">
              <div className="w-9 h-9 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg" data-icon="smart_toy">smart_toy</span>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-[#f4f7f4] dark:bg-[#15271c] border border-[#14532d]/10 dark:border-emerald-800/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="text-xs text-on-surface-variant dark:text-emerald-300/70 ml-1 font-medium">
                  AgriSmart AI formulating response in {currentLangObj.name}...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Localized Suggested Prompt Pills */}
        <div className="px-4 py-2.5 bg-surface-container-lowest dark:bg-[#0d1c13] border-t border-outline-variant/20 dark:border-emerald-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-label-sm font-label-sm text-on-surface-variant dark:text-emerald-300/80 flex-shrink-0 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-amber-500" data-icon="tips_and_updates">tips_and_updates</span>
            <span>{selectedLang === 'hi' ? 'सुझाव:' : selectedLang === 'pa' ? 'ਸੁਝਾਅ:' : selectedLang === 'mr' ? 'सुचवलेले:' : selectedLang === 'gu' ? 'સૂચવેલ:' : selectedLang === 'te' ? 'సూచించినవి:' : selectedLang === 'ta' ? 'பரிந்துரைக்கப்பட்டவை:' : selectedLang === 'bn' ? 'সুপারিশকৃত:' : 'Suggested:'}</span>
          </span>
          {activePrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="hover-lift active:scale-95 px-3.5 py-1.5 rounded-full bg-[#f4f7f4] dark:bg-[#162a1e] hover:bg-emerald-50 dark:hover:bg-[#1d3827] text-on-surface-variant dark:text-emerald-200 hover:text-primary dark:hover:text-primary-fixed text-label-sm font-label-sm whitespace-nowrap border border-outline-variant/30 dark:border-emerald-700/40 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm transition-all flex items-center gap-1.5 group"
              onClick={() => sendMessage(prompt.text)}
              type="button"
            >
              <span className="material-symbols-outlined text-xs text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform" data-icon={prompt.icon}>{prompt.icon}</span>
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="p-4 bg-surface-container-lowest dark:bg-[#0d1c13] border-t border-outline-variant/20 dark:border-emerald-900/30">
          <form className="flex items-center gap-2.5" id="chat-form" onSubmit={handleSubmit}>
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 hover-lift ${
                isListening
                  ? 'bg-red-600 text-white ring-4 ring-red-500/40 animate-pulse'
                  : 'bg-[#f4f7f4] dark:bg-[#162a1e] text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white border border-outline-variant/30 dark:border-emerald-700/40'
              }`}
              title={isListening ? "Stop Voice Listening" : `Speak in ${currentLangObj.name}`}
            >
              <span className="material-symbols-outlined text-xl" data-icon="mic">mic</span>
            </button>

            <div className="relative flex-1">
              <input
                className="w-full h-12 pl-4 pr-10 rounded-2xl bg-[#f4f7f4] dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#1c3627] focus:ring-2 focus:ring-emerald-500/20 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all placeholder:text-stone-400 dark:placeholder:text-emerald-300/40"
                id="chat-input"
                placeholder={
                  selectedLang === 'hi'
                    ? "बीमारी के लक्षण, जैविक उपाय या सिंचाई के बारे में पूछें..."
                    : selectedLang === 'pa'
                    ? "ਬਿਮਾਰੀ ਦੇ ਲੱਛਣ, ਜੈਵਿਕ ਇਲਾਜ ਜਾਂ ਸਿੰਚਾਈ ਬਾਰੇ ਪੁੱਛੋ..."
                    : selectedLang === 'mr'
                    ? "रोगाची लक्षणे, सेंद्रिय उपाय किंवा सिंचनाबद्दल विचारा..."
                    : selectedLang === 'gu'
                    ? "રોગના લક્ષણો, જૈવિક ઉપાયો અથવા સિંચાઈ વિશે પૂછો..."
                    : selectedLang === 'te'
                    ? "వ్యాధి లక్షణాలు, సేంద్రీయ నివారణల గురించి అడగండి..."
                    : selectedLang === 'ta'
                    ? "நோய் அறிகுறிகள், இயற்கை தீர்வுகள் பற்றி கேட்கவும்..."
                    : selectedLang === 'bn'
                    ? "রোগের লক্ষণ, জৈব প্রতিকার বা সেচ সম্পর্কে জিজ্ঞাসা করুন..."
                    : "Ask about disease symptoms, bio-fungicides, or canopy care..."
                }
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-emerald-300/50 text-base pointer-events-none" data-icon="keyboard">
                keyboard
              </span>
            </div>

            {/* Send Button */}
            <button
              className="group h-12 px-6 rounded-2xl bg-gradient-to-r from-primary-container to-[#14532d] hover:from-[#14532d] hover:to-[#0f3d21] text-on-primary font-label-md flex items-center gap-2 shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] transition-all active:scale-95 hover-lift"
              type="submit"
            >
              <span>{selectedLang === 'hi' ? 'भेजें' : selectedLang === 'pa' ? 'ਭੇਜੋ' : selectedLang === 'mr' ? 'पाठवा' : selectedLang === 'gu' ? 'મોકલો' : 'Send'}</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform" data-icon="send">send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

