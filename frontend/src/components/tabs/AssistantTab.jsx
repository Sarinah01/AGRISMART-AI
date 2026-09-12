import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_LEAF_IMAGE } from '../../constants/data';
import { getStoredUser, computeInitials } from '../../utils/userStore';
import { askAssistant, processVoice } from '../../services/api';

export default function AssistantTab({ pendingPrompt, onClearPendingPrompt, scanResult, user }) {
  const activeUser = user || getStoredUser();
  const cropContext = scanResult?.crop || "Tomato";
  const diseaseContext = scanResult?.prediction || "Tomato Early Blight";
  const confidenceContext = scanResult?.confidence_percentage || "91%";

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hi! I'm the AgriSmart AI Agronomist assistant. I'm preloaded with telemetry for ${diseaseContext} (${confidenceContext} confidence).`,
      subtext: "How can I help you clarify this prediction, recommend bio-fungicides, or guide canopy management?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const chatFeedRef = useRef(null);

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
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
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
      const response = await askAssistant(text, cropContext, diseaseContext, historyPayload);

      setIsTyping(false);
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply,
        subtext: response.subtext || `Source: ${response.source}`
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setIsTyping(false);
      const errorReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `For ${diseaseContext}, key precautions include removing infected foliage, avoiding overhead watering, and monitoring adjacent crop rows.`,
        subtext: `Fallback mode (${err.message})`
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  const handleVoiceInput = async () => {
    setIsVoiceRecording(true);
    setTimeout(async () => {
      setIsVoiceRecording(false);
      try {
        const voiceRes = await processVoice("What precautions should I take for Early Blight?", "en");
        sendMessage(voiceRes.transcription || "What precautions should I take for Early Blight?");
      } catch (err) {
        sendMessage("What precautions should I take?");
      }
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const suggestedPrompts = [
    { text: "What does this disease mean?", icon: "help" },
    { text: "What precautions should I take?", icon: "shield" },
    { text: "Explain this result simply", icon: "psychology" },
    { text: "How can I prevent this disease from spreading?", icon: "fence" }
  ];

  const userInitials = activeUser?.initials || computeInitials(activeUser?.name) || "HP";

  return (
    <section className="tab-content space-y-6" id="tab-AI Farmer Assistant">
      {/* Header Banner with animated badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-label-sm font-label-sm mb-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="material-symbols-outlined text-sm" data-icon="smart_toy">smart_toy</span>
            <span>Hackathon Conversational Prototype · Online</span>
          </div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface dark:text-[#ecfdf5] font-extrabold">AI Farmer Assistant</h2>
          <p className="text-body-md font-body-md text-on-surface-variant dark:text-emerald-200/80">
            Ask questions regarding predictions, symptoms, precautions, and general agronomic guidelines.
          </p>
        </div>

        <div className="group bg-surface-container-lowest dark:bg-[#112117] border border-[#10b981]/30 dark:border-emerald-700/40 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm hover:shadow-[0_6px_20px_rgba(16,185,129,0.18)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="relative overflow-hidden rounded-xl w-10 h-10 ring-2 ring-emerald-500/20">
            <img
              alt="Attached Context"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src={DEFAULT_LEAF_IMAGE}
            />
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-label-sm font-label-sm font-bold text-primary dark:text-primary-fixed">Active Telemetry Context</p>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface dark:text-emerald-100 truncate text-xs font-medium">Tomato Early Blight (91%)</p>
          </div>
        </div>
      </div>

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
                  <div className="p-4 rounded-2xl rounded-tl-none bg-[#f4f7f4] dark:bg-[#15271c] border border-[#14532d]/10 dark:border-emerald-800/30 space-y-2 text-on-surface dark:text-[#ecfdf5] shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-body-sm font-body-sm leading-relaxed whitespace-pre-line font-medium">
                      {msg.text}
                    </p>
                    {msg.subtext && (
                      <p className="text-body-sm font-body-sm leading-relaxed text-on-surface-variant dark:text-emerald-200/80 pt-1 border-t border-outline-variant/15 dark:border-emerald-800/20">
                        {msg.subtext}
                      </p>
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
                <span className="text-xs text-on-surface-variant dark:text-emerald-300/70 ml-1 font-medium">AgriSmart AI analyzing agronomic context...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompt Pills in Chat */}
        <div className="px-4 py-2.5 bg-surface-container-lowest dark:bg-[#0d1c13] border-t border-outline-variant/20 dark:border-emerald-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-label-sm font-label-sm text-on-surface-variant dark:text-emerald-300/80 flex-shrink-0 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-amber-500" data-icon="tips_and_updates">tips_and_updates</span>
            <span>Suggested:</span>
          </span>
          {suggestedPrompts.map((prompt, idx) => (
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

        {/* Input Bar */}
        <div className="p-4 bg-surface-container-lowest dark:bg-[#0d1c13] border-t border-outline-variant/20 dark:border-emerald-900/30">
          <form className="flex items-center gap-2.5" id="chat-form" onSubmit={handleSubmit}>
            <div className="relative flex-1">
              <input
                className="w-full h-12 pl-4 pr-10 rounded-2xl bg-[#f4f7f4] dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#1c3627] focus:ring-2 focus:ring-emerald-500/20 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all placeholder:text-stone-400 dark:placeholder:text-emerald-300/40"
                id="chat-input"
                placeholder="Ask about disease symptoms, bio-fungicides, or canopy care..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-emerald-300/50 text-base pointer-events-none" data-icon="keyboard">
                keyboard
              </span>
            </div>
            <button
              className="group h-12 px-6 rounded-2xl bg-gradient-to-r from-primary-container to-[#14532d] hover:from-[#14532d] hover:to-[#0f3d21] text-on-primary font-label-md flex items-center gap-2 shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] transition-all active:scale-95 hover-lift"
              type="submit"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform" data-icon="send">send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
