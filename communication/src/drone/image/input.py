"Input methods for the ImageThread, modifying current_image."

from __future__ import absolute_import

import numpy as np


def camera_input(current_image: np.ndarray) -> None:
    """Reads data from the drone camera and stores it in the shared buffer.

    Args:
        current_image (np.ndarray): Cross-thread image data.
    """


def network_input(current_image: np.ndarray, port: int) -> None:
    """Creates a socket for listening for received drone image frames.

    Args:
        current_image (np.ndarray): Cross-thread image data.
        port (int): TCP port a socket to be created on for listening.
    """
