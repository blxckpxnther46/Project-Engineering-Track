"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaskInputProps {
  onAddTask: (text: string) => void
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onAddTask(value.trim())
      setValue("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <Button type="submit" className="gap-1.5">
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </form>
  )
}
