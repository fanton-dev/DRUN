"Output methods for the ImageThread, reading from current_image."

from __future__ import absolute_import

import numpy as np


def debug_output(current_image: np.ndarray) -> None:
    """Creates a debug window for previewing the image data.

    Args:
        current_image (np.ndarray): Cross-thread image data.
    """


def network_output(
        current_image: np.ndarray,
        ip_address: str,
        port: int,
        fps: float = 10.0
) -> None:
    """Connects to a given socket and forwards images to it at a certain FPS.
    Args:
        current_image (np.ndarray): Cross-thread image data.
        ip_address (str): IP address of the server.
        port (int): TCP port on the server for communication.
        fps (float, optional): Rate data to be send at. Defaults to 10.0.
    """
