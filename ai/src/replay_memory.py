from __future__ import absolute_import
from collections import namedtuple, deque

import numpy as np


Experience = namedtuple(
    "Experience",
    ("observation", "position", "action", "next_observation", "next_position", "reward", "done")
)


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
