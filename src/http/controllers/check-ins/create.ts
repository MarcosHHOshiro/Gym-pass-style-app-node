import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.uuid()
    })

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine((val) => { return Math.abs(val) <= 90 }),
        longitude: z.number().refine((val) => { return Math.abs(val) <= 180 })
    })

    const { gymId } = createCheckInParamsSchema.parse(request.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    const createCheckInUseCase = makeCheckInUseCase()

    await createCheckInUseCase.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(201).send();
}