import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_USERS, MOCK_EVENTS } from "@/lib/data";
import { getInitials, getRoleColor, getRoleLabel, cn } from "@/lib/utils";

interface Group {
  id: string; name: string; members: number; category: string;
  description: string; active: boolean; joined: boolean;
}

interface Discussion {
  id: string; author: string; authorAvatar?: string; time: string;
  title: string; content: string; replies: number; likes: number; liked: boolean;
}

const INITIAL_GROUPS: Group[] = [
  { id: "g1", name: "Freelancers Network", members: 1240, category: "Networking", description: "A community of independent professionals sharing tips, leads, and support.", active: true, joined: true },
  { id: "g2", name: "Tech Startups SF", members: 890, category: "Startup", description: "Bay Area founders sharing resources, co-founders, and investor intros.", active: true, joined: false },
  { id: "g3", name: "Remote Work Hub", members: 2100, category: "Remote Work", description: "Tools, habits, and community for the distributed workforce.", active: true, joined: false },
  { id: "g4", name: "Design Collective", members: 560, category: "Creative", description: "Designers, UX researchers, and visual artists sharing work and feedback.", active: true, joined: true },
  { id: "g5", name: "AI & Machine Learning", members: 1780, category: "Technology", description: "Practitioners and enthusiasts exploring the frontier of AI.", active: true, joined: false },
];

const INITIAL_DISCUSSIONS: Discussion[] = [
  { id: "d1", author: "Alex Rivera", time: "2h ago", title: "Best practices for remote team collaboration in coworking spaces", content: "I've been experimenting with different techniques to keep our distributed team aligned when we use coworking spaces across cities. What's working for your teams?", replies: 12, likes: 34, liked: false },
  { id: "d2", author: "Sarah Chen", time: "5h ago", title: "Looking for a UX collaborator for a 2-month fintech project", content: "Our startup is looking for a senior UX designer with fintech experience. The project involves a redesign of a mobile banking app. Remote-friendly.", replies: 8, likes: 21, liked: false },
  { id: "d3", author: "Emma Wilson", time: "1d ago", title: "Upcoming community event: Tech Founders Meetup — June 5th SF", content: "We have a fantastic lineup for this month's meetup! Speakers include founders from three Y Combinator companies. RSVP in the events section.", replies: 45, likes: 89, liked: true },
  { id: "d4", author: "Marcus Johnson", time: "2d ago", title: "Tips for negotiating long-term workspace contracts as a startup", content: "After signing three long-term contracts across different cities, here's what I've learned about getting the best deal as an early-stage startup.", replies: 6, likes: 17, liked: false },
];

