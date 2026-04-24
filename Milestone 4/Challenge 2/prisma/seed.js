// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@test.com'
    }
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@test.com'
    }
  });

  const laptop = await prisma.product.create({
    data: {
      name: 'Laptop',
      price: 1000,
      stock: 10
    }
  });

  const phone = await prisma.product.create({
    data: {
      name: 'Phone',
      price: 500,
      stock: 20
    }
  });

  await prisma.order.create({
    data: {
      userId: alice.id,
      productId: laptop.id,
      quantity: 1
    }
  });

  console.log('✅ Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });