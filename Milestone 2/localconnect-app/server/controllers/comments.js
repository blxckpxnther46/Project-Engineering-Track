const prisma = require('../prismaClient');

exports.getComments = async (req, res) => {
  try {
    const { parentType, parentId } = req.query;
    const comments = await prisma.comment.findMany({
      where: {
        parentType: parentType,
        parentId: parseInt(parentId)
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content, parentType, parentId } = req.body;
    
    if (!content || !parentType || !parentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        parentType,
        parentId: parseInt(parentId)
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Comment deleted', comment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
