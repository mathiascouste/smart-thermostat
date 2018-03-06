<template>
  <div class="status">
    <div class="roundedArea">
      <div class="content">
        <div class="temperature" v-if="currentTemperature != null">{{currentTemperature | truncateTemperature}}°C</div>
        <div class="no-temperature" v-else>Error</div>
        <div class="time">{{currentTime}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import MetricsService from '@/services/metrics'
import functions from '@/components/functions'

export default {
  name: 'status',
  subscriptions: {
    currentTemperature: MetricsService.$currentTemperature,
    currentTime: MetricsService.$currentTime
  },
  filters: {
    truncateTemperature: functions.truncateTemperature
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.status {
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.roundedArea {
  height: 300px;
  width: 300px;
  border-radius: 50%;
  border: solid 2px #2c3e50;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.time {
  font-size: 4em;
}

.temperature {
  font-size: 5em;
}

.no-temperature {
  font-size: 2em;
  font-style: italic;
  color: red;
}
</style>
