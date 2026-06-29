"use client";

import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoadmapFilterBarProps {
  categories: string[];
  selectedCategories: string[];
  onSelectedCategoriesChange: (value: string[]) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
}

export function RoadmapFilterBar({
  categories,
  selectedCategories,
  onSelectedCategoriesChange,
  difficulty,
  onDifficultyChange,
}: RoadmapFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel =
    selectedCategories.length === 0
      ? "All domains"
      : `${selectedCategories.length} selected`;

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onSelectedCategoriesChange(
        selectedCategories.filter((item) => item !== category),
      );
      return;
    }

    onSelectedCategoriesChange([...selectedCategories, category]);
  };

  return (
    <div className="sticky top-0 z-20 border-y border-[#E9EAF0] bg-white/95 py-4 backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex min-h-12 w-full items-center gap-2 rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] px-3 py-2 text-left shadow-sm transition hover:border-[#38A3A5]/50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-white">
              <SlidersHorizontal className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {selectedCategories.length ? (
                selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-sm font-black text-[#0F172A]"
                  >
                    {category}
                    <span className="text-[#8C94A3]">
                      <X className="size-3.5" />
                    </span>
                  </span>
                ))
              ) : (
                <span className="px-1 text-sm font-black text-[#6B7280]">
                  {selectedLabel}
                </span>
              )}
            </div>
            <ChevronDown
              className={`size-4 shrink-0 text-[#6B7280] transition ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen ? (
            <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-full rounded-3xl border border-[#E9EAF0] bg-white p-3 shadow-[0_30px_90px_rgba(15,23,42,0.16)] md:max-w-[560px]">
              <div className="flex items-center justify-between px-2 pb-2">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8C94A3]">
                  Domains
                </p>
                {selectedCategories.length ? (
                  <button
                    type="button"
                    onClick={() => onSelectedCategoriesChange([])}
                    className="text-xs font-black text-[#E86C0D]"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category);

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                        isSelected
                          ? "bg-[#E9EAF0] text-[#0F172A]"
                          : "bg-white text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0F172A]"
                      }`}
                    >
                      <span>{category}</span>
                      {isSelected ? <Check className="size-4" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="h-12 w-full rounded-2xl border-[#E9EAF0] bg-[#F9FAFB] font-black text-[#0F172A] lg:w-[210px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
