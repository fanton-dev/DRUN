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
            current_location: List[float],
            ip_address: str,
            port: List[int]
    ) -> None:
        super(LocationThread, self).__init__()

    def run(self) -> None:
        input_ts = []
        output_ts = []

        if "gps" in self.input_mode:
            input_ts.append(
                Thread(
                    target=gps_input,
                    args=(self.current_location,)
                )
            )
        if "network" in self.input_mode:
            input_ts.append(
                Thread(
                    target=network_input,
                    args=(
                        self.current_location,
                        self.port,
                    )
                )
            )

        if "debug" in self.output_mode:
            output_ts.append(
                Thread(
                    target=debug_output,
                    args=(self.current_location,)
                )
            )
        if "network" in self.output_mode:
            output_ts.append(
                Thread(
                    target=network_output,
                    args=(
                        self.current_location,
                        self.ip_address,
                        self.port,
                    )
                )
            )

        for thread in input_ts:
            thread.start()

        for thread in output_ts:
            thread.start()

        for thread in input_ts:
            thread.join()

        for thread in output_ts:

        pass
