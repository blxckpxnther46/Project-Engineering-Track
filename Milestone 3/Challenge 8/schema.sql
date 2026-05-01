DROP TABLE IF EXISTS feature_usage;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
  session_id SERIAL PRIMARY KEY,
  user_id INT,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  user_id INT,
  session_id INT,
  event_type TEXT,
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE feature_usage (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    feature_name VARCHAR(100) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    count INTEGER DEFAULT 1
);

DROP TABLE IF EXISTS feature_usage;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
  session_id SERIAL PRIMARY KEY,
  user_id INT,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  user_id INT,
  session_id INT,
  event_type TEXT,
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE feature_usage (
  id SERIAL PRIMARY KEY,
  user_id INT,
  feature_name TEXT,
  used_at TIMESTAMP DEFAULT NOW()
);