from __future__ import absolute_import
from collections import deque

import gym
import tensorflow as tf
import numpy as np

from src.image_processing import stack_frames

env = gym.make("airsim_gym:airsim-regular-v0")
STATE_SIZE = [256, 256, 4]
ACTION_SIZE = env.action_space.n
STACK_SIZE = 64


env.reset()

model = tf.keras.models.load_model("model")
stacked_frames = deque([np.zeros(STATE_SIZE[:2], dtype=np.int) for i in range(STACK_SIZE)], maxlen=4)
for i in range(1):

    done = False

    env.reset()

    observation, position = env.get_state()
    observation, stacked_frames = stack_frames(stacked_frames, observation, True)

    while not done:
        # Take the biggest Q value (= the best action)
        observation = np.array(observation)
        position = np.array(position)

        observation = observation.reshape(1, *observation.shape)
        position = position.reshape(1, *position.shape)

        Qs = model.predict([observation, position])
        # Take the biggest Q value (= the best action)
        action = np.argmax(Qs)

        state, position, reward, done = env.step(action)

        if not done:
            next_observation, position = env.step(action)
            next_observation, stacked_frames = stack_frames(
                stacked_frames, next_observation, False)
            state = next_observation
