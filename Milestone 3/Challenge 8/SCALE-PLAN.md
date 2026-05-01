# 📈 SCALE PLAN – TrackFlow API

---

## 1️⃣ Growth Projections

### 📊 Current Load

| Metric                | Value             |
| --------------------- | ----------------- |
| Active Users          | 50,000            |
| Events per User / Day | 200               |
| Total Events / Day    | 10,000,000        |
| Monthly Growth        | ~300,000,000 rows |

---

### 📈 Data Growth Projection

| Time     | Total Rows  |
| -------- | ----------- |
| 1 Day    | 10 million  |
| 1 Week   | 70 million  |
| 1 Month  | 300 million |
| 3 Months | 900 million |

---

### ❌ Breaking Query

```sql
SELECT COUNT(*), event_type
FROM events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY event_type;
```

### 🚨 Why it breaks

* Full table scan on massive dataset
* No partition pruning
* High memory + CPU usage
* Slows down API response

---

## 2️⃣ Three-Strategy Summary

---

### 🥇 Partitioning Strategy

* **Type:** Time-based partitioning (monthly)
* **Reason:** Events are time-series data

```sql
CREATE TABLE events_2026_04 PARTITION OF events
FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
```

✔ Benefits:

* Faster queries (partition pruning)
* Efficient inserts
* Easy cleanup

---

### 🥈 Archiving Strategy

* **Threshold:** 30 days
* **Schedule:** Daily job

```sql
DELETE FROM events
WHERE created_at < NOW() - INTERVAL '30 days';
```

✔ Older data:

* moved to cold storage / backups
* reduces table size

---

### 🥉 Read Replica Strategy

* **Writes → Primary DB**
* **Reads → Replica DB**

Affected routes:

```plaintext
GET /metrics/monthly
GET /events
GET /sessions/active
```

✔ Benefit:

* Reduces load on primary DB
* Improves read performance

---

## 3️⃣ Implementation Order

---

### 🥇 First: Partitioning

✔ Reason:

* Biggest immediate performance issue
* Queries already slowing with growth
* Enables efficient data handling

---

### 🥈 Second: Archiving

✔ Reason:

* Controls data explosion
* Prevents storage + performance degradation

---

### 🥉 Third: Read Replicas

✔ Reason:

* Needed when traffic increases
* Not critical at early stage
* Adds infrastructure complexity

---

## 4️⃣ Trade-offs and Risks

---

### ⚠️ Partitioning

* **Risk:** Increased schema complexity
* **Issue:** Incorrect queries may skip partitions
* **Mitigation:** Always filter by `created_at`

---

### ⚠️ Archiving

* **Risk:** Loss of historical data
* **Issue:** Queries may not include archived data
* **Mitigation:** Store backups and define retention policy

---

### ⚠️ Read Replicas

* **Risk:** Replication lag
* **Issue:** Slightly stale data in analytics
* **Mitigation:** Use primary DB for critical reads

---

## 🏁 Conclusion

This plan ensures:

* Efficient handling of **millions of events/day**
* Improved query performance
* Controlled storage growth
* Scalable architecture for future expansion

---
