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
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev: any[]) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let quickActions: string[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('ttc') || lower.includes('teacher') || lower.includes('200h') || lower.includes('course') || lower.includes('package')) {
        replyText = '🧘‍♀️ **200-Hour Yoga Teacher Training Package**\n\n• Yoga Alliance USA RYS 200 Certification\n• 24 Days Residential Immersion in Rishikesh / Tapovan\n• Hatha, Vinyasa Alignment & Anatomy\n• All Sattvic Meals & Accommodation Included\n• Package Price: $1,250 USD.\n\nOur concierge can tailor package dates for your travel schedule!';
        quickActions = ['Ayurveda & Panchakarma 🌿', 'How Escrow Works 🛡️', 'Talk to Human Specialist 💬'];
      } else if (lower.includes('ayurveda') || lower.includes('panchakarma') || lower.includes('detox') || lower.includes('kerala')) {
        replyText = '🌿 **14-Day Ayurvedic Panchakarma Healing Package**\n\n• NABH Accredited Ayurveda Resorts in Kerala & Goa\n• Daily Doctor Consultations & Custom Oil Treatments\n• Full Sattvic Nutrition & Daily Gentle Hatha Practice\n• Package Price: $1,450 USD.\n\nWould you like me to connect you with an Ayurvedic doctor?';
        quickActions = ['Book Consultation 🌿', 'Escrow Payment Info 🛡️', 'Talk to Human Specialist 💬'];
      } else if (lower.includes('escrow') || lower.includes('payment') || lower.includes('refund') || lower.includes('safe')) {
        replyText = '🛡️ **100% Admin Escrow Safety Guarantee**\n\n• Package payments are held safely by Platform Admin until your retreat begins.\n• Customer contact details are protected from ashrams until booking approval.\n• 100% Full Refund Guarantee for host cancellations.\n• Gateways: Stripe, PayPal, Wise, Credit Cards.';
        quickActions = ['View All Packages 📦', 'Talk to Human Specialist 💬'];
      } else if (lower.includes('human') || lower.includes('support') || lower.includes('phone') || lower.includes('contact') || lower.includes('call') || lower.includes('agent')) {
        replyText = '💬 **Customer Support Specialist Connected!**\n\nSenior Support Concierge Rahul is active on this chat line.\n• WhatsApp Direct: +91 98765 43210\n• Support Email: support@yogaconnect.in\n\nPlease drop your phone number or email below to request an instant callback!';
        quickActions = ['Request Callback 📞', 'Email Support ✉️'];
      } else {
        replyText = `Thank you for contacting YogaConnect India Support! I am here to assist with package details, custom travel dates, and escrow booking safety. How can I help you further?`;
        quickActions = ['200h TTC Packages 🧘‍♀️', 'Ayurveda Packages 🌿', 'Talk to Human Specialist 💬'];
      }

      const agentMsg = {
        id: 'agent-' + Date.now(),
        sender: 'agent' as const,
        senderName: 'Priya (Yoga Specialist)',
        senderAvatar: '🧘‍♀️',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions
      };

      setIsTyping(false);
      setChatMessages((prev: any[]) => [...prev, agentMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isChatOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-sand-50 rounded-3xl shadow-2xl border border-sand-300 flex flex-col overflow-hidden mb-4 animate-fade-in">
          {/* Header */}
          <div className="bg-sage-950 text-white p-4 flex items-center justify-between border-b border-sage-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-lg shadow">
                  🧘‍♀️
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-sage-950"></span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-sand-50 leading-tight">Priya • Retreat Specialist</h4>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span>Online • 24/7 Customer Support</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => { setActiveView('support'); setIsChatOpen(false); }}
                title="Open Full Support Page"
                className="text-xs text-sand-200 hover:text-gold-400 px-2 py-1 bg-sage-900 rounded"
              >
                Full Hub ↗
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full bg-sage-900 hover:bg-sage-800 text-sand-200 flex items-center justify-center text-sm font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {chatMessages.map((msg: any) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'agent' && (
                  <span className="text-[10px] text-sage-600 font-bold mb-1 ml-1 flex items-center space-x-1">
                    <span>{msg.senderAvatar}</span>
                    <span>{msg.senderName}</span>
                  </span>
                )}

                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-terracotta-600 text-white rounded-br-none' 
                      : 'bg-white text-sage-950 border border-sand-300 rounded-bl-none font-sans'
                  }`}
                >
                  {msg.text}
                </div>

                <span className="text-[9px] text-sage-400 mt-1 px-1">{msg.time}</span>

                {/* Quick Action Chips */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.quickActions.map((action: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="bg-sand-100 hover:bg-terracotta-50 text-terracotta-700 font-bold text-[11px] px-3 py-1.5 rounded-full border border-terracotta-300 transition shadow-sm"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-sage-500 bg-white p-3 rounded-2xl w-28 border border-sand-300 shadow-sm">
                <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] font-semibold text-sage-600">Typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-white border-t border-sand-300 flex items-center space-x-2"
          >
            <input 
              type="text" 
              placeholder="Ask about packages, pricing, support..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-sand-50 text-sage-950 p-2.5 rounded-xl border border-sand-300 text-xs focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            />
            <button 
              type="submit" 
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center space-x-1 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="group relative bg-gradient-to-r from-terracotta-600 to-sage-900 hover:from-terracotta-700 hover:to-sage-950 text-white p-4 rounded-full shadow-2xl flex items-center justify-center space-x-2 border-2 border-gold-400/50 transition-all transform hover:scale-105"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="font-bold text-xs pr-1 hidden sm:inline">Chat Us & Support</span>
        {unreadCount > 0 && !isChatOpen && (
          <span className="absolute -top-1 -right-1 bg-gold-400 text-sage-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow border border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
