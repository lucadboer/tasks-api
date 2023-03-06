import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../libs/prisma'

const tasksFormSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
})

export function tasksRoutes(app: FastifyInstance) {
  app.post('/', async (req) => {
    if (req.method !== 'POST') {
      return 'Method invalid'
    }

    const task = tasksFormSchema.parse(req.body)

    const { title, description } = task
    await prisma.tasks.create({
      data: {
        title,
        description,
      },
    })
  })
}
