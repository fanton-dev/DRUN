"""Location handler for the drone.

Provides a custom thread class for handling location input/output from a
remote Parrot AR drone connected to the internet.
"""

from __future__ import absolute_import
from threading import Thread
from typing import List

from .input import (
    gps_input,
    network_input
)
from .output import (
    debug_output,
    network_output
)


class LocationThread(Thread):
    """Custom thread class for handling controls input/output.

    Args:
        input_mode (List[str]): Input methods to be involked.
        output_mode (List[str]): Output methods to be involked.
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
            current_location: List[float],
            ip_address: str,
            port: List[int]
    ) -> None:
        super(LocationThread, self).__init__()

    def run(self) -> None:
        pass
