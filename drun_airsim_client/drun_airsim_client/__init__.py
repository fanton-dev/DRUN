"""Base simulation utility for Microsoft AirSim."""

from __future__ import absolute_import
from typing import Tuple

from airsim.types import Pose
from airsim import (
    MultirotorClient,
    WeatherParameter
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

    def set_weather(
            self,
            rain=0.0,
            snow=0.0,
            leafs=0.0,
            dust=0.0,
            fog=0.0
    ) -> None:
        """Sets AirSim weather properties.

        Args:
            rain (float, optional): Rain percentage. Defaults to 0.0.
            snow (float, optional): Snow percentage. Defaults to 0.0.
            leafs (float, optional): Leafs percentage. Defaults to 0.0.
            dust (float, optional): Dust percentage. Defaults to 0.0.
            fog (float, optional): Fog percentage. Defaults to 0.0.
        """
        self.simEnableWeather(True)
        self.simSetWeatherParameter(WeatherParameter.Rain, rain)
        self.simSetWeatherParameter(WeatherParameter.Roadwetness, rain)
        self.simSetWeatherParameter(WeatherParameter.Snow, snow)
        self.simSetWeatherParameter(WeatherParameter.RoadSnow, snow)
        self.simSetWeatherParameter(WeatherParameter.MapleLeaf, leafs)
        self.simSetWeatherParameter(WeatherParameter.RoadLeaf, leafs)
        self.simSetWeatherParameter(WeatherParameter.Dust, dust)
        self.simSetWeatherParameter(WeatherParameter.Fog, fog)

    def get_pose(self) -> Pose:
        """Returns the drone's current position and orientation.

        Returns:
            airsim.types.Pose: AirSim Pose object for current state.
        """
        return self.simGetVehiclePose()

    def set_pose(
            self,
            position: Tuple[float, float, float] = None,
            orientation: Tuple[float, float, float, float] = None
    ) -> None:
        """Sets the drone's current position and orientation.

        Args:
            position (Tuple, optional): (x, y, z) coordinates.
            orientation (Tuple, optional): (w, x, y, z) rotation quaternion.

        Notes:
            For quaterion explanation refer to this article:
            http://wiki.alioth.net/index.php/Quaternion
        """
        pose = self.get_pose()
        if position:
            (pose.position.x_val,
             pose.position.y_val,
             pose.position.z_val) = position

        if orientation:
            (pose.orientation.w_val,
             pose.orientation.x_val,
             pose.orientation.y_val,
             pose.orientation.z_val) = orientation

        self.simSetVehiclePose(pose, True)

    def takeoff(self):
        """Starts an drone flight; takes off the drone."""
        self.takeoffAsync().join()
