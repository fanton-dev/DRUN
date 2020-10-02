
"""Control handler for the drone.

Provides a custom thread class for handling control input/output from a remote
Parrot AR drone connected to the internet.
"""

from __future__ import absolute_import
from threading import Thread
from typing import List, Dict

import numpy as np

from .input import (
    debug_input,
    network_input,
    ai_input
)
from .output import (
    debug_output,
    network_output,
    drone_output,
    airsim_output
)
from ...database.interfaces.order import Order


class ControlThread(Thread):
    """Custom thread class for handling controls input/output.

    Args:
        input_mode (List[str]): Input methods to be invoked.
        output_mode (List[str]): Output methods to be invoked.
        current_controls (List[Dict]): Cross-thread controls data.
        current_image (np.ndarray): Cross-thread image data.
        current_location (List[float]): Cross-thread location data.
        orders (List[Order]): List of orders the drone should deliver.
        ip_address (str): IP address of the remote device.
        port (List[int]): TCP port for communication.
    """

    def __init__(
            self,
            input_mode: List[str],
            output_mode: List[str],
            current_controls: List[Dict],
            current_image: np.array,
            current_location: List[float],
            orders: List[Order],
            ip_address: str,
            port: List[int]
    ) -> None:
        super(ControlThread, self).__init__()

    def run(self) -> None:
        pass
