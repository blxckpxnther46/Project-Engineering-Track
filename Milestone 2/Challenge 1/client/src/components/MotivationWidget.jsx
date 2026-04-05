import { useEffect, useState } from "react";
import { getTaskProgress } from "../api/motivationApi";

/**
 * Task Progress Widget (formerly Motivation Mode).
 * This redesigned feature helps users track their productivity by displaying
 * real-time task completion statistics. Seeing visible progress is genuinely
 * motivating and directly supports the core goal of task management.
 */
export default function MotivationWidget() {
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  const fetchProgress = async () => {
    try {
      const data = await getTaskProgress();
      setProgress(data);
    } catch (err) {
      console.error("Error fetching task progress:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProgress();

    // Refresh when data changes - debounced every 10 seconds instead of every 5
    const interval = setInterval(() => {
      fetchProgress();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="progress-widget">
      <h3>Progress</h3>
      <div className="progress-stats">
        {progress.total === 0 ? (
          <p className="empty-state">Add tasks to get started</p>
        ) : (
          <>
            <div className="stat">
              <div className="stat-value">{progress.completionRate}%</div>
              <div className="stat-label">Complete</div>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill" 
                style={{width: `${progress.completionRate}%`}}
              ></div>
            </div>
            <div className="stat-summary">
              <span>{progress.completed} of {progress.total} done</span>
              <span>{progress.pending} pending</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
