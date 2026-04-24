import { getProducts, getProductById } from './product.service.js';

export async function listProducts(req, res) {
  try {
    // ❌ Raw query params passed directly, no validation
    const products = await getProducts(req.query);
    res.json(products);
  } catch (err) {
      if (err.message.includes('Invalid')) {
        return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
}
}

export async function getProduct(req, res) {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
      if (err.message.includes('Invalid')) {
        return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
}
}