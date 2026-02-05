import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to search a gym', async () => {
        const { token } = await createAndAuthenticateUser(app);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Test',
                description: 'A test gym',
                phone: '1234567890',
                latitude: -23.55052,
                longitude: -46.633308
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Test 2',
                description: 'A test gym 2',
                phone: '1234567890',
                latitude: -23.55052,
                longitude: -46.633308
            });

        const response = await request(app.server)
            .get('/gyms/search')
            .query({ q: 'Gym Test' })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(2);
        expect(response.body.gyms).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: 'Gym Test' }),
                expect.objectContaining({ title: 'Gym Test 2' }),
            ]),
        )
    })
})