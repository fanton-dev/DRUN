"Module containing Order class for drone deliveries."

from __future__ import absolute_import
from typing import List, Dict
import time

from ...database import Database


class Order():
    """Class containing everything needed for the delivery of a order.
    Args:
        order_id (str): UUID of the order. Set as None if it is a new order.
        drone_id (str): UUID of the drone.
        sender_id (str): UUID of the sender.
        receiver_id (str): UUID of the receiver.
        price_customer (float): Price the receiver should pay the sender.
        sender_location (List[float]): Coordinates X and Y of the sender.
        receiver_location (List[float]): Coordinates X and Y of the receiver.
        start_time (str, optional): Date and time the order was created.
    """

    def __init__(
            self,
            order_id: str,
            drone_id: str,
            sender_id: str,
            reciever_id: str,
            price_customer: float,
            price_delivery: float,
            sender_location: List[float],
            reciever_location: List[float],
            start_time: str = time
    ) -> None:
        self.order_id = order_id if order_id else uuid.uuid4().hex
        self.drone_id = drone_id
        self.sender_id = sender_id
        self.reciever_id = reciever_id
        self.price_customer = price_customer
        self.price_delivery = price_delivery
        self.sender_location = sender_location
        self.reciever_location = reciever_location
        self.start_time = start_time

    def database_add(self) -> None:
        """Stores order entry in the database."""
        with Database() as database:
            database.execute(
                """
                INSERT INTO orders
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    self.order_id,
                    self.drone_id,
                    self.sender_id,
                    self.reciever_id,
                    self.price_customer,
                    self.price_delivery,
                    self.sender_location[0],
                    self.sender_location[1],
                    self.reciever_location[0],
                    self.reciever_location[1],
                    self.start_time))

    @staticmethod
    def database_get(filters: Dict[str, str] = None) -> List:
        """Returns a list of orders matching the filters passed.

        Args:
            filters (Dict[str, str], optional): Query filters.

        Returns:
            List[Order]: A list of orders matching the query.
        """

        query = "SELECT * FROM orders "
        if "order_id" in filters:
            query += "WHERE order_id = {}".format(filters["order_id"])

        if "drone_id" in filters:
            query += "WHERE drone_id = {}".format(filters["drone_id"])

        if "sender_id" in filters:
            query += "WHERE sender_id = {}".format(filters["sender_id"])

        if "reciever_id" in filters:
            query += "WHERE reciever_id = {}".format(filters["reciever_id"])

        if "price_customer" in filters:
            query += "WHERE price_customer = {}".format(
                filters["price_customer"])

        if "price_delivery" in filters:
            query += "WHERE price_delivery = {}".format(
                filters["price_delivery"])

        if "newer_than" in filters:
            query += "WHERE start_time < '{}'".format(filters["newer_than"])

        if "older_than" in filters:
            query += "WHERE start_time > '{}'".format(filters["older_than"])

        with Database() as database:
            rows = database.execute(query).fetchall()
            orders = [Order(row[0], row[1], row[2], row[3], row[4], row[5], [
                            row[6], row[7]], [row[8], row[9]], row[10]) for row in rows]
            return orders
