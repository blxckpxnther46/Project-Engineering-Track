import { TaskManager } from "@/components/task-manager"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your daily tasks and stay productive
          </p>
        </header>
        <TaskManager />
      </div>
    </main>
  )
}
