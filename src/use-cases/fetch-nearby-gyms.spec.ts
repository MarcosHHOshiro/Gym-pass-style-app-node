import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymUseCase } from "./search-gyms";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    })

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -22.2348294,
            longitude: -54.8181412,
        });

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -22.0856722,
            longitude: -54.5043123,
        });

        const { gyms } = await sut.execute({
            userLatitude: -22.2348294,
            userLongitude: -54.8181412
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ]);
    })

})
