export default function StatCard({ label, value }) {
  return (
    <div style={{ padding: 15, border: "1px solid #333" }}>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}