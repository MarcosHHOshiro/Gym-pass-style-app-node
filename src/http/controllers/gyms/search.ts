import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import { gymSchema } from "../schemas/common";

// Request schema
export const searchGymQuerySchema = z.object({
    q: z.string().min(1).describe('Search term to filter gyms by name'),
    page: z.coerce.number().min(1).default(1).describe('Page number for pagination (20 items per page)'),
});

// Response schema
export const searchGymResponseSchema = z.object({
    gyms: z.array(gymSchema)
});

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const { q, page } = searchGymQuerySchema.parse(request.query)

    const searchGymUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchGymUseCase.execute({ query: q, page })

    return reply.status(200).send({
        gyms
    });
}