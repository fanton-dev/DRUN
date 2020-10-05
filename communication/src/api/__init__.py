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
from typing import List
from threading import Thread

from .server import create_app
from .common import common_variables
from ..drone import DroneServerThread


class APIServerThread(Thread):
    """Custom thread class for runing the Flask API server.

    Args:
        drone_ts (List[DroneServerThread]): List of all drones connected.
        port (int): Port on which the API should run.
    """

    def __init__(self, drone_ts: List[DroneServerThread], port: int) -> None:
        self.drone_ts = drone_ts
        self.ports_assigned = [port]
        common_variables.set_drone_ts(self.drone_ts)
        common_variables.set_ports_assigned(self.ports_assigned)

        super(APIServerThread, self).__init__()

    def run(self) -> None:
        app = create_app()
        app.run(host='0.0.0.0', port=self.ports_assigned[0], debug=False)
