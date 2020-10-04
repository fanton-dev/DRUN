"Output methods for the ControlThread, reading from current_controls."

from __future__ import absolute_import
from .controls import Controls
import socket

from pyardrone import ARDrone
from pyardrone.utils import every

def debug_output(current_controls: Controls, fps: float = 0.1) -> None:
    """Prints current controls in the stdout at a given rate.
    Args:
        current_controls (Controls): Cross-thread controls data.
        fps (float): Rate data to be printed at. Defaults to 0.1.
    """
    for _ in every(1/fps):
        print(current_controls.dumps())

def network_output(current_controls: Controls, port: int) -> None:
    """Creates a socket on a given port and forwards control data through it.
    Args:
        current_controls (Controls): Cross-thread controls data.
        port (int): TCP port on the server for communication.
    """
    print('ControlThread > network_output')
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as ssock:
        ssock.bind(('localhost', port))
        print('Control Output Socket binded')
        ssock.listen()
        print('Control Output Socket listnening')
        conn, addr = ssock.accept()
        with conn:
            print('Control established')
            while True:
                data = current_controls.dumps()
                conn.send(data.encode())
        

def drone_output(current_controls: Controls) -> None:
    """Connects to the Parrot drone using its API and sends controls.

    Args:
        current_controls (Controls): Cross-thread controls data.
    """
    drone = ARDrone()
    drone.navdata_ready.wait()
    
    directions = { 
        action: 1 if control.state else 0 
        for (action, control) in current_controls.items() 
        if action not in ['takeoff', 'land'] 
    }

    drone.move(**directions)

    if current_controls['land'].state:
        drone.land()
    
    if current_controls['takeoff'].state:
        drone.takeoff()

def airsim_output(current_controls: Controls) -> None:
    """Connects using the AirSim client and sends controls from the buffer.

    Args:
        current_controls (Controls): Cross-thread controls data.
    """
    pass