const prisma = require('./lib/prisma');

async function purchaseItem(req, res) {
  try {
    const { userId, productId } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          productId,
          quantity: 1
        }
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: 1
          }
        }
      });

      return order;
    });

    res.status(201).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOrdersByUser(req, res) {
  try {
    const userId = parseInt(req.params.userId);

    const orders = await prisma.order.findMany({
      where: { userId }
    });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { purchaseItem, getOrdersByUser };