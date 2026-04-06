import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getPosts = () => axios.get(`${API_URL}/posts`);
export const createPost = (content) => axios.post(`${API_URL}/posts`, { content });

export const getIssues = () => axios.get(`${API_URL}/issues`);
export const createIssue = (title, description) => axios.post(`${API_URL}/issues`, { title, description });
export const updateIssue = (id, status) => axios.patch(`${API_URL}/issues/${id}`, { status });

export const getTasks = () => axios.get(`${API_URL}/tasks`);
export const createTask = (title, assignedTo) => axios.post(`${API_URL}/tasks`, { title, assignedTo });
export const updateTask = (id, status) => axios.patch(`${API_URL}/tasks/${id}`, { status });

export const getMetrics = () => axios.get(`${API_URL}/metrics`);

// Comments API
export const getComments = (parentType, parentId) => 
  axios.get(`${API_URL}/comments`, { params: { parentType, parentId } });
export const createComment = (content, parentType, parentId) => 
  axios.post(`${API_URL}/comments`, { content, parentType, parentId });
export const deleteComment = (id) => 
  axios.delete(`${API_URL}/comments/${id}`);

// Events API
export const getEvents = () => axios.get(`${API_URL}/events`);
export const createEvent = (title, description, date, location, category) => 
  axios.post(`${API_URL}/events`, { title, description, date, location, category });
export const updateEvent = (id, eventData) => 
  axios.patch(`${API_URL}/events/${id}`, eventData);
export const rsvpEvent = (id, attendeeName) => 
  axios.post(`${API_URL}/events/${id}/rsvp`, { attendeeName });
export const deleteEvent = (id) => 
  axios.delete(`${API_URL}/events/${id}`);
