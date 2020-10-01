"""Module for providing common server values"""

from __future__ import absolute_import
from typing import List
from threading import Lock

from ..drone import DroneServerThread


class CommonVariables():
    """Provides common server values"""

    def __init__(self, drone_ts, ports_assigned):
        self.drone_ts = drone_ts
        self.ports_assigned = ports_assigned
        self.lock = Lock()

    def set_drone_ts(self, new_value: List[DroneServerThread]) -> None:
        """Sets common variable "drone_ts" to a given value.

        Args:
            new_value (List[DroneServerThread]): New value "drone_ts".
        """
        self.drone_ts = new_value

    def set_ports_assigned(self, new_value: List[int]) -> None:
        """Sets common variable "ports_assigned" to a given value.

        Args:
            new_value (List[int]): New value "ports_assigned".
        """
        self.ports_assigned = new_value

    def get_drone_ts(self) -> Lock and List[DroneServerThread]:
        """Gets common variable "drone_ts".

        Returns:
            Lock and List[DroneServerThread]: A mutex lock and drone_ts.
        """
        return self.lock, self.drone_ts

    def get_ports_assigned(self) -> List[int]:
        """Gets common variable "ports_assigned".

        Returns:
            Lock and List[DroneServerThread]: A mutex lock and ports_assigned.
        """
        return self.lock, self.ports_assigned


common_variables = CommonVariables([], [])
