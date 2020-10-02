"""Drone driving module.

Provides all the means for connecting to a remote drone and creating 3 TCP
sessions - 1 for controls transmission, 1 for camera image data and 1 for
location data.
"""

from __future__ import absolute_import
from threading import Thread
from typing import List

import numpy as np

from .control import ControlThread
from .image import ImageThread
from .location import LocationThread


class DroneServerThread(Thread):
    """Custom thread class containing everything needed for driving a drone.
    Args:
        drone_id (str): A permanent drone identification UUID.
        ip_address (str): Drone IP address.
        ports (List[int]): A list of 3 TCP ports; for control, images and GPS.
        home (List[float]): Coordinates X and Y of the drone starting postion.
    """

    def __init__(
            self,
            drone_id: str,
            ip_address: str,
            ports: List[int],
            home: List[float]
    ) -> None:
        super(DroneServerThread, self).__init__()

    def run(self) -> None:
        pass


class DroneClientThread(Thread):
    """Custom thread class containing everything needed for driving a drone.
    Args:
        ip_address (str): Drone IP address.
        ports (List[int]): A list of 3 TCP ports; for control, images and GPS.
    """

    def __init__(
            self,
            ip_address: str,
            ports: List[int],
    ) -> None:
        self.ip_address = ip_address
        self.ports = ports

        self.current_controls = [
            {
                "action": "takeoff",
                "state": False,
                "key": "Key.space"
            },
            {
                "action": "land",
                "state": False,
                "key": "x"
            },
            {
                "action": "forward",
                "state": False,
                "key": "w"
            },
            {
                "action": "left",
                "state": False,
                "key": "a"
            },
            {
                "action": "backward",
                "state": False,
                "key": "s"},
            {
                "action": "right",
                "state": False,
                "key": "d"
            },
            {
                "action": "up",
                "state": False,
                "key": "z"
            },
            {
                "action": "down",
                "state": False,
                "key": "c"
            },
            {
                "action": "cw",
                "state": False,
                "key": "e"
            },
            {
                "action": "ccw",
                "state": False,
                "key": "q"
            },
        ]
        self.current_image = np.zeros((448, 448, 3))
        self.current_location = []
        super(DroneClientThread, self).__init__()

    def run(self) -> None:
        # Starting the 3 TCP session threads
        control_t = ControlThread(
            ["network"],
            ["drone"],
            self.current_controls,
            self.current_image,
            self.current_location,
            None,
            self.ip_address,
            self.ports[0]
        )
        control_t.start()

        image_t = ImageThread(
            ["camera"],
            ["network"],
            self.current_image,
            self.ip_address,
            self.ports[1]
        )
        image_t.start()

        location_t = LocationThread(
            ["gps"],
            ["network"],
            self.current_location,
            self.ip_address,
            self.ports[2]
        )
        location_t.start()

        # Waiting for the threads to complete
        control_t.join()
        image_t.join()
        location_t.join()
