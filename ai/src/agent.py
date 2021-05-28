import random
import numpy as np


class Agent:
    def __init__(self, strategy, num_actions):
        self.current_step = 0
        self.strategy = strategy
        self.num_actions = num_actions

    def select_action(self, observation, position, model):
        rate = self.strategy.get_exploration_rate(self.current_step)
        self.current_step += 1

        if rate < random.random():
            return random.randrange(self.num_actions)
        else:
            return random.randrange(self.num_actions)
            # return model.predict([np.array(observation), np.array(position)])
