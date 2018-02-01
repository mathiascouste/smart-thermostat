print(" *** Starting Smart-thermometer ***")

print(" > Loading modules...")
import os
import glob
import time
import sys
import requests
import json
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(18,GPIO.OUT)


web_loop_duration = 300
main_loop_duration = 30

days = {"0" : "SUN", "1" : "MON", "2" : "TUE", "3" : "WED", "4" : "THU", "5" : "FRI", "6" : "SAT"}

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

firebase_url = 'https://smart-thermostat-2c65a.firebaseio.com/temperature.json'

temp_buffer = []
temp_buffer_index = 0
buffer_len = web_loop_duration / main_loop_duration

current_temperature = 0
current_average_temperature = 0
targets = None
expected_temperature = 0

print(" > Defining methods...")
def read_temp_raw():
  f = open(device_file, 'r')
  lines = f.readlines()
  f.close()
  return lines

def read_temp():
  global current_temperature
  lines = read_temp_raw()
  while lines[0].strip()[-3:] != 'YES' :
    time.sleep(0.2)
    lines = read_temp_raw()
  equals_pos = lines[1].find('t=')
  if equals_pos != -1:
    temp_string = lines[1][equals_pos+2:]
  current_temperature = float(temp_string) / 1000.0

def computeExpectedTemperature():
  global expected_temperature
  if targets != None:
    closest_target_before = None
    closest_target_after = None
    current_time_in_minutes = int(time.strftime('%H')) * 60 + int(time.strftime('%M'))
    for target in targets:
      if current_time_in_minutes > int(target['time']):
        if closest_target_before == None or current_time_in_minutes - int(closest_target_before['time']) > current_time_in_minutes - int(target['time']):
          closest_target_before = target
      if current_time_in_minutes < int(target['time']):
        if closest_target_after == None or current_time_in_minutes - int(closest_target_after['time']) < current_time_in_minutes - int(target['time']):
          closest_target_after = target
    xA = float(closest_target_before['time'])
    xB = float(closest_target_after['time'])
    yA = float(closest_target_before['temperature'])
    yB = float(closest_target_after['temperature'])
    coef = (yB - yA) / (xB - xA)
    expected_temperature = yA + coef * (current_time_in_minutes - xA)

def on():
  GPIO.output(18,GPIO.HIGH)

def off():
  GPIO.output(18,GPIO.LOW)

def checkTemperature():
  computeExpectedTemperature()
  if(current_temperature < expected_temperature):
    on()
  else:
    off()

def calculateAverageTemperature():
  global temp_buffer_index
  global current_average_temperature
  if len(temp_buffer) <= temp_buffer_index:
    temp_buffer.append(current_temperature)
  else:
    temp_buffer[temp_buffer_index] = current_temperature
  
  temp_buffer_index = temp_buffer_index + 1
  if(temp_buffer_index >= buffer_len):
    temp_buffer_index = 0
  current_average_temperature = sum(temp_buffer) / len(temp_buffer)

# Mocked upload writing
def sendToFirebase():
  date = time.strftime('%Y%m%d%H%M%S')
  data = {'date':date,'value':current_average_temperature}
  result = requests.post(firebase_url, data=json.dumps(data))

def downloadTargets():
  global targets
  day = days.get(time.strftime('%w'))
  r = requests.get("https://smart-thermostat-2c65a.firebaseio.com/settings/-L3x0J_gL97IVtVl-zzg/" + day +".json")
  if(r.status_code == 200):
    targets = r.json

def executeWebLoop():
  downloadTargets()
  sendToFirebase()

print(" > Starting main loop...")
downloadTargets()
try:
  while True:
    read_temp()
    calculateAverageTemperature()
    checkTemperature()
    if(temp_buffer_index == buffer_len - 1):
      executeWebLoop()
    time.sleep(main_loop_duration)
except KeyboardInterrupt:
  sys.exit(0)
