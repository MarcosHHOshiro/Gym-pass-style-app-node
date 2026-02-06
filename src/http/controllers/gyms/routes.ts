import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { verifyJwt } from "../../middleware/verify-jwt";
import { search, searchGymQuerySchema, searchGymResponseSchema } from "./search";
import { nearby, nearbyGymsQuerySchema, nearbyGymsResponseSchema } from "./nearby";
import { create, createGymBodySchema } from "./create";
import { verifyUserRole } from "@/http/middleware/verify-user-role";
import { unauthorizedErrorSchema, validationErrorSchema } from "../schemas/common";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt);

    const appWithType = app.withTypeProvider<ZodTypeProvider>();

    // GET /gyms/search - Search gyms
    appWithType.get('/gyms/search', {
        schema: {
            summary: 'Search gyms by name',
            description: 'Search for gyms filtering by name. Results paginated with 20 items per page',
            tags: ['gyms'],
            security: [{ bearerAuth: [] }],
            querystring: searchGymQuerySchema,
            response: {
                200: searchGymResponseSchema.describe('List of gyms found'),
                401: unauthorizedErrorSchema.describe('Invalid or expired JWT token'),
                400: validationErrorSchema.describe('Parameter validation error'),
            },
        }
    }, search);

    // GET /gyms/nearby - Find nearby gyms
    appWithType.get('/gyms/nearby', {
        schema: {
            summary: 'Find nearby gyms',
            description: 'Returns gyms within a 10km radius of the provided location',
            tags: ['gyms'],
            security: [{ bearerAuth: [] }],
            querystring: nearbyGymsQuerySchema,
            response: {
                200: nearbyGymsResponseSchema.describe('List of nearby gyms (up to 10km)'),
                401: unauthorizedErrorSchema.describe('Invalid or expired JWT token'),
                400: validationErrorSchema.describe('Parameter validation error'),
            },
        }
    }, nearby);

    // POST /gyms - Create gym (ADMIN only)
    appWithType.post('/gyms', {
        onRequest: [verifyUserRole('ADMIN')],
        schema: {
            summary: 'Create new gym',
            description: 'Registers a new gym in the system. **Requires ADMIN permission**',
            tags: ['gyms'],
            security: [{ bearerAuth: [] }],
            body: createGymBodySchema,
            response: {
                201: z.object({}).describe('Gym created successfully'),
                401: unauthorizedErrorSchema.describe('Invalid or expired token, or user is not ADMIN'),
                400: validationErrorSchema.describe('Data validation error'),
            },
        }
    }, create);
}