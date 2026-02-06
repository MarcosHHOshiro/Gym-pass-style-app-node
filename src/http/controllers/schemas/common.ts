import z from 'zod';

// User schema (baseado no Prisma model)
export const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'MEMBER']),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

// Gym schema (baseado no Prisma model)
export const gymSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.union([z.number(), z.any()]).transform(val => typeof val === 'number' ? val : Number(val)),
    longitude: z.union([z.number(), z.any()]).transform(val => typeof val === 'number' ? val : Number(val)),
});

// CheckIn schema (baseado no Prisma model)
export const checkInSchema = z.object({
    id: z.string().uuid(),
    created_at: z.coerce.date(),
    validated_at: z.coerce.date().nullable(),
    user_id: z.string().uuid(),
    gym_id: z.string().uuid(),
});

// Schemas de erro comuns
export const unauthorizedErrorSchema = z.object({
    message: z.string(),
}).describe('Token inválido, expirado ou usuário não possui permissão');

export const validationErrorSchema = z.object({
    message: z.string(),
    issues: z.any(),
}).describe('Erro de validação dos dados enviados');
