import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import { type FastifyReply, type FastifyRequest } from "fastify";
import z from "zod";
import { userSchema } from "../schemas/common";

// Response schema
export const profileResponseSchema = z.object({
    user: userSchema
});

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.execute({
        userId: request.user.sub,
    });

    return reply.status(200).send({
        user: {
            ...user,
            password_hash: undefined,
        }
    });
}