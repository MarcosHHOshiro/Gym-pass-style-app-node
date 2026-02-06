import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { checkInSchema } from "../schemas/common";

// Request schema
export const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).describe('Número da página para paginação (20 itens por página)'),
});

// Response schema
export const checkInHistoryResponseSchema = z.object({
    checkIns: z.array(checkInSchema)
});

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const { page } = checkInHistoryQuerySchema.parse(request.query)

    const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
        userId: request.user.sub, page
    })

    return reply.status(200).send({
        checkIns
    });
}