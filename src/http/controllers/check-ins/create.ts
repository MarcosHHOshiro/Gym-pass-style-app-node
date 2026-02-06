import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

// Request schemas
export const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid().describe('ID da academia (UUID)')
});

export const createCheckInBodySchema = z.object({
    latitude: z.number().refine((val) => Math.abs(val) <= 90).describe('Latitude da localização do usuário (-90 a 90)'),
    longitude: z.number().refine((val) => Math.abs(val) <= 180).describe('Longitude da localização do usuário (-180 a 180)')
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
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