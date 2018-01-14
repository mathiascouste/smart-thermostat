#!/usr/bin/env python

import os
import glob
import time
import sys
import requests
import json

# os.system('modprobe w1-gpio')
# os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

firebase_url = 'https://smart-thermostat-2c65a.firebaseio.com/temperature.json'

def read_temp_raw():
  f = open(device_file, 'r')
  lines = f.readlines()
  f.close()
  return lines

def read_temp():
  lines = read_temp_raw()
  while lines[0].strip()[-3:] != 'YES' :
    time.sleep(0.2)
    lines = read_temp_raw()
  equals_pos = lines[1].find('t=')
  if equals_pos != -1:
    temp_string = lines[1][equals_pos+2:]
  temp_c = float(temp_string) / 1000.0
  temp_f = temp_c * 9.0 / 5.0 + 32.0
  return temp_c, temp_f

temp_buffer = []
buffer_len = 10

def handleMeasure(temp_c):
  temp_buffer.append(temp_c)
  if(len(temp_buffer) >= buffer_len):
    temp_average = sum(temp_buffer) / len(temp_buffer)
    temp_buffer[:] = []
    sendToFirebase(temp_average)


def sendToFirebase(temp):
  date = time.strftime('%Y%m%d%H%M%S')
  data = {'date':date,'value':temp}
  result = requests.post(firebase_url, data=json.dumps(data))

try:
  while True:
    handleMeasure(read_temp()[0])
    time.sleep(30)
except KeyboardInterrupt:
  sys.exit(0)

