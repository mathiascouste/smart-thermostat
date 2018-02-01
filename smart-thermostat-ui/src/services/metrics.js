import Rx from 'rxjs/Rx'
import axios from 'axios'

const $currentTemperature = new Rx.ReplaySubject(1)
const $currentTime = new Rx.ReplaySubject(1)
const $recentHistoric = new Rx.ReplaySubject(1)

const retrieveCurrentTemperature = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - 10)

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }

  const lastOfTenMinutes = '' + year + month + day + hour + minute + second

  axios.get('https://smart-thermostat-2c65a.firebaseio.com/temperature.json?orderBy="date"&startAt="' + lastOfTenMinutes + '"&limitToLast=1').then(
    (result) => {
      for (let index in result.data) {
        if (result.data.hasOwnProperty(index)) {
          $currentTemperature.next(result.data[index].value)
        }
      }
    })
}

const retrieveRecentHistoric = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }

  const lastsOfOneDay = '' + year + month + day + hour + minute + second

  axios.get('https://smart-thermostat-2c65a.firebaseio.com/temperature.json?orderBy="date"&startAt="' + lastsOfOneDay + '"&limitToLast=288').then(
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
