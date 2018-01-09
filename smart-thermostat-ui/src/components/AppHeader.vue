<template>
  <div class="appHeader tab-container">
    <span class="tab left" :class="{ selected: this.selected.tab === 'metrics' }" @click="selectMetrics"><p>METRICS</p></span>
    <span class="tab right" :class="{ selected: this.selected.tab === 'settings' }" @click="selectSettings"><p>SETTINGS</p></span>
  </div>
</template>

<script>
import router from '@/router'

let selected = {
  tab: 'metrics'
}

export default {
  name: 'app-header',
  data: function () {
    return {
      selected: selected
    }
  },
  methods: {
    selectMetrics: () => {
      selected.tab = 'metrics'
      router.push({name: 'Metrics'})
    },
    selectSettings: () => {
      selected.tab = 'settings'
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
