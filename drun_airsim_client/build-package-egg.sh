#/bin/bash
# see http://peak.telecommunity.com/DevCenter/PythonEggs
pushd .
python ./setup.py bdist_egg
popd .

echo; echo