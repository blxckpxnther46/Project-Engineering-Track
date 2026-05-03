import { useDashboard } from '../hooks/useDashboard';
import { SkeletonCard, ErrorMessage } from '../components/states';

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return <div className="p-8"><SkeletonCard count={4} /></div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorMessage
          message="Dashboard stats failed to load."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
};

export default Dashboard;