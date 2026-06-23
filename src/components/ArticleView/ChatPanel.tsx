import React from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { ChatMessage, Article } from '../../types';

interface ChatPanelProps {
  article: Article;
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  isFocusMode: boolean;
  messages: ChatMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isTyping: boolean;
  handleSend: (e?: React.FormEvent) => void;
  renderChatMessageContent: (text: string) => React.ReactNode;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatPanel({
  article,
  isChatOpen,
  setIsChatOpen,
  isFocusMode,
  messages,
  inputValue,
  setInputValue,
  isTyping,
  handleSend,
  renderChatMessageContent,
  chatEndRef
}: ChatPanelProps) {
  return (
    <div 
      id="chatbot-drawer-container"
      className={`transition-all duration-500 ease-in-out flex flex-col shrink-0 bg-white dark:bg-[#1C1C1E] ${isChatOpen ? 'border-l border-r border-b border-[#F3F3F3] dark:border-0' : 'border-none'} ${isFocusMode ? 'z-[70] relative shadow-2xl' : 'z-10'}`}
      style={{
        width: isChatOpen ? '340px' : '0px',
        minWidth: isChatOpen ? '340px' : '0px',
        maxWidth: isChatOpen ? '340px' : '0px',
        opacity: isChatOpen ? 1 : 0,
        pointerEvents: isChatOpen ? 'auto' : 'none',
        height: '100vh',
        position: 'sticky',
        top: '0px',
        borderRadius: '0px',
        boxShadow: isChatOpen ? '0 4px 24px rgba(0, 0, 0, 0.02)' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Drawer Header */}
      <div className="p-4 flex items-center justify-between select-none h-20 bg-white dark:bg-transparent">
        <div className="flex items-center space-x-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#888888]">RESEARCH ASSISTANT</span>
        </div>

        <button 
          onClick={() => setIsChatOpen(false)}
          className="p-1.5 hover:bg-black/5 text-neutral-600 cursor-pointer flex items-center justify-center dark:bg-transparent dark:text-white dark:border dark:border-transparent dark:hover:bg-white/10 dark:hover:border-white/40 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 rounded-full"
          title="Minimize concierge drawer"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Chat Message Logs Body & Empty State */}
      <div 
        className="flex-1 overflow-y-auto p-4 flex flex-col bg-white dark:bg-transparent"
        style={messages.length === 0 ? { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' } : undefined}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 select-none">
            <Sparkles className="h-10 w-10 text-[#D1D1D6]" strokeWidth={1.5} />
            <p className="font-sans font-medium text-[13px] text-[#8E8E93] mt-3 leading-relaxed max-w-[240px]">
              Ask me anything about this paper, audio or the cue cards, I got your back
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`leading-[1.5] ${
                    msg.sender === 'user' 
                      ? 'max-w-[85%] text-[13px] text-white dark:text-gray-300 bg-[#2C2C2E] dark:bg-white/10 rounded-[12px] px-4 py-3 border-0' 
                      : 'w-full text-sm bg-neutral-100 dark:bg-white/5 border dark:border-white/10 rounded-2xl p-4 text-neutral-900 dark:text-gray-300'
                  }`}
                >
                  {msg.sender === 'assistant' ? (
                    <div className="space-y-2">{renderChatMessageContent(msg.text)}</div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
                <span className="text-[9px] font-mono text-neutral-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1.5 text-neutral-400 text-xs pl-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce duration-300" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce duration-300" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Form Input query field sitting perfectly flush */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-transparent flex items-center space-x-2 shrink-0">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask the concierge..."
          className="flex-1 bg-white dark:bg-white/5 rounded-full outline-none text-[12px] leading-none transition placeholder-neutral-400 dark:placeholder-gray-500 font-sans border border-[#EAEAEA] dark:border-white/10"
          style={{ padding: '10px 14px' }}
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isTyping}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white dark:bg-white dark:text-black cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
