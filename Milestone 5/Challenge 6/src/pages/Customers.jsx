import { useCustomers } from '../hooks/useCustomers';
import CustomerRow from '../components/CustomerRow';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

const Customers = () => {
  const { data: customers, isLoading, error, refetch } = useCustomers();

  if (isLoading) {
    return <div className="p-8"><SkeletonCard count={5} /></div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorMessage
          message="Customer data unavailable. Try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="No Customers"
          message="Customers will appear here once orders are placed."
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>

      <table className="min-w-full">
        <tbody>
          {customers.map(c => (
            <CustomerRow key={c.id} customer={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;