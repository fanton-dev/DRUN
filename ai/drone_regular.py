# DRUN Deep Q-network navigation (Regular observations)
# Library imports
from __future__ import absolute_import
from collections import namedtuple
from math import exp

import gym
import numpy as np
import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.layers import Input, Conv2D, Flatten, Dense, Activation, Concatenate
from tensorflow.keras.optimizers import Adam
from collections import deque


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
        stack_size: int = STACK_SIZE
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

    combined = Concatenate(axis=1)
    combined = combined([img_net, coords_input])

    dense_net = Dense(512, activation=tf.nn.relu)(combined)
    dense_net = Dense(512, activation=tf.nn.relu)(dense_net)
    dense_net = Dense(512, activation=tf.nn.relu)(dense_net)
    output = Dense(ACTION_SIZE, activation=tf.nn.elu)(dense_net)
    return Model(inputs=(image_input, coords_input), outputs=output)


drone_dqn = drun_dqn()
optimizer = Adam(learning_rate=LEARNING_RATE, clipnorm=1.0)

Experience = namedtuple(
    "Experience",
    ("state", "action", "next_state", "reward")
)


class EpsilonGreedy():
    def __init__(self, start, stop, decay):
        self.start = start
        self.stop = stop
        self.decay = decay

    def get_exploration_rate(self, current_step):
        rate = self.stop + (self.start - self.stop)
        rate *= exp(-1 * current_step * self.decay)
        return rate

    def predict_action(self, current_step, state, actions):
        # EPSILON GREEDY STRATEGY
        # Choose action a from state s using epsilon greedy.
        # First we randomize a number
        exp_exp_tradeoff = np.random.rand()

        # Here we"ll use an improved version of our epsilon greedy strategy used in Q-learning notebook
        explore_probability = self.get_exploration_rate(current_step)

        if explore_probability > exp_exp_tradeoff:
            action = env.action_space.sample()

        else:
            # Get action from Q-network (exploitation)
            # Estimate the Qs values state
            prediction = drone_dqn.predict((state, np.zeros(2)))

            # Take the biggest Q value (= the best action)
            choice = np.argmax(prediction)
            action = env.action_space[int(choice)]

        return action


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
        replay_memory.add(Experience(state, action, next_state, reward))

        # Our state is now the next_state
        state = next_state

epsilon = EpsilonGreedy(EXPLORE_START, EXPLORE_START, DECAY_RATE)
# Start training
if TRAINING:
    decay_step = 0

    for episode in range(total_episodes):
        episode_step = 0
        episode_rewards = []

        state = env.reset()
        state, stacked_frames = stack_frames(stacked_frames, state, True)

        while episode_step < MAX_STEPS:
            episode_step += 1
            # Increase decay_step
            decay_step += 1

            # Predict the action to take and take it
            action, explore_probability = epsilon.predict_action(
                state, possible_actions)

            # Do the action
            state, reward, done, _ = env.step(action)

            # Add the reward to total reward
            episode_rewards.append(reward)

            # If the game is finished
            if done:
                # the episode ends so no next state
                next_state = np.zeros(STATE_SIZE[:2], dtype=np.int)
                next_state, stacked_frames = stack_frames(
                    stacked_frames, next_state, False)

                # Set step = max_steps to end the episode
                step = MAX_STEPS

                # Get the total reward of the episode
                total_reward = np.sum(episode_rewards)

                print("Episode: {}".format(episode),
                      "Total reward: {}".format(total_reward),
                      "Training loss: {:.4f}".format(loss),
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

            # Get Q values for next_state
            Qs_next_state = sess.run(DQNetwork.output, feed_dict={
                                     DQNetwork.inputs_: next_states_mb})

            # Set Q_target = r if the episode ends at s+1, otherwise set Q_target = r + gamma*maxQ(s", a")
            for i in range(0, len(batch)):
                terminal = dones_mb[i]

                # If we are in a terminal state, only equals reward
                if terminal:
                    target_Qs_batch.append(rewards_mb[i])

                else:
                    target = rewards_mb[i] + gamma * np.max(Qs_next_state[i])
                    target_Qs_batch.append(target)

            targets_mb = np.array([each for each in target_Qs_batch])

            loss, _ = sess.run([DQNetwork.loss, DQNetwork.optimizer],
                               feed_dict={DQNetwork.inputs_: states_mb,
                                          DQNetwork.target_Q: targets_mb,
                                          DQNetwork.actions_: actions_mb})

        # Save model every 10 episodes
        if episode % 10 == 0:
            drone_dqn.save("model/")
