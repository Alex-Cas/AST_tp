#!/usr/bin/env ts-node

import { MetricsHandler, Metric } from '../src/metrics'

const dbMet = new MetricsHandler('db/metrics')

const met = [
  new Metric('2013-11-04 14:00 UTC', 12),
  new Metric('2013-11-04 14:10 UTC', 13),
  new Metric('2013-11-04 14:20 UTC', 22),
  new Metric('2013-11-04 14:30 UTC', 11),
  new Metric('2013-11-04 14:40 UTC', 15),
  new Metric('2013-11-04 14:50 UTC', 19)
]

dbMet.save(0, met, (err: Error | null) => {
  if (err) throw err
  console.log('Metrics saved')
})