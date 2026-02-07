import fastify from 'fastify';
import z, { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { checkInsRoutes } from './http/controllers/check-ins/routes';
import fastifyCookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    }
})

app.register(fastifyCookie)

// Type provider Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Swagger plugin
app.register(swagger, {
    openapi: {
        info: {
            title: 'GymPass Style API',
            description: 'RESTful API for managing gym check-ins, inspired by the GymPass business model. Allows users to register, search for nearby gyms and check-in. Administrators can register gyms and validate check-ins.',
            version: '1.0.0',
            contact: {
                name: 'API Support',
                url: 'https://github.com/MarcosHHOshiro/Gym-pass-style-app-node',
            },
        },
        servers: [
            {
                url: 'http://localhost:3333',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token obtained through /sessions endpoint (expires in 10 minutes)',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                    description: 'Refresh token stored in httpOnly cookie (expires in 7 days)',
                },
            },
        },
        tags: [
            { name: 'users', description: 'User-related operations' },
            { name: 'gyms', description: 'Gym-related operations' },
            { name: 'check-ins', description: 'Check-in-related operations' },
        ],
    },
    transform: jsonSchemaTransform,
});

// Swagger UI
app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
    },
    staticCSP: false,
});

// Registrar rotas após Swagger
app.after(() => {
    app.register(usersRoutes);
    app.register(gymsRoutes);
    app.register(checkInsRoutes);
});

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: "Validation error",
            issues: z.treeifyError(error),
        });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {

    }

    return reply.status(500).send({
        message: "Internal server error.",
    });
})