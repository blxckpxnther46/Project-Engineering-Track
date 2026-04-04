"use client"

import { cn } from "@/lib/utils"

export type FilterType = "all" | "active" | "completed"

interface FilterTabsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: {
    all: number
    active: number
    completed: number
  }
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
]

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-secondary p-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            activeFilter === filter.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {filter.label}
          <span className="ml-1.5 text-xs text-muted-foreground">
            {counts[filter.value]}
          </span>
        </button>
      ))}
    </div>
  )
}
