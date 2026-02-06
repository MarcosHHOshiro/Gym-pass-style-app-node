import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { verifyJwt } from "../../middleware/verify-jwt";
import { create, createCheckInParamsSchema, createCheckInBodySchema } from "./create";
import { validate, validateCheckInParamsSchema } from "./validate";
import { history, checkInHistoryQuerySchema, checkInHistoryResponseSchema } from "./history";
import { metrics, metricsResponseSchema } from "./metrics";
import { verifyUserRole } from "@/http/middleware/verify-user-role";
import { unauthorizedErrorSchema, validationErrorSchema } from "../schemas/common";

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt);

    const appWithType = app.withTypeProvider<ZodTypeProvider>();

    // GET /check-ins/history - User check-in history
    appWithType.get('/check-ins/history', {
        schema: {
            summary: 'User check-in history',
            description: 'Returns paginated history of all check-ins made by the authenticated user',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            querystring: checkInHistoryQuerySchema,
            response: {
                200: checkInHistoryResponseSchema.describe('List of user check-ins'),
                401: unauthorizedErrorSchema.describe('Invalid or expired JWT token'),
                400: validationErrorSchema.describe('Parameter validation error'),
            },
        }
    }, history);

    // GET /check-ins/metrics - Check-in metrics
    appWithType.get('/check-ins/metrics', {
        schema: {
            summary: 'Check-in metrics',
            description: 'Returns the total number of check-ins made by the authenticated user',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            response: {
                200: metricsResponseSchema.describe('Total check-in count'),
                401: unauthorizedErrorSchema.describe('Invalid or expired JWT token'),
            },
        }
    }, metrics);

    // POST /gyms/:gymId/check-ins - Create check-in
    appWithType.post('/gyms/:gymId/check-ins', {
        schema: {
            summary: 'Check-in at a gym',
            description: 'Registers a user check-in at a gym. User must be within 100m of the gym and cannot check-in more than once on the same day',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            params: createCheckInParamsSchema,
            body: createCheckInBodySchema,
            response: {
                201: z.object({}).describe('Check-in successful'),
                401: unauthorizedErrorSchema.describe('Invalid or expired JWT token'),
                400: validationErrorSchema.describe('Validation or business rule error (max distance, duplicate check-in)'),
            },
        }
    }, create);

    // PATCH /check-ins/:checkInId/validate - Validate check-in (ADMIN only)
    appWithType.patch('/check-ins/:checkInId/validate', {
        onRequest: [verifyUserRole('ADMIN')],
        schema: {
            summary: 'Validate check-in',
            description: 'Validates an existing check-in. **Requires ADMIN permission**. Check-in can only be validated within 20 minutes after creation',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            params: validateCheckInParamsSchema,
            response: {
                204: z.void().describe('Check-in validated successfully'),
                401: unauthorizedErrorSchema.describe('Invalid or expired token, or user is not ADMIN'),
                400: validationErrorSchema.describe('Validation error or expired check-in (more than 20 minutes)'),
            },
        }
    }, validate);
}