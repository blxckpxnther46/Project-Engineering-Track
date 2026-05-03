import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

const Orders = () => {
  const { data: orders, isLoading, error, refetch } = useOrders();

  if (isLoading) {
    return (
      <div className="p-8">
        <SkeletonCard count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorMessage
          message="We couldn't load your orders. Try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="No Orders Yet"
          message="You haven't received any orders yet."
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recent Orders</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;