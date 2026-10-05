CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('farmer', 'partner', 'admin')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  county text,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  county text NOT NULL,
  sub_county text,
  area_ha numeric(8, 2) NOT NULL CHECK (area_ha > 0),
  farm_type text NOT NULL DEFAULT 'Smallholder',
  water_source text,
  irrigation text,
  lat numeric(9, 6),
  lng numeric(9, 6),
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX farms_owner_idx ON farms (owner_id);

CREATE TABLE crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name text NOT NULL,
  stage text,
  expected_kg integer NOT NULL DEFAULT 0 CHECK (expected_kg >= 0),
  expected_harvest date,
  risk text NOT NULL DEFAULT 'low' CHECK (risk IN ('low', 'medium', 'high')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX crops_farm_idx ON crops (farm_id);

CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('buyer', 'processor', 'storage', 'transport')),
  county text,
  lat numeric(9, 6),
  lng numeric(9, 6),
  price_per_kg numeric(8, 2),
  capacity_kg integer,
  accepting boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE match_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  crop_id uuid REFERENCES crops(id) ON DELETE SET NULL,
  kg integer NOT NULL CHECK (kg > 0),
  price_per_kg numeric(8, 2) NOT NULL,
  pickup_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'declined', 'scheduled', 'in_transit', 'delivered')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX match_requests_partner_idx ON match_requests (partner_id, status);
CREATE INDEX match_requests_farmer_idx ON match_requests (farmer_id);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('alert', 'message', 'system')),
  icon text NOT NULL,
  tone text NOT NULL,
  title text NOT NULL,
  body text,
  action_to text,
  unread boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON notifications (user_id, created_at DESC);