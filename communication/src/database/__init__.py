"""Database controller module."""

from __future__ import absolute_import
import os
import sqlite3 as sqlite

DB_NAME = os.path.dirname(os.path.realpath(__file__)) + "/drun.db"


class Database:
    """Database controller class."""

    def __enter__(self):
        self.conn = sqlite.connect(DB_NAME)
        return self.conn.cursor()

    def __exit__(self, cb_type, value, traceback):
        self.conn.commit()
