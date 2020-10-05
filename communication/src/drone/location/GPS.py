import RPi.GPIO as GPIO

import serial
import time
import re

from typing import List


class GPS:
    ser = serial.Serial('/dev/ttyS0', 115200)
    ser.flushInput()
    is_on = False

    @classmethod
    def power_on(cls, power_key=6):
        # print('SIM7600X is starting:')
        if not cls.is_on:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            GPIO.setup(power_key, GPIO.OUT)
            time.sleep(0.1)
            GPIO.output(power_key, GPIO.HIGH)
            time.sleep(2)
            GPIO.output(power_key, GPIO.LOW)
            time.sleep(20)
            cls.ser.flushInput()
        # print('SIM7600X is ready')

    @classmethod
    def power_down(cls, power_key=6):
        # print('SIM7600X is loging off:')
        if cls.is_on:
            GPIO.output(power_key, GPIO.HIGH)
            time.sleep(3)
            GPIO.output(power_key, GPIO.LOW)
            time.sleep(18)
        # print('Good bye')

    @classmethod
    def __send_at(cls, command, returnee, timeout):
        rec_buff = ''
        cls.ser.write((command+'\r\n').encode())
        time.sleep(timeout)
        if cls.ser.inWaiting():
            time.sleep(0.01)
            rec_buff = cls.ser.read(cls.ser.inWaiting())
        if rec_buff != '':
            if returnee not in rec_buff.decode():
                #print(command + ' ERROR')
                #print(command + ' back:\t' + rec_buff.decode())
                return 0
            else:
                # print(rec_buff.decode())
                res = rec_buff.decode()
                if ',,,,,,' in res:
                    time.sleep(1)
                else:
                    return res

    @classmethod
    def __get_current_location(cls):
        while True:
            buff = cls.__send_at('AT+CGPSINFO', '+CGPSINFO: ', 1)
            if buff is None:
                #print('buff none')
                buff = ''
                continue
            if buff == 0:
                print('error')
                #raise Exception('Serial Communication error')
            if 'CGPSINFO:' in buff:
                return buff
            time.sleep(1.5)

    @classmethod
    def current_location(cls) -> List[float]:
        s = cls.__get_current_location()
        
        x = re.search(r"\d+\.\d+,[A-Z],\d+\.\d+,[A-Z]", s)
        location = x.group().split(',')  # 4241.165993,N,02315.930125,E
        print(location)
        lat = float(location[0])
        lon = float(location[2])
        if location[1] == 'S':
            lat *= -1
        if location[3] == 'W':
            lon *= -1
        return [lon, lat]