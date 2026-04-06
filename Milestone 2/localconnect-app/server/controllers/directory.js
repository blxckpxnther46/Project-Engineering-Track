const prisma = require('../prismaClient');

exports.getDirectory = async (req, res) => {
  try {
    const entries = await prisma.directoryEntry.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch directory' });
  }
};

exports.createDirectoryEntry = async (req, res) => {
  try {
    const { name, email, phone, address, bio } = req.body;
    const entry = await prisma.directoryEntry.create({
      data: { name, email, phone, address, bio }
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create directory entry' });
  }
};

exports.updateDirectoryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, bio } = req.body;
    const entry = await prisma.directoryEntry.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, address, bio }
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update directory entry' });
  }
};

exports.deleteDirectoryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.directoryEntry.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Directory entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete directory entry' });
  }
};
