from __future__ import absolute_import
import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="drun_airsim_client",
    version="0.0.2",
    author="Angel Penchev (FAnton)",
    author_email="angel.penchev.tsb@gmail.com",
    description="Custom AirSim client for the DRUN project",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/braind3d/DRUN/tree/master/drun_airsim_client",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
    install_requires=['airsim']
)
