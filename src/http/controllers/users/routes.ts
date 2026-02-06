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

    // POST /users - Registro de usuário
    appWithType.post('/users', {
        schema: {
            summary: 'Registrar novo usuário',
            description: 'Cria um novo usuário no sistema com email único',
            tags: ['users'],
            body: registerBodySchema,
            response: {
                201: z.object({}).describe('Usuário registrado com sucesso'),
                409: registerErrorSchema.describe('Email já cadastrado'),
                400: validationErrorSchema.describe('Erro de validação dos dados'),
            },
        }
    }, register);

    // POST /sessions - Autenticação
    appWithType.post('/sessions', {
        schema: {
            summary: 'Autenticar usuário',
            description: 'Realiza login e retorna token JWT. Refresh token é enviado em cookie httpOnly',
            tags: ['users'],
            body: authenticateBodySchema,
            response: {
                200: authenticateResponseSchema.describe('Autenticação bem-sucedida. Refresh token enviado em cookie'),
                400: authenticateErrorSchema.describe('Credenciais inválidas'),
            },
        }
    }, authenticate);

    // PATCH /token/refresh - Renovar token
    appWithType.patch('/token/refresh', {
        schema: {
            summary: 'Renovar token de acesso',
            description: 'Gera novo token JWT usando refresh token do cookie. Novo refresh token também é enviado',
            tags: ['users'],
            security: [{ cookieAuth: [] }],
            response: {
                200: refreshResponseSchema.describe('Token renovado com sucesso. Novo refresh token enviado em cookie'),
                401: unauthorizedErrorSchema.describe('Refresh token inválido ou expirado'),
            },
        }
    }, refresh);

    // GET /me - Perfil do usuário
    appWithType.get('/me', {
        onRequest: [verifyJwt],
        schema: {
            summary: 'Obter perfil do usuário autenticado',
            description: 'Retorna dados completos do usuário logado (requer autenticação JWT)',
            tags: ['users'],
            security: [{ bearerAuth: [] }],
            response: {
                200: profileResponseSchema.describe('Perfil do usuário'),
                401: unauthorizedErrorSchema.describe('Token JWT inválido ou expirado'),
            },
        }
    }, profile);
}