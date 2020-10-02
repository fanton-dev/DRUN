
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

from flask import Blueprint


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


@users_blueprint.route("/users/update_discord", methods=["POST"])
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
