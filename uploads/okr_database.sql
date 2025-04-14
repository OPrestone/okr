-- OKR System Database Schema

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  team_id INTEGER,
  position VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams Table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  leader_id INTEGER NOT NULL REFERENCES users(id),
  description TEXT,
  parent_team_id INTEGER REFERENCES teams(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key reference for users.team_id after teams table exists
ALTER TABLE users ADD CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES teams(id);

-- Cycles Table (for OKR time periods)
CREATE TABLE cycles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'upcoming',
  type VARCHAR(50) NOT NULL DEFAULT 'quarterly',
  created_by_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_default BOOLEAN DEFAULT FALSE
);

-- Objectives Table
CREATE TABLE objectives (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  team_id INTEGER REFERENCES teams(id),
  owner_id INTEGER REFERENCES users(id),
  is_company_objective BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  cycle_id INTEGER REFERENCES cycles(id),
  status VARCHAR(50) DEFAULT 'active',
  priority VARCHAR(50) DEFAULT 'medium',
  parent_objective_id INTEGER REFERENCES objectives(id),
  created_by_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT FALSE,
  confidence_score INTEGER
);

-- Key Results Table
CREATE TABLE key_results (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  objective_id INTEGER NOT NULL REFERENCES objectives(id),
  owner_id INTEGER REFERENCES users(id),
  start_value NUMERIC,
  target_value NUMERIC,
  current_value NUMERIC,
  is_completed BOOLEAN DEFAULT FALSE,
  unit VARCHAR(50),
  format VARCHAR(50) NOT NULL DEFAULT 'number',
  direction VARCHAR(50) NOT NULL DEFAULT 'increasing',
  confidence_score INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check-ins Table
CREATE TABLE check_ins (
  id SERIAL PRIMARY KEY,
  objective_id INTEGER REFERENCES objectives(id),
  key_result_id INTEGER REFERENCES key_results(id),
  author_id INTEGER NOT NULL REFERENCES users(id),
  new_value NUMERIC,
  previous_value NUMERIC,
  progress_delta INTEGER,
  note TEXT,
  confidence_score INTEGER,
  check_in_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings Table
CREATE TABLE meetings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id1 INTEGER NOT NULL REFERENCES users(id),
  user_id2 INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'scheduled',
  meeting_type VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  notes TEXT,
  recording_url VARCHAR(500),
  recurrence VARCHAR(50),
  objective_id INTEGER REFERENCES objectives(id),
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources Table
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  url VARCHAR(500),
  category VARCHAR(50),
  tags TEXT[],
  author_id INTEGER REFERENCES users(id),
  is_public BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Data Table
CREATE TABLE financial_data (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  objective_id INTEGER REFERENCES objectives(id),
  department VARCHAR(100),
  import_batch_id VARCHAR(100),
  created_by_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Settings Table
CREATE TABLE company_settings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  primary_color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default company settings
INSERT INTO company_settings (name, primary_color) 
VALUES ('My Company', '#4f46e5');

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category) 
VALUES 
('default_cycle_duration', '90', 'Default duration in days for OKR cycles', 'okr'),
('objective_limit_per_user', '5', 'Maximum number of objectives a user can own', 'okr'),
('enable_ai_suggestions', 'true', 'Whether AI-generated OKR suggestions are enabled', 'features'),
('enable_google_meet', 'true', 'Whether Google Meet integration is enabled', 'features');

-- Create indexes for performance
CREATE INDEX idx_objectives_owner_id ON objectives(owner_id);
CREATE INDEX idx_objectives_team_id ON objectives(team_id);
CREATE INDEX idx_objectives_cycle_id ON objectives(cycle_id);
CREATE INDEX idx_key_results_objective_id ON key_results(objective_id);
CREATE INDEX idx_key_results_owner_id ON key_results(owner_id);
CREATE INDEX idx_check_ins_key_result_id ON check_ins(key_result_id);
CREATE INDEX idx_meetings_user_id1 ON meetings(user_id1);
CREATE INDEX idx_meetings_user_id2 ON meetings(user_id2);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);