import Rx from 'rxjs/Rx'
import axios from 'axios'

const $targets = new Rx.ReplaySubject(1)
let retrieveTarget = null
let currentTarget = null

const noDaySelected = () => {
  $targets.next(null)
}

const firstDaySelected = (dayCode) => {
  axios.get('https://smart-thermostat-2c65a.firebaseio.com/settings/-L3x0J_gL97IVtVl-zzg/' + dayCode + '.json').then(
    (result) => {
      retrieveTarget = result.data

      reset()
    })
}

const reset = () => {
  currentTarget = JSON.parse(JSON.stringify(retrieveTarget))
  $targets.next(currentTarget)
}

const save = (days) => {
  var objTargets = {}
  for (var i = 0; i < currentTarget.length; ++i) {
    objTargets[i] = currentTarget[i]
  }
  days.filter(day => day.selected).forEach(day => {
    axios.patch('https://smart-thermostat-2c65a.firebaseio.com/settings/-L3x0J_gL97IVtVl-zzg/' + day.label + '.json', objTargets)
  })
}

export default {
  $targets: $targets,
  noDaySelected: noDaySelected,
  firstDaySelected: firstDaySelected,
  reset: reset,
  save: save
}
