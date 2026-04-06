import React, { useState, useEffect } from 'react';
import { fetchScore } from '../services/api';
import { Award, TrendingUp } from 'lucide-react';

const ScoreWidget = ({ tasks }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await fetchScore();
        setScore(data.value);
      } catch (err) {
        console.error('Error fetching score:', err);
      }
    };
    getScore();
  }, [tasks]);

  return (
    <div className="score-hero-card">
      <div className="score-hero-left">
        <h2>Your Productivity</h2>
        <div className="score-big">
          {score}
          <span>pts</span>
        </div>
        <p style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
          Earn points by completing tasks. Important tasks are worth more! 🔥
        </p>
        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.6' }}>
          <strong>How it works:</strong><br/>
          +1 for creating a task<br/>
          +5 for completing regular tasks<br/>
          +15 for completing important tasks
        </div>
      </div>
      <div className="score-hero-right">
        <div className="status-badge" style={{ background: '#4ade80', color: '#064e3b', marginBottom: '1rem' }}>
          <TrendingUp size={16} />
          Keep Going!
        </div>
        <div className="logo-icon" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <Award size={48} />
        </div>
      </div>
    </div>
  );
};

export default ScoreWidget;
