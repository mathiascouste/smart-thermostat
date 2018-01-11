import Vue from 'vue'
import Router from 'vue-router'
import Metrics from '@/components/metrics/metrics'
import Settings from '@/components/settings/settings'

import MetricsService from '@/services/metrics'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Metrics',
      component: Metrics,
      beforeEnter: (to, from, next) => {
        MetricsService.retrieveCurrentTemperature()
        MetricsService.updateTime()
        next()
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
