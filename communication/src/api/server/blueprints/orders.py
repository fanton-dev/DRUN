"""
Blueprint of the "/orders" server path.
This module contains a Flask server with th following paths:
    - PUT /orders/create
        Processes new orders submitions.
    - GET /orders/status
        Returns information of orders processed by the server.
Usage:
    from server.blueprints.orders import orders_blueprint
    app.register_blueprint(orders_blueprint)
"""

from __future__ import absolute_import
from typing import Tuple, List, Dict

from flask import Blueprint


PRICE_DELIVERY: float = 2.00
orders_blueprint = Blueprint("orders", __name__)


@orders_blueprint.route("/orders/create", methods=["PUT"])
def create() -> Tuple[str, int]:
    """Processes new orders submitions.

    1.
    This path takes the order information and creates an Order object.
    2.
    Then it tries processing two etherium payments - one from the wallet
    of the reciever to the wallet of the sender with a price specified in the
    order.price_customer variable and the other - from the reciever to a
    server wallet with the amount specified in order.price_delivery.
    3.
    The order information is added to the "orders" database table.
    4.
    FInally, the order object is appended to the drone order list with the
    least pending orders.

    Request:
        drone_id (str): UUID of the drone.
        sender_id (str): UUID of the sender.
        reciever_id (str): UUID of the reciever.
        price_customer (float): Price the reciever should pay the sender.
        sender_location (List[float]): Coordinates X and Y of the sender.
        reciever_location (List[float]): Coordinates X and Y of the reciever.

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - Order created sucessfully.
        400, "Bad Request" - Missing information in request.
        402, "Payment Required" - Insuficient funds.
    """


@orders_blueprint.route("/orders/status", methods=["GET"])
def status() -> List[Dict]:
    """Returns information of orders processed by the server.
    Returns a list of orders matching the filters in the request body.

    Request:
        order_id (str, optional): UUID of the order.
        drone_id (str, optional): UUID of the drone.
        sender_id (str, optional): UUID of the sender.
        reciever_id (str, optional): UUID of the reciever.
        price_customer (float, optional): Amount the reciever payed.
        price_delivery (float, optional): Amound the delivery cost.
        newer_than (str, optional): Only requests made after this date.
        older_than (str, optional): Only requests made before this date.

    Response:
        List[Dict] or Tuple[str, int]: JSON list of orders.
        200, [order.__dict__, ...] - List of all orders found.
    """
