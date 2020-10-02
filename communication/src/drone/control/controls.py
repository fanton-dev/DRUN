class Controls:

    def __init__(self, controls = None):
        self.actions_keys = {
            'takeoff':'Key.space', 
            'land':'x', 
            'forward':'w', 
            'left':'a', 
            'backward':'s', 
            'right':'d', 
            'up':'z', 
            'down':'c', 
            'cw':'e', 
            'ccw':'q'
        }
        if controls is None:
            self.controls = { action: Control(key, False) for (action, key) in self.actions_keys.items() }
        else:
            self.controls = { action: Control(self.actions_keys[action], state) for (action,state) in controls.items() }

    def __getitem__(self, action):
        return self.controls[action]

    def find_by_key(self, key):
        for (a, k) in self.actions_keys:
            if key == k:
                return self.controls[a]

    def dumps(self):
        return str({ action:control.state for (action, control) in self.controls.items() })

    @staticmethod
    def loads(str):
        return Controls(eval(str))

class Control:

    def __init__(self, key, state):
        self.key = key
        self.state = state

    def __repr__(self):
        return "({},{})".format(self.key, self.state)