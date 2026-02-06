import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

// Request schema
export const registerBodySchema = z.object({
    name: z.string().min(1).describe('Full name'),
    email: z.string().email().describe('Valid email address'),
    password: z.string().min(6).describe('Password (minimum 6 characters)')
});

// Response schemas
export const registerErrorSchema = z.object({
    message: z.string()
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const registerUseCase = makeRegisterUseCase()

        await registerUseCase.execute({ name, email, password })
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message });
        }

        throw error;
    }

    return reply.status(201).send();

}