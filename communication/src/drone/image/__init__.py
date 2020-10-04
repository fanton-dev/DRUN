"""Image handler for the drone.

Provides a custom thread class for handling image input/output from a remote
Parrot AR drone connected to the internet.
"""

from __future__ import absolute_import
from threading import Thread
from typing import List

import numpy as np

from .input import (
    camera_input,
    network_input
)
from .output import (
    debug_output,
    network_output
)


class ImageThread(Thread):
    """Custom thread class for handling image input/output.

    Args:
        input_mode (List[str]): Input methods to be invoked.
        output_mode (List[str]): Output methods to be invoked.
        current_image (np.ndarray): Cross-thread image data.
        ip_address (str): IP address of the remote device.
        port (List[int]): TCP port for communication.
    """

    def __init__(
            self,
            input_mode: List[str],
            output_mode: List[str],
            current_image: np.array,
            ip_address: str,
            port: List[int]
    ) -> None:
        self.input_mode = input_mode
        self.output_mode = output_mode
        self.current_image = current_image
        self.ip_address = ip_address
        self.port = port

        super(ImageThread, self).__init__()

    def run(self) -> None:
        input_ts = []
        output_ts = []

        if "camera" in self.input_mode:
            input_ts.append(
                Thread(
                    target=camera_input,
                    args=(self.current_image,)
                )
            )
        if "network" in self.input_mode:
            input_ts.append(
                Thread(
                    target=network_input,
                    args=(
                        self.current_image,
                        self.port,
                    )
                )
            )

        if "debug" in self.output_mode:
            output_ts.append(
                Thread(
                    target=debug_output,
                    args=(self.current_image,)
                )
            )
        if "network" in self.output_mode:
            output_ts.append(
                Thread(
                    target=network_output,
                    args=(
                        self.current_image,
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
            thread.join()

