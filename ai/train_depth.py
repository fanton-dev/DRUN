# DRUN Deep Q-network navigation (Regular observations)
# Library imports
from __future__ import absolute_import
from collections import namedtuple, deque
from time import sleep
from math import exp

import gym
import numpy as np
import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.layers import Input, Conv2D, Flatten, Dense, Activation, Concatenate
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import Huber
from tensorflow.python.keras.losses import MeanSquaredError
from src.agent import Agent

from src.dqn import drun_dqn
from src.epsilon import EpsilonGreedy
from src.image_processing import stack_frames
from src.replay_memory import ReplayMemory, Experience

# GPU fix
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        # Currently, memory growth needs to be the same across GPUs
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        logical_gpus = tf.config.experimental.list_logical_devices('GPU')
        print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
    except RuntimeError as e:
        # Memory growth must be set before GPUs have been initialized
        print(e)

# Connect to environment
env = gym.make("airsim_gym:airsim-depth-v0")

# Hyper-parameters
# Model hyperparameters
STATE_SIZE = [256, 256, 4]
ACTION_SIZE = env.action_space.n
STACK_SIZE = 64
LEARNING_RATE = 0.0002

# Training parameters
TOTAL_EPISODES = 5000
MAX_STEPS = 1000
BATCH_SIZE = 64
PRETRAIN_LENGTH = BATCH_SIZE * 4
MEMORY_SIZE = 1000000
UPDATE_AFTER_ACTIONS = 4
TARGET_UPDATE = 10

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
    for _ in range(1000):
        env.step(env.action_space.sample())


# Initialise replay memory
replay_memory = ReplayMemory(MEMORY_SIZE)
observation_stack = None
next_observation_stack = None
next_action = None
done = False
observation = None

for i in range(PRETRAIN_LENGTH):
    if i == 0:
        # If no state is available, we get one from the reset
        start_observation, position = env.reset()
        _, observation_stack = stack_frames(
            observation_stack,
            start_observation,
            True,
        )
        _, next_observation_stack = stack_frames(
            next_observation_stack,
            start_observation,
            True,
        )

    # Random action
    if (observation is None):
        action = env.action_space.sample()
        observation, position, reward, done = env.step(action)

        _, next_observation_stack = stack_frames(
            next_observation_stack,
            observation,
            False,
        )

    _, observation_stack = stack_frames(
        observation_stack,
        observation,
        False,
    )

    # Hit something
    if done:
        print("done")
        # Empty frame on episode ending
        next_observation = np.zeros(STATE_SIZE[:2], dtype=np.float32)
        _, next_observation_stack = stack_frames(
            next_observation_stack,
            next_observation,
            False,
        )
        next_position = position

        # Add experience to memory
        replay_memory.add(
            Experience(
                observation_stack,
                position,
                action,
                next_observation_stack,
                next_position,
                reward,
            ),
        )

        # Start a new episode
        start_observation, position = env.reset()
        _, observation_stack = stack_frames(
            observation_stack,
            start_observation,
            True,
        )
        _, next_observation_stack = stack_frames(
            next_observation_stack,
            start_observation,
            True,
        )

        observation = None
        position = None
        done = False
    else:
        # Get the next state
        next_observation, next_position, next_action, next_done = env.step(action)
        _, next_observation_stack = stack_frames(
            next_observation_stack,
            observation,
            False,
        )

        # Add experience to memory
        replay_memory.add(
            Experience(
                observation_stack,
                position,
                action,
                next_observation_stack,
                next_position,
                reward,
            ),
        )

        # Our state is now the next_observation
        observation = next_observation
        position = next_position
        done = next_done


model = drun_dqn()
target_model = drun_dqn()
target_model.set_weights(model.get_weights())
optimizer = Adam(learning_rate=LEARNING_RATE, clipnorm=1.0)
loss_function = MeanSquaredError()
epsilon = EpsilonGreedy(EXPLORE_START, EXPLORE_START, DECAY_RATE)
agent = Agent(epsilon, ACTION_SIZE)
observation_stack = None
next_observation_stack = None
observation = None

# Start training
if TRAINING:
    for episode in range(TOTAL_EPISODES):
        observation, position = env.reset()
        _, observation_stack = stack_frames(
            observation_stack,
            observation,
            True,
        )
        _, next_observation_stack = stack_frames(
            next_observation_stack,
            observation,
            True,
        )

        for step in range(MAX_STEPS):
            _, observation_stack = stack_frames(
                observation_stack,
                observation,
                False,
            )

            action = agent.select_action(observation_stack, position, model)
            next_observation, next_position, reward, done = env.step(action)

            _, next_observation_stack = stack_frames(
                next_observation_stack,
                next_observation,
                False,
            )

            replay_memory.add(
                Experience(
                    observation_stack,
                    position,
                    action,
                    next_observation_stack,
                    next_position,
                    reward,
                ),
            )

            observation = next_observation
            position = next_position

            # Sampling a training batch
            batch = replay_memory.sample(BATCH_SIZE)
            observations_mb = np.array([item.observation for item in batch])
            observations_mb = np.rollaxis(observations_mb, 1, observations_mb.ndim)
            positions_mb = np.array([item.position for item in batch])
            actions_mb = np.array([item.action for item in batch])
            next_observations_mb = np.array([item.next_observation for item in batch])
            next_observations_mb = np.rollaxis(next_observations_mb, 1, next_observations_mb.ndim)
            next_positions_mb = np.array([item.next_position for item in batch])
            rewards_mb = np.array([item.reward for item in batch])
            current_q_values = model.predict([observations_mb, positions_mb])
            next_q_values = target_model.predict([next_observations_mb, next_positions_mb])
            target_q_values = (next_q_values * GAMMA) + rewards_mb

            loss = loss_function(current_q_values, target_q_values)

            with tf.GradientTape() as tape:
                # Backpropagation
                grads = tape.gradient(loss, model.trainable_variables)
                optimizer.apply_gradients(zip(grads, model.trainable_variables))

            if done:
                break

        if episode % TARGET_UPDATE == 0:
            target_model.set_weights(model.get_weights())
            model.save("model/")
