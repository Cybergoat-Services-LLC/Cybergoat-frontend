'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon, 
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useModals } from './site-modals';
import { TrainingTrigger } from './interactive-buttons';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'bot',
    text: '👋 Hello! I am CyberGOAT AI Assistant. How can I help you with our cybersecurity training programs or EC-Council certifications today?',
    timestamp: 'Just now',
  },
];

const QUICK_SUGGESTIONS = [
  'Which course is best for beginners?',
  'Tell me about EC-Council certifications',
  'How do I book a corporate training consultation?',
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { openContact } = useModals();

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
      id: Date.now().toString(),
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
        body: JSON.stringify({ message: query }),
      });
      const resData = await res.json();
      const botResponse =
        resData.reply ||
        'Thank you for reaching out! Please connect with our admissions advisor on WhatsApp (+971 55 184 6786).';

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Connection update in progress. Please reach out to admin@cybergoat.ae or +971 55 184 6786.',
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
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white rounded-full shadow-[0_0_30px_rgba(47,87,239,0.5)] hover:scale-105 transition-all duration-300"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0DCAF0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0DCAF0]"></span>
          </span>
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
          <span className="font-bold text-sm tracking-wide hidden sm:inline">Ask CyberGOAT AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[520px] bg-[#0A0F1A] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl glass-card animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-[#05080F] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2F57EF] to-[#0DCAF0] flex items-center justify-center text-white">
                <CpuChipIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  CyberGOAT AI <SparklesIcon className="w-4 h-4 text-[#0DCAF0]" />
                </h3>
                <p className="text-xs text-gray-400">Security & Training Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrainingTrigger className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-[#00F0FF] transition-colors cursor-pointer" title="Manage AI Training Data">
                <Cog6ToothIcon className="w-5 h-5" />
              </TrainingTrigger>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
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
                      : 'bg-[#2F57EF]/20 text-[#0DCAF0]'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <UserIcon className="w-4 h-4" />
                  ) : (
                    <CpuChipIcon className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white rounded-tr-none'
                      : 'bg-[#05080F] border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="block text-[10px] text-gray-400 mt-1.5 opacity-70">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic p-2">
                <CpuChipIcon className="w-4 h-4 animate-spin text-[#0DCAF0]" />
                CyberGOAT AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="p-2.5 bg-[#05080F]/50 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-[#2F57EF] transition-all"
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
              placeholder="Ask about training, certs, or pricing..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-gradient-to-r from-[#2F57EF] to-[#0DCAF0] text-white rounded-full disabled:opacity-40 hover:scale-105 transition-all"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
