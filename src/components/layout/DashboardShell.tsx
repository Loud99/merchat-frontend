"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import {
  MessageSquare, ShoppingBag, Package, BarChart2, Settings,
  Bell, Menu, X, LogOut, Bot, AlertCircle, ChevronDown,
  ShoppingCart, CreditCard, Wallet,
} from "lucide-react";
import { ReactNode } from "react";
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
} from "@/lib/data/notifications";
import type { UINotification } from "@/lib/data/notifications";
import TestAIModal from "@/components/dashboard/TestAIModal";
import SupportButton from "@/components/dashboard/SupportButton";

const NAV_LINKS = [
  { icon: MessageSquare, label: "Conversations", href: "/dashboard/conversations" },
  { icon: ShoppingBag,   label: "Orders",        href: "/dashboard/orders" },
  { icon: Package,       label: "Inventory",     href: "/dashboard/inventory" },
  { icon: BarChart2,     label: "Analytics",     href: "/dashboard/analytics" },
  { icon: Wallet,        label: "Finances",      href: "/dashboard/finances" },
  { icon: Settings,      label: "Settings",      href: "/dashboard/settings" },
];

const MOCK_MERCHANT_NAME  = "Fashion by Amina";
const MOCK_MERCHANT_EMAIL = "amabibid400@gmail.com";

function notifIcon(type: UINotification["type"]) {
  switch (type) {
    case "new_order":        return <ShoppingCart size={14} className="text-brand-navy" />;
    case "payment_received": return <CreditCard size={14} className="text-[#16A34A]" />;
    case "escalation":       return <AlertCircle size={14} className="text-[#EF4444]" />;
    case "low_stock":        return <Package size={14} className="text-[#D97706]" />;
  }
}

