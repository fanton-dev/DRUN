from __future__ import absolute_import

import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.layers import Input, Conv2D, Flatten, Dense, Concatenate


STATE_SIZE = [256, 256, 4]
ACTION_SIZE = 8


def drun_dqn() -> Model:
    image_input = Input(STATE_SIZE)
    coords_input = Input(2)

    img_net = Conv2D(32, (4, 4), strides=(4, 4), activation="relu", padding="same", input_shape=STATE_SIZE)(image_input)
    img_net = Conv2D(64, (3, 3), strides=(2, 2), activation="relu", padding="same")(img_net)
    img_net = Conv2D(64, (3, 3), strides=(2, 2), activation="relu", padding="same")(img_net)
    img_net = Flatten()(img_net)

    combined = Concatenate(axis=1)
    combined = combined([img_net, coords_input])

    dense_net = Dense(512, activation=tf.nn.relu)(combined)
    dense_net = Dense(512, activation=tf.nn.relu)(dense_net)
    dense_net = Dense(512, activation=tf.nn.relu)(dense_net)
    output = Dense(ACTION_SIZE, activation=tf.nn.elu)(dense_net)
    return Model(inputs=(image_input, coords_input), outputs=output)
