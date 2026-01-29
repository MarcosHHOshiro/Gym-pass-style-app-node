import type { CheckIn, Prisma } from "generated/prisma/client";

export interface CheckInsRepository {
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
}