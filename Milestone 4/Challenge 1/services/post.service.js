
const prisma = require('../prisma/client');

async function getPosts() {
  return prisma.post.findMany({
    include: { author: true }
  });
}

async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true }
  });
}

module.exports = { getPosts, getPostById };
