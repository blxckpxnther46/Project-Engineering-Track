export default function AddTaskInput({ newTask, setNewTask, addTask }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add task"
      />
      <button onClick={addTask}>Add</button>
    </div>
  );
}