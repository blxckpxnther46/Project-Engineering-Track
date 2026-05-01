import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getProducts(query) {
  let { page = 1, limit = 20, sortBy = 'id', order = 'asc', fields } = query;

  page = parseInt(page);
  limit = Math.min(parseInt(limit), 100); // MAX LIMIT

  if (page < 1 || limit < 1) {
    throw new Error('Invalid pagination');
  }

  const skip = (page - 1) * limit;

  // ✅ FIELD SELECTION
  const allowedFields = ['id', 'name', 'price', 'category'];
  let select;

  if (fields) {
    const requested = fields.split(',');
    const invalid = requested.filter(f => !allowedFields.includes(f));

    if (invalid.length) {
      throw new Error('Invalid fields requested');
    }

    select = {};
    requested.forEach(f => select[f] = true);
  }

  const products = await prisma.product.findMany({
    skip,
    take: limit,
    orderBy: { [sortBy]: order },
    select
  });

  const total = await prisma.product.count();

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: products
  };
}

export async function getProductById(id) {
  return prisma.product.findUnique({ where: { id } });
}