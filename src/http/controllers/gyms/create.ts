import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().optional(),
        phone: z.string().optional(),
        latitude: z.number().refine((val) => { return Math.abs(val) <= 90 }),
        longitude: z.number().refine((val) => { return Math.abs(val) <= 180 })
    })

    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)

    const createGymUseCase = makeCreateGymUseCase()

    await createGymUseCase.execute({ title, description, phone, latitude, longitude })

    return reply.status(201).send();
}