import { type FastifyReply, type FastifyRequest } from "fastify";
import z from "zod";

// Response schema
export const refreshResponseSchema = z.object({
    token: z.string().describe('Novo JWT token de acesso (expira em 10 minutos)')
});

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true })

    const { role } = request.user;

    const token = await reply.jwtSign(
        { role },
        {
            sign: {
                sub: request.user.sub
            }
        }
    )

    const refreshToken = await reply.jwtSign(
        { role },
        {
            sign: {
                sub: request.user.sub,
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

}