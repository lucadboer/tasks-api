import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../libs/prisma'

export async function tasksRoutes(app: FastifyInstance) {
  const tasksFormSchema = z.object({
    title: z.string(),
    description: z.string(),
  })

  app.post('/task', async (req) => {
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

  app.get('/task', async (req, reply) => {
    if (req.method !== 'GET') {
      return 'Method Invalid'
    }

    const tasks = await prisma.tasks.findMany()

    reply.send({
      tasks,
    })
  })

  app.put('/task/:id', async (req) => {
    const updateTaskFormSchema = z.object({
      title: z.string(),
    })

    if (req.method !== 'PUT') {
      return 'Method Invalid'
    }

    const { id } = req.params
    const { title } = updateTaskFormSchema.parse(req.body)

    await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        title,
        updated_at: new Date(),
      },
    })
  })

  app.delete('/task/:id', async (req) => {
    if (req.method !== 'DELETE') {
      return 'Method Invalid'
    }

    const { id } = req.params

    await prisma.tasks.delete({
      where: {
        id,
      },
    })
  })

  app.patch('/task/:id/complete', async (req) => {
    if (req.method !== 'PATCH') {
      return 'Method Invalid'
    }

    const { id } = req.params

    const isTaskCompleted = await prisma.tasks.findUnique({
      where: {
        id,
      },
    })

    if (isTaskCompleted?.completed_at) {
      await prisma.tasks.update({
        where: {
          id,
        },
        data: {
          completed_at: null,
        },
      })

      return
    }

    await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        completed_at: new Date(),
      },
    })
  })
}
