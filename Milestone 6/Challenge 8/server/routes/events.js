import express from 'express';
import { events } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Middleware to protect all routes
router.use(authMiddleware);

// FIXED: Filter events - only return events where user is creator or invited
router.get('/', (req, res) => {
    const userEvents = events.filter(event =>
        event.creatorId === req.user.id || event.invitedEmails.includes(req.user.email)
    );
    res.json(userEvents);
});

router.post('/', (req, res) => {
    const { title, description, date, invitedEmails } = req.body;
    const newEvent = {
        id: Date.now().toString(),
        title,
        description,
        date,
        creatorId: req.user.id,
        invitedEmails: invitedEmails || [],
        rsvps: []
    };
    events.push(newEvent);
    console.log(`Invitations sent for event "${title}" to: ${newEvent.invitedEmails.join(', ')}`);
    res.status(201).json(newEvent);
});

// FIXED: Check if user is authorized to view this event
router.get('/:id', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Authorization check: user must be creator or invited
    const isCreator = event.creatorId === req.user.id;
    const isInvited = event.invitedEmails.includes(req.user.email);
    
    if (!isCreator && !isInvited) {
        return res.status(403).json({ message: 'You are not authorized to view this event' });
    }
    
    res.json({
        ...event,
        isCreator,
        isInvited
    });
});

// FIXED: Check for invitation and prevent duplicate RSVPs
router.post('/:id/rsvp', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if user is invited
    if (!event.invitedEmails.includes(req.user.email)) {
        return res.status(403).json({ message: 'You are not invited to this event' });
    }

    // Check if user already RSVPed
    if (event.rsvps.includes(req.user.id)) {
        return res.status(400).json({ message: 'You have already RSVPed to this event' });
    }

    event.rsvps.push(req.user.id);
    res.json({ message: 'RSVP successful', event });
});

// FIXED: Check ownership before allowing deletion
router.delete('/:id', (req, res) => {
    const index = events.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Event not found' });

    const event = events[index];
    
    // Authorization check: only creator can delete
    if (event.creatorId !== req.user.id) {
        return res.status(403).json({ message: 'Only the event creator can delete this event' });
    }

    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
});

export default router;
