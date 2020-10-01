"""Drone driving module.

Provides all the means for connecting to a remote drone and creating 3 TCP
sessions - 1 for controls transmission, 1 for camera image data and 1 for
location data.
"""

from __future__ import absolute_import
from threading import Thread
from typing import List

from .control import ControlThread
from .image import ImageThread
from .location import LocationThread


class DroneServerThread(Thread):
    """Custom thread class containing everything needed for driving a drone.
    Args:
        drone_id (str): A permanent drone indentification UUID.
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
