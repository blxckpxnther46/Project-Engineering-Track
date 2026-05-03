import { useState } from "react";
import tasks from "../data/tasks";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsRow from "../components/dashboard/StatsRow";
import AddTaskInput from "../components/dashboard/AddTaskInput";
import TaskFilterBar from "../components/dashboard/TaskFilterBar";
import TaskList from "../components/dashboard/TaskList";

export default function DashboardPage() {
  const [taskList, setTaskList] = useState(tasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;

    setTaskList([
      ...taskList,
      {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: "medium",
        tag: "general",
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTaskList(
      taskList.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTaskList(taskList.filter((t) => t.id !== id));
  };

  const filtered = taskList
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const completedCount = taskList.filter((t) => t.completed).length;
  const totalCount = taskList.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh", color: "#fff" }}>
      <DashboardHeader />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 32 }}>
        <StatsRow
          total={totalCount}
          completed={completedCount}
          progress={progressPercent}
        />

        <AddTaskInput
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
        />

        <TaskFilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <TaskList
          tasks={filtered}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  );
}