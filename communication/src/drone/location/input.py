"Input methods for the LocationThread, modifying current_location."

from __future__ import absolute_import
from typing import List


def gps_input(current_location: List[float]) -> None:
    """Reads data from the RPi GPS antenna and stores it in the shared buffer.

    Args:
        current_location (List[float]): Cross-thread location data.
    """


def network_input(current_location: List[float], port: int) -> None:
    """Creates a socket for listening for received drone location data.

    Args:
        current_location (List[float]): Cross-thread location data.
        port (int): TCP port a socket to be created on for listening.
    """
