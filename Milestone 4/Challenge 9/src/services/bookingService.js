const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createBooking({ userId, seatId, showId }) {
  try {
    const booking = await prisma.booking.create({
      data: { userId, seatId, showId }
    });
    return { status: 201, data: booking };
  } catch (err) {
    if (err.code === 'P2002') {
      return { status: 409, error: 'Seat already booked' };
    }
    throw err;
  }
}

module.exports = { createBooking };