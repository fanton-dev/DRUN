class Controls:

    def __init__(self):
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
        self.controls = {action: Control(key, False) for (action, key) in actions_keys.items()}

    def __getitem__(self, action):
        return self.controls[action]

    def find_by_key(self, key):
        for (a, k) in self.actions_keys:
            if key == k:
                return self.controls[a]

class Control:

    def __init__(self, key, state):
        self.key = key
        self.state = state