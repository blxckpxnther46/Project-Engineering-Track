import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { getEvents, createEvent } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [showForm, setShowForm] = useState(false);

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
    if (!title.trim() || !date || !time || !location.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const dateTimeString = `${date}T${time}`;
      await createEvent(title, description, dateTimeString, location, category);
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setLocation('');
      setCategory('OTHER');
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);
  const pastEvents = events.filter(e => new Date(e.date) < now);

  return (
    <div>
      <h1 className="page-title">Community Events</h1>
      <p style={{ marginBottom: '2rem', color: '#64748b', fontSize: '1.1rem' }}>
        Discover and organize neighborhood events. Connect with your community in person!
      </p>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ marginBottom: '2rem', fontSize: '1.05rem' }}
        >
          + Create New Event
        </button>
      ) : (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Plan a Community Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Event Title (required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ marginBottom: '1rem' }}
              />
              <textarea
                className="input-field"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
                style={{ marginBottom: '1rem' }}
              />
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ marginBottom: '1rem' }}
              >
                <option value="CLEANUP">🧹 Community Cleanup</option>
                <option value="SOCIAL">🎉 Social Gathering</option>
                <option value="WORKSHOP">📚 Workshop/Skill Share</option>
                <option value="EMERGENCY">🚨 Emergency/Support</option>
                <option value="OTHER">📌 Other</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="date"
                  className="input-field"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ flex: 1, marginBottom: 0 }}
                />
                <input
                  type="time"
                  className="input-field"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={{ flex: 1, marginBottom: 0 }}
                />
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Location (required)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">Create Event</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: '#e2e8f0',
                  border: 'none',
                  color: '#475569',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
            📅 Upcoming Events ({upcomingEvents.length})
          </h2>
          {upcomingEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={fetchEvents}
              onRsvp={fetchEvents}
            />
          ))}
        </div>
      )}

      {upcomingEvents.length === 0 && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '2px dashed #86efac',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          <p style={{ color: '#166534', fontSize: '1.1rem' }}>
            No upcoming events yet. Be the first to create one! 🎉
          </p>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Past Events ({pastEvents.length})
          </h2>
          {pastEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={fetchEvents}
              onRsvp={fetchEvents}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