export default function DashboardCommunity() {
  const [tab, setTab] = useState<"members" | "groups" | "discussions" | "events">("members");
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);
  const [memberSearch, setMemberSearch] = useState("");
  const [openDiscussion, setOpenDiscussion] = useState<string | null>(null);

  // Message modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageMember, setMessageMember] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Group modal
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", category: "Networking", description: "", isPrivate: false });
  const [groupErrors, setGroupErrors] = useState<{ name?: string; description?: string }>({});
  const [submittingGroup, setSubmittingGroup] = useState(false);

  // Event modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "", date: "", time: "18:00", location: "", type: "networking",
    description: "", maxAttendees: "", price: "0",
  });
  const [eventErrors, setEventErrors] = useState<Partial<typeof eventForm>>({});
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [communityEvents, setCommunityEvents] = useState(MOCK_EVENTS.slice(0, 4));

  // Discussion modal
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionForm, setDiscussionForm] = useState({ title: "", content: "" });
  const [discussionErrors, setDiscussionErrors] = useState<{ title?: string; content?: string }>({});

  const today = new Date().toISOString().split("T")[0];

  const filteredMembers = MOCK_USERS.filter((u) =>
    !memberSearch ||
    u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // ── Group Logic ──
  const validateGroup = () => {
    const errs: { name?: string; description?: string } = {};
    if (!groupForm.name.trim()) errs.name = "Group name is required";
    else if (groupForm.name.length < 3) errs.name = "Name must be at least 3 characters";
    if (!groupForm.description.trim()) errs.description = "Description is required";
    else if (groupForm.description.length < 20) errs.description = "Description must be at least 20 characters";
    setGroupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGroup()) return;
    setSubmittingGroup(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmittingGroup(false);
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name: groupForm.name,
      category: groupForm.category,
      description: groupForm.description,
      members: 1,
      active: true,
      joined: true,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setShowGroupModal(false);
    setGroupForm({ name: "", category: "Networking", description: "", isPrivate: false });
    toast.success(`"${groupForm.name}" group created successfully!`);
  };

  const toggleJoinGroup = (id: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 }
          : g
      )
    );
    const group = groups.find((g) => g.id === id)!;
    toast.success(group.joined ? `Left "${group.name}"` : `Joined "${group.name}"!`);
  };

  // ── Event Logic ──
  const validateEvent = () => {
    const errs: Partial<typeof eventForm> = {};
    if (!eventForm.title.trim()) errs.title = "Title required";
    if (!eventForm.date) errs.date = "Date required";
    if (!eventForm.location.trim()) errs.location = "Location required";
    if (!eventForm.description.trim()) errs.description = "Description required";
    else if (eventForm.description.length < 20) errs.description = "Min 20 characters";
    if (!eventForm.maxAttendees || Number(eventForm.maxAttendees) < 1) errs.maxAttendees = "Capacity required";
    setEventErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEvent()) return;
    setSubmittingEvent(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmittingEvent(false);
    const newEvent = {
      id: `e${Date.now()}`,
      title: eventForm.title,
      description: eventForm.description,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      type: eventForm.type,
      attendees: 0,
      maxAttendees: Number(eventForm.maxAttendees),
      price: Number(eventForm.price),
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      organizer: "Emma Wilson",
      tags: ["Community", eventForm.type],
      featured: false,
    };
    setCommunityEvents((prev) => [newEvent, ...prev]);
    setShowEventModal(false);
    setEventForm({ title: "", date: "", time: "18:00", location: "", type: "networking", description: "", maxAttendees: "", price: "0" });
    toast.success("Event created successfully! Members will be notified.");
  };

  // ── Discussion Logic ──
  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { title?: string; content?: string } = {};
    if (!discussionForm.title.trim()) errs.title = "Title required";
    if (!discussionForm.content.trim()) errs.content = "Content required";
    else if (discussionForm.content.length < 20) errs.content = "Min 20 characters";
    setDiscussionErrors(errs);
    if (Object.keys(errs).length) return;

    const newDiscussion: Discussion = {
      id: `d${Date.now()}`,
      author: "Emma Wilson",
      time: "Just now",
      title: discussionForm.title,
      content: discussionForm.content,
      replies: 0,
      likes: 0,
      liked: false,
    };
    setDiscussions((prev) => [newDiscussion, ...prev]);
    setShowDiscussionModal(false);
    setDiscussionForm({ title: "", content: "" });
    toast.success("Discussion posted!");
  };

  const toggleLike = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 } : d
      )
    );
  };

  const GROUP_CATEGORIES = ["Networking", "Startup", "Remote Work", "Creative", "Technology", "Marketing", "Finance", "Design", "Healthcare", "Education"];
  const EVENT_TYPES = ["networking", "workshop", "conference", "meetup", "webinar", "hackathon"];

  return (
    <DashboardLayout title="Community">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Community Hub</h2>
          <p className="text-slate-500 text-sm">Connect with members, manage groups, and engage with discussions</p>
        </div>
        <div className="flex gap-2">
          {tab === "groups" && (
            <button onClick={() => setShowGroupModal(true)} className="btn-primary text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Create Group
            </button>
          )}
          {tab === "events" && (
            <button onClick={() => setShowEventModal(true)} className="btn-primary text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Create Event
            </button>
          )}
          {tab === "discussions" && (
            <button onClick={() => setShowDiscussionModal(true)} className="btn-primary text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Discussion
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total Members", v: "2,340", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "text-primary-600 bg-primary-50 dark:bg-primary-900/20" },
          { l: "Active Groups", v: groups.filter((g) => g.active).length.toString(), icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" },
          { l: "Events This Month", v: communityEvents.length.toString(), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { l: "Engagement Rate", v: "87%", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.l} className={cn("card p-5 flex items-center gap-3", s.color.split(" ")[1], s.color.split(" ")[2])}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.color)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
            </div>
            <div>
              <p className={cn("text-xl font-bold font-display", s.color.split(" ")[0])}>{s.v}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 w-fit flex-wrap">
        {(["members", "groups", "discussions", "events"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap",
              tab === t ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── MEMBERS ── */}
      {tab === "members" && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search members by name or email..."
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">{getInitials(member.name)}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{member.name}</p>
                    {member.verified && (
                      <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{member.company || member.email}</p>
                  {member.bio && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{member.bio}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn("text-xs px-2 py-1 rounded-md font-medium", getRoleColor(member.role))}>{getRoleLabel(member.role)}</span>
                  <button
                    onClick={() => { setMessageMember(member); setMessageText(""); setShowMessageModal(true); }}
                    className="text-xs text-primary-600 font-medium border border-primary-200 dark:border-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="p-8 text-center text-slate-400">No members found matching "{memberSearch}"</div>
            )}
          </div>
        </div>
      )}

      {/* ── GROUPS ── */}
      {tab === "groups" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="card p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {group.name[0]}
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", group.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500")}>
                    {group.active ? "Active" : "Inactive"}
                  </span>
                  {group.joined && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">Joined</span>
                  )}
                </div>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-1">{group.name}</h4>
              <p className="text-xs text-slate-400 mb-2">{group.category} · {group.members.toLocaleString()} members</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{group.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleJoinGroup(group.id)}
                  className={cn("flex-1 py-2 text-sm font-semibold rounded-xl transition-all",
                    group.joined
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  )}
                >
                  {group.joined ? "Leave" : "Join Group"}
                </button>
                <button
                  onClick={() => toast.info("Group management panel coming soon")}
                  className="py-2 px-3 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DISCUSSIONS ── */}
      {tab === "discussions" && (
        <div className="space-y-3">
          {discussions.map((post) => (
            <div key={post.id} className="card p-5">
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => setOpenDiscussion(openDiscussion === post.id ? null : post.id)}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {post.author[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{post.author}</span>
                    <span className="text-xs text-slate-400">{post.time}</span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors leading-snug">{post.title}</h4>
                </div>
                <svg className={cn("w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform", openDiscussion === post.id && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>

              {openDiscussion === post.id && (
                <div className="mt-3 pl-14 animate-fade-up">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={cn("flex items-center gap-1.5 font-medium transition-colors", post.liked ? "text-red-500" : "text-slate-400 hover:text-red-400")}
                    >
                      <svg className="w-4 h-4" fill={post.liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      {post.likes} likes
                    </button>
                    <button
                      onClick={() => toast.info("Reply feature coming soon!")}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-primary-500 font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      {post.replies} replies
                    </button>
                    <button onClick={() => toast.info("Copied link!")} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 font-medium transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      Share
                    </button>
                  </div>
                </div>
              )}

              {openDiscussion !== post.id && (
                <div className="flex items-center gap-4 mt-2 pl-14">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {post.likes}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {post.replies}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── EVENTS ── */}
      {tab === "events" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {communityEvents.map((event) => (
            <div key={event.id} className="card overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-36 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full capitalize">{event.type}</span>
                  <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", event.price === 0 ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                    {event.price === 0 ? "Free" : `$${event.price}`}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1 line-clamp-1">{event.title}</h4>
                <p className="text-xs text-slate-400 mb-3">{event.date} at {event.time} · {event.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1">
                      {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 border border-white dark:border-slate-800" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{event.attendees}/{event.maxAttendees}</span>
                  </div>
                  <button
                    onClick={() => toast.success(`Registered for "${event.title}"!`)}
                    className="text-xs font-semibold px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE GROUP MODAL ── */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowGroupModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">Create New Group</h2>
              <button onClick={() => setShowGroupModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <div>
                <label className="field-label">Group Name *</label>
                <input
                  type="text"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  placeholder="e.g. Product Designers Network"
                  className={cn("input-field", groupErrors.name && "border-red-400")}
                />
                {groupErrors.name && <p className="text-xs text-red-500 mt-1">{groupErrors.name}</p>}
              </div>

              <div>
                <label className="field-label">Category *</label>
                <select value={groupForm.category} onChange={(e) => setGroupForm({ ...groupForm, category: e.target.value })} className="input-field">
                  {GROUP_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="field-label">Description *</label>
                <textarea
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  rows={3}
                  placeholder="What is this group about? Who should join?"
                  className={cn("input-field resize-none", groupErrors.description && "border-red-400")}
                />
                {groupErrors.description && <p className="text-xs text-red-500 mt-1">{groupErrors.description}</p>}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setGroupForm({ ...groupForm, isPrivate: !groupForm.isPrivate })}
                  className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                    groupForm.isPrivate ? "bg-primary-600 border-primary-600" : "border-slate-300 dark:border-slate-600"
                  )}
                >
                  {groupForm.isPrivate && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Make this group private</p>
                  <p className="text-xs text-slate-400">Only invited members can join</p>
                </div>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowGroupModal(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                <button type="submit" disabled={submittingGroup} className="btn-primary flex-1 py-3 text-sm justify-center">
                  {submittingGroup ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</> : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE EVENT MODAL ── */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowEventModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">Create New Event</h2>
              <button onClick={() => setShowEventModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="field-label">Event Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Startup Founders Networking Night"
                  className={cn("input-field", eventErrors.title && "border-red-400")}
                />
                {eventErrors.title && <p className="text-xs text-red-500 mt-1">{eventErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Event Type *</label>
                  <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} className="input-field capitalize">
                    {EVENT_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Ticket Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    placeholder="0 = Free"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Date *</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    min={today}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className={cn("input-field", eventErrors.date && "border-red-400")}
                  />
                  {eventErrors.date && <p className="text-xs text-red-500 mt-1">{eventErrors.date}</p>}
                </div>
                <div>
                  <label className="field-label">Time *</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Location *</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="e.g. The Innovation Hub, SF or Online"
                  className={cn("input-field", eventErrors.location && "border-red-400")}
                />
                {eventErrors.location && <p className="text-xs text-red-500 mt-1">{eventErrors.location}</p>}
              </div>

              <div>
                <label className="field-label">Max Attendees *</label>
                <input
                  type="number"
                  min="1"
                  value={eventForm.maxAttendees}
                  onChange={(e) => setEventForm({ ...eventForm, maxAttendees: e.target.value })}
                  placeholder="100"
                  className={cn("input-field", eventErrors.maxAttendees && "border-red-400")}
                />
                {eventErrors.maxAttendees && <p className="text-xs text-red-500 mt-1">{eventErrors.maxAttendees}</p>}
              </div>

              <div>
                <label className="field-label">Description *</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the event, what attendees can expect, speakers, agenda..."
                  className={cn("input-field resize-none", eventErrors.description && "border-red-400")}
                />
                {eventErrors.description && <p className="text-xs text-red-500 mt-1">{eventErrors.description}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEventModal(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                <button type="submit" disabled={submittingEvent} className="btn-primary flex-1 py-3 text-sm justify-center">
                  {submittingEvent ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</> : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE DISCUSSION MODAL ── */}
      {showDiscussionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowDiscussionModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">Start a Discussion</h2>
              <button onClick={() => setShowDiscussionModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateDiscussion} className="p-6 space-y-4">
              <div>
                <label className="field-label">Discussion Title *</label>
                <input
                  type="text"
                  value={discussionForm.title}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                  placeholder="What do you want to discuss?"
                  className={cn("input-field", discussionErrors.title && "border-red-400")}
                />
                {discussionErrors.title && <p className="text-xs text-red-500 mt-1">{discussionErrors.title}</p>}
              </div>
              <div>
                <label className="field-label">Content *</label>
                <textarea
                  value={discussionForm.content}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, content: e.target.value })}
                  rows={5}
                  placeholder="Share your thoughts, questions, or ideas with the community..."
                  className={cn("input-field resize-none", discussionErrors.content && "border-red-400")}
                />
                {discussionErrors.content && <p className="text-xs text-red-500 mt-1">{discussionErrors.content}</p>}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowDiscussionModal(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 py-3 text-sm justify-center">Post Discussion</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MESSAGE MODAL ── */}
      {showMessageModal && messageMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowMessageModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">Message {messageMember.name}</h2>
              <button onClick={() => setShowMessageModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                placeholder="Type your message here..."
                className="input-field resize-none"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowMessageModal(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                <button 
                  onClick={async () => {
                    setSendingMessage(true);
                    await new Promise(r => setTimeout(r, 800));
                    setSendingMessage(false);
                    setShowMessageModal(false);
                    toast.success(`Message sent to ${messageMember.name}!`);
                  }} 
                  disabled={sendingMessage || !messageText.trim()} 
                  className="btn-primary flex-1 py-3 text-sm justify-center"
                >
                  {sendingMessage ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
