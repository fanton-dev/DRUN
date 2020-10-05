"""Drone REST API Flask server.
This module contains a Flask server with th following paths:
    - PUT "/drones/connect"
        Processes new drone connections.
    - DELETE "/drones/disconnect"
        Deletes the DroneServerThread with a given id.
    - GET "/drones/status"
        Responds with the current status of the drones.

    - PUT "/orders/create"
        Processes new orders submitions.
    - GET "/orders/status"
        Returns information of orders processed by the server.

    - PUT "/users/create"
        Creates ethereum keys and links them to the Firebase UUID passed.

Usage:
    from server import create_app
    app = create_app()
    app.run(host="0.0.0.0", debug=False)
"""

from __future__ import absolute_import

from flask import Flask

from .blueprints.drones import drones_blueprint
from .blueprints.orders import orders_blueprint
from .blueprints.users import users_blueprint


def create_app(name: str = __name__) -> Flask:
    """Initializes the Flask server.

    Args:
        name (str, optional): Name of the server. Defaults to __name__.
        config (str, optional): Configuration file. Defaults to "flask.cfg".

    Returns:
        Flask: API Server object.
    """

    app = Flask(
        name,
        template_folder="templates",
        instance_relative_config=True
    )

    blueprints = (drones_blueprint, orders_blueprint, users_blueprint)
    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    return app
