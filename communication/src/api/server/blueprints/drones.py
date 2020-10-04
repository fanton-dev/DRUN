
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

from flask import Blueprint, request, jsonify

from ....drone import DroneServerThread
from ...common import common_variables


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
        200, [port1, port2, port3] - Drone thread created successfully.
        400, "Bad Request" - Missing information in request.
    """

    # Checking if json info is full and making variables
    if not 'drone_id' in request.json or not 'home' in request.json:
        return "Bad Request", 400
    drone_id = request.json["drone_id"]
    home = request.json["home"]
    if drone_id == "" or len(home) == 0:
        return "Bad Request", 400

    # Adding ports
    ports_lock, ports_assigned = common_variables.get_ports_assigned()

    ports_lock.acquire()

    port1 = ports_assigned[-1]+1
    port2 = port1 + 1
    port3 = port2 + 1
    ports_assigned.append(port1)
    ports_assigned.append(port2)
    ports_assigned.append(port3)

    ports_lock.release()

    # Creating drone thread object

    ports = [port1, port2, port3]
    ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    new_drone_th = DroneServerThread(drone_id, ip_address, ports, home)

    # Adding drone thread object to drone's list

    drones_lock, drone_ts = common_variables.get_drone_ts()
    drones_lock.acquire()
    drone_ts.append(new_drone_th)
    drone_ts[-1].start()
    drones_lock.release()

    print(request.json)
    return jsonify(ports), 200


@drones_blueprint.route("/drones/disconnect", methods=["DELETE"])
def disconnect() -> Tuple[str, int]:
    """Deletes the DroneServerThread with a given id.

    Iterates over all the drones in the shared list and deletes the one with a
    matching drone_id. If none are found returns an error.

    Request:
        drone_id (str): UUID of the drone.

    Response:
        Tuple[str, int]: Response status.
        200, "OK" - Drone disconnected created successfully.
        400, "Bad Request" - Incorrect drone_id.
    """

    # Check if the json is correct and making a variable
    if not 'uuid' in request.json or request.json["uuid"] == "":
        return "Bad Request", 400
    drone_id = request.json["uuid"]

    # Iterates through the array and checks elements
    drones_lock, drone_ts = common_variables.get_drone_ts()
    drones_lock.acquire()
    for drone in drone_ts:
        if drone_id == drone.drone_id:
            ports_lock, ports_assigned = common_variables.get_ports_assigned()
            ports_assigned.remove(drone.ports[0])
            ports_assigned.remove(drone.ports[1])
            ports_assigned.remove(drone.ports[2])
            drone_ts.remove(drone)
            drones_lock.release()
            return "OK", 200

    drones_lock.release()
    return "Bad Request", 400


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

    lock, drone_ts = common_variables.get_drone_ts()
    lock.acquire()
    drone_list = [drone_t.__dict__ for drone_t in drone_ts]
    lock.release()
    for drone in drone_list:
        drone["orders"] = [order.__dict__ for order in drone["orders"]]
        drone.pop("current_image")
        drone.pop("current_controls")
        for key in list(drone.keys()):
            if key.startswith("_"):
                drone.pop(key)
    print(drone_list)

    return jsonify(drone_list), 200
