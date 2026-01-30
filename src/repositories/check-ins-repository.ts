import type { CheckIn, Prisma } from "generated/prisma/client";

export interface CheckInsRepository {
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
    findByUserIdOnDate(userId: string, date: Date): Promise<Prisma.CheckInUncheckedCreateInput | null>;

}