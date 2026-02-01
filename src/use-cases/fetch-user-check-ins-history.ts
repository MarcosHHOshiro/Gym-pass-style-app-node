import type { CheckIn } from "generated/prisma/client";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-errors";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckinsError } from "./errors/max-number-of-checkins-error";

interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string;

}

interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
    ) { }

    async execute({
        userId
    }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const distance = getDistanceBetweenCoordinates(
            {
                latitude: userLatitude,
                longitude: userLongitude
            },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber()
            }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1;

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError();
        }

        const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

        if (checkInOnSameDate) {
            throw new MaxNumberOfCheckinsError();
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        });

        return {
            checkIn
        }
    }
}