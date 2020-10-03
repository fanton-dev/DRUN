# DRUN Deep Q-network navigation (Regular observations)
# Library imports
from __future__ import absolute_import

import tensorflow as tf
import numpy as np
import gym


# Connect to environment
env = gym.make("airsim_gym:airsim-regular-v0")

# Hyper-parameters
# Model hyperparameters
STATE_SIZE = [256, 256, 4]
ACTION_SIZE = env.action_size
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
ENV_PREVIEW = True

# Environment preview
if ENV_PREVIEW:
    env.reset()
    for _ in range(10):
        env.step(env.action_space.sample())


## Image processing utilities
def preprocess_frame(frame):
    # Converts frame from RGB to grayscale
    grayscale_frame = np.mean(frame, -1)

    # Normalize Pixel Values
    normalized_frame = grayscale_frame/255.0

    return normalized_frame
