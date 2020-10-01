
"""
Blueprint of the "/drones" server path.
This module contains a Flask server with th following paths:
    - PUT /drones/create
        Creates allocates and returns 3 ports and creates a DroneServerThread.
    - DELETE /drones/disconnect/:drone_id
        Deletes the DroneServerThread with a given id.
    - GET /drones/status
        Responds with the current status of the drones.
Usage:
    from server.blueprints.drones import drones_blueprint
    app.register_blueprint(drones_blueprint)
"""

from __future__ import absolute_import
from typing import Tuple, List, Dict

from flask import Blueprint


drones_blueprint = Blueprint("drones", __name__)


@drones_blueprint.route("/drones/connect", methods=["PUT"])
def connect() -> Tuple[str, int]:
    """Processes new drone connections.

    Creates а DroneServerThread object and allocates it 3 empty ports. Then
    the object is added to the drone_ts list and the port numbers are returned
    as a responce. On insufficient information, 400 "Bad request" is sent.

    Request:
        drone_id (str): UUID of the drone.
        home (List[float]): Coordinates X and Y of the drone starting postion.

    Response:
        Tuple[str, int]: Response status.
        200, [port1, port2, port3] - Drone thread created sucessfully.
        400, "Bad Request" - Missing information in request.
    """


@drones_blueprint.route("/drones/disconnect", methods=["DELETE"])
def disconnect() -> Tuple[str, int]:
    """Deletes the DroneServerThread with a given id.

    Iterates over all the drones in the shared list and deletes the one with a
    matching drone_id. If none are found returns an error.

    Request:
        drone_id (str): UUID of the drone.

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - Drone disconnected created sucessfully.
        400, "Bad Request" - Incorrect drone_id.
    """


@drones_blueprint.route("/drones/status", methods=["GET"])
def status() -> List[Dict]:
    """Returns information of drones processed by the server.

    Returns a list of drones matching the filters in the request body.

    Request:
        drone_id (str, optional): UUID of the drone.
        ip_address (str, optional): Drone IP address.
        ports (List[int], optional): Control, images and GPS ports.
        home (List[float], optional): Drone starting postion coordinates.
        available (bool, optional): Whether the drone is available or not.

    Response:
        List[Dict] or Tuple[str, int]: JSON list of drones.
        200, [drone_t.__dict__, ...] - List of all drones found.
    """
