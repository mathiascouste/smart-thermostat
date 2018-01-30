print(" *** Starting Smart-thermometer ***")

print(" > Loading modules...")
import os
import glob
import time
import sys
import requests
import json

web_loop_duration = 10
main_loop_duration = 1

days = {"0" : "SUN", "1" : "MON", "2" : "TUE", "3" : "WED", "4" : "THU", "5" : "FRI", "6" : "SAT"}

temp_buffer = []
temp_buffer_index = 0
buffer_len = web_loop_duration / main_loop_duration

current_temperature = 0
current_average_temperature = 0
targets = None
expected_temperature = 0

print(" > Defining methods...")
# Mocked temperature reading
def read_temp():
  global current_temperature
  current_temperature = 19.8

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
  print(" -- ON -- ")

def off():
  print(" -- OFF -- ")

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
  print(json.dumps(data))

def downloadTargets():
  global targets
  day = days.get(time.strftime('%w'))
  r = requests.get("https://smart-thermostat-2c65a.firebaseio.com/settings/-L3x0J_gL97IVtVl-zzg/" + day +".json")
  targets = r.json()

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

