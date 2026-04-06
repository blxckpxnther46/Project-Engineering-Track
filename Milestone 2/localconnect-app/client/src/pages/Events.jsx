import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, deleteEvent } from '../services/api';

const EventCard = ({ event, onDelete }) => {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h3 className="card-title">{event.title}</h3>
      <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>{event.description}</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
        <span><strong>📅 {eventDate}</strong></span>
        <span><strong>📍 {event.location}</strong></span>
      </div>
      <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Posted by: {event.createdBy}</p>
      <button 
        onClick={() => onDelete(event.id)}
        className="btn-primary" 
        style={{ marginTop: '0.5rem', backgroundColor: '#ef4444' }}
      >
        Delete
      </button>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !location.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await createEvent(title, description, date, location, createdBy || 'Anonymous');
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setCreatedBy('');
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Community Events</h1>
      <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
        Share and discover upcoming events in your neighborhood
      </p>
      
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>Post a New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              className="input-field" 
              placeholder="Event Title (e.g., Block Party, Cleanup Day)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
              required
            />
            <textarea 
              className="input-field" 
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              style={{ marginBottom: '0.5rem' }}
            />
            <input 
              className="input-field" 
              placeholder="Date and Time"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
              required
            />
            <input 
              className="input-field" 
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
              required
            />
            <input 
              className="input-field" 
              placeholder="Your Name (Optional)"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">Create Event</button>
        </form>
      </div>

      <h2 className="card-title" style={{ marginTop: '2rem', marginBottom: '1rem' }}>Upcoming Events</h2>
      {events.length === 0 ? (
        <p style={{ color: '#64748b' }}>No events posted yet. Be the first to create one!</p>
      ) : (
        <div>
          {events.map(event => (
            <EventCard key={event.id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
