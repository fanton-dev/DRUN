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
STACK_SIZE = 4
LEARNING_RATE = 0.0002

# Training parameters
TOTAL_EPISODES = 5000
MAX_STEPS = 1000
BATCH_SIZE = 2
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


model = drun_dqn()
optimizer = Adam(learning_rate=LEARNING_RATE, clipnorm=1.0)


# Initialise replay memory
stacked_frames = deque([np.zeros(STATE_SIZE[:2], dtype=np.int) for i in range(STACK_SIZE)], maxlen=4)
replay_memory = ReplayMemory(MEMORY_SIZE)

for i in range(PRETRAIN_LENGTH):
    if i == 0:
        # If no state is available, we get one from the reset
        state = env.reset()
        state, stacked_frames = stack_frames(stacked_frames, state, True)

    # Random action
    action = env.action_space.sample()
    state, reward, done, _ = env.step(action)
    state = preprocess_frame(state)

    # Hit something
    if done:
        # We finished the episode
        next_state = np.zeros(state.shape)

        # Add experience to memory
        replay_memory.add(Experience(state, action, next_state, reward))

        # Start a new episode
        state = env.reset()

        # Stack the frames
        state, stacked_frames = stack_frames(stacked_frames, state, True)

    else:
        # Get the next state
        next_state = env.get_state()
        next_state, stacked_frames = stack_frames(
            stacked_frames, next_state, False)

        # Add experience to memory
        print(state)
        replay_memory.add(Experience(state, action, next_state, reward))

        # Our state is now the next_state
        state = next_state

# print(replay_memory.buffer)
epsilon = EpsilonGreedy(EXPLORE_START, EXPLORE_START, DECAY_RATE)
# Start training
if TRAINING:
    decay_step = 0

    for episode in range(TOTAL_EPISODES):
        episode_step = 0
        episode_rewards = []

        state = env.reset()
        state, stacked_frames = stack_frames(stacked_frames, state, True)

        while episode_step < MAX_STEPS:
            episode_step += 1
            # Increase decay_step
            decay_step += 1

            # Predict the action to take and take it
            action, explore_probability = epsilon.predict_action(decay_step, state, env, model)

            # Do the action
            state, reward, done, _ = env.step(action)

            # Add the reward to total reward
            episode_rewards.append(reward)

            # If the game is finished
            if done:
                # We finished the episode
                next_state = np.zeros(state.shape)

                # Add experience to memory
                replay_memory.add(Experience(state, action, next_state, reward))

                # Start a new episode
                state = env.reset()

                # Stack the frames
                state, stacked_frames = stack_frames(stacked_frames, state, True)

                # Set episode_step = max_steps to end the episode
                episode_step = MAX_STEPS

                # Get the total reward of the episode
                total_reward = np.sum(episode_rewards)

                print("Episode: {}".format(episode),
                      "Total reward: {}".format(total_reward),
                    #   "Training loss: {:.4f}".format(loss),
                      "Explore P: {:.4f}".format(explore_probability))

                replay_memory.add(Experience(
                    state, action, next_state, reward))

            else:
                # Get the next state
                next_state = env.get_state()
                next_state, stacked_frames = stack_frames(stacked_frames, next_state, False)

                # Add experience to memory
                replay_memory.add(Experience(state, action, next_state, reward))

                # st+1 is now our current state
                state = next_state

            # LEARNING PART
            # Obtain random mini-batch from memory
            batch = replay_memory.sample(BATCH_SIZE)
            states_mb = np.array([each[0] for each in batch], ndmin=3)
            actions_mb = np.array([each[1] for each in batch])
            rewards_mb = np.array([each[2] for each in batch])
            next_states_mb = np.array([each[3] for each in batch], ndmin=3)
            dones_mb = np.array([each[4] for each in batch])

            target_Qs_batch = []

            # with tf.GradientTape() as tape:
            #     q_values = model(replay_memory.sample(BATCH_SIZE))

            # # Get Q values for next_state
            # Qs_next_state = sess.run(DQNetwork.output, feed_dict={
            #                          DQNetwork.inputs_: next_states_mb})

            # # Set Q_target = r if the episode ends at s+1, otherwise set Q_target = r + gamma*maxQ(s", a")
            # for i in range(0, len(batch)):
            #     terminal = dones_mb[i]

            #     # If we are in a terminal state, only equals reward
            #     if terminal:
            #         target_Qs_batch.append(rewards_mb[i])

            #     else:
            #         target = rewards_mb[i] + gamma * np.max(Qs_next_state[i])
            #         target_Qs_batch.append(target)

            # targets_mb = np.array([each for each in target_Qs_batch])

            # loss, _ = sess.run([DQNetwork.loss, DQNetwork.optimizer],
            #                    feed_dict={DQNetwork.inputs_: states_mb,
            #                               DQNetwork.target_Q: targets_mb,
            #                               DQNetwork.actions_: actions_mb})

        # Save model every 10 episodes
        if episode % 10 == 0:
            model.save("model/")
