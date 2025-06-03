-- Create platform_connections table
CREATE TABLE platform_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  platform_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  account_info JSONB,
  credentials_encrypted TEXT, -- For non-OAuth platforms
  connection_status TEXT DEFAULT 'connected' CHECK (connection_status IN ('connected', 'disconnected', 'error', 'pending')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('manual', 'daily', 'weekly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform_name)
);

-- Create platform_data table for storing synced data
CREATE TABLE platform_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID REFERENCES platform_connections(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'revenue', 'streams', 'releases', etc.
  period_start DATE,
  period_end DATE,
  data_value NUMERIC,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(connection_id, data_type, period_start, period_end)
);

-- Enable RLS
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own platform connections" ON platform_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform connections" ON platform_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform connections" ON platform_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform connections" ON platform_connections
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own platform data" ON platform_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM platform_connections 
      WHERE id = platform_data.connection_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own platform data" ON platform_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_connections 
      WHERE id = platform_data.connection_id 
      AND user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_platform_connections_user_id ON platform_connections(user_id);
CREATE INDEX idx_platform_connections_platform ON platform_connections(platform_name);
CREATE INDEX idx_platform_data_connection_id ON platform_data(connection_id);
CREATE INDEX idx_platform_data_period ON platform_data(period_start, period_end);

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_platform_connections_updated_at 
  BEFORE UPDATE ON platform_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 