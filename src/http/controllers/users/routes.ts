import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { register, registerBodySchema, registerErrorSchema } from "./register";
import { authenticate, authenticateBodySchema, authenticateResponseSchema, authenticateErrorSchema } from "./authenticate";
import { profile, profileResponseSchema } from "./profile";
import { verifyJwt } from "../../middleware/verify-jwt";
import { refresh, refreshResponseSchema } from "./refresh";
import { unauthorizedErrorSchema, validationErrorSchema } from "../schemas/common";

export async function usersRoutes(app: FastifyInstance) {
    const appWithType = app.withTypeProvider<ZodTypeProvider>();

    // POST /users - User registration
    appWithType.post('/users', {
        schema: {
            summary: 'Register new user',
            description: 'Creates a new user in the system with unique email',
            tags: ['users'],
            body: registerBodySchema,
            response: {
                201: z.object({}).describe('User registered successfully'),
                409: registerErrorSchema.describe('Email already registered'),
                400: validationErrorSchema.describe('Data validation error'),
            },
        }
    }, register);

    // POST /sessions - Authentication
    appWithType.post('/sessions', {
        schema: {
            summary: 'Authenticate user',
            description: 'Performs login and returns JWT token. Refresh token is sent in httpOnly cookie',
            tags: ['users'],
            body: authenticateBodySchema,
            response: {
                200: authenticateResponseSchema.describe('Authentication successful. Refresh token sent in cookie'),
                400: authenticateErrorSchema.describe('Invalid credentials'),
            },
        }
    }, authenticate);

    // PATCH /token/refresh - Refresh token
    appWithType.patch('/token/refresh', {
        schema: {
            summary: 'Refresh access token',
            description: 'Generates new JWT token using refresh token from cookie. New refresh token is also sent',
            tags: ['users'],
            security: [{ cookieAuth: [] }],
            response: {
                200: refreshResponseSchema.describe('Token refreshed successfully. New refresh token sent in cookie'),
                401: unauthorizedErrorSchema.describe('Invalid or expired refresh token'),
            },
        }
    }, refresh);

    // GET /me - User profile
    appWithType.get('/me', {
        onRequest: [verifyJwt],
        schema: {
            summary: 'Get authenticated user profile',
            description: 'Returns complete data of the logged in user (requires JWT authentication)',
            tags: ['users'],
            security: [{ bearerAuth: [] }],
            response: {
                200: profileResponseSchema.describe('User profile'),
                401: unauthorizedErrorSchema.describe('Invalid or expired JWT token'),
            },
        }
    }, profile);
}