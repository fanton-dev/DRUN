"""Custom AirSim gym environment with depth camera observation."""
from __future__ import absolute_import
from typing import List

import numpy as np
import gym
from gym.utils import seeding

from drun_airsim_client import DRUNAirSimClient


class AirSimDepthEnv(gym.Env):
    """Custom AirSim gym environment with depth camera observation."""

    def __init__(self):
        # Observation space definition
        # Image shape (256, 256, 3)
        self.observation_space = gym.spaces.Box(
            low=0, high=255, shape=(256, 256))
        self.state = np.zeros((256, 256), dtype=np.uint8)

        # Action space definition
        # [Forward, Left, Backward, Right]
        self.action_space = gym.spaces.Discrete(4)

        self._seed()
        self.home = [0.0, 0.0, -30.0]
        self.goal = [100.0, -100.0]
        self.position = self.home

        self.current_episode = 0
        self.current_step = 0

        self.default_history = {
            "reward": [0],
            "distance": [0],
            "action": [0]
        }
        self.history = self.default_history.copy()
        self.client = DRUNAirSimClient()

    def step(self, action):
        self.history["action"].append(action)
        self.current_step += 1

        current_move = [0 for _ in range(8)]
        current_move[action] = 1
        self.client.move(*current_move, duration=1)

        collided = self.client.get_collisions().has_collided
        self.position = self.client.get_pose().position

        if collided:
            done = True
            reward = -100.0
            distance = self._calculate_distance(self.goal)
        else:
            done = False
            reward, distance = self._calculate_reward()

        if distance < 2:
            done = True
            reward = 100.0

        self.history["reward"].append(reward)
        self.history["distance"].append(distance)

        info = {
            "x_position": self.position.x_val,
            "y_position": self.position.y_val
        }
        self.state = self.client.get_observation_depth()

        return self.state, reward, done, info

    def reset(self):
        self.client.simulation_reset()
        self.client.set_pose(position=(0, 0, -30))
        self.client.takeoff()

        self.current_episode += 1
        self.current_step = 0
        self.history = self.default_history.copy()

        return self.client.get_observation_depth()

    def render(self, mode="none") -> None:
        pass

    def get_state(self):
        return self.client.get_observation_depth()

    def set_home(self, new_home: List[int]) -> None:
        """Changes the environment home.

        Args:
            new_home (List[int]): New home coordinates.
        """
        self.home = new_home.copy()

    def set_goal(self, new_goal: List[int]) -> None:
        """Changes the environment goal.

        Args:
            new_goal (List[int]): New goal coordinates.
        """
        self.goal = new_goal.copy()

    def _calculate_reward(self):
        distance_now = self._calculate_distance(self.goal)
        distance_before = self.history["distance"][-1]

        reward = -1
        reward = reward + (distance_before - distance_now)

        return reward, distance_now

    def _calculate_distance(self, goal):
        distance = np.power((goal[0]-self.position.x_val), 2)
        distance += np.power((goal[1]-self.position.y_val), 2)
        return np.sqrt(distance)

    def _seed(self, seed=None):
        self.np_random, seed = seeding.np_random(seed)
        return [seed]
