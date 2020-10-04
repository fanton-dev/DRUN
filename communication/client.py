"""Client for DRUN drone.

Script for establishing a connection with a DRUN server.
"""

from __future__ import absolute_import
import uuid

import requests

from src.drone import DroneClientThread


def client(ip_address: str, api_port: int):
    """Drone client procedure.

    Args:
        ip_address (str): Server IP address.
        api_port (int): TCP port of the server API.
    """

    # Constants
    base_url = "http://{}:{}".format(ip_address, api_port)
    connect_url = base_url + "/drones/connect"
    disconnect_url = base_url + "/drones/disconnect"
    drone_id_file = "drone_id.txt"

    # Generating a drone_id if it has not already be done.
    # If an id file is found it is loaded.
    try:
        file = open(drone_id_file, "r")
        drone_id = file.read()
    except FileNotFoundError:
        drone_id = uuid.uuid4().hex
        file = open(drone_id_file, "w")
        file.write(drone_id)
    finally:
        file.close()

    # Request 3 TCP ports for socket communication
    request_json = {"drone_id": drone_id, "home": [0.0, 0.0]}
    response = requests.put(connect_url, json=request_json)
    ports = response.json()
    print(ports)

    # DroneClientThread
    client_t = DroneClientThread(ip_address, ports)
    client_t.start()
    client_t.join()

    # Disconnects from the server on completion
    requests.delete(disconnect_url)


if __name__ == "__main__":
    client("localhost", 5000)
