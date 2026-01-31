import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-ins";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { MaxNumberOfCheckinsError } from "./errors/max-number-of-checkins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check In Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -22.2348294,
            longitude: -54.8181412
        })

        vi.useFakeTimers();
    })

    afterEach(() => {
        vi.useRealTimers();
    })

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.2348294,
            userLongitude: -54.8181412
        });

        expect(checkIn.id).toEqual(expect.any(String));
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.2348294,
            userLongitude: -54.8181412
        });

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.2348294,
            userLongitude: -54.8181412
        })).rejects.toBeInstanceOf(MaxNumberOfCheckinsError);
    })

    it('should be able to check in twice but on different days', async () => {
        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.2348294,
            userLongitude: -54.8181412
        });

        vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.2348294,
            userLongitude: -54.8181412
        })

        expect(checkIn.id).toEqual(expect.any(String));
    })

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-22.0787138),
            longitude: new Decimal(-54.7773697)
        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -22.2348294,
                userLongitude: -54.8181412
            })
        ).rejects.toBeInstanceOf(MaxDistanceError);
    })

})
