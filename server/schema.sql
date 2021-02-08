CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    phone_number TEXT NOT NULL,
    joined_on TIMESTAMPTZ NOT NULL
);

-- TO-DO REFERENCES users(id)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    sender_id UUID NOT NULL, 
    sender_location_latitude FLOAT8 NOT NULL,
    sender_location_longitude FLOAT8 NOT NULL,
    receiver_id UUID NOT NULL,
    receiver_location_latitude FLOAT8 NOT NULL,
    receiver_location_longitude FLOAT8 NOT NULL,
    source_ip TEXT NOT NULL,
    source_browser TEXT NOT NULL,
    source_referrer TEXT,
    created_on TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id) NOT NULL,
    payment_card_token TEXT NOT NULL,
    created_on TIMESTAMPTZ NOT NULL,
    completed_on TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id) NOT NULL,
    drone_id UUID NOT NULL,
    drone_home_location_latitude FLOAT8 NOT NULL,
    drone_home_location_longitude FLOAT8 NOT NULL,
    drone_source_ip TEXT NOT NULL,
    drone_source_browser TEXT,
    drone_source_referrer TEXT,
    sender_location_latitude FLOAT8 NOT NULL,
    sender_location_longitude FLOAT8 NOT NULL,
    receiver_location_latitude FLOAT8 NOT NULL,
    receiver_location_longitude FLOAT8 NOT NULL,
    created_on TIMESTAMPTZ NOT NULL,
    completed_on TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS order_logs (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    subject TEXT NOT NULL,
    body TEXT NOT NULL
)

CREATE TABLE users(
  id INTEGER PRIMARY KEY,
  token TEXT NOT NULL,
  phone_number TEXT NOT NULL
)