"""Base simulation utility for Microsoft AirSim."""

from __future__ import absolute_import
from typing import Tuple
from math import sin, pi

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
            rain: float = 0.0,
            snow: float = 0.0,
            leafs: float = 0.0,
            dust: float = 0.0,
            fog: float = 0.0
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

    def land(self):
        """Lands the drone."""
        self.landAsync().join()

    def move(
            self,
            forward: float = 0.0,
            backward: float = 0.0,
            left: float = 0.0,
            right: float = 0.0,
            up: float = 0.0,
            down: float = 0.0,
            cw: float = 0.0,
            ccw: float = 0.0,
            duration: float = 0.01
    ):
        """Moves the drone in a certain direction for a certain amount of time.

        Args:
            forward (float, optional): Speed percent of moving forward.
            backward (float, optional): Speed percent of moving backward.
            left (float, optional): Speed percent of moving left.
            right (float, optional): Speed percent of moving right.
            up (float, optional): Speed percent of moving up.
            down (float, optional): Speed percent of moving down.
            cw (float, optional): Speed percent of rotating clockwise.
            ccw (float, optional): Speed percent of rotating counterclockwise.
            duration (float, optional): Duration in seconds. Defaults to 0.01.
        """

        z_orientation = self.get_pose().orientation.z_val
        x_velocity = 2 * (-abs(z_orientation) + 0.5) * (forward - backward)
        x_velocity -= sin(z_orientation * pi) * (right - left)
        y_velocity = 2 * (-abs(z_orientation) + 0.5) * (right - left)
        y_velocity += sin(z_orientation * pi) * (forward - backward)

        if cw or ccw:
            self.rotateByYawRateAsync(
                yaw_rate=(cw - ccw)*45,
                duration=duration).join()

        self.moveByVelocityAsync(
            vx=x_velocity,
            vy=y_velocity,
            vz=down - up,
            duration=duration).join()

    def simulation_reset(
            self,
            position: Tuple[int, int, int] = (0.0, 0.0, -20.0),
            orientation: Tuple[int, int, int, int] = (0.0, 0.0, 0.0, 0.0),
            start_datetime="2020-01-01 12:00:00",
            weather: Tuple[int, int, int, int, int] = (0.0, 0.0, 0.0, 0.0, 0.0)
    ) -> None:
        """Resets the simulation with certain settings.

        Args:
            position (Tuple[int, int, int], optional): Starting drone position.
            orientation (Tuple[int, int, int, int], optional): Drone orient.
            start_datetime (str, optional): Simulation time.
            weather (Tuple[int, int, int, int, int], optional): Weather tuple.
        """

        self.reset()
        self.takeoff()
        self.set_pose(position=position, orientation=orientation)
        self.set_time(start_datetime=start_datetime)
        self.set_weather(*weather)

    def get_collisions(self):
        """Returns collision data for the drone."""
        return self.simGetCollisionInfo()
