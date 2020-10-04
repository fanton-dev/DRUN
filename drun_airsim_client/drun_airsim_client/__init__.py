"""Base simulation utility for Microsoft AirSim."""

from __future__ import absolute_import
from __future__ import division
from typing import Tuple, List
from math import sin, cos, pi, acos, atan

from airsim.types import Pose, CollisionInfo
from airsim import (
    MultirotorClient,
    WeatherParameter,
    ImageRequest,
    ImageType
)
import numpy as np


class DRUNAirSimClient(MultirotorClient):
    """Custom simulation client for Microsoft AirSim to wrap base functions
    required for reinforcement learning.

    Args:
        ip (str, optional): IP of the AirSim instance. Defaults to "".
        port (float, optional): Port of the AirSim instance. Defaults to 41451.
    """

    def __init__(self, ip: str = "", port: float = 41451) -> None:
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

        # Math by @simo1209 <3 nh
        z_orientation = self.get_pose().orientation.z_val
        x_vel = cos(2 * (acos(z_orientation) - (pi/4))) * (left - right)
        x_vel += sin(2 * (acos(z_orientation) - (pi/4))) * (forward-backward)
        y_vel = cos(2 * (acos(z_orientation) - (pi/4))) * (forward-backward)
        y_vel += sin(2 * (acos(z_orientation) - (pi/4))) * (right - left)

        if cw or ccw:
            self.rotateByYawRateAsync(
                yaw_rate=(cw - ccw)*45,
                duration=duration).join()

        self.moveByVelocityAsync(
            vx=x_vel,
            vy=y_vel,
            vz=down - up,
            duration=duration).join()

    def simulation_reset(
            self,
            start_datetime: str = None,
            weather: Tuple[float, float, float, float, float] = None
    ) -> None:
        """Resets the simulation with certain settings.

        Args:
            start_datetime (str, optional): Simulation time.
            weather (Tuple[int, int, int, int, int], optional): Weather tuple.
        """
        self.reset()
        self.enableApiControl(True)
        self.armDisarm(True)
        if start_datetime:
            self.set_time(start_datetime)
        if weather:
            self.set_weather(*weather)

    def get_collisions(self) -> CollisionInfo:
        """Returns collision data for the drone.

        Returns:
            airsim.types.CollisionInfo: Colission data.
        """
        return self.simGetCollisionInfo()

    def get_observation_regular(self) -> np.ndarray:
        """Returns regular FPV camera observation.

        Returns:
            np.ndarray: Image array.
        """
        image_raw = self.simGetImages(
            [ImageRequest(0, ImageType.Scene, False, False)]
        )[0]
        image_array = np.fromstring(image_raw.image_data_uint8, dtype=np.uint8)
        return image_array.reshape(image_raw.height, image_raw.width, 3)

    def get_observation_depth(self) -> np.ndarray:
        """Returns depth FPV camera observation.

        Returns:
            np.ndarray: Image array.
        """
        image_raw = self.simGetImages(
            [ImageRequest(0, ImageType.DepthVis, False, False)]
        )[0]
        image_array = np.fromstring(image_raw.image_data_uint8, dtype=np.uint8)
        return image_array.reshape(image_raw.height, image_raw.width)

    def get_observation_segmentation(self) -> np.ndarray:
        """Returns segmentation FPV camera observation.

        Returns:
            np.ndarray: Image array.
        """
        image_raw = self.simGetImages(
            [ImageRequest(0, ImageType.Segmentation, False, False)]
        )[0]
        image_array = np.fromstring(image_raw.image_data_uint8, dtype=np.uint8)
        return image_array.reshape(image_raw.height, image_raw.width)

    @staticmethod
    def calculate_normalized_point(
            X: List[float, float],
            A: List[float, float],
            B: List[float, float],
            scale: float
    ) -> List[float, float]:

        normal_x = abs((X[0] - B[0] * scale) / ((A[0] - B[0]) * scale))
        normal_y = abs((X[1] - B[1] * scale) / ((A[1] - B[1]) * scale))
        return (normal_x, normal_y)

    @staticmethod
    def calculate_goal_orientation(
        A: List[float, float],
        B: List[float, float]
    ) -> float:

        point_x = abs(A[0] - B[0])
        point_y = abs(A[1] - B[1])
        angle = atan(point_x/point_y)
        return cos(angle/2 + pi/4)
