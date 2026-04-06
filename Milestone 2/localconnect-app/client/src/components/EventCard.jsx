import React, { useState } from 'react';
import { deleteEvent, rsvpEvent } from '../services/api';

const EventCard = ({ event, onDelete, onRsvp }) => {
  const [rsvpName, setRsvpName] = useState('');
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const attendeesList = event.attendees ? event.attendees.split(',').filter(a => a.trim()) : [];

  const handleRsvp = async (e) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    try {
      await rsvpEvent(event.id, rsvpName);
      setRsvpName('');
      setIsRsvpOpen(false);
      onRsvp();
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(event.id);
        onDelete();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const eventDate = new Date(event.date);
  const categoryColors = {
    CLEANUP: '#22c55e',
    SOCIAL: '#f59e0b',
    WORKSHOP: '#3b82f6',
    EMERGENCY: '#ef4444',
    OTHER: '#6b7280'
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{event.title}</h3>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: categoryColors[event.category] || '#6b7280',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
          >
            {event.category}
          </span>
        </div>
        <button
          onClick={handleDelete}
          style={{
            background: '#fee2e2',
            border: 'none',
            color: '#dc2626',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Delete
        </button>
      </div>

      <p style={{ color: '#475569', marginBottom: '1rem' }}>{event.description}</p>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>📅</span>
          <strong style={{ color: '#1e293b' }}>
            {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </strong>
        </div>
        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>📍</span>
          <strong style={{ color: '#1e293b' }}>{event.location}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>👥</span>
          <strong style={{ color: '#1e293b' }}>{attendeesList.length} going</strong>
        </div>
      </div>

      {attendeesList.length > 0 && (
        <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Going:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {attendeesList.map((name, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.85rem'
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        {!isRsvpOpen ? (
          <button
            onClick={() => setIsRsvpOpen(true)}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            I'm Going!
          </button>
        ) : (
          <form onSubmit={handleRsvp} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Your name"
              value={rsvpName}
              onChange={(e) => setRsvpName(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <button type="submit" className="btn-primary">
              RSVP
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRsvpOpen(false);
                setRsvpName('');
              }}
              style={{
                background: '#e2e8f0',
                border: 'none',
                color: '#475569',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventCard;
