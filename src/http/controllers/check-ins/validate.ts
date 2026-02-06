import z from "zod";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";

// Request schema
export const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid().describe('Check-in ID to validate (UUID)')
});

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const { checkInId } = validateCheckInParamsSchema.parse(request.params)

    const validateCheckInUseCase = makeValidateCheckInUseCase()

    await validateCheckInUseCase.execute({
        checkInId
    })

    return reply.status(204).send();
}