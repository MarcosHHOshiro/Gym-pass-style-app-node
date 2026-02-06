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

    // GET /check-ins/history - Histórico de check-ins do usuário
    appWithType.get('/check-ins/history', {
        schema: {
            summary: 'Histórico de check-ins do usuário',
            description: 'Retorna o histórico paginado de todos os check-ins realizados pelo usuário autenticado',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            querystring: checkInHistoryQuerySchema,
            response: {
                200: checkInHistoryResponseSchema.describe('Lista de check-ins do usuário'),
                401: unauthorizedErrorSchema.describe('Token JWT inválido ou expirado'),
                400: validationErrorSchema.describe('Erro de validação dos parâmetros'),
            },
        }
    }, history);

    // GET /check-ins/metrics - Métricas de check-ins do usuário
    appWithType.get('/check-ins/metrics', {
        schema: {
            summary: 'Métricas de check-ins',
            description: 'Retorna o número total de check-ins realizados pelo usuário autenticado',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            response: {
                200: metricsResponseSchema.describe('Contagem total de check-ins'),
                401: unauthorizedErrorSchema.describe('Token JWT inválido ou expirado'),
            },
        }
    }, metrics);

    // POST /gyms/:gymId/check-ins - Criar check-in
    appWithType.post('/gyms/:gymId/check-ins', {
        schema: {
            summary: 'Realizar check-in em uma academia',
            description: 'Registra um check-in do usuário em uma academia. O usuário deve estar a no máximo 100m da academia e não pode fazer mais de um check-in no mesmo dia',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            params: createCheckInParamsSchema,
            body: createCheckInBodySchema,
            response: {
                201: z.object({}).describe('Check-in realizado com sucesso'),
                401: unauthorizedErrorSchema.describe('Token JWT inválido ou expirado'),
                400: validationErrorSchema.describe('Erro de validação ou regra de negócio (distância máxima, check-in duplicado)'),
            },
        }
    }, create);

    // PATCH /check-ins/:checkInId/validate - Validar check-in (ADMIN only)
    appWithType.patch('/check-ins/:checkInId/validate', {
        onRequest: [verifyUserRole('ADMIN')],
        schema: {
            summary: 'Validar check-in',
            description: 'Valida um check-in existente. **Requer permissão de ADMIN**. Check-in só pode ser validado até 20 minutos após sua criação',
            tags: ['check-ins'],
            security: [{ bearerAuth: [] }],
            params: validateCheckInParamsSchema,
            response: {
                204: z.void().describe('Check-in validado com sucesso'),
                401: unauthorizedErrorSchema.describe('Token inválido, expirado ou usuário não é ADMIN'),
                400: validationErrorSchema.describe('Erro de validação ou check-in expirado (mais de 20 minutos)'),
            },
        }
    }, validate);
}