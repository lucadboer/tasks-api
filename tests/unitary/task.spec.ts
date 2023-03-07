import { describe, expect, it } from 'vitest'
import { prisma } from '../../src/libs/prisma'

describe('Tasks', () => {
  it('should be able to create new task', async () => {
    const task = await prisma.tasks.create({
      data: {
        title: 'Test Vitest',
        description: 'Testing...',
      },
    })
    expect(task).toEqual(
      expect.objectContaining({
        title: 'Test Vitest',
        description: 'Testing...',
      }),
    )
  })

  // it('should be able to list tasks', async () => {
  //   const task = await prisma.tasks.findMany()
  // })
})
