from __future__ import absolute_import
import setuptools

# setup(name='airsim_gym',
#       version='0.0.1',
#       install_requires=['gym', 'airsim', 'pillow'])

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="airsim_gym",
    version="0.0.1",
    author="Angel Penchev (FAnton)",
    author_email="angel.penchev.tsb@gmail.com",
    description="Custom OpenAI gym environment for AirSim",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/braind3d/DRUN/tree/master/ai/airsim_gym",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
    install_requires=['gym', 'airsim', 'numpy']
)
