"Input methods for the ControlThread, modifying current_controls."

from __future__ import absolute_import
from controls import Controls

import numpy as np

from ...database.interfaces.order import Order


def debug_input(current_controls: Controls) -> None:
    """Reads keyboard input and stores controls it in the shared buffer.

    Args:
        current_controls (Controls): Cross-thread controls data.
    """


def network_input(
        current_controls: Controls,
        ip_address: str,
        port: int
) -> None:
    """Connects to a given socket and receives control data from it.

    Args:
        current_controls (Controls): Cross-thread controls data.
        ip_address (str): IP address of the server.
        port (int): TCP port on the server for communication.
    """


def ai_input(
        current_controls: Controls,
        current_image: np.ndarray,
        current_location: List[float],
        orders: List[Order]
) -> None:
    """Forwards all the drone data to a trained AI model which outputs controls.
    Args:
        current_controls (Controls): Cross-thread controls data.
        current_image (np.ndarray): Cross-thread image data.
        current_location (List[float]): Cross-thread location data.
        orders (List[Order]): List of orders the drone should deliver.
    """
