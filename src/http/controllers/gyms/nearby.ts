import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { gymSchema } from "../schemas/common";

// Request schema
export const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((val) => Math.abs(val) <= 90).describe('User location latitude (-90 to 90)'),
    longitude: z.coerce.number().refine((val) => Math.abs(val) <= 180).describe('User location longitude (-180 to 180)')
});

// Response schema
export const nearbyGymsResponseSchema = z.object({
    gyms: z.array(gymSchema)
});

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

    const nearbyGymsUseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await nearbyGymsUseCase.execute({ userLatitude: latitude, userLongitude: longitude })

    return reply.status(200).send({
        gyms
    });
}