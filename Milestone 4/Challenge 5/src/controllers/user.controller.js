async function createUser(req, res) {
  console.log('DATABASE HIT: Creating user...', req.body);
  res.status(201).json(req.body);
}

module.exports = { createUser };