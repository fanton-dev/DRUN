"Module containing Order class for drone deliveries."

from __future__ import absolute_import
from typing import List, Dict
import time


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
            receiver_id: str,
            price_customer: float,
            price_delivery: float,
            sender_location: List[float],
            receiver_location: List[float],
            start_time: str = time
    ) -> None:
        pass

    def database_add(self) -> None:
        """Stores order entry in the database."""

    @staticmethod
    def database_get(filters: Dict[str, str] = None) -> List:
        """Returns a list of orders matching the filters passed.

        Args:
            filters (Dict[str, str], optional): Query filters.

        Returns:
            List[Order]: A list of orders matching the query.
        """
