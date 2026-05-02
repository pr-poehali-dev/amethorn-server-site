CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  minecraft_nick VARCHAR(64) NOT NULL,
  age INTEGER NOT NULL,
  about TEXT NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reject_reason TEXT
);