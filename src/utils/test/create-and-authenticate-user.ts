import request from 'supertest';
import type { FastifyInstance } from 'fastify';
import { hash } from 'bcryptjs';

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
    await request(app.server)
        .post('/users')
        .send({
            name: 'John Doe',
            email: 'john6.doe@example.com',
            password: await hash('123456', 6),
            role: isAdmin ? 'ADMIN' : 'USER'
        });

    const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            name: 'John Doe',
            email: 'john6.doe@example.com',
            password: '123456'
        });

    const { token } = authResponse.body;

    return { token };
}