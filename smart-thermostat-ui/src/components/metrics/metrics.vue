<template>
  <div class="metrics">
    <status></status>
    <historic></historic>
  </div>
</template>

<script>
import Status from './status'
import Historic from './historic'

export default {
  name: 'metrics',
  components: {
    'status': Status,
    'historic': Historic
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.metrics {
  height: 90vh;
  display: flex;
  flex-direction: column;
}
</style>
