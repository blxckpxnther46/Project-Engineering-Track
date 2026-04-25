const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../utils/AppError');

async function getUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json(user);

  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return next(new AppError('Name and email are required', 400));
    }

    const user = await prisma.user.create({
      data: { name, email }
    });

    res.status(201).json(user);

  } catch (err) {
    next(err);
  }
}

module.exports = { getUser, createUser };