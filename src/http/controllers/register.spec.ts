import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import request from 'supertest';
import { prisma } from '@/lib/prisma';

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to register', async () => {

        const result = await prisma.$queryRawUnsafe(`select current_schema() as schema`)
        console.log(result)
        const response = await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john6.doe@example.com',
                password: '123456'
            });

        expect(response.statusCode).toEqual(201);
    })
})