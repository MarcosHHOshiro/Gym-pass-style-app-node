import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { CheckInUseCase } from "./check-ins";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check In Use Case', () => {
    beforeEach(() => {
        checkInRepository = new InMemoryCheckInsRepository();
        sut = new CheckInUseCase(checkInRepository);
    })

    it('should be able to check in', async () => {
        const checkIn = await checkInRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        expect(checkIn.gym_id).toEqual(expect.any(String));
    })

})
