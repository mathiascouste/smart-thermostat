<template>
  <div class="daySettings">
    <svg height="100%" width="100%" v-if="this.targets">
      <line v-for="(line) in lines" :key="'displayed-' + line.index" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" style="stroke:#2c3e50;stroke-width:2" />
      <line class="hiddenWithEvent" v-for="(line, lineIndex) in lines" :key="line.index" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" style="stroke-width:16" @click='addTarget(lineIndex, $event)'/>

      <circle v-for="(target) in targets" :key="'displayed-' + target.time" :cx="target.time | timeToAbsix" :cy="target.temperature | temperatureToOrdonate" r="8" stroke="#2c3e50" stroke-width="2" fill="white"/>
      <circle class="hiddenWithEvent" v-for="(target, index) in targets" :key="target.time" :cx="target.time | timeToAbsix" :cy="target.temperature | temperatureToOrdonate" r="16" stroke="#2c3e50" stroke-width="2" fill="white" @click='showTarget(index)'/>

      <text x="0" y="15" fill="#2c3e50">{{temperatureMax}}°C</text>
      <text x="0" y="100%" fill="#2c3e50">{{temperatureMin}}°C</text>
    </svg>
    <div height="100%" width="100%" v-if="!this.targets">
      Select some day to see the days settings
    </div>
    <div class="modal-mask" v-if="targetInUpdate">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <h3 v-if="minTime !== maxTime">Adjust target</h3>
            <h3 v-else>Adjust target for {{targetInUpdate.time | minuteTimeToDisplayable}}</h3>
          </div>

          <div class="modal-body">
            <div class="range-slider" v-if="minTime !== maxTime">
              <input class="range-slider__range" type="range" v-model="targetInUpdate.time" :min="minTime" :max="maxTime" step="5">
              <span class="range-slider__value">{{targetInUpdate.time | minuteTimeToDisplayable}}</span>
            </div>
            <div class="range-slider">
              <input class="range-slider__range" type="range" v-model="targetInUpdate.temperature" :min="temperatureMin" :max="temperatureMax" step="0.5">
              <span class="range-slider__value">{{targetInUpdate.temperature}}°C</span>
            </div>
          </div>

          <div class="close">
            <span class="button" @click='deleteTarget()' v-if="minTime !== maxTime">
              <p>DELETE</p>
            </span>
            <span class="button principal" @click='hideTarget()'>
              <p>CONFIRM</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsService from '@/services/settings'

const temperatureMax = 25
const temperatureMin = 15

export default {
  name: 'day-settings',
  subscriptions: {
    targets: SettingsService.$targets
  },
  data: function () {
    return {
      temperatureMax: temperatureMax,
      temperatureMin: temperatureMin,
      targetInUpdate: null,
      targetInUpdateIndex: null,
      minTime: 0,
      maxTime: 1440
    }
  },
  methods: {
    addTarget: function (index, event) {
      let svgWidth = event.path[1].scrollWidth

      let newTime = 1440 * event.offsetX / svgWidth
      newTime = Math.ceil(newTime / 5) * 5

      let previous = this.targets[index]
      let next = this.targets[index + 1]

      let a = (next.temperature - previous.temperature) / (next.time - previous.time)
      let b = Number(previous.temperature)

      let newTarget = {
        time: newTime,
        temperature: (a * (newTime - previous.time)) + b
      }

      this.targets.splice(index + 1, 0, newTarget)
    },
    showTarget: function (index) {
      if (index === 0) {
        this.minTime = 0
        this.maxTime = 0
      } else if (index === this.targets.length - 1) {
        this.minTime = 1440
        this.maxTime = 1440
      } else {
        this.minTime = Number(this.targets[index - 1].time) + 5
        this.maxTime = Number(this.targets[index + 1].time) - 5
      }

      this.targetInUpdate = this.targets[index]
      this.targetInUpdateIndex = index
    },
    hideTarget: function () {
      this.targetInUpdate = null
      this.targetInUpdateIndex = null
    },
    deleteTarget: function () {
      this.targets.splice(this.targetInUpdateIndex, 1)
      this.targetInUpdate = null
      this.targetInUpdateIndex = null
    }
  },
  computed: {
    lines: function () {
      let lines = []
      let previous = null
      for (let index in this.targets) {
        if (previous) {
          lines.push({
            index: index,
            x1: this.$options.filters.timeToAbsix(previous.time),
            y1: this.$options.filters.temperatureToOrdonate(previous.temperature),
            x2: this.$options.filters.timeToAbsix(this.targets[index].time),
            y2: this.$options.filters.temperatureToOrdonate(this.targets[index].temperature)
          })
        }
        previous = this.targets[index]
      }
      return lines
    }
  },
  filters: {
    /**
     * @argument time in minutes
     */
    timeToAbsix: function (time) {
      return (time / 1440 * 100) + '%'
    },
    temperatureToOrdonate: function (temperature) {
      return (100 - ((temperature - temperatureMin) / (temperatureMax - temperatureMin)) * 100) + '%'
    },
    minuteTimeToDisplayable: function (minutes) {
      return Math.trunc(minutes / 60) + ':' + (Math.trunc(minutes % 60) < 10 ? '0' : '') + Math.trunc(minutes % 60)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.daySettings {
  margin: 10px
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.close {
  display: flex;
  flex-direction: row;
}

.button {
  flex: 1;
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



.range-slider {
  margin: 0;
}

.range-slider {
  width: 100%;
}

.range-slider__range {
  -webkit-appearance: none;
  width: calc(100% - (73px));
  height: 10px;
  border-radius: 5px;
  background: #d7dcdf;
  outline: none;
  padding: 0;
  margin: 0;
}
.range-slider__range::-webkit-slider-thumb {
  -webkit-appearance: none;
          appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  -webkit-transition: background .15s ease-in-out;
  transition: background .15s ease-in-out;
}
.range-slider__range::-webkit-slider-thumb:hover {
  background: #1abc9c;
}
.range-slider__range:active::-webkit-slider-thumb {
  background: #1abc9c;
}
.range-slider__range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  -webkit-transition: background .15s ease-in-out;
  transition: background .15s ease-in-out;
}
.range-slider__range::-moz-range-thumb:hover {
  background: #1abc9c;
}
.range-slider__range:active::-moz-range-thumb {
  background: #1abc9c;
}

.range-slider__value {
  display: inline-block;
  position: relative;
  width: 40px;
  color: #fff;
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  background: #2c3e50;
  padding: 5px 10px;
  margin-left: 8px;
}
.range-slider__value:after {
  position: absolute;
  top: 8px;
  left: -7px;
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-right: 7px solid #2c3e50;
  border-bottom: 7px solid transparent;
  content: '';
}

::-moz-range-track {
  background: #d7dcdf;
  border: 0;
}

input::-moz-focus-inner,
input::-moz-focus-outer {
  border: 0;
}

.hiddenWithEvent {
  visibility:hidden;
  pointer-events: all;
}
</style>
