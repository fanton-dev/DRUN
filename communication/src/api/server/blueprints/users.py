
"""
Blueprint of the "/users" server path.
This module contains a Flask server with th following paths:
    - PUT "/users/create"
        Creates ethereum keys and links them to the Firebase UUID passed.
Usage:
    from server.blueprints.users import users_blueprint
    app.register_blueprint(users_blueprint)
"""

from __future__ import absolute_import
from typing import Tuple

from flask import Blueprint, request, jsonify
import web3 as w3

from ....ethereum import EthereumClient
from ....database.interfaces.user import User

from ....database import Database


users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/users/create", methods=["PUT"])
def create() -> Tuple[str, int]:
    """Creates ethereum keys and links them to the Firebase UUID passed.

    Request:
        user_firebase_id (str): UUID of the user on Firebase.

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - User created successfully.
        400, "Bad Request" - Missing information in request.
    """
    if not 'user_firebase_id' in request.json or request.json["user_firebase_id"] == "":
        return "Bad Request", 400
    user_firebase_id = request.json["user_firebase_id"]

    user = User(user_firebase_id)
    user.database_add()

    return "OK", 200


@users_blueprint.route("/users/balance", methods=["GET"])
def get_balance() -> Tuple[str, int]:
    """Gets balance of user by the given Firebase UUID.

    Request:
        user_firebase_id (str): UUID of the user on Firebase.

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - User created successfully.
        400, "Bad Request" - Missing information in request.
    """
    if "user_firebase_id" not in request.json:
        return "Bad Request", 400
    user_id = request.json["user_firebase_id"]


    try:
        balance = User.get_balance(user_id)       
    except ValueError as err:
        return str(err), 402

    balance_dict = {"user_balance": balance}

    return jsonify(balance_dict), 200


@users_blueprint.route("/users/balance/topup", methods=["POST"])
def topup_account() -> Tuple[str, int]:
    """Gives amount of money to user with a given Firebase UUID.

    Request:
        user_firebase_id (str): UUID of the user on Firebase.
        amount (str): Amount to insert into user"s account.

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - User created successfully.
        400, "Bad Request" - Missing information in request.
    """

    if "user_firebase_id" not in request.json or "amount" not in request.json:
        return "Bad Request", 400
    user_id = request.json["user_firebase_id"]
    amount = request.json["amount"]

    try:
        topup_tx = User.topup_account(user_id, amount)        
    except ValueError as err:
        return str(err), 402


    topup_dict = {"topup_tx": topup_tx}

    return jsonify(topup_dict), 200


@users_blueprint.route("/users/update_discord", methods=["PATCH"])
def update_discord() -> Tuple[str, int]:
    """Changes the discord ID of a given user.

    Request:
        user_firebase_id (str): UUID of the user on Firebase.
        Discord_OAuth2 (str): New discord ID

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - User created successfully.
        400, "Bad Request" - Missing information in request.
    """
    if "user_firebase_id" not in request.json or "Discord_OAuth2" not in request.json:
        return "Bad Request", 400
    user_id = request.json["user_firebase_id"]
    Discord_OAuth2 = request.json["Discord_OAuth2"]

    User.database_update_discord(user_id, Discord_OAuth2)

    return 'OK', 200
