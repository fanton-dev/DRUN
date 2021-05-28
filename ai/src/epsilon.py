from __future__ import absolute_import
from math import exp

import numpy as np


class EpsilonGreedy():
    def __init__(self, start, stop, decay):
        self.start = start
        self.stop = stop
        self.decay = decay

    def get_exploration_rate(self, current_step):
        rate = self.stop + (self.start - self.stop)
        rate *= exp(-1 * current_step * self.decay)
        return rate

    def predict_action(self, current_step, observation, position, env, dqn):
        # EPSILON GREEDY STRATEGY
        # Choose action a from state s using epsilon greedy.
        # First we randomize a number
        exp_exp_tradeoff = np.random.rand()

        # Exploration rate is decayed
        explore_probability = self.get_exploration_rate(current_step)

        if explore_probability < exp_exp_tradeoff:
            # A random action is sampled (exploration)
            action = env.action_space.sample()

        else:
            # Get action from Q-network (exploitation)
            # Estimate the Qs values state
            observation = np.array(observation)
            position = np.array(position)

            observation = observation.reshape(1, *observation.shape)
            position = position.reshape(1, *position.shape)

            prediction = dqn.predict([observation, position])

            # Take the biggest Q value (= the best action)
            action = np.argmax(prediction)

        return action, explore_probability
