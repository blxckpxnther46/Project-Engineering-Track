import React, { useState, useEffect } from 'react';
import { getComments, createComment, deleteComment } from '../services/api';

const CommentSection = ({ parentType, parentId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [parentType, parentId]);

  const fetchComments = async () => {
    try {
      const { data } = await getComments(parentType, parentId);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      await createComment(commentText, parentType, parentId);
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
      <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Discussion ({comments.length})</h3>
      
      <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <textarea
            className="input-field"
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="2"
            style={{ marginBottom: '0.5rem' }}
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ fontSize: '0.9rem' }}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map(comment => (
            <div
              key={comment.id}
              style={{
                padding: '1rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #3b82f6'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{comment.content}</p>
                  <small style={{ color: '#64748b' }}>
                    {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '0'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
