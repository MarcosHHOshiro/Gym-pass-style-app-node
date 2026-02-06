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
            description: 'API RESTful para gerenciamento de check-ins em academias, inspirada no modelo de negócio do GymPass. Permite que usuários se cadastrem, busquem academias próximas e realizem check-ins. Administradores podem cadastrar academias e validar check-ins.',
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
                    description: 'JWT token obtido através do endpoint /sessions (expira em 10 minutos)',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                    description: 'Refresh token armazenado em cookie httpOnly (expira em 7 dias)',
                },
            },
        },
        tags: [
            { name: 'users', description: 'Operações relacionadas a usuários' },
            { name: 'gyms', description: 'Operações relacionadas a academias' },
            { name: 'check-ins', description: 'Operações relacionadas a check-ins' },
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
    staticCSP: true,
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