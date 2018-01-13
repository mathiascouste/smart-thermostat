<template>
    <trend class="historic"
    :data="recentHistoric"
    :gradient="['#16a085', '#2c3e50', '#e74c3c']"
    :height="180"
    :stroke-width="2"
    auto-draw
    smooth>
</trend>
</template>

<script>
import MetricsService from '@/services/metrics'

export default {
  name: 'historic',
  subscriptions: {
    recentHistoric: MetricsService.$recentHistoric
  },
  components: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.historic {
  flex: 4;
}
</style>
