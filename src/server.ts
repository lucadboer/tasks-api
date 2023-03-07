import { app } from './app'
import { env } from './env'

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running!')
  })
