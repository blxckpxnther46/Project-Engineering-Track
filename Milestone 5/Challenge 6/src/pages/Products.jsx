import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

const Products = () => {
  const { data: products, isLoading, error, refetch } = useProducts();

  if (isLoading) {
    return <div className="p-8"><SkeletonCard count={6} /></div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorMessage
          message="Inventory failed to load. Retry."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="No Products Found"
          message="Add your first product to get started."
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Product Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Products;