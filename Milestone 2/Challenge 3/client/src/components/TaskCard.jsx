import React from 'react';
import { updateTaskStatus, deleteTaskFromApi } from '../services/api';
import { Trash2, Check, Flame } from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const handleToggle = async () => {
    try {
      await updateTaskStatus(task.id, !task.completed);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTaskFromApi(task.id);
      onTaskUpdated();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className={`task-card-v2 animate-fade ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <div 
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <span className="task-text">{task.title}</span>
          {task.important && (
            <Flame 
              size={16} 
              style={{ color: '#f97316', flexShrink: 0 }} 
              title="Important task - 3x points"
            />
          )}
        </div>
      </div>

      <button onClick={handleDelete} className="action-btn" title="Delete Task">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskCard;
