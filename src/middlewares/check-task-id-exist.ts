import { prisma } from '../libs/prisma'

export async function checkTaskIdExist(id: string) {
  const taskId = await prisma.tasks.findFirst({
    where: {
      id,
    },
  })

  return taskId
}
