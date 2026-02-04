import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.number().refine((val) => { return Math.abs(val) <= 90 }),
        longitude: z.number().refine((val) => { return Math.abs(val) <= 180 })
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

    const nearbyGymsUseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await nearbyGymsUseCase.execute({ userLatitude: latitude, userLongitude: longitude })

    return reply.status(200).send({
        gyms
    });
}