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

    def predict_action(self, current_step, state, env, dqn):
        # EPSILON GREEDY STRATEGY
        # Choose action a from state s using epsilon greedy.
        # First we randomize a number
        exp_exp_tradeoff = np.random.rand()

        explore_probability = self.get_exploration_rate(current_step)

        if explore_probability > exp_exp_tradeoff:
            action = env.action_space.sample()

        else:
            # Get action from Q-network (exploitation)
            # Estimate the Qs values state
            prediction = dqn.predict((state, np.zeros(2)))

            # Take the biggest Q value (= the best action)
            choice = np.argmax(prediction)
            action = env.action_space[int(choice)]

        return action, explore_probability
