CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE subtitles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  content TEXT NOT NULL
);

