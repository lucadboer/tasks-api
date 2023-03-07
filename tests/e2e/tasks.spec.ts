import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'

describe('Tasks', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create new task', async () => {
    await request(app.server)
      .post('/task')
      .send({
        title: 'Test Vitest',
        description: 'Testing...',
      })
      .expect(201)
  })

  it('should be able to list tasks', async () => {
    await request(app.server).get('/task').expect(200)
  })

  // it('should be able to create new task', async () => {
  //   const task = await prisma.tasks.create({
  //     data: {
  //       title: 'Test Vitest',
  //       description: 'Testing...',
  //     },
  //   })

  //   expect(task).toEqual(
  //     expect.objectContaining({
  //       title: 'Test Vitest',
  //       description: 'Testing...',
  //     }),
  //   )
  // })
})
