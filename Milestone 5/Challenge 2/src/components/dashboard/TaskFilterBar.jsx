export default function TaskFilterBar({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}