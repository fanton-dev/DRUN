# DRUN AirSim Client
A custom client for Microsoft AirSim wrapping all the necessities need for driving a reinforcement learning agent in the given environment.

This package was developed for and is a part of the DRUN project - an automated drone delivery system, but available on the [PyPI](https://pypi.org/project/drun-airsim-client/) and [TestPyPI](https://test.pypi.org/project/drun-airsim-client/) repositories.


# Contents
* `drun_airsim_client` contains a the DRUNAirSimClient, which contains all the necessities need for driving a reinforcement learning agent in the given environment.

# FAQ
## How do I Package/Bundle/Zip/Prepare my source code into a distributable package that I can distribute to others to use in their own Python apps?
Run `build-package.sh` to prepare your package source code for distribution. This will deploy a distributable Python package into `package-project/src/dist/drun_airsim_client-0.0.2.tar.gz`.

## How do other users install the package once it's built?
Other users can run `pip install drun_airsim_client-1.0.tar.gz` to install your package. See `install-built-package.sh` as an example.

Alternatively, you can [upload your built package to PyPI](https://packaging.python.org/distributing/#uploading-your-project-to-pypi) and then they can install it by running `pip install drun_airsim_client`.

## What are the differences between "Python Packages" and eggs?
I'm trying to figure that out myself. `build-package.sh` is an example of building a "Python Package" and `build-package-egg.sh` is an example of building an egg.

"Python Packages" are documented at https://packaging.python.org/distributing/ and Eggs are documented at http://peak.telecommunity.com/DevCenter/PythonEggs


# Troubleshooting
## After installing the package I still see the error 'ImportError: No module named <mypackage>' when trying to use it in a script/app.
It is important that the `setup.py` is in the **parent** of the actual root package folder. If you don't do this you won't get any errors, and pip will show you're package as installed (e.g. with `pip show <mypackage>`) but consuming scripts of the package won't ever find the package and will always get the `ImportError`.

So this also implies that the "package" isn't what you specify as the name of your package in `setup.py`. Although `pip` uses the name in `setup.py` to determine whether it is installed, Python itself only cares about the directory that contains the `__init__.py` file.