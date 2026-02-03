import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-ins";
import { ResourceNotFoundError } from "./errors/resource-not-found-errors";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-erros";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check In Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInRepository);

        vi.useFakeTimers();
    })

    afterEach(() => {
        vi.useRealTimers();
    })

    it('should be able to validate a check in', async () => {
        const createdCheckIn = await checkInRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
    })

    it('should not be able to validate an inexistent check in', async () => {
        await expect(() =>
            sut.execute({
                checkInId: 'Inexisting-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    })

    it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2024, 0, 1, 13, 40)); // Jan 1, 2024, 13:40

        const createdCheckIn = await checkInRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        vi.advanceTimersByTime(21 * 60 * 1000); // Advance time by 21 minutes

        await expect(() =>
            sut.execute({
                checkInId: createdCheckIn.id
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError);
    })
})
