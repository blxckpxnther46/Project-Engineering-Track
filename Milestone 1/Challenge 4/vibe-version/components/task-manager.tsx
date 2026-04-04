"use client"

import { useState, useMemo, useEffect } from "react"
import { TaskInput } from "./task-input"
import { TaskItem, type Task } from "./task-item"
import { FilterTabs, type FilterType } from "./filter-tabs"
import { ClipboardList } from "lucide-react"

const initialTasks: Task[] = [
  { id: "1", text: "Review project requirements", completed: true },
  { id: "2", text: "Design system architecture", completed: false },
  { id: "3", text: "Set up development environment", completed: false },
]

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTasks(initialTasks)
    setMounted(true)
  }, [])
  const [filter, setFilter] = useState<FilterType>("all")

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  )

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter((t) => !t.completed)
      case "completed":
        return tasks.filter((t) => t.completed)
      default:
        return tasks
    }
  }, [tasks, filter])

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <div className="flex-1 h-[42px] rounded-lg border border-border bg-input animate-pulse" />
          <div className="w-[72px] h-[36px] rounded-md bg-primary/20 animate-pulse" />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 w-64 rounded-lg bg-secondary animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[45px] rounded-lg border border-border bg-card animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <TaskInput onAddTask={addTask} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          activeFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />
        {counts.completed > 0 && (
          <button
            onClick={() =>
              setTasks((prev) => prev.filter((t) => !t.completed))
            }
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-12 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">No tasks</p>
              <p className="text-sm text-muted-foreground">
                {filter === "all"
                  ? "Add a task to get started"
                  : filter === "active"
                    ? "No active tasks"
                    : "No completed tasks"}
              </p>
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
