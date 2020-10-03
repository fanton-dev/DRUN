"Input methods for the LocationThread, modifying current_location."

from __future__ import absolute_import
from typing import List
from .GPS import GPS

def gps_input(current_location: List[float]) -> None:
    """Reads data from the RPi GPS antenna and stores it in the shared buffer.

    Args:
        current_location (List[float]): Cross-thread location data.
    """
    current_location = GPS.current_location()

def network_input(current_location: List[float], port: int) -> None:
    """Creates a socket for listening for received drone location data.

    Args:
        current_location (List[float]): Cross-thread location data.
        port (int): TCP port a socket to be created on for listening.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as rsock:
        rsock.bind(('localhost', port))
        rsock.listen()
        conn, addr = rsock.accept()
        while True:
            data = conn.recv(4096)
            current_location = eval(data.decode())