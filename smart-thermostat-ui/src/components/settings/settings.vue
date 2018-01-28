<template>
  <div class="settings">
    <ul class="daySelection">
      <li v-for="(day, index) in days" :key="day.label" :class="{ selected: day.selected }" @click="toggleDay(index)">
        {{ day.label }}
      </li>
    </ul>
    <day-settings class="daySettings"></day-settings>
    <div class="submission">
      <span class="button" @click="reset" v-bind:class="{ disabled: !targets }">
        <p>RESET</p>
      </span>
      <span class="button principal" @click="confirm" v-bind:class="{ disabled: !targets }">
        <p>CONFIRM</p>
      </span>
    </div>
  </div>
</template>

<script>
import SettingsService from '@/services/settings'

import DaySettings from './daySettings'

export default {
  name: 'Settings',
  subscriptions: {
    targets: SettingsService.$targets
  },
  components: {
    'day-settings': DaySettings
  },
  data () {
    return {
      days: [
        {
          label: 'MON',
          selected: false
        },
        {
          label: 'TUE',
          selected: false
        },
        {
          label: 'WED',
          selected: false
        },
        {
          label: 'THU',
          selected: false
        },
        {
          label: 'FRI',
          selected: false
        },
        {
          label: 'SAT',
          selected: false
        },
        {
          label: 'SUN',
          selected: false
        }
      ]
    }
  },
  methods: {
    toggleDay: function (dayIndex) {
      let numberOfDaysAlreadySelected = this.calculateNumberOfDaysAlreadySelected()
      this.days[dayIndex].selected = !this.days[dayIndex].selected
      if (!numberOfDaysAlreadySelected) {
        SettingsService.firstDaySelected(this.days[dayIndex].label)
      }
      let numberOfDaysSelected = this.calculateNumberOfDaysAlreadySelected()
      if (!numberOfDaysSelected) {
        SettingsService.noDaySelected()
      }
    },
    calculateNumberOfDaysAlreadySelected: function () {
      let numberOfDaysAlreadySelected = 0
      for (let index in this.days) {
        if (this.days[index].selected) {
          numberOfDaysAlreadySelected++
        }
      }
      return numberOfDaysAlreadySelected
    },
    reset: function () {
      if (this.targets) {
        SettingsService.reset()
      }
    },
    confirm: function () {
      if (this.targets) {
        SettingsService.save(this.days)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settings {
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.daySelection {
  flex: 1;
  padding: 0;
}

.daySelection>li {
  display: inline-block;
  border: 1px solid #2c3e50;
  margin: 5px;
  padding: 5px;
  border-radius: 10px;
  width: 35px;
}

.daySelection>li.selected {
  background-color: #415161;
  color: white;
}

.daySettings {
  flex: 10;
}

.submission {
  flex: 2;
  display: flex;
  flex-direction: row;
}

.submission>.button {
  flex: 1;
}

.button {
  margin: 5px;

  border: 2px solid #2c3e50;
  border-radius: 5px;
  color: #2c3e50;
  font-weight: bold;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.button.principal {
  background-color: #415161;
  color: white;
}

.button:hover {
  background-color: #aab1b9;
  color: #2c3e50;
}

.button.disabled {
  border: 2px solid grey;
  background-color: white;
  color: grey;
}

.button.disabled:hover {
  border: 2px solid grey;
  background-color: white;
  color: grey;
}
</style>
