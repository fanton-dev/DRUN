# DRUN Deep Q-network navigation (Regular observations)
# Library imports
from __future__ import absolute_import
from collections import namedtuple
from math import exp

import gym
import numpy as np
import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.layers import Input, Conv2D, Flatten, Dense, Activation
from tensorflow.keras.optimizers import Adam
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

# Epsilon greedy
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


def drun_dqn() -> Model:
    image_input = Input(STATE_SIZE)
    coords_input = Input(2)
    img_net = Conv2D(32, (4, 4), strides=(4, 4), activation="relu", input_shape=STATE_SIZE)(image_input)
    img_net = Conv2D(64, (3, 3), strides=(2, 2), activation="relu")(img_net)
    img_net = Conv2D(64, (3, 3), strides=(2, 2), activation="relu")(img_net)
    img_net = Flatten()(img_net)

    dense_net = Dense(512)(img_net, coords_input)
    dense_net = Activation("relu")(dense_net)
    dense_net = Dense(512)(dense_net)
    dense_net = Activation("relu")(dense_net)
    dense_net = Dense(512)(dense_net)
    dense_net = Activation("relu")(dense_net)
    dense_net = Dense(ACTION_SIZE)(dense_net)
    output = Activation("linear")
    return Model(inputs=(image_input, coords_input), output=output)


drone_dqn = drun_dqn()
optimizer = Adam(learning_rate=LEARNING_RATE, clipnorm=1.0)

Experience = namedtuple(
    "Experience",
    ("state", "action", "next_state", "reward")
)


class ReplayMemory():
    def __init__(self, capacity):
        self.buffer = deque(maxlen=capacity)
        self.push_count = 0

    def add(self, experience):
        self.buffer.append(experience)
        self.push_count += 1

    def sample(self, batch_size):
        buffer_size = len(self.buffer)
        index = np.random.choice(
            np.arange(buffer_size),
            size=batch_size,
            replace=False
        )

        return [self.buffer[i] for i in index]

    def is_sample_available(self, batch_size):
        return len(self.buffer) >= batch_size


class EpsilonGreedy():
    def __init__(self, start, stop, decay):
        self.start = start
        self.stop = stop
        self.decay = decay

    def get_exploration_rate(self, current_step):
        rate = self.stop + (self.start - self.stop)
        rate *= exp(-1 * current_step * self.decay)
        return rate
