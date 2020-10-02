"""Database controller module."""

from __future__ import absolute_import
import os
import sqlite3 as sqlite

DB_NAME = os.path.dirname(os.path.realpath(__file__)) + "/drun.db"

conn = sqlite.connect(DB_NAME)

# Creating "users" table if it does not exist.
conn.cursor().execute('''
CREATE TABLE IF NOT EXISTS users
    (
        firebase_user_id TEXT PRIMARY KEY,
        ethereum_public_key TEXT NOT NULL UNIQUE,
        ethereum_private_key TEXT NOT NULL UNIQUE,
        discord_api_key TEXT UNIQUE
    )
''')
conn.commit()

# Creating "orders" table if it does not exist.
conn.cursor().execute('''
CREATE TABLE IF NOT EXISTS orders
    (
        order_id TEXT PRIMARY KEY,
        drone_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        reciever_id TEXT NOT NULL,
        price_customer FLOAT NOT NULL,
        price_delivery FLOAT NOT NULL,
        sender_location_x FLOAT NOT NULL,
        sender_location_y FLOAT NOT NULL,
        reciever_location_x FLOAT NOT NULL,
        reciever_location_y FLOAT NOT NULL,
        start_time DATE NOT NULL,
        FOREIGN KEY(sender_id) REFERENCES users(firebase_user_id),
        FOREIGN KEY(reciever_id) REFERENCES users(firebase_user_id)
    )
''')
conn.commit()

class Database:
    """Database controller class."""

    def __enter__(self):
        self.conn = sqlite.connect(DB_NAME)
        return self.conn.cursor()

    def __exit__(self, cb_type, value, traceback):
        self.conn.commit()