function notifBg(type: UINotification["type"]) {
  switch (type) {
    case "new_order":        return "bg-[#E8EDF2]";
    case "payment_received": return "bg-[#DCFCE7]";
    case "escalation":       return "bg-[#FEE2E2]";
    case "low_stock":        return "bg-[#FEF3C7]";
  }
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

function SidebarContent({ onClose, onTestAI, onLogout }: { onClose?: () => void; onTestAI: () => void; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo + merchant name */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <Image
            src="/images/icon-dark.svg"
            alt="Merchat.io"
            width={36}
            height={40}
            unoptimized
            priority
            style={{ width: 36, height: "auto" }}
          />
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          )}
        </div>
        <p className="text-[13px] text-white/60 truncate">{MOCK_MERCHANT_NAME}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all ${
                active
                  ? "bg-brand-orange text-white font-semibold"
                  : "text-white/70 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Test AI + account + wordmark */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4 space-y-3">
        <button
          onClick={() => { onClose?.(); onTestAI(); }}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-white/30 text-white/80 text-[13px] font-medium hover:bg-white/[0.08] transition-colors"
        >
          <Bot size={15} strokeWidth={1.5} />
          Test Your AI
        </button>

        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(MOCK_MERCHANT_NAME)}
          </div>
          <span className="flex-1 text-[13px] text-white/70 truncate">{MOCK_MERCHANT_NAME}</span>
          <button aria-label="Log out" onClick={onLogout} className="text-white/40 hover:text-white transition-colors">
            <LogOut size={15} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-1 pt-1">
          <Image
            src="/images/wordmark-dark.svg"
            alt="Merchat.io"
            width={120}
            height={20}
            unoptimized
            style={{ width: 120, height: "auto", opacity: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Page title ─────────────────────────────────────────────────────────────────

function pageTitle(pathname: string) {
  return NAV_LINKS.find(l => l.href === pathname)?.label ?? "Dashboard";
}

// ── Shell ──────────────────────────────────────────────────────────────────────

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [avatarOpen, setAvatarOpen]         = useState(false);
  const [notifOpen, setNotifOpen]           = useState(false);
  const [testAIOpen, setTestAIOpen]         = useState(false);
  const [notifications, setNotifications]   = useState<UINotification[]>([]);
  const [showProvBanner, setShowProvBanner] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }, [router]);
  const title = pageTitle(pathname);
  const avatarRef = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleNotifClick(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await markNotificationRead(id);
  }

  async function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await markAllNotificationsRead();
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* ── Desktop sidebar (fixed) ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-brand-navy z-40">
        <SidebarContent onTestAI={() => setTestAIOpen(true)} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile sidebar drawer ──────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
        <div
          className={`absolute left-0 top-0 bottom-0 w-60 bg-brand-navy transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent onClose={() => setDrawerOpen(false)} onTestAI={() => setTestAIOpen(true)} onLogout={handleLogout} />
        </div>
      </div>

      {/* ── Main content area ──────────────────────────────────────────────── */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 bg-brand-navy flex items-center px-4 gap-4 shrink-0 z-30">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-white"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-white font-semibold text-[16px]">{title}</span>
          <button onClick={() => setNotifOpen(v => !v)} className="relative text-white" aria-label="Notifications">
            <Bell size={20} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#EF4444]" />
            )}
          </button>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex h-14 bg-white border-b border-[#E5E7EB] items-center px-6 gap-4 shrink-0 z-30">
          <h1 className="flex-1 text-[18px] font-bold text-brand-navy">{title}</h1>

          {/* Notification bell with dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative text-brand-navy/60 hover:text-brand-navy transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                  <span className="text-[14px] font-bold text-brand-navy">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-[12px] text-brand-orange hover:opacity-75 transition-opacity font-medium">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-[13px] text-[#9CA3AF] py-8">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n.id)}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors ${!n.isRead ? "bg-[#FAFBFF]" : ""}`}
                      >
                        <div className={`w-7 h-7 rounded-full ${notifBg(n.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                          {notifIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] leading-tight ${!n.isRead ? "font-semibold text-brand-navy" : "font-medium text-brand-navy/80"}`}>{n.title}</p>
                          <p className="text-[12px] text-[#6B7280] mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[11px] text-[#9CA3AF] mt-1">{n.createdAt}</p>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-brand-orange shrink-0 mt-1.5" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar with dropdown */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen(v => !v)}
              className="flex items-center gap-1.5 group"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold">
                {getInitials(MOCK_MERCHANT_NAME)}
              </div>
              <ChevronDown size={14} className={`text-brand-navy/50 transition-transform ${avatarOpen ? "rotate-180" : ""}`} />
            </button>

            {avatarOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.10)] py-1 z-50">
                <Link href="/dashboard/settings" onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 text-[14px] text-brand-navy hover:bg-[#F3F4F6] transition-colors">
                  Profile
                </Link>
                <Link href="/dashboard/settings" onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 text-[14px] text-brand-navy hover:bg-[#F3F4F6] transition-colors">
                  Settings
                </Link>
                <div className="my-1 border-t border-[#E5E7EB]" />
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-[14px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Global banners */}
        {showProvBanner && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#FEF3C7] border-b border-[#D97706] shrink-0">
            <AlertCircle size={16} className="text-[#D97706] shrink-0" />
            <p className="flex-1 text-[13px] text-[#92400E] leading-snug">
              Your WhatsApp number is still being set up. We&apos;ll notify you when it&apos;s ready — usually within the hour.
            </p>
            <button
              onClick={() => setShowProvBanner(false)}
              className="text-[13px] font-medium text-[#92400E] hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page content — no padding; pages manage their own */}
        <main className="flex-1 flex flex-col min-h-0 pb-16 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-brand-navy flex items-center z-40">
        {NAV_LINKS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition-colors ${
                active ? "text-brand-orange" : "text-white/50"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {testAIOpen && (
        <TestAIModal
          storeName={MOCK_MERCHANT_NAME}
          onClose={() => setTestAIOpen(false)}
        />
      )}

      <SupportButton
        merchantName={MOCK_MERCHANT_NAME}
        merchantEmail={MOCK_MERCHANT_EMAIL}
      />
    </div>
  );
}
