from __future__ import absolute_import
# import tensorflow as tf
import gym

env = gym.make("airsim_gym:airsim-regular-v0")
env.reset()
for _ in range(1000):
    env.step(env.action_space.sample())
