from gym.envs.registration import register

register(
    id="airsim-regular-v0",
    entry_point="airsim_gym.envs:AirSimRegularEnv",
)

register(
    id="airsim-depth-v0",
    entry_point="airsim_gym.envs:AirSimDepthEnv",
)
