import Rx from 'rxjs/Rx'
import axios from 'axios'

const $currentTemperature = new Rx.ReplaySubject(1)
const $currentTime = new Rx.ReplaySubject(1)
const $recentHistoric = new Rx.ReplaySubject(1)

const retrieveCurrentTemperature = () => {
  axios.get('https://smart-thermostat-2c65a.firebaseio.com/temperature.json?orderBy="date"&limitToLast=1').then(
    (result) => {
      for (let index in result.data) {
        if (result.data.hasOwnProperty(index)) {
          $currentTemperature.next(result.data[index].value)
        }
      }
    })
}

const retrieveRecentHistoric = () => {
  axios.get('https://smart-thermostat-2c65a.firebaseio.com/temperature.json?orderBy="date"&limitToLast=288').then(
    (result) => {
      let temperatures = []

      for (var key in result.data) {
        if (result.data.hasOwnProperty(key)) {
          temperatures.push(result.data[key])
        }
      }

      temperatures = temperatures.sort((a, b) => {
        if (a.date < b.date) {
          return -1
        } else if (a.date > b.date) {
          return 1
        } else {
          return 0
        }
      }).map(x => Math.trunc(x.value * 10) / 10)

      $recentHistoric.next(temperatures)
    })
}

const updateTime = () => {
  const time = new Date()
  $currentTime.next(time.getHours() + ':' + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes())
}

setInterval(updateTime, 60000)

export default {
  $currentTemperature: $currentTemperature,
  $currentTime: $currentTime,
  $recentHistoric: $recentHistoric,
  retrieveCurrentTemperature: retrieveCurrentTemperature,
  retrieveRecentHistoric: retrieveRecentHistoric,
  updateTime: updateTime
}
