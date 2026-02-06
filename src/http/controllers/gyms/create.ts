import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

// Request schema
export const createGymBodySchema = z.object({
    title: z.string().min(1).describe('Nome da academia'),
    description: z.string().optional().describe('Descrição da academia'),
    phone: z.string().optional().describe('Telefone de contato'),
    latitude: z.number().refine((val) => Math.abs(val) <= 90).describe('Latitude da localização (-90 a 90)'),
    longitude: z.number().refine((val) => Math.abs(val) <= 180).describe('Longitude da localização (-180 a 180)')
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)

    const createGymUseCase = makeCreateGymUseCase()

    await createGymUseCase.execute({ title, description, phone, latitude, longitude })

    return reply.status(201).send();
}