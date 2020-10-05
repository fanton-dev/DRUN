"Output methods for the ImageThread, reading from current_image."

from __future__ import absolute_import
import socket

import numpy as np
import cv2

from pyardrone.utils import every

def debug_output(current_image: np.ndarray) -> None:
    """Creates a debug window for previewing the image data.

    Args:
        current_image (np.ndarray): Cross-thread image data.
    """
    cv2.imshow('Current Image', current_image)


def network_output(
        current_image: np.ndarray,
        ip_address: str,
        port: int,
        fps: float = 10.0
) -> None:
    """Connects to a given socket and forwards images to it at a certain FPS.
    Args:
        current_image (np.ndarray): Cross-thread image data.
        ip_address (str): IP address of the server.
        port (int): TCP port on the server for communication.
        fps (float, optional): Rate data to be send at. Defaults to 10.0.
    """
    print('ImageThread > network_output')
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as ssock:
        connected = False
        while not connected:
            print('Trying to connect to {}:{}'.format(ip_address, port))
            try:
                ssock.connect((ip_address, port))
                connected = True
            except:
                pass

        print('Image network_output connected')
        for _ in every(1/fps):
            # current_image can be read on the server
            # by calling numpy.loads on the recieved data
            data = current_image.dumps()
            sent_bytes = 0
            while True:
                if sent_bytes == len(data):
                    ssock.sendall(b'') # send zero bytes
                    break
                ssock.send( data[sent_bytes:sent_bytes+4096] )
                recieved_bytes = ssock.recv(4).decode() # wait response
                sent_bytes += int(recieved_bytes)
            ssock.recv(3) # wait ACK