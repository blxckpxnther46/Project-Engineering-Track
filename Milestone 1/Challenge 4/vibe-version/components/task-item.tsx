"use client"

import { Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Task {
  id: string
  text: string
  completed: boolean
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-muted-foreground/30">
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          task.completed
            ? "border-accent bg-accent text-accent-foreground"
            : "border-muted-foreground/40 hover:border-accent"
        )}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <Check className="h-3 w-3" />}
      </button>
      <span
        className={cn(
          "flex-1 text-sm transition-all",
          task.completed && "text-muted-foreground line-through"
        )}
      >
        {task.text}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
