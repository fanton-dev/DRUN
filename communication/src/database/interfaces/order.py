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
        reciever_id (str): UUID of the reciever.
        price_customer (float): Price the reciever should pay the sender.
        sender_location (List[float]): Coordinates X and Y of the sender.
        reciever_location (List[float]): Coordinates X and Y of the reciever.
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
