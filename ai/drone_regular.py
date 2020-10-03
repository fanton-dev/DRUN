# DRUN Deep Q-network navigation (Regular observations)
# Library imports
from __future__ import absolute_import

import gym
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Conv2D, Flatten, Dense, Activation
from collections import deque


# Connect to environment
env = gym.make("airsim_gym:airsim-regular-v0")

# Hyper-parameters
# Model hyperparameters
STATE_SIZE = [256, 256, 4]
ACTION_SIZE = env.action_space.n
print(ACTION_SIZE)
LEARNING_RATE = 0.0002

# Training parameters
TOTAL_EPISODES = 5000
MAX_STEPS = 1000
BATCH_SIZE = 64
PRETRAIN_LENGTH = BATCH_SIZE
MEMORY_SIZE = 1000000

# Epsilon greedy strategy
EXPLORE_START = 1.0
EXPLORE_STOP = 0.01
DECAY_RATE = 0.0001

# Q-learning hyperparameters
GAMMA = 0.95

# Script execution
TRAINING = True
ENV_PREVIEW = False

# Environment preview
if ENV_PREVIEW:
    env.reset()
    for _ in range(10):
        env.step(env.action_space.sample())


# Image processing utilities
def preprocess_frame(frame):
    # Converts frame from RGB to grayscale
    grayscale_frame = np.mean(frame, -1)

    # Normalize Pixel Values
    normalized_frame = grayscale_frame/255.0

    return normalized_frame


def stack_frames(
        stacked_frames,
        state,
        is_new_episode: bool,
        stack_size: int = 4
):
    # Preprocess frame
    frame = preprocess_frame(state)
    if is_new_episode:
        # Clear our stacked_frames
        stacked_frames = [np.zeros(STATE_SIZE[:2], dtype=np.int) for i in range(stack_size)]
        stacked_frames = deque(stack_frames, maxlen=stack_size)

        # In a new episode the deque is filled with the same frame
        for _ in range(stack_size):
            stacked_frames.append(frame)

    else:
        # Append frame to deque, pops the last
        stacked_frames.append(frame)

    # Build the stacked state (first dimension specifies different frames)
    stacked_state = np.stack(stacked_frames, axis=2)
    return stacked_state, stacked_frames


class DroneDQN(tf.keras.Model):
    def __init__(self):
        self.image_input = Input(STATE_SIZE)
        self.coords_input = Input(2)

        super(DroneDQN, self).__init__()

    def call(self):
        img_net = Conv2D(32, (4, 4), strides=(4, 4), activation="relu", input_shape=STATE_SIZE)(self.image_input)
        img_net = Conv2D(64, (3, 3), strides=(2, 2), activation="relu")(img_net)
        img_net = Conv2D(64, (3, 3), strides=(2, 2), activation="relu")(img_net)
        img_net = Flatten()(img_net)

        dense_net = Dense(512)(img_net, self.coords_input)
        dense_net = Activation("relu")(dense_net)
        dense_net = Dense(512)(dense_net)
        dense_net = Activation("relu")(dense_net)
        dense_net = Dense(512)(dense_net)
        dense_net = Activation("relu")(dense_net)
        dense_net = Dense(ACTION_SIZE)(dense_net)
        model = Activation("linear")
        return model

optimizer = keras.optimizers.Adam(learning_rate=LEARNING_RATE, clipnorm=1.0)
drone_dqn = DroneDQN()
