<template>
  <div class="appHeader tab-container">
    <span class="tab left" :class="{ selected: selected.tab === 'Metrics' }" @click="selectMetrics"><p>METRICS</p></span>
    <span class="tab right" :class="{ selected: selected.tab === 'Settings' }" @click="selectSettings"><p>SETTINGS</p></span>
  </div>
</template>

<script>
import router from '@/router'

let selected = {
  tab: 'Metrics'
}

export default {
  name: 'app-header',
  data: function () {
    return {
      selected: selected
    }
  },
  mounted: function () {
    selected.tab = router.currentRoute.name
  },
  methods: {
    selectMetrics: () => {
      selected.tab = 'Metrics'
      router.push({name: 'Metrics'})
    },
    selectSettings: () => {
      selected.tab = 'Settings'
      router.push({name: 'Settings'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.appHeader {
  width: 100%;
  height: 10vh;
}

.tab-container {
  display: flex;
}

.tab-container > .tab {
  flex: 1;
  border-top: solid 2px #2c3e50;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
}

.tab > p {
  width: 100%;
}

.tab:not(.selected) {
  margin-top: 2px;
  border-top: none;
  border-bottom: solid 2px #2c3e50;
  font-weight: normal;
}

.tab.selected.left {
  border-right: solid 2px #2c3e50;
}

.tab.selected.right {
  border-left: solid 2px #2c3e50;
}
</style>
