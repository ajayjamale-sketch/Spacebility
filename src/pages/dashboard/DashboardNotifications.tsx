import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_NOTIFICATIONS } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Your Notifications</h2>
            <p className="text-sm text-slate-500 mt-1">You have {unreadCount} unread messages</p>
          </div>
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold rounded-xl text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No notifications found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {notifications.map((notif) => (
                <div key={notif.id} className={cn(
                  "p-5 flex items-start gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 group",
                  !notif.read && "bg-primary-50/50 dark:bg-primary-900/10"
                )}>
                  <div className={cn(
                    "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                    !notif.read ? "bg-primary-500" : "bg-slate-300 dark:bg-slate-600"
                  )} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={cn("text-sm font-semibold", !notif.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={cn("text-sm mt-1", !notif.read ? "text-slate-600 dark:text-slate-300" : "text-slate-500 dark:text-slate-400")}>
                      {notif.message}
                    </p>
                    
                    {notif.actionUrl && (
                      <a href={notif.actionUrl} className="inline-block mt-3 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        View Details &rarr;
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
