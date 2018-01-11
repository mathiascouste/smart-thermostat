import Rx from 'rxjs/Rx'
import axios from 'axios'

const $currentTemperature = new Rx.ReplaySubject(1)
const $currentTime = new Rx.ReplaySubject(1)

const retrieveCurrentTemperature = () => {
  axios.get('/api/temperature/now').then((result) => $currentTemperature.next(result.data.value))
}

const updateTime = () => {
  const time = new Date()
  $currentTime.next(time.getHours() + ':' + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes())
}

setInterval(updateTime, 60000)

export default {
  $currentTemperature: $currentTemperature,
  $currentTime: $currentTime,
  retrieveCurrentTemperature: retrieveCurrentTemperature,
  updateTime: updateTime
}
