"""Server for DRUN.

Script for creating a multithreaded server, controlling multiple drone.
"""

from __future__ import absolute_import

from src.api import APIServerThread
import src.discord as dis


def server(api_port=5000):
    """Drone server procedure.

    Args:
        api_port (int, optional): TCP port of the server API. Defaults to 5000.
    """
    drone_ts = []
    api_t = APIServerThread(drone_ts, api_port)
    api_t.start()
    dis.init()    
    api_t.join()
    for thread in drone_ts:
        thread.join()


if __name__ == "__main__":
    server()
