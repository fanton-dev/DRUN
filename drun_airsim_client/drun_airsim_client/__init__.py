"""Base simulation utility for Microsoft AirSim."""

from __future__ import absolute_import

from airsim import (
    MultirotorClient
)


class DRUNAirSimClient(MultirotorClient):
    """Custom simulation client for Microsoft AirSim to wrap base functions
    required for reinforcement learning.

    Args:
        ip (str, optional): IP of the AirSim instance. Defaults to "".
        port (int, optional): Port of the AirSim instance. Defaults to 41451.
    """

    def __init__(self, ip: str = "", port: int = 41451):
        MultirotorClient.__init__(self)
        MultirotorClient.confirmConnection(self)
        self.enableApiControl(True)
        self.armDisarm(True)
