import Vue from 'vue'
import Router from 'vue-router'
import Metrics from '@/components/metrics/metrics'
import Settings from '@/components/settings/settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Metrics',
      component: Metrics
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
