import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMine: boolean;
}

interface ChatSession {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

const MOCK_CHATS: ChatSession[] = [
  { id: "c1", name: "Community Announcements", lastMessage: "Join us for the networking event tomorrow!", time: "10:30 AM", unread: 2, avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop", online: true },
  { id: "c2", name: "Sarah Jenkins", lastMessage: "Can we extend the meeting room booking?", time: "Yesterday", unread: 0, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", online: false },
  { id: "c3", name: "Tech Startup Group", lastMessage: "Has anyone seen my charger?", time: "Yesterday", unread: 5, avatar: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop", online: true },
];

const MOCK_MESSAGES: Message[] = [
  { id: "m1", senderId: "u1", senderName: "Sarah Jenkins", text: "Hey! Are you in the office today?", time: "09:45 AM", isMine: false },
  { id: "m2", senderId: "me", senderName: "Me", text: "Yes, I'm at desk 12 in the main area.", time: "09:50 AM", isMine: true },
  { id: "m3", senderId: "u1", senderName: "Sarah Jenkins", text: "Great! Can we extend the meeting room booking for another hour?", time: "09:55 AM", isMine: false },
];

export default function DashboardMessages() {
  const [activeChat, setActiveChat] = useState<ChatSession>(MOCK_CHATS[1]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "Me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };

    setMessages([...messages, newMsg]);
    setInputText("");
  };

  return (
    <DashboardLayout title="Messages">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden flex h-[calc(100vh-140px)]">
        
        {/* Sidebar */}
        <div className="w-full max-w-[320px] border-r border-slate-100 dark:border-slate-700/60 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/60">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MOCK_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-slate-50 dark:border-slate-700/30",
                  activeChat.id === chat.id ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                )}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                  {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{chat.name}</h4>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/20">
          {/* Header */}
          <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-white dark:bg-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <img src={activeChat.avatar} alt={activeChat.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{activeChat.name}</h3>
                <p className="text-xs text-slate-400">{activeChat.online ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col max-w-[75%]", msg.isMine ? "ml-auto items-end" : "mr-auto items-start")}>
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm",
                  msg.isMine 
                    ? "bg-primary-600 text-white rounded-br-sm" 
                    : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-bl-sm"
                )}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/60 flex-shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <button type="button" className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" disabled={!inputText.trim()} className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
