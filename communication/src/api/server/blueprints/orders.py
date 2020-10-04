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

from pathlib import Path
import os

from flask import Blueprint, request, jsonify

from ...common import common_variables
from ....database.interfaces.order import Order
from ....ethereum import EthereumClient
from ....database import Database
from ....database.interfaces.user import User
from dotenv import load_dotenv


from datetime import datetime


PRICE_DELIVERY: float = 2.00
orders_blueprint = Blueprint("orders", __name__)


@orders_blueprint.route("/orders/create", methods=["PUT"])
def create() -> Tuple[str, int]:
    """Processes new orders submitions.

    1.
    This path takes the order information and creates an Order object.
    2.
    Then it tries processing two ethereum payments - one from the wallet
    of the receiver to the wallet of the sender with a price specified in the
    order.price_customer variable and the other - from the receiver to a
    server wallet with the amount specified in order.price_delivery.
    3.
    The order information is added to the "orders" database table.
    4.
    FInally, the order object is appended to the drone order list with the
    least pending orders.

    Request:
        drone_id (str): UUID of the drone.
        sender_id (str): UUID of the sender.
        receiver_id (str): UUID of the receiver.
        price_customer (float): Price the receiver should pay the sender.
        sender_location (List[float]): Coordinates X and Y of the sender.
        receiver_location (List[float]): Coordinates X and Y of the receiver.

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - Order created successfully.
        400, "Bad Request" - Missing information in request.
        402, "Payment Required" - Insufficient funds.
    """

    # Initialising variables from json
    drone_id = request.json["drone_id"]
    sender_id = request.json["sender_id"]
    reciever_id = request.json["reciever_id"]
    price_customer = request.json["price_customer"]
    sender_location = request.json["sender_location"]
    reciever_location = request.json["reciever_location"]

    sender_public_key = ""
    reciever_public_key = ""
    reciever_private_key = ""

    # Getting keys for sender from the db
    query = "SELECT * FROM users WHERE firebase_user_id = '{}'".format(
        sender_id)
    with Database() as database:
        rows = database.execute(query).fetchall()
        if rows == []:
            return "No such sender", 402
        sender_public_key = rows[0][1]

    # Getting keys for sender from the db
    query = "SELECT * FROM users WHERE firebase_user_id = '{}'".format(
        reciever_id)
    with Database() as database:
        rows = database.execute(query).fetchall()
        if rows == []:
            return "No such reciever", 402
        reciever_public_key = rows[0][1]
        reciever_private_key = rows[0][2]

    # Transaction from reciever to sender

    transaction_client = EthereumClient("http://127.0.0.1:7545")

    tx_hash = transaction_client.make_transaction(
        reciever_public_key, sender_public_key, reciever_private_key, price_customer)

    # Transaction from reciever to bank

    bank_address = transaction_client.get_bank_address()
    transaction_client.make_transaction(
        reciever_public_key, bank_address, reciever_private_key, PRICE_DELIVERY)

    now = datetime.now()

    # Creating new order and sending it to the db
    new_order = Order(tx_hash, drone_id, sender_id, reciever_id, price_customer,
                      PRICE_DELIVERY, sender_location, reciever_location, now)
    new_order.database_add()

    return "OK", 200


@orders_blueprint.route("/orders/status", methods=["GET"])
def status() -> List[Dict]:
    """Returns information of orders processed by the server.
    Returns a list of orders matching the filters in the request body.

    Request:
        order_id (str, optional): UUID of the order.
        drone_id (str, optional): UUID of the drone.
        sender_id (str, optional): UUID of the sender.
        receiver_id (str, optional): UUID of the receiver.
        price_customer (float, optional): Amount the receiver payed.
        price_delivery (float, optional): Amount the delivery cost.
        newer_than (str, optional): Only requests made after this date.
        older_than (str, optional): Only requests made before this date.

    Response:
        List[Dict] or Tuple[str, int]: JSON list of orders.
        200, [order.__dict__, ...] - List of all orders found.
    """
    return jsonify([order.__dict__ for order in Order.database_get(request.json)]), 200
