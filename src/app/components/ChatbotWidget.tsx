'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
};

const ENTERPRISE_INITIAL_MESSAGE =
  "👋 Marhaba! I'm Layla, your Sovereign AI GRC & Compliance Advisor. How can I assist you with automated compliance across DESC ISR v3.1, UAE PDPL, CBUAE, or Enterprise Workforce Competency today?";

const ACADEMY_INITIAL_MESSAGE =
  "👋 Hello! I'm Layla, your Certification & Workforce Advisor. How can I guide your team through official EC-Council certification tracks, cloud iLabs, or statutory training evidence today?";

const ENTERPRISE_SUGGESTIONS = [
  'How does CyberGOAT automate DESC ISR v3.1?',
  'How does Workforce Competency link to the Evidence Vault?',
  'What are the UAE Sovereign Data Residency tiers?',
  'Book a Sovereign GRC Platform Demo',
];

const ACADEMY_SUGGESTIONS = [
  'Which certification fits my role (SOC, Cloud, IR, CISO)?',
  'What is included in official EC-Council kits?',
  'How do certifications map to GRC audit workpapers?',
  'How do enterprise seat pools work?',
];

export default function ChatbotWidget() {
  const pathname = usePathname();
  const isAcademy = pathname?.startsWith('/academy');

  const initialGreeting = isAcademy ? ACADEMY_INITIAL_MESSAGE : ENTERPRISE_INITIAL_MESSAGE;
  const quickSuggestions = isAcademy ? ACADEMY_SUGGESTIONS : ENTERPRISE_SUGGESTIONS;
  const inputPlaceholder = isAcademy
    ? 'Ask Layla about certifications, iLabs, vouchers, or syllabus...'
    : 'Ask Layla about Sovereign GRC, DESC ISR, or Workforce Competency...';
  const subtitle = isAcademy
    ? 'Accredited Certification & Training Advisor'
    : 'Sovereign GRC & Compliance Advisor';

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: initialGreeting,
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(1);
  const generateMessageId = () => (++nextMessageId.current).toString();

  // Adapt greeting when switching routes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: isAcademy ? ACADEMY_INITIAL_MESSAGE : ENTERPRISE_INITIAL_MESSAGE,
        timestamp: 'Just now',
      },
    ]);
  }, [isAcademy]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: generateMessageId(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          page: isAcademy ? 'academy' : 'homepage',
        }),
      });
      const resData = await res.json();
      const botResponse =
        resData.reply ||
        'Thank you for reaching out! Please connect directly with our advisory team on WhatsApp (+971 55 184 6786) or email admin@cybergoat.ae.';

      const botMsg: Message = {
        id: generateMessageId(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: generateMessageId(),
        sender: 'bot',
        text: 'Connection update in progress. Please reach out directly to admin@cybergoat.ae or +971 55 184 6786.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#2F57EF] via-[#0DCAF0] to-[#C664FF] text-white rounded-full shadow-[0_0_30px_rgba(47,87,239,0.5)] hover:scale-105 transition-all duration-300"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]"></span>
          </span>
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
          <span className="font-bold text-sm tracking-wide hidden sm:inline">Ask Layla AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[530px] bg-[#0A0F1A] border border-[#00F0FF]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl glass-card animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-[#05080F] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2F57EF] to-[#00F0FF] flex items-center justify-center text-black font-extrabold text-sm shadow-md">
                L
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  Layla AI <SparklesIcon className="w-4 h-4 text-[#00F0FF]" />
                </h3>
                <p className="text-[11px] text-gray-400 font-mono">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-[#C664FF]/20 text-[#C664FF]'
                      : 'bg-[#00F0FF]/20 text-[#00F0FF]'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <UserIcon className="w-4 h-4" />
                  ) : (
                    <ShieldCheckIcon className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white rounded-tr-none'
                      : 'bg-[#05080F] border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed text-xs sm:text-sm">{msg.text}</p>
                  <span className="block text-[10px] text-gray-400 mt-1.5 opacity-70">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic p-2">
                <CpuChipIcon className="w-4 h-4 animate-spin text-[#00F0FF]" />
                Layla is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="p-2.5 bg-[#05080F]/80 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {quickSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-[#00F0FF] hover:border-[#00F0FF]/40 transition-all cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#05080F] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black rounded-full disabled:opacity-40 hover:scale-105 transition-all cursor-pointer shadow-md"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
