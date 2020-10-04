"Input methods for the ControlThread, modifying current_controls."

from __future__ import absolute_import
from typing import List
import socket
from time import sleep
from collections import deque

import numpy as np
import tensorflow as tf
from drun_airsim_client import DRUNAirSimClient

from .controls import Controls
from .utils import stack_frames
from ...database.interfaces.order import Order


STATE_SIZE = [256, 256, 4]
STACK_SIZE = 64


def debug_input(current_controls: Controls) -> None:
    """Reads keyboard input and stores controls it in the shared buffer.

    Args:
        current_controls (Controls): Cross-thread controls data.
    """
    from pynput import keyboard

    def on_press(key):
        try:
            control = current_controls.find_by_key(key)
            control.state = True
        except TypeError:
            pass

    def on_release(key):
        try:
            control = current_controls.find_by_key(key)
            control.state = False
        except TypeError:
            pass

    with keyboard.Listener(
            on_press=on_press,
            on_release=on_release) as listener:
        listener.join()


def network_input(
        current_controls: Controls,
        ip_address: str,
        port: int
) -> None:
    """Connects to a given socket and receives control data from it.

    Args:
        current_controls (Controls): Cross-thread controls data.
        ip_address (str): IP address of the server.
        port (int): TCP port on the server for communication.
    """
    print('ControlThread > network_input')
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as rsock:
        rsock.connect((ip_address, port))
        data = rsock.recv(4096)
        control_string = data.decode()
        current_controls = Controls.loads(control_string)


def ai_input(
        current_controls: Controls,
        current_image: np.ndarray,
        current_location: List[float],
        orders: List[Order],
        home: List[float]
) -> None:
    """Forwards all the drone data to a trained AI model which outputs controls.

    Args:
        current_controls (Controls): Cross-thread controls data.
        current_image (np.ndarray): Cross-thread image data.
        current_location (List[float]): Cross-thread location data.
        orders (List[Order]): List of orders the drone should deliver.
    """

    model = tf.keras.models.load_model("model")
    stacked_frames = deque([np.zeros(STATE_SIZE[:2], dtype=np.int)
                            for i in range(STACK_SIZE)], maxlen=4)
    while True:
        if orders:
            for order in orders:
                done = False

                observation = current_image.copy()
                observation, stacked_frames = stack_frames(
                    stacked_frames, observation, True)
                position = DRUNAirSimClient.calculate_normalized_point(
                    current_location,
                    home,
                    order.sender_location,
                    scale=1.3
                )
                position = np.array(position)

                while not done:
                    observation = current_image.copy()
                    observation, stacked_frames = stack_frames(
                        stacked_frames, observation, True)
                    position = DRUNAirSimClient.calculate_normalized_point(
                        current_location,
                        home,
                        order.sender_location,
                        scale=1.3
                    )
                    position = np.array(position)

                    Qs = model.predict([observation, position])
                    # Take the biggest Q value (= the best action)
                    action = np.argmax(Qs)

                    controls = Controls()
                    if action == 0:
                        controls["forward"].state = True
                    if action == 1:
                        controls["backward"].state = True
                    if action == 2:
                        controls["left"].state = True
                    if action == 3:
                        controls["right"].state = True
                    current_controls.controls = controls

                    if not done:
                        sleep(0.05)
                        next_observation = current_image.copy()
                        next_observation, stacked_frames = stack_frames(
                            stacked_frames, next_observation, False)
                        next_position = DRUNAirSimClient.calculate_normalized_point(
                            current_location,
                            home,
                            order.sender_location,
                            scale=1.3
                        )
                        next_position = np.array(position)
                        observation, position = next_observation, next_position

                done = False

                observation = current_image.copy()
                observation, stacked_frames = stack_frames(
                    stacked_frames, observation, True)
                position = DRUNAirSimClient.calculate_normalized_point(
                    current_location,
                    home,
                    order.sender_location,
                    scale=1.3
                )
                position = np.array(position)

                while not done:
                    observation = current_image.copy()
                    observation, stacked_frames = stack_frames(
                        stacked_frames, observation, True)
                    position = DRUNAirSimClient.calculate_normalized_point(
                        current_location,
                        order.sender_location,
                        order.reciever_location,
                        scale=1.3
                    )
                    position = np.array(position)

                    Qs = model.predict([observation, position])
                    # Take the biggest Q value (= the best action)
                    action = np.argmax(Qs)

                    controls = Controls()
                    if action == 0:
                        controls["forward"].state = True
                    if action == 1:
                        controls["backward"].state = True
                    if action == 2:
                        controls["left"].state = True
                    if action == 3:
                        controls["right"].state = True
                    current_controls.controls = controls

                    if not done:
                        sleep(0.05)
                        next_observation = current_image.copy()
                        next_observation, stacked_frames = stack_frames(
                            stacked_frames, next_observation, False)
                        next_position = DRUNAirSimClient.calculate_normalized_point(
                            current_location,
                            order.sender_location,
                            order.reciever_location,
                            scale=1.3
                        )
                        next_position = np.array(position)
                        observation, position = next_observation, next_position

                done = False

                observation = current_image.copy()
                observation, stacked_frames = stack_frames(
                    stacked_frames, observation, True)
                position = DRUNAirSimClient.calculate_normalized_point(
                    current_location,
                    order.reciever_location,
                    home,
                    scale=1.3
                )
                position = np.array(position)

                while not done:
                    observation = current_image.copy()
                    observation, stacked_frames = stack_frames(
                        stacked_frames, observation, True)
                    position = DRUNAirSimClient.calculate_normalized_point(
                        current_location,
                        order.reciever_location,
                        order.home,
                        scale=1.3
                    )
                    position = np.array(position)

                    Qs = model.predict([observation, position])
                    # Take the biggest Q value (= the best action)
                    action = np.argmax(Qs)

                    controls = Controls()
                    if action == 0:
                        controls["forward"].state = True
                    if action == 1:
                        controls["backward"].state = True
                    if action == 2:
                        controls["left"].state = True
                    if action == 3:
                        controls["right"].state = True
                    current_controls.controls = controls

                    if not done:
                        sleep(0.05)
                        next_observation = current_image.copy()
                        next_observation, stacked_frames = stack_frames(
                            stacked_frames, next_observation, False)
                        next_position = DRUNAirSimClient.calculate_normalized_point(
                            current_location,
                            order.reciever_location,
                            order.home,
                            scale=1.3
                        )
                        next_position = np.array(position)
                        observation, position = next_observation, next_position
        sleep(2)
