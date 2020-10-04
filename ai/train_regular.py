# DRUN Deep Q-network navigation (Regular observations)
# Library imports
from __future__ import absolute_import
from collections import namedtuple, deque
from math import exp

import gym
import numpy as np
import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.layers import Input, Conv2D, Flatten, Dense, Activation, Concatenate
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import Huber

from src.dqn import drun_dqn
from src.epsilon import EpsilonGreedy
from src.image_processing import stack_frames, preprocess_frame
from src.replay_memory import ReplayMemory, Experience

# Connect to environment
env = gym.make("airsim_gym:airsim-regular-v0")

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
PRETRAIN_LENGTH = BATCH_SIZE
MEMORY_SIZE = 1000000
UPDATE_AFTER_ACTIONS = 4

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
stacked_frames = deque([np.zeros(STATE_SIZE[:2], dtype=np.int) for i in range(STACK_SIZE)], maxlen=4)
replay_memory = ReplayMemory(MEMORY_SIZE)

for i in range(PRETRAIN_LENGTH):
    if i == 0:
        # If no state is available, we get one from the reset
        observation, position = env.reset()
        observation, stacked_frames = stack_frames(stacked_frames, observation, True)

    # Random action
    action = env.action_space.sample()
    observation, position, reward, done = env.step(action)
    observation = preprocess_frame(observation)

    # Hit something
    if done:
        # Empty frame on episode ending
        next_observation = np.zeros(observation.shape)
        next_position = [0.0, 0.0]

        # Add experience to memory
        replay_memory.add(Experience(stacked_frames, position, action, next_observation, next_position, reward, done))

        # Start a new episode
        observation, position = env.reset()

        # Stack the frames
        observation, stacked_frames = stack_frames(stacked_frames, observation, True)

    else:
        # Get the next state
        next_observation, next_position = env.get_state()
        next_observation, stacked_frames = stack_frames(
            stacked_frames, next_observation, False)

        # Add experience to memory
        replay_memory.add(Experience(stacked_frames, position, action, next_observation, next_position, reward, done))

        # Our state is now the next_observation
        observation = next_observation

model = drun_dqn()
print(model.summary())
optimizer = Adam(learning_rate=LEARNING_RATE, clipnorm=1.0)
loss_function = Huber()
epsilon = EpsilonGreedy(EXPLORE_START, EXPLORE_START, DECAY_RATE)


# Start training
if TRAINING:
    decay_step = 0

    for episode in range(TOTAL_EPISODES):
        episode_step = 0
        episode_rewards = []

        observation, position = env.reset()
        observation, stacked_frames = stack_frames(stacked_frames, observation, True)

        while episode_step < MAX_STEPS:
            # Increase episode_decay/decay_steps
            episode_step += 1
            decay_step += 1

            # Predict the action to take and take it
            action, explore_probability = epsilon.predict_action(decay_step, observation, position, env, model)

            # Do the action
            observation, position, reward, done = env.step(action)
            observation = preprocess_frame(observation)

            # Add the reward to total reward
            episode_rewards.append(reward)

            # If the game is finished
            if done:
                # Empty frame on episode ending
                next_observation = np.zeros(observation.shape)
                next_position = [0.0, 0.0]

                # Add experience to memory
                replay_memory.add(Experience(stacked_frames, position, action, next_observation, next_position, reward, done))

                # Start a new episode
                observation, position = env.reset()

                # Stack the frames
                observation, stacked_frames = stack_frames(stacked_frames, observation, True)

                # Set episode_step = max_steps to end the episode
                episode_step = MAX_STEPS

                # Get the total reward of the episode
                total_reward = np.sum(episode_rewards)

                print("Episode: {}".format(episode),
                      "Total reward: {}".format(total_reward),
                      "Explore probability: {:.4f}".format(explore_probability))

                replay_memory.add(Experience(stacked_frames, position, action, next_observation, next_position, reward, done))

            else:
                # Get the next state
                next_observation, next_position = env.get_state()
                next_observation, stacked_frames = stack_frames(stacked_frames, next_observation, False)

                # Add experience to memory
                replay_memory.add(Experience(stacked_frames, position, action, next_observation, next_position, reward, done))

                # st+1 is now our current state
                observation = next_observation

            # LEARNING PART
            # Obtain random mini-batch from memory
            if episode_step % UPDATE_AFTER_ACTIONS == 0 and replay_memory.is_sample_available(BATCH_SIZE):
                batch = replay_memory.sample(BATCH_SIZE)
                observation_mb = np.array([item.observation for item in batch])
                observation_mb = np.rollaxis(observation_mb, 1, observation_mb.ndim)
                position_mb = np.array([item.position for item in batch])
                actions_mb = np.array([item.action for item in batch])
                next_observations_mb = np.array([item.next_observation for item in batch])
                next_positions_mb = np.array([item.next_position for item in batch])
                rewards_mb = np.array([item.reward for item in batch])
                dones_mb = np.array([item.done for item in batch])

                target_Qs_batch = []

                # Build the updated Q-values for the sampled future states
                # Use the target model for stability
    
                future_rewards = model.predict([observation_mb, position_mb])
                # Q value = reward + discount factor * expected future reward
                updated_q_values = rewards_mb + GAMMA * tf.reduce_max(
                    future_rewards, axis=1
                )

                # If final frame set the last value to -1
                updated_q_values = updated_q_values * (1 - dones_mb) - dones_mb

                # Create a mask so we only calculate loss on the updated Q-values
                masks = tf.one_hot(actions_mb, ACTION_SIZE)

                with tf.GradientTape() as tape:
                    # Train the model on the states and updated Q-values
                    q_values = model([observation_mb, position_mb])

                    # Apply the masks to the Q-values to get the Q-value for action taken
                    q_action = tf.reduce_sum(tf.multiply(q_values, masks), axis=1)
                    # Calculate loss between new Q-value and old Q-value
                    loss = loss_function(updated_q_values, q_action)
                    print("Training loss: {:.4f}".format(loss))

                # Backpropagation
                grads = tape.gradient(loss, model.trainable_variables)
                optimizer.apply_gradients(zip(grads, model.trainable_variables))

        # Save model every 10 episodes
        if episode % 10 == 0:
            model.save("model/")
