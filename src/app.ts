import fastify from 'fastify'
import { tasksRoutes } from './routes/tasksRoutes'

export const app = fastify()

app.register(tasksRoutes, {
  prefix: 'tasks',
})
