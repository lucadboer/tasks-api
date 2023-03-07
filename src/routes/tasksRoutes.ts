import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../libs/prisma'
import { checkTaskIdExist } from '../utils/check-task-id-exist'

export async function tasksRoutes(app: FastifyInstance) {
  const taskIdParams = z.object({
    id: z.string().uuid(),
  })

  app.post('/task', async (req, reply) => {
    const tasksFormSchema = z.object({
      title: z.string({ required_error: 'Title cannot is nullable' }).min(3),
      description: z.string({
        required_error: 'Description cannot is nullable',
      }),
    })

    if (req.method !== 'POST') {
      return reply.status(405)
    }

    const task = tasksFormSchema.parse(req.body)

    const { title, description } = task

    const isTaskExist = await prisma.tasks.findFirst({
      where: {
        title,
      },
    })

    if (isTaskExist) {
      return reply.status(409).send({
        message: 'Task already exist',
      })
    }

    await prisma.tasks.create({
      data: {
        title,
        description,
      },
    })
  })

  app.get('/task', async (req, reply) => {
    if (req.method !== 'GET') {
      return reply.status(405)
    }

    const tasks = await prisma.tasks.findMany()

    reply.send({
      tasks,
    })
  })

  app.put('/task/:id', async (req, reply) => {
    const updateTaskFormSchema = z.object({
      title: z.string().min(3),
    })

    if (req.method !== 'PUT') {
      return reply.status(405)
    }

    const { id } = taskIdParams.parse(req.params)
    const { title } = updateTaskFormSchema.parse(req.body)

    const isTaskExist = await checkTaskIdExist(id)

    if (!isTaskExist) {
      return reply.status(404).send({
        message: 'There is no task with that id',
      })
    }

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

  app.delete('/task/:id', async (req, reply) => {
    if (req.method !== 'DELETE') {
      return reply.status(405)
    }

    const { id } = taskIdParams.parse(req.params)

    const isTaskExist = await checkTaskIdExist(id)

    if (!isTaskExist) {
      return reply.status(404).send({
        message: 'There is no task with that id',
      })
    }

    await prisma.tasks.delete({
      where: {
        id,
      },
    })
  })

  app.patch('/task/:id/complete', async (req, reply) => {
    if (req.method !== 'PATCH') {
      return reply.status(405)
    }

    const { id } = taskIdParams.parse(req.params)

    const isTaskExist = await checkTaskIdExist(id)

    if (!isTaskExist) {
      return reply.status(404).send({
        message: 'There is no task with that id',
      })
    }

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
