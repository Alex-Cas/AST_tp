#!/usr/bin/env ts-node

import { MetricsHandler, Metric } from '../src/metrics'
import { UserHandler } from '../src/user'


const dbUser = new UserHandler('db/users')

const user1 = {

    'username': 'Alexandre',
    'email': 'alex@mail.com',
    'password': 'alex'
}

const user2 = {

    'username': 'Jean',
    'email': 'jean@mail.com',
    'password': 'secret'
}

dbUser.save(user1, (err: Error | null) => {
    if (err) throw err
    console.log('User saved')
})

dbUser.save(user2, (err: Error | null) => {
    if (err) throw err
    console.log('User saved')
})

const dbMet = new MetricsHandler('db/metrics')

const met1 = [
  new Metric('1544871586', 12),
  new Metric('1544881586', 13),
  new Metric('1544891586', 22),
  new Metric('1544901586', 11),
  new Metric('1544911586', 15),
  new Metric('1544921586', 19)
]

const met2 = [
  new Metric('1544871586', 20),
  new Metric('1544881586', 12),
  new Metric('1544891586', 14),
  new Metric('1544901586', 17),
  new Metric('1544911586', 11),
  new Metric('1544921586', 9)
]

dbMet.save('Alexandre', met1, (err: Error | null) => {
  if (err) throw err
  console.log('Metrics saved')
})

dbMet.save('Jean', met2, (err: Error | null) => {
  if (err) throw err
  console.log('Metrics saved')
})

