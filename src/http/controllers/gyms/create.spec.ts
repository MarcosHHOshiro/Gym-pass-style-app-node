import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Test',
                description: 'A test gym',
                phone: '1234567890',
                latitude: -23.55052,
                longitude: -46.633308
            });

        expect(response.statusCode).toEqual(201);
    })
})