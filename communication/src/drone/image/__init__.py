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
        input_mode (List[str]): Input methods to be involked.
        output_mode (List[str]): Output methods to be involked.
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
        super(ImageThread, self).__init__()

    def run(self) -> None:
        pass