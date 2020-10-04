#/bin/bash
pushd .
python ./setup.py sdist
popd .

echo; echo