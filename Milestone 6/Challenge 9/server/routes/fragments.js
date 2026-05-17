
const express = require('express');
const router = express.Router();
const { fragments, users } = require('../data/store');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', (req, res) => {
  res.json(fragments);
});

// FIXED: Add role check for Contributors and above
router.post('/', auth, roleCheck(['contributor', 'curator', 'admin']), (req, res) => {
  const { content, parentId } = req.body;
  const newFrag = {
    id: Date.now().toString(),
    content,
    parentId,
    userId: req.user.userId,
    author: users.find(u => u.id === req.user.userId)?.email,
    status: 'pending', // Start as pending
    createdAt: new Date()
  };
  fragments.push(newFrag);
  res.status(201).json(newFrag);
});

// FIXED: Check ownership - Contributors can only edit their own fragments
router.put('/:id', auth, roleCheck(['contributor', 'curator', 'admin']), (req, res) => {
  const frag = fragments.find(f => f.id === req.params.id);
  if(!frag) return res.status(404).json({ error: 'Fragment not found' });
  
  // Ownership check: user must be the author or an admin/curator
  if(frag.userId !== req.user.userId && !['curator', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'You can only edit your own fragments' });
  }
  
  frag.content = req.body.content;
  res.json(frag);
});

// FIXED: Require Curator role
router.post('/:id/approve', auth, roleCheck(['curator', 'admin']), (req, res) => {
  const frag = fragments.find(f => f.id === req.params.id);
  if(!frag) return res.status(404).json({ error: 'Fragment not found' });
  frag.status = 'published';
  res.json(frag);
});

// FIXED: Require Admin role
router.delete('/:id', auth, roleCheck(['admin']), (req, res) => {
  const index = fragments.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  fragments.splice(index, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
