import React, { useState, useEffect } from 'react';
import IssueCard from '../components/IssueCard';
import CommentSection from '../components/CommentSection';
import { getIssues, createIssue, updateIssue } from '../services/api';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data } = await getIssues();
      setIssues(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createIssue(title, description);
      setTitle('');
      setDescription('');
      fetchIssues();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateIssue(id, status);
      fetchIssues();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="page-title">Local Issues</h1>
      <div className="card">
        <h2 className="card-title" style={{marginBottom: '1rem'}}>Report an Issue</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              className="input-field" 
              placeholder="Issue Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{marginBottom: '0.5rem'}}
            />
            <textarea 
              className="input-field" 
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
            />
          </div>
          <button type="submit" className="btn-primary">Submit Issue</button>
        </form>
      </div>
      <div className="grid">
        {issues.map(issue => (
          <div key={issue.id}>
            <IssueCard issue={issue} onUpdateStatus={handleUpdateStatus} />
            {selectedIssueId === issue.id && (
              <div className="card" style={{ marginBottom: '1rem' }}>
                <CommentSection parentType="ISSUE" parentId={issue.id} />
              </div>
            )}
            <button
              onClick={() => setSelectedIssueId(selectedIssueId === issue.id ? null : issue.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                textDecoration: 'underline'
              }}
            >
              {selectedIssueId === issue.id ? 'Hide Discussion' : 'View Discussion'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Issues;
