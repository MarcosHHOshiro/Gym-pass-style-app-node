import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-erros";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

// Request schema
export const authenticateBodySchema = z.object({
    email: z.string().email().describe('User email'),
    password: z.string().min(6).describe('User password')
});

// Response schemas
export const authenticateResponseSchema = z.object({
    token: z.string().describe('JWT access token (expires in 10 minutes)')
});

export const authenticateErrorSchema = z.object({
    message: z.string()
});

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({ email, password })

        const token = await reply.jwtSign(
            {
                role: user.role
            },
            {
                sign: {
                    sub: user.id,
                }
            }
        )

        const refreshToken = await reply.jwtSign(
            {
                role: user.role
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d',
                }
            }
        )

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: 'none',
                httpOnly: true,
            })
            .status(200)
            .send({
                token
            });
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message });
        }

        throw error;
    }
}