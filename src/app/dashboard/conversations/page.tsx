"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, ArrowLeft, MoreVertical, Send, AlertCircle,
  MessageSquare, X,
} from "lucide-react";
import {
  getConversations, insertMessage, updateConversationStatus,
} from "@/lib/data/conversations";
import type { UIThread as Thread, UIMessage as Message, UIThreadStatus as ThreadStatus } from "@/lib/data/conversations";
import CustomerProfilePanel from "@/components/dashboard/CustomerProfilePanel";

// ── Types ─────────────────────────────────────────────────────────────────────

type MsgRole = "customer" | "ai" | "merchant" | "system";
type FilterTab = "all" | "active" | "escalated" | "resolved";

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ConvSkeleton() {
  return (
    <div className="flex flex-1 min-h-0 animate-pulse">
      <div className="w-full lg:w-[340px] border-r border-[#E5E7EB] bg-white flex flex-col">
        <div className="px-4 pt-4 pb-3 border-b border-[#E5E7EB] space-y-3">
          <div className="h-6 w-36 bg-[#F3F4F6] rounded" />
          <div className="h-8 bg-[#F3F4F6] rounded-xl" />
          <div className="h-8 bg-[#F3F4F6] rounded-lg" />
        </div>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-[#E5E7EB]">
            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-[#F3F4F6] rounded w-3/4" />
              <div className="h-3 bg-[#F3F4F6] rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function StatusBadge({ status, size = "sm" }: { status: ThreadStatus; size?: "sm" | "xs" }) {
  const base = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";
  switch (status) {
    case "ai_active":       return <span className={`${base} rounded-full bg-[#DCFCE7] text-[#16A34A] font-medium whitespace-nowrap`}>AI Active</span>;
    case "escalated":       return <span className={`${base} rounded-full bg-[#FEE2E2] text-[#EF4444] font-medium flex items-center gap-0.5 whitespace-nowrap`}><AlertCircle size={10} strokeWidth={2.5} />Escalated</span>;
    case "merchant_active": return <span className={`${base} rounded-full bg-[#FEF3C7] text-[#D97706] font-medium whitespace-nowrap`}>Merchant Active</span>;
    case "resolved":        return <span className={`${base} rounded-full bg-[#F3F4F6] text-[#6B7280] font-medium whitespace-nowrap`}>Resolved</span>;
  }
}

// ── Thread item ───────────────────────────────────────────────────────────────

function ThreadItem({
  thread,
  selected,
  effectiveStatus,
  onClick,
}: {
  thread: Thread;
  selected: boolean;
  effectiveStatus: ThreadStatus;
  onClick: () => void;
}) {
  const isEscalated = thread.status === "escalated";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[#E5E7EB] transition-colors ${
        selected
          ? "bg-[#F4EDE8] border-l-[3px] border-l-brand-orange"
          : isEscalated
          ? "bg-white border-l-[3px] border-l-[#EF4444] hover:bg-[#FFF5F5]"
          : "bg-white hover:bg-[#F9FAFB]"
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#E8EDF2] flex items-center justify-center text-brand-navy text-[13px] font-bold shrink-0 mt-0.5">
        {getInitials(thread.customerName)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-[14px] font-semibold text-brand-navy truncate">{thread.customerName}</span>
          <span className="text-[11px] text-[#9CA3AF] shrink-0">{thread.timestamp}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <StatusBadge status={effectiveStatus} size="xs" />
          <span className="text-[12px] text-[#6B7280] truncate">{thread.lastMessage}</span>
          {thread.unread > 0 && (
            <span className="ml-auto shrink-0 w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center">
              {thread.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MsgBubble({ msg }: { msg: Message }) {
  if (msg.role === "system") {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] text-[#6B7280] bg-[#E5DDD5]/80 px-3 py-1 rounded-full">{msg.text}</span>
      </div>
    );
  }

  const isCustomer = msg.role === "customer";
  const isAi = msg.role === "ai";
  const isMerchant = msg.role === "merchant";

  const bubbleCls = isCustomer
    ? "bg-white rounded-[12px_12px_12px_0]"
    : isAi
    ? "bg-[#DCF8C6] rounded-[12px_12px_0_12px]"
    : "bg-[#D5E8FB] rounded-[12px_12px_0_12px]";

  return (
    <div className={`flex ${isCustomer ? "justify-start" : "justify-end"} mb-1`}>
      <div className={`max-w-[72%] px-3 py-2 ${bubbleCls}`}>
        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[10px] text-[#9CA3AF]">{msg.ts}</span>
          {(isAi || isMerchant) && (
            <span className="text-[10px] text-[#9CA3AF]">{isAi ? "· AI" : "· You"}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Thread view ───────────────────────────────────────────────────────────────

function ThreadView({
  thread,
  messages,
  effectiveStatus,
  aiPaused,
  replyText,
  showTooltip,
  moreOpen,
  onBack,
  onReplyChange,
  onSend,
  onHandBackToAi,
  onTakeOver,
  onTooltipDismiss,
  onToggleMore,
  onMarkResolved,
  onViewProfile,
}: {
  thread: Thread;
  messages: Message[];
  effectiveStatus: ThreadStatus;
  aiPaused: boolean;
  replyText: string;
  showTooltip: boolean;
  moreOpen: boolean;
  onBack: () => void;
  onReplyChange: (v: string) => void;
  onSend: () => void;
  onHandBackToAi: () => void;
  onTakeOver: () => void;
  onTooltipDismiss: () => void;
  onToggleMore: () => void;
  onMarkResolved: () => void;
  onViewProfile: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`; // max ~4 lines
  }, [replyText]);

  // Close more dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) onToggleMore();
    }
    if (moreOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [moreOpen, onToggleMore]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  const canHandoff = aiPaused || effectiveStatus === "merchant_active" || effectiveStatus === "escalated";

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E7EB] shrink-0 bg-white">
        <button onClick={onBack} className="lg:hidden text-brand-navy/60 hover:text-brand-navy transition-colors" aria-label="Back">
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#E8EDF2] flex items-center justify-center text-brand-navy text-[12px] font-bold shrink-0">
          {getInitials(thread.customerName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-brand-navy truncate">{thread.customerName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <StatusBadge status={effectiveStatus} size="xs" />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canHandoff ? (
            <button
              onClick={onHandBackToAi}
              className="hidden sm:block px-3 py-1.5 rounded-lg border border-[#D1D5DB] text-[12px] font-medium text-brand-navy hover:bg-[#F3F4F6] transition-colors"
            >
              Hand to AI
            </button>
          ) : (
            <button
              onClick={onTakeOver}
              className="hidden sm:block px-3 py-1.5 rounded-lg border border-brand-orange text-[12px] font-medium text-brand-orange hover:bg-[#F4EDE8] transition-colors"
            >
              Take over
            </button>
          )}
          <div className="relative" ref={moreRef}>
            <button
              onClick={onToggleMore}
              className="p-1.5 rounded-lg text-brand-navy/50 hover:text-brand-navy hover:bg-[#F3F4F6] transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={18} strokeWidth={1.5} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.10)] py-1 z-50">
                <button onClick={onMarkResolved} className="w-full text-left px-4 py-2.5 text-[14px] text-brand-navy hover:bg-[#F3F4F6] transition-colors">
                  Mark resolved
                </button>
                <button
                  onClick={() => { onToggleMore(); onViewProfile(); }}
                  className="w-full text-left px-4 py-2.5 text-[14px] text-brand-navy hover:bg-[#F3F4F6] transition-colors"
                >
                  View customer profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto bg-[#E5DDD5] px-3 py-4 min-h-0">
        {messages.map(msg => (
          <MsgBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* AI takeover tooltip */}
      {showTooltip && (
        <div className="mx-3 mb-1 flex items-center gap-2 px-3 py-2 bg-[#FEF3C7] border border-[#D97706]/30 rounded-lg">
          <p className="flex-1 text-[12px] text-[#92400E] leading-snug">
            Sending this message will pause the AI for this conversation.
          </p>
          <button
            onClick={onTooltipDismiss}
            className="text-[12px] font-semibold text-[#92400E] hover:underline shrink-0"
          >
            Got it
          </button>
        </div>
      )}

      {/* AI paused banner */}
      {aiPaused && (
        <div className="mx-3 mb-1 flex items-center gap-2 px-3 py-2 bg-[#FEF3C7] rounded-lg">
          <p className="flex-1 text-[12px] text-[#92400E] font-medium leading-snug">
            AI is paused. You&apos;re handling this conversation.
          </p>
          <button
            onClick={onHandBackToAi}
            className="text-[12px] font-semibold text-brand-orange hover:opacity-75 transition-opacity shrink-0"
          >
            Hand back to AI
          </button>
        </div>
      )}

      {/* Reply bar */}
      <div className="px-3 pb-3 pt-2 border-t border-[#E5E7EB] shrink-0 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={replyText}
            onChange={e => onReplyChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to reply..."
            className="flex-1 resize-none px-3 py-2.5 text-[14px] rounded-xl border border-[#D1D5DB] outline-none focus:border-brand-navy transition-colors placeholder:text-[#9CA3AF] leading-relaxed"
            style={{ minHeight: 44 }}
          />
          <button
            onClick={onSend}
            disabled={!replyText.trim()}
            className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shrink-0 hover:bg-[#B54E20] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Send size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-[#F9FAFB] gap-3">
      <MessageSquare size={48} className="text-[#D1D5DB]" strokeWidth={1} />
      <div className="text-center">
        <p className="text-[16px] font-semibold text-brand-navy">No conversation selected</p>
        <p className="text-[13px] text-[#6B7280] mt-1">Select a conversation from the list to get started.</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ConversationsPage() {
  const [threads, setThreads]   = useState<Thread[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<FilterTab>("all");
  const [search, setSearch]     = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [profileOpen, setProfileOpen] = useState(false);

  // Per-thread overrides
  const [aiPausedMap, setAiPausedMap]       = useState<Record<string, boolean>>({});
  const [resolvedMap, setResolvedMap]       = useState<Record<string, boolean>>({});
  const [extraMessages, setExtraMessages]   = useState<Record<string, Message[]>>({});

  useEffect(() => {
    getConversations().then(data => {
      setThreads(data);
      // Pre-populate aiPausedMap for merchant_active threads
      const paused: Record<string, boolean> = {};
      data.forEach(t => { if (t.status === "merchant_active") paused[t.id] = true; });
      setAiPausedMap(paused);
      if (data.length > 0) setSelectedId(data[0].id);
      setLoading(false);
    });
  }, []);

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [tooltipShown, setTooltipShown] = useState<Record<string, boolean>>({});

  function effectiveStatus(thread: Thread): ThreadStatus {
    if (resolvedMap[thread.id]) return "resolved";
    if (aiPausedMap[thread.id]) return "merchant_active";
    return thread.status;
  }

  // Build filtered + sorted thread list
  const filtered = threads.filter(t => {
    const status = effectiveStatus(t);
    const matchesSearch = !search ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search);
    if (!matchesSearch) return false;
    if (filter === "active")    return status === "ai_active" || status === "merchant_active" || status === "escalated";
    if (filter === "escalated") return status === "escalated";
    if (filter === "resolved")  return status === "resolved";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aEsc = effectiveStatus(a) === "escalated";
    const bEsc = effectiveStatus(b) === "escalated";
    if (aEsc && !bEsc) return -1;
    if (!aEsc && bEsc) return 1;
    return 0;
  });

  const selectedThread = threads.find(t => t.id === selectedId) ?? null;
  const allMessages = selectedId
    ? [...(threads.find(t => t.id === selectedId)?.messages ?? []), ...(extraMessages[selectedId] ?? [])]
    : [];

  function selectThread(id: string) {
    setSelectedId(id);
    setMobileView("thread");
    setMoreOpen(false);
    setReplyText("");
    setProfileOpen(false);
  }

  function handleReplyChange(v: string) {
    setReplyText(v);
    // Show tooltip when merchant first types in an AI-active thread
    if (
      v.length > 0 &&
      selectedThread &&
      effectiveStatus(selectedThread) === "ai_active" &&
      !tooltipShown[selectedId!] &&
      !aiPausedMap[selectedId!]
    ) {
      setTooltipShown(prev => ({ ...prev, [selectedId!]: true }));
    }
  }

  function handleSend() {
    if (!replyText.trim() || !selectedId) return;
    const text = replyText.trim();
    const msg: Message = {
      id: `new-${Date.now()}`,
      role: "merchant",
      text,
      ts: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setExtraMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), msg] }));
    setAiPausedMap(prev => ({ ...prev, [selectedId]: true }));
    setReplyText("");
    insertMessage(selectedId, text, "merchant");
  }

  function handleHandBackToAi() {
    if (!selectedId) return;
    setAiPausedMap(prev => ({ ...prev, [selectedId]: false }));
    updateConversationStatus(selectedId, "ai_active");
  }

  function handleTakeOver() {
    if (!selectedId) return;
    setAiPausedMap(prev => ({ ...prev, [selectedId]: true }));
    updateConversationStatus(selectedId, "merchant_active");
  }

  const handleToggleMore = useCallback(() => setMoreOpen(v => !v), []);

  function handleMarkResolved() {
    if (!selectedId) return;
    setResolvedMap(prev => ({ ...prev, [selectedId]: true }));
    setMoreOpen(false);
    updateConversationStatus(selectedId, "resolved");
  }

  const showTooltip = !!(
    selectedId &&
    selectedThread &&
    effectiveStatus(selectedThread) === "ai_active" &&
    tooltipShown[selectedId] &&
    !aiPausedMap[selectedId] &&
    replyText.length > 0
  );

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: "all",       label: "All" },
    { key: "active",    label: "Active" },
    { key: "escalated", label: "Escalated" },
    { key: "resolved",  label: "Resolved" },
  ];

  if (loading) return <ConvSkeleton />;

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* ── Thread list ────────────────────────────────────────────────────── */}
      <div
        className={`flex flex-col w-full lg:w-[340px] shrink-0 border-r border-[#E5E7EB] bg-white min-h-0 ${
          mobileView === "thread" ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* List header */}
        <div className="px-4 pt-4 pb-3 border-b border-[#E5E7EB] shrink-0 space-y-3">
          <h2 className="text-[18px] font-bold text-brand-navy">Conversations</h2>

          {/* Filter tabs */}
          <div className="flex gap-1">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  filter === key ? "bg-brand-navy text-white" : "text-[#6B7280] hover:text-brand-navy hover:bg-[#F3F4F6]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              placeholder="Search by name or number…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg border border-[#D1D5DB] bg-white outline-none focus:border-brand-navy transition-colors placeholder:text-[#9CA3AF]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-brand-navy transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Thread items */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 px-4 text-center">
              <MessageSquare size={48} className="text-[#D1D5DB]" strokeWidth={1} />
              <div>
                <p className="text-[15px] font-semibold text-brand-navy">No conversations yet</p>
                <p className="text-[13px] text-[#6B7280] mt-1">Share your WhatsApp number to start getting messages.</p>
              </div>
            </div>
          ) : (
            sorted.map(thread => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                selected={thread.id === selectedId}
                effectiveStatus={effectiveStatus(thread)}
                onClick={() => selectThread(thread.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Thread view / empty state ─────────────────────────────────────── */}
      <div
        className={`flex-1 flex min-h-0 overflow-hidden ${
          mobileView === "list" ? "hidden lg:flex" : "flex"
        }`}
      >
        {selectedThread ? (
          <ThreadView
            thread={selectedThread}
            messages={allMessages}
            effectiveStatus={effectiveStatus(selectedThread)}
            aiPaused={!!(selectedId && aiPausedMap[selectedId])}
            replyText={replyText}
            showTooltip={showTooltip}
            moreOpen={moreOpen}
            onBack={() => setMobileView("list")}
            onReplyChange={handleReplyChange}
            onSend={handleSend}
            onHandBackToAi={handleHandBackToAi}
            onTakeOver={handleTakeOver}
            onTooltipDismiss={() => selectedId && setTooltipShown(prev => ({ ...prev, [selectedId]: false }))}
            onToggleMore={handleToggleMore}
            onMarkResolved={handleMarkResolved}
            onViewProfile={() => setProfileOpen(true)}
          />
        ) : (
          <EmptyState />
        )}

        {profileOpen && selectedThread && (
          <CustomerProfilePanel
            customerName={selectedThread.customerName}
            phone={selectedThread.phone}
            onClose={() => setProfileOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
