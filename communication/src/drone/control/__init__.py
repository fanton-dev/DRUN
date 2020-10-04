
"""Control handler for the drone.

Provides a custom thread class for handling control input/output from a remote
Parrot AR drone connected to the internet.
"""

from __future__ import absolute_import
from threading import Thread
from typing import List

from .controls import Controls

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
        current_controls (Controls): Cross-thread controls data.
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
            current_controls: Controls,
            current_image: np.array,
            current_location: List[float],
            orders: List[Order],
            ip_address: str,
            port: List[int]
    ) -> None:
        self.input_mode = input_mode
        self.output_mode = output_mode
        self.current_controls = current_controls
        self.current_image = current_image
        self.current_location = current_location
        self.orders = orders
        self.ip_address = ip_address
        self.port = port

        super(ControlThread, self).__init__()

    def run(self) -> None:
        input_ts = []
        output_ts = []

        if "debug" in self.input_mode:
            input_ts.append(
                Thread(
                    target=debug_input,
                    args=(
                        self.current_controls
                    )
                )
            )
        if "network" in self.input_mode:
            input_ts.append(
                Thread(
                    target=network_input,
                    args=(
                        self.current_controls,
                        self.ip_address,
                        self.port
                    )
                )
            )
        if "ai" in self.input_mode:
            input_ts.append(
                Thread(
                    target=ai_input,
                    args=(
                        self.current_controls,
                        self.current_image,
                        self.current_location,
                        self.orders
                    )
                )
            )

        if "debug" in self.output_mode:
            output_ts.append(
                Thread(
                    target=debug_output,
                    args=(self.current_controls)
                )
            )
        if "network" in self.output_mode:
            output_ts.append(
                Thread(
                    target=network_output,
                    args=(
                        self.current_controls,
                        self.port
                    )
                )
            )
        if "drone" in self.output_mode:
            output_ts.append(
                Thread(
                    target=drone_output,
                    args=(self.current_controls)
                )
            )
        if "airsim" in self.output_mode:
            output_ts.append(
                Thread(
                    target=airsim_output,
                    args=(self.current_controls)
                )
            )

        for thread in input_ts:
            thread.start()

        for thread in output_ts:
            thread.start()

        for thread in input_ts:
            thread.join()

        for thread in output_ts:
            thread.join()
