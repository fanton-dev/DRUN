"Output methods for the ControlThread, reading from current_controls."

from __future__ import absolute_import
from .controls import Controls

from pyardrone import ARDrone

def debug_output(current_controls: Controls, fps: float = 0.1) -> None:
    """Prints current controls in the stdout at a given rate.
    Args:
        current_controls (Controls): Cross-thread controls data.
        fps (float): Rate data to be printed at. Defaults to 0.1.
    """


def network_output(current_controls: Controls, port: int) -> None:
    """Creates a socket on a given port and forwards control data through it.
    Args:
        current_controls (Controls): Cross-thread controls data.
        port (int): TCP port on the server for communication.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as ssock:
        sock.bind(('localhost', port))
        ssock.listen()
        conn, addr = ssock.accept()
        while True:
            # Waiting for ACK from the client
            try:
                conn.recv(3)
            except socket.error:
                break
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

def airsim_output(current_controls: Controls) -> None:
    """Connects using the AirSim client and sends controls from the buffer.

    Args:
        current_controls (Controls): Cross-thread controls data.
    """
