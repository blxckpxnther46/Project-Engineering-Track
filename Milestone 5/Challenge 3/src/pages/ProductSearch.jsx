import { useState, useEffect } from 'react';
import { searchProducts } from '../api/shopwaveApi';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      let isActive = true;

      setLoading(true);

      searchProducts(query).then((data) => {
        if (isActive) {
          setResults(data);
          setLoading(false);
        }
      });

      return () => {
        isActive = false;
      };
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]); // ✅ FIXED (removed results)

  return (
    <div className="page">
      <h1>🔍 Product Search</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {loading && <p>Loading...</p>}

      {results.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}