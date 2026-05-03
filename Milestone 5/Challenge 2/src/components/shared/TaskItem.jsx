export default function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div style={{ borderBottom: "1px solid #333", padding: 10 }}>
      <span
        style={{
          textDecoration: task.completed ? "line-through" : "none",
        }}
      >
        {task.title}
      </span>

      <button onClick={() => toggleTask(task.id)}>Toggle</button>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
}