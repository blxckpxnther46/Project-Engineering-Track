import { useMemo, useState } from 'react';
import { generateTransactions } from '../data/generateTransactions';

// Pre-seeded transactions
const initialTransactions = generateTransactions(2000);

export const useTransactions = () => {
  const [transactions] = useState(initialTransactions);
  const [filter, setFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    const lowerFilter = filter.toLowerCase();

    return transactions.filter(t => 
      t.name.toLowerCase().includes(lowerFilter) ||
      t.category.toLowerCase().includes(lowerFilter)
    );
  }, [transactions, filter]);

  return {
    transactions,
    filteredTransactions,
    filter,
    setFilter
  };
};
