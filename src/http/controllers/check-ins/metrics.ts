import { type FastifyReply, type FastifyRequest } from "fastify";
import z from "zod";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

// Response schema
export const metricsResponseSchema = z.object({
    checkInsCount: z.number().describe('Total number of check-ins made by the user')
});

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()

    const { checkInsCount } = await getUserMetricsUseCase.execute({
        userId: request.user.sub
    })

    return reply.status(200).send({
        checkInsCount
    });
}