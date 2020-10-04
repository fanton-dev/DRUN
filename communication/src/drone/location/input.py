"Input methods for the LocationThread, modifying current_location."

from __future__ import absolute_import
import socket

from typing import List

def gps_input(current_location: List[float]) -> None:
    """Reads data from the RPi GPS antenna and stores it in the shared buffer.

    Args:
        current_location (List[float]): Cross-thread location data.
    """
    from .GPS import GPS
    location = GPS.current_location()
    current_location[0] = location[0]
    current_location[1] = location[1]


def network_input(current_location: List[float], port: int) -> None:
    """Creates a socket for listening for received drone location data.

    Args:
        current_location (List[float]): Cross-thread location data.
        port (int): TCP port a socket to be created on for listening.
    """
    print('LocationThread > network_input')
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as rsock:
        rsock.bind(('0.0.0.0', port))
        print('Socket binded')
        rsock.listen()
        print('Socket listnening')
        conn, addr = rsock.accept()
        with conn:
            print('Location network_input connection established')
            while True:
                data = conn.recv(4096)
                location = eval(data.decode())
                current_location[0] = location[0]
                current_location[1] = location[1]
                conn.send(b'ACK')