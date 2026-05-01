const prisma = require('../prismaClient');

exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        date: new Date(date),
        location,
        category: category || 'OTHER'
      }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, category, attendees } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (location) updateData.location = location;
    if (category) updateData.category = category;
    if (attendees !== undefined) updateData.attendees = attendees;

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendeeName } = req.body;

    if (!attendeeName) {
      return res.status(400).json({ error: 'Attendee name is required' });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    let attendees = event.attendees ? event.attendees.split(',') : [];
    if (!attendees.includes(attendeeName)) {
      attendees.push(attendeeName);
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { attendees: attendees.join(',') }
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to RSVP to event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Event deleted', event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
