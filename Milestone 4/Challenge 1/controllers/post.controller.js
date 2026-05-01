
const postService = require('../services/post.service');

async function getPosts(req, res) {
  try {
    const posts = await postService.getPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getPostById(req, res) {
  try {
    const post = await postService.getPostById(parseInt(req.params.id));
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getPosts, getPostById };
