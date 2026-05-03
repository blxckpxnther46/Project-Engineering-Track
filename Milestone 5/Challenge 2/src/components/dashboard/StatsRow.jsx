import StatCard from "../shared/StatCard";

export default function StatsRow({ total, completed, progress }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      <StatCard label="Total" value={total} />
      <StatCard label="Completed" value={completed} />
      <StatCard label="Progress" value={`${progress}%`} />
    </div>
  );
}