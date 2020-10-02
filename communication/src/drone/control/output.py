"Output methods for the ControlThread, reading from current_controls."

from __future__ import absolute_import
from typing import List, Dict


def debug_output(current_controls: List[Dict], fps: float = 0.1) -> None:
    """Prints current controls in the stdout at a given rate.
    Args:
        current_controls (List[Dict]): Cross-thread controls data.
        fps (float): Rate data to be printed at. Defaults to 0.1.
    """


def network_output(current_controls: List[Dict], port: int) -> None:
    """Creates a socket on a given port and forwards control data through it.
    Args:
        current_controls (List[Dict]): Cross-thread controls data.
        port (int): TCP port on the server for communication.
    """


def drone_output(current_controls: List[Dict]) -> None:
    """Connects to the Parrot drone using its API and sends controls.

    Args:
        current_controls (List[Dict]): Cross-thread controls data.
    """


def airsim_output(current_controls: List[Dict]) -> None:
    """Connects using the AirSim client and sends controls from the buffer.

    Args:
        current_controls (List[Dict]): Cross-thread controls data.
    """
