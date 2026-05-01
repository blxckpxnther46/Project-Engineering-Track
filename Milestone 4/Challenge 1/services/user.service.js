
const prisma = require('../prisma/client');

async function getUsers() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    include: { posts: true }
  });

  return users.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`
  }));
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  });
}

module.exports = { getUsers, getUserById };
