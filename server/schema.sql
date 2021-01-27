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


DROP VIEW IF EXISTS orders_view;
CREATE VIEW orders_view AS
SELECT
    a.id,
    a.sender_id as senderId,
    a.sender_location_latitude AS senderLocationLatitude,
    a.sender_location_longitude AS senderLocationLongitude,
    a.receiver_id AS receiverId,
    a.receiver_location_latitude AS receiverLocationLatitude,
    a.receiver_location_longitude AS receiverLocationLongitude,
    a.source_ip AS sourceIp,
    a.source_browser AS sourceBrowser,
    a.source_referrer AS sourceReferrer,
    a.created_on AS createdOn
FROM orders as a
