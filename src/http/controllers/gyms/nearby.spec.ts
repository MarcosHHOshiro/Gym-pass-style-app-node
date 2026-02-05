import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Test',
                description: 'A test gym',
                phone: '1234567890',
                latitude: -22.2348294,
                longitude: -54.8181412,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Test 2',
                description: 'A test gym 2',
                phone: '1234567890',
                latitude: -22.0856722,
                longitude: -54.5043123,
            });

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -22.2348294,
                longitude: -54.8181412,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200);

    })
})