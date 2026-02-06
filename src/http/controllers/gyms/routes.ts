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

    // GET /gyms/search - Pesquisar academias
    appWithType.get('/gyms/search', {
        schema: {
            summary: 'Pesquisar academias por nome',
            description: 'Busca academias filtrando pelo nome. Resultados paginados com 20 itens por página',
            tags: ['gyms'],
            security: [{ bearerAuth: [] }],
            querystring: searchGymQuerySchema,
            response: {
                200: searchGymResponseSchema.describe('Lista de academias encontradas'),
                401: unauthorizedErrorSchema.describe('Token JWT inválido ou expirado'),
                400: validationErrorSchema.describe('Erro de validação dos parâmetros'),
            },
        }
    }, search);

    // GET /gyms/nearby - Buscar academias próximas
    appWithType.get('/gyms/nearby', {
        schema: {
            summary: 'Buscar academias próximas',
            description: 'Retorna academias em um raio de até 10km da localização fornecida',
            tags: ['gyms'],
            security: [{ bearerAuth: [] }],
            querystring: nearbyGymsQuerySchema,
            response: {
                200: nearbyGymsResponseSchema.describe('Lista de academias próximas (até 10km)'),
                401: unauthorizedErrorSchema.describe('Token JWT inválido ou expirado'),
                400: validationErrorSchema.describe('Erro de validação dos parâmetros'),
            },
        }
    }, nearby);

    // POST /gyms - Criar academia (ADMIN only)
    appWithType.post('/gyms', {
        onRequest: [verifyUserRole('ADMIN')],
        schema: {
            summary: 'Criar nova academia',
            description: 'Registra uma nova academia no sistema. **Requer permissão de ADMIN**',
            tags: ['gyms'],
            security: [{ bearerAuth: [] }],
            body: createGymBodySchema,
            response: {
                201: z.object({}).describe('Academia criada com sucesso'),
                401: unauthorizedErrorSchema.describe('Token inválido, expirado ou usuário não é ADMIN'),
                400: validationErrorSchema.describe('Erro de validação dos dados'),
            },
        }
    }, create);
}