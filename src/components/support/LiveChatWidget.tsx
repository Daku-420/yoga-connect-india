import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, User, ShieldCheck, PhoneCall, Mail } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, setChatMessages, unreadCount, setUnreadCount, setActiveView, formatPrice } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
    }
  }, [isChatOpen, setUnreadCount]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim()) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: messageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev: any[]) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate concierge response
    setIsTyping(true);
    setTimeout(() => {
      let reply = "Namaste! 🙏 Our Platform Admin team handles your request with 100% Escrow Protection. Your inquiries stay confidential with zero direct ashram spam. What specific dates or Himalayan region are you planning for?";
      
      const lower = messageContent.toLowerCase();
      if (lower.includes('ttc') || lower.includes('200h') || lower.includes('teacher')) {
        reply = "Our Yoga Alliance RYS 200h courses in Rishikesh include full syllabus instruction, 3 daily organic sattvic meals, and accommodation starting at $1,250. You can submit an enquiry directly through any centre page!";
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('currency')) {
        reply = "All prices on YogaConnect India are direct ashram rates. You can change your viewing currency (USD, EUR, GBP, AUD, CAD, INR) in the top navigation bar.";
      } else if (lower.includes('escrow') || lower.includes('safe') || lower.includes('security')) {
        reply = "With 100% Escrow Protection, deposit funds are held safely until seat availability and room category are confirmed. Centres never receive your contact details directly before confirmation.";
      }

      const agentMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'agent',
        senderName: 'Priya (Himalayan Retreat Specialist)',
        senderAvatar: '🧘‍♀️',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setChatMessages((prev: any[]) => [...prev, agentMsg]);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isChatOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-[#F7F5EE] rounded-3xl shadow-2xl border border-[#E2E5DD] flex flex-col overflow-hidden mb-4 animate-fade-in">
          {/* Header */}
          <div className="bg-[#263D32] text-[#F7F5EE] p-4 flex items-center justify-between border-b border-[#1E3228]">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#536B50] text-white flex items-center justify-center font-bold text-lg shadow">
                  🧘‍♀️
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#286749] rounded-full border-2 border-[#263D32]"></span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-white leading-tight">Priya • Retreat Concierge</h4>
                <span className="text-[10px] text-[#A5B89A] font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-[#A5B89A] rounded-full animate-ping"></span>
                  <span>Online • Escrow Support Active</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => { setActiveView('support'); setIsChatOpen(false); }}
                title="Open Full Support Page"
                className="text-xs text-[#A5B89A] hover:text-white px-2 py-1 bg-white/10 rounded-md transition"
              >
                Help Desk
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-[#A5B89A] hover:text-white p-1 rounded-full transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Escrow Guarantee Sub-strip */}
          <div className="bg-[#1E3228] px-4 py-1.5 border-b border-[#3D5E4C]/30 text-[10px] text-[#A5B89A] flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DCCDB5]" />
            <span>Encrypted Traveler Support • Zero Direct Ashram Spam</span>
          </div>

          {/* Messages Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F7F5EE]">
            {chatMessages.map((msg: any) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'agent' && (
                  <span className="text-[10px] text-[#59665C] font-semibold mb-1 ml-1 flex items-center space-x-1">
                    <span>{msg.senderAvatar}</span>
                    <span>{msg.senderName}</span>
                  </span>
                )}

                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#536B50] text-white rounded-br-none' 
                      : 'bg-white text-[#252C27] border border-[#E2E5DD] rounded-bl-none font-sans'
                  }`}
                >
                  {msg.text}
                </div>

                <span className="text-[9px] text-[#59665C] mt-1 px-1">{msg.time}</span>

                {/* Quick Action Chips */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.quickActions.map((action: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="bg-white hover:bg-[#E6EDE2] text-[#263D32] font-semibold text-[11px] px-3 py-1.5 rounded-full border border-[#E2E5DD] transition shadow-sm"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-[#59665C] bg-white p-3 rounded-2xl w-28 border border-[#E2E5DD] shadow-sm">
                <span className="w-2 h-2 bg-[#536B50] rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-[#536B50] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-[#536B50] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] font-semibold text-[#59665C]">Typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-white border-t border-[#E2E5DD] flex items-center space-x-2"
          >
            <input 
              type="text" 
              placeholder="Ask about packages, visas, escrow..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-[#F7F5EE] text-[#252C27] p-2.5 rounded-xl border border-[#E2E5DD] text-xs focus:outline-none focus:ring-1 focus:ring-[#536B50]"
            />
            <button 
              type="submit" 
              className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-4 py-2.5 rounded-xl text-xs shadow-sm flex items-center space-x-1 shrink-0 transition"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) matching reference style */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="group relative bg-[#18201A] hover:bg-[#253228] text-white pl-2.5 pr-4 py-2 rounded-full shadow-2xl flex items-center space-x-2.5 border border-white/15 transition-all transform hover:scale-105"
        aria-label="Open concierge support chat"
      >
        <div className="w-8 h-8 rounded-full bg-[#E6EDE2] text-sm flex items-center justify-center overflow-hidden border border-white/20 shrink-0 shadow-xs">
          <span>🧘‍♀️</span>
        </div>
        <div className="text-left pr-0.5">
          <span className="font-semibold text-xs text-white block leading-tight">Ask Concierge</span>
          <span className="text-[10px] text-emerald-300 font-medium flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>Online</span>
          </span>
        </div>
        {unreadCount > 0 && !isChatOpen && (
          <span className="absolute -top-1 -right-1 bg-[#536B50] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow border border-white">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
