"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = ["All", "Fashion", "Food", "Electronics", "Beauty", "Home", "Other"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export interface FilterState {
  search: string;
  category: string;
  sort: string;
  inStockOnly: boolean;
  pod: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const update = (patch: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...patch });

  const activePills = [
    filters.category !== "All" && {
      label: filters.category,
      clear: () => update({ category: "All" }),
    },
    filters.inStockOnly && {
      label: "In stock only",
      clear: () => update({ inStockOnly: false }),
    },
    filters.pod && {
      label: "Pay on delivery",
      clear: () => update({ pod: false }),
    },
    filters.sort !== "newest" && {
      label: SORTS.find((s) => s.value === filters.sort)?.label ?? "",
      clear: () => update({ sort: "newest" }),
    },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const activeCount = activePills.length;

  return (
    <>
      <div className="sticky top-0 z-30 bg-white border-b border-[#E9ECEF]">
        <div className="flex items-center gap-3 px-4 h-14">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD] pointer-events-none"
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="Search products..."
              className="w-full h-10 pl-9 pr-4 bg-[#F1F3F5] rounded-full text-[14px] text-[#343A40] placeholder:text-[#ADB5BD] outline-none border-none"
            />
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center gap-1.5 text-[#343A40] text-[14px] font-medium shrink-0"
          >
            <SlidersHorizontal size={18} />
            Filter
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {activePills.length > 0 && (
          <div className="flex items-center gap-2 px-4 pb-2.5 overflow-x-auto no-scrollbar">
            {activePills.map((pill) => (
              <button
                key={pill.label}
                onClick={pill.clear}
                className="flex items-center gap-1 bg-[#25D366]/10 text-[#25D366] text-[12px] font-medium px-3 py-1 rounded-full shrink-0"
              >
                {pill.label}
                <X size={11} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl px-5 pt-4 pb-10">
            <div className="w-10 h-1 bg-[#E9ECEF] rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-[#212529]">Filters</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#ADB5BD]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category */}
            <div className="mb-5">
              <p className="text-[12px] font-semibold text-[#343A40] uppercase tracking-wide mb-3">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => update({ category: cat })}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                      filters.category === cat
                        ? "bg-[#25D366] text-white border-[#25D366]"
                        : "bg-white text-[#343A40] border-[#E9ECEF]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-5">
              <p className="text-[12px] font-semibold text-[#343A40] uppercase tracking-wide mb-3">
                Sort by
              </p>
              <div className="flex flex-col gap-3">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => update({ sort: s.value })}
                    className="flex items-center gap-3 text-[14px] text-[#343A40]"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        filters.sort === s.value
                          ? "border-[#25D366]"
                          : "border-[#DEE2E6]"
                      }`}
                    >
                      {filters.sort === s.value && (
                        <div className="w-2 h-2 rounded-full bg-[#25D366]" />
                      )}
                    </div>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock only */}
            <div className="mb-5">
              <p className="text-[12px] font-semibold text-[#343A40] uppercase tracking-wide mb-3">
                Availability
              </p>
              <button
                onClick={() => update({ inStockOnly: !filters.inStockOnly })}
                className="flex items-center gap-3 text-[14px] text-[#343A40]"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.inStockOnly
                      ? "bg-[#25D366] border-[#25D366]"
                      : "border-[#DEE2E6]"
                  }`}
                >
                  {filters.inStockOnly && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                In Stock Only
              </button>
            </div>

            {/* Pay on delivery toggle */}
            <div className="mb-7">
              <p className="text-[12px] font-semibold text-[#343A40] uppercase tracking-wide mb-3">
                Pay on Delivery
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => update({ pod: !filters.pod })}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                    filters.pod ? "bg-[#25D366]" : "bg-[#DEE2E6]"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      filters.pod ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-[14px] text-[#343A40]">Available</span>
              </label>
            </div>

            <button
              onClick={() => {
                onFiltersChange({
                  search: filters.search,
                  category: "All",
                  sort: "newest",
                  inStockOnly: false,
                  pod: false,
                });
                setDrawerOpen(false);
              }}
              className="w-full py-3 text-[14px] font-semibold text-[#6C757D] border border-[#E9ECEF] rounded-full"
            >
              Clear All Filters
            </button>
          </div>
        </>
      )}
    </>
  );
}
