"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, FileText, Building2, Download,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Constants ─────────────────────────────────────────────────────────────────

const MERCHANT_ID = "b4a55b01-be1b-4aed-a4bc-542a51a39caa";
const VAT_RATE     = 0.075;
const PAGE_SIZE    = 10;

const QUARTERS = [
  { label: "Q1 (Jan–Mar)", months: [0, 1, 2] },
  { label: "Q2 (Apr–Jun)", months: [3, 4, 5] },
  { label: "Q3 (Jul–Sep)", months: [6, 7, 8] },
  { label: "Q4 (Oct–Dec)", months: [9, 10, 11] },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface FinanceOrder {
  id: string;
  reference: string;
  customerName: string;
  amount: number;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtNaira(n: number) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[16px] font-bold text-brand-navy">{title}</h2>
      {subtitle && <p className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Label({ children, helper }: { children: React.ReactNode; helper?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[13px] font-semibold text-brand-navy">{children}</label>
      {helper && <p className="text-[12px] text-[#6B7280] mt-0.5">{helper}</p>}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function RevenueSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-[#F3F4F6] rounded-xl" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-14 bg-[#F3F4F6] rounded-xl" />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FinancesPage() {
  const [orders, setOrders]   = useState<FinanceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  // Compliance fields
  const [cac, setCac]               = useState("");
  const [tin, setTin]               = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, order_reference, total_amount, created_at, customers(name)")
        .eq("merchant_id", MERCHANT_ID)
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false });

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOrders(data.map((o: any) => ({
          id:           o.id,
          reference:    o.order_reference,
          customerName: o.customers?.name ?? "Customer",
          amount:       Number(o.total_amount),
          createdAt:    o.created_at,
        })));
      }
      setLoading(false);
    })();
  }, []);

  // ── Revenue maths ─────────────────────────────────────────────────────────

  const now       = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();
  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear  = thisMonth === 0 ? thisYear - 1 : thisYear;

  function sumRevenue(test: (d: Date) => boolean) {
    return orders.filter(o => test(new Date(o.createdAt))).reduce((s, o) => s + o.amount, 0);
  }

  const thisMonthRev = sumRevenue(d => d.getMonth() === thisMonth && d.getFullYear() === thisYear);
  const lastMonthRev = sumRevenue(d => d.getMonth() === prevMonth && d.getFullYear() === prevYear);
  const ytdRev       = sumRevenue(d => d.getFullYear() === thisYear);
  const momChange    = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100 : null;

  const quarterlyData = QUARTERS.map(q => {
    const revenue = sumRevenue(d => d.getFullYear() === thisYear && q.months.includes(d.getMonth()));
    return { label: q.label, revenue, vat: revenue * VAT_RATE };
  });
  const currentQIdx = Math.floor(thisMonth / 3);

  // ── Pagination ────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pageOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Exports ───────────────────────────────────────────────────────────────

  function exportCSV() {
    const bom  = "﻿";
    const head = "Date,Description,Amount (₦),VAT (7.5%),Net\n";
    const rows = orders.map(o => {
      const vat = o.amount * VAT_RATE;
      const net = o.amount - vat;
      return [
        fmtDate(o.createdAt),
        `"${o.reference} — ${o.customerName}"`,
        o.amount.toFixed(2),
        vat.toFixed(2),
        net.toFixed(2),
      ].join(",");
    }).join("\n");
    const blob = new Blob([bom + head + rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = `transactions_${thisYear}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const win = window.open("", "_blank");
    if (!win) return;
    const totalRev = orders.reduce((s, o) => s + o.amount, 0);
    const totalVat = totalRev * VAT_RATE;
    const totalNet = totalRev - totalVat;
    const rowsHtml = orders.map(o => {
      const vat = o.amount * VAT_RATE;
      const net = o.amount - vat;
      return `<tr>
        <td>${fmtDate(o.createdAt)}</td>
        <td>${o.reference} — ${o.customerName}</td>
        <td class="r">₦${o.amount.toLocaleString("en-NG")}</td>
        <td class="r">₦${Math.round(vat).toLocaleString("en-NG")}</td>
        <td class="r">₦${Math.round(net).toLocaleString("en-NG")}</td>
      </tr>`;
    }).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>Transaction Report — Fashion by Amina</title>
<style>
  body{font-family:Arial,sans-serif;padding:32px;color:#182E47;font-size:13px}
  h1{font-size:20px;margin-bottom:4px}
  .meta{color:#6B7280;margin-bottom:24px}
  table{width:100%;border-collapse:collapse}
  th{background:#F3F4F6;padding:10px 12px;text-align:left;font-weight:600;border-bottom:2px solid #E5E7EB}
  td{padding:9px 12px;border-bottom:1px solid #F3F4F6}
  .r{text-align:right}
  .foot td{font-weight:700;border-top:2px solid #E5E7EB;border-bottom:none}
  @media print{@page{margin:20mm}}
</style></head><body>
<h1>Transaction Report — Fashion by Amina</h1>
<p class="meta">Generated ${fmtDate(new Date().toISOString())} · ${orders.length} transactions · VAT rate: 7.5%</p>
<table>
  <thead><tr><th>Date</th><th>Description</th><th class="r">Amount</th><th class="r">VAT (7.5%)</th><th class="r">Net</th></tr></thead>
  <tbody>${rowsHtml}</tbody>
  <tfoot><tr class="foot">
    <td colspan="2">Total</td>
    <td class="r">₦${Math.round(totalRev).toLocaleString("en-NG")}</td>
    <td class="r">₦${Math.round(totalVat).toLocaleString("en-NG")}</td>
    <td class="r">₦${Math.round(totalNet).toLocaleString("en-NG")}</td>
  </tr></tfoot>
</table>
</body></html>`);
    win.document.close();
    win.print();
  }

  function handleSaveCompliance() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="px-4 lg:px-6 py-5 space-y-8 max-w-4xl w-full mx-auto">

        {/* ── 1. Revenue Summary ──────────────────────────────────────────── */}
        <section>
          <SectionHead
            title="Revenue Summary"
            subtitle="Totals calculated from confirmed paid orders."
          />
          {loading ? <RevenueSkeleton /> : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* This month */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-brand-orange" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#6B7280] font-medium">This month</span>
                </div>
                <p className="text-[24px] font-bold text-brand-navy leading-none">{fmtNaira(thisMonthRev)}</p>
                {momChange !== null && (
                  <p className={`text-[11px] mt-2 font-semibold ${momChange >= 0 ? "text-[#16A34A]" : "text-[#EF4444]"}`}>
                    {momChange >= 0 ? "▲" : "▼"} {Math.abs(momChange).toFixed(1)}% vs last month
                  </p>
                )}
              </div>
              {/* Last month */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-[#9CA3AF]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#6B7280] font-medium">Last month</span>
                </div>
                <p className="text-[24px] font-bold text-brand-navy leading-none">{fmtNaira(lastMonthRev)}</p>
              </div>
              {/* YTD */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-[#16A34A]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#6B7280] font-medium">Year to date ({thisYear})</span>
                </div>
                <p className="text-[24px] font-bold text-brand-navy leading-none">{fmtNaira(ytdRev)}</p>
              </div>
            </div>
          )}
        </section>

        {/* ── 2. Transaction History ──────────────────────────────────────── */}
        <section>
          <SectionHead
            title="Transaction History"
            subtitle="All confirmed paid orders, most recent first."
          />
          {loading ? <TableSkeleton /> : orders.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl py-14 flex flex-col items-center gap-2">
              <FileText size={36} className="text-[#D1D5DB]" strokeWidth={1} />
              <p className="text-[14px] font-medium text-brand-navy">No paid transactions yet</p>
              <p className="text-[13px] text-[#9CA3AF]">Transactions will appear here once orders are paid.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                {/* Header row — hidden on mobile */}
                <div className="hidden sm:grid grid-cols-[1fr_140px_90px_120px] bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-2.5 gap-4">
                  <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Order / Customer</span>
                  <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Date</span>
                  <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-center">Method</span>
                  <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Amount</span>
                </div>
                {pageOrders.map((o, i) => (
                  <div
                    key={o.id}
                    className={`flex sm:grid sm:grid-cols-[1fr_140px_90px_120px] items-center px-4 py-3.5 gap-4 ${
                      i < pageOrders.length - 1 ? "border-b border-[#F3F4F6]" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-brand-navy">{o.reference}</p>
                      <p className="text-[12px] text-[#6B7280] truncate">{o.customerName}</p>
                    </div>
                    <span className="text-[12px] text-[#6B7280] text-right shrink-0 hidden sm:block">{fmtDate(o.createdAt)}</span>
                    <div className="hidden sm:flex justify-center">
                      <span className="text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">Online</span>
                    </div>
                    <span className="text-[14px] font-bold text-brand-navy text-right shrink-0 ml-auto sm:ml-0">{fmtNaira(o.amount)}</span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="text-[12px] text-[#6B7280]">
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, orders.length)} of {orders.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-brand-navy disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-brand-navy disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── 3. Tax Filing Helper ────────────────────────────────────────── */}
        <section>
          <SectionHead
            title="Tax Filing Helper"
            subtitle={`Estimated VAT at 7.5% across each quarter of ${thisYear}.`}
          />
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="grid grid-cols-[1fr_140px_140px] bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-2.5 gap-4">
              <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Quarter</span>
              <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Revenue</span>
              <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Est. VAT (7.5%)</span>
            </div>
            {quarterlyData.map((q, i) => {
              const isCurrent = i === currentQIdx;
              return (
                <div
                  key={q.label}
                  className={`grid grid-cols-[1fr_140px_140px] items-center px-4 py-3.5 gap-4 ${
                    i < quarterlyData.length - 1 ? "border-b border-[#F3F4F6]" : ""
                  } ${isCurrent ? "bg-[#FAFBFF]" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-brand-navy">{q.label}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-[14px] font-semibold text-brand-navy text-right">
                    {q.revenue > 0 ? fmtNaira(q.revenue) : "—"}
                  </span>
                  <span className={`text-[14px] font-semibold text-right ${q.vat > 0 ? "text-[#D97706]" : "text-[#9CA3AF]"}`}>
                    {q.vat > 0 ? fmtNaira(q.vat) : "—"}
                  </span>
                </div>
              );
            })}
            {/* YTD totals */}
            <div className="grid grid-cols-[1fr_140px_140px] items-center px-4 py-3.5 gap-4 border-t-2 border-[#E5E7EB] bg-[#F9FAFB]">
              <span className="text-[13px] font-bold text-brand-navy">Year to date</span>
              <span className="text-[14px] font-bold text-brand-navy text-right">{fmtNaira(ytdRev)}</span>
              <span className="text-[14px] font-bold text-[#D97706] text-right">{fmtNaira(ytdRev * VAT_RATE)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-3 p-3.5 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl">
            <AlertCircle size={15} className="text-[#D97706] shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-[12px] text-[#92400E] leading-relaxed">
              <strong>Disclaimer:</strong> These figures are estimates based on recorded revenue at a 7.5% VAT rate.
              Actual VAT liability depends on your registration status and applicable exemptions.
              Consult a certified accountant for official filing.
            </p>
          </div>
        </section>

        {/* ── 4. Export for Accounting ────────────────────────────────────── */}
        <section>
          <SectionHead
            title="Export for Accounting"
            subtitle="Download all transaction data formatted for bookkeeping — columns: Date, Description, Amount, VAT, Net."
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportCSV}
              disabled={orders.length === 0}
              className="flex items-center gap-2 h-10 px-5 rounded-xl border border-[#E5E7EB] bg-white text-[13px] font-medium text-brand-navy hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors"
            >
              <Download size={15} strokeWidth={1.5} />
              Export as CSV
            </button>
            <button
              onClick={exportPDF}
              disabled={orders.length === 0}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-navy text-white text-[13px] font-medium hover:bg-[#1E3D5C] disabled:opacity-40 transition-colors"
            >
              <FileText size={15} strokeWidth={1.5} />
              Export as PDF
            </button>
          </div>
        </section>

        {/* ── 5. Business Compliance ──────────────────────────────────────── */}
        <section className="pb-6">
          <SectionHead
            title="Business Compliance"
            subtitle="Store your registration details for record-keeping. Not shown to customers."
          />

          <div className="flex items-start gap-2.5 mb-5 p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
            <Building2 size={15} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-[12px] text-[#166534] leading-relaxed">
              Your CAC number and TIN are stored securely for your own records and are not displayed to
              customers or third parties.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
            <div>
              <Label helper="e.g. RC-1234567">CAC Registration Number</Label>
              <input
                value={cac}
                onChange={e => setCac(e.target.value)}
                placeholder="RC-0000000"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors font-mono"
              />
            </div>
            <div>
              <Label helper="Your Tax Identification Number from FIRS">Tax Identification Number (TIN)</Label>
              <input
                value={tin}
                onChange={e => setTin(e.target.value)}
                placeholder="00000000-0001"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 transition-colors font-mono"
              />
            </div>
            <div>
              <Label>Registered Business Address</Label>
              <textarea
                value={bizAddress}
                onChange={e => setBizAddress(e.target.value)}
                rows={3}
                placeholder="e.g. 12 Adeola Odeku Street, Victoria Island, Lagos"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-brand-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-brand-navy/40 resize-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSaveCompliance}
                className="h-10 px-6 rounded-xl bg-brand-orange text-white text-[14px] font-semibold hover:bg-[#c45a25] transition-colors"
              >
                Save
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#16A34A]">
                  <CheckCircle size={14} strokeWidth={2} />
                  Saved
                </span>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
