const AppError = require('../utils/AppError');

async function getUser(req, res, next) {
  try {
    const user = { id: 1, name: "Test User" }; // mock
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function crashTest(req, res, next) {
  try {
    throw new Error('Crash test');
  } catch (err) {
    next(err);
  }
}

module.exports = { getUser, crashTest };