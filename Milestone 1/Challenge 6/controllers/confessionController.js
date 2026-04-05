const service = require('../services/confessionService');

exports.createConfession = (req, res) => {
  try {
    const result = service.createConfession(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllConfessions = (req, res) => {
  const result = service.getAllConfessions();
  res.json(result);
};

exports.getConfessionById = (req, res) => {
  const result = service.getConfessionById(req.params.id);
  if (!result) return res.status(404).json({ msg: 'not found' });
  res.json(result);
};

exports.getByCategory = (req, res) => {
  try {
    const result = service.getByCategory(req.params.cat);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteConfession = (req, res) => {
  try {
    const result = service.deleteConfession(
      req.params.id,
      req.headers['x-delete-token']
    );
    res.json(result);
  } catch (err) {
    res.status(403).json({ msg: err.message });
  }
};
