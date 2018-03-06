<template>
  <svg class="historic" v-if="recentHistoric">
    <trend
    :data="recentHistoric"
    :gradient="['#16a085', '#2c3e50', '#e74c3c']"
    :height="240"
    :stroke-width="2"
    auto-draw
    smooth>
    </trend>
    <line x1="15" y1="0" x2="35" y2="0" style="stroke:#e74c3c; stroke-width:4" />
    <text x="12" y="18" fill="#e74c3c">{{recentHistoric  | maxTemperature | truncateTemperature }}°</text>
    <line x1="15" y1="240" x2="35" y2="240" style="stroke:#16a085; stroke-width:2" />
    <text x="12" y="235" fill="#16a085">{{recentHistoric  | minTemperature | truncateTemperature }}°</text>
  </svg>
</template>

<script>
import MetricsService from '@/services/metrics'
import functions from '@/components/functions'

export default {
  name: 'historic',
  subscriptions: {
    recentHistoric: MetricsService.$recentHistoric
  },
  components: {},
  filters: {
    truncateTemperature: functions.truncateTemperature,
    maxTemperature: functions.maxFromRange,
    minTemperature: functions.minFromRange
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.historic {
  flex: 4;
  font-size: 0.8em;
}
</style>
