import fastify from 'fastify'
import { env } from './env'

const app = fastify()

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running!')
  })
