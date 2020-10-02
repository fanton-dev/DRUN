"""Base simulation utility for Microsoft AirSim."""

from __future__ import absolute_import

from airsim import (
    MultirotorClient,
)


class DRUNAirSimClient(MultirotorClient):
    """Custom simulation client for Microsoft AirSim to wrap base functions
    required for reinforcement learning.

    Args:
        ip (str, optional): IP of the AirSim instance. Defaults to "".
        port (int, optional): Port of the AirSim instance. Defaults to 41451.
    """

    def __init__(self, ip: str = "", port: int = 41451) -> None:
        MultirotorClient.__init__(self)
        MultirotorClient.confirmConnection(self)
        self.enableApiControl(True)
        self.armDisarm(True)

    def set_time(
            self,
            start_datetime: str,
            clock_speed: float = 1.0
    ) -> None:
        """Sets AirSim time properties.

        Args:
            start_datetime (str): Time in "YYYY-MM-DD hh:mm:ss" format.
            clock_speed (float, optional): Time scale factor. Defaults to 1.0.
        """

        self.simSetTimeOfDay(
            True,
            start_datetime=start_datetime,
            is_start_datetime_dst=True,
            celestial_clock_speed=clock_speed,
            update_interval_secs=60,
            move_sun=True
        )
