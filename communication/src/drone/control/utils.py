from __future__ import absolute_import
from collections import deque

import numpy as np


STATE_SIZE = [256, 256, 4]
STACK_SIZE = 4


# Image processing utilities
def preprocess_frame(frame):
    # Converts frame from RGB to grayscale
    grayscale_frame = np.mean(frame, -1)

    # Normalize Pixel Values
    normalized_frame = grayscale_frame/255.0

    # Resize
    preprocessed_frame = transform.resize(normalized_frame, STATE_SIZE[:2])

    return preprocessed_frame


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
        stacked_frames = [np.zeros(STATE_SIZE[:2], dtype=np.int)
                          for i in range(stack_size)]
        stacked_frames = deque(stacked_frames, maxlen=stack_size)

        # In a new episode the deque is filled with the same frame
        for _ in range(stack_size):
            stacked_frames.append(frame)

    else:
        # Append frame to deque, pops the last
        stacked_frames.append(frame)

    # Build the stacked state (first dimension specifies different frames)
    stacked_state = np.stack(stacked_frames, axis=2)
    return stacked_state, stacked_frames
