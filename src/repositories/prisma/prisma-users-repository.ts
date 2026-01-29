import { prisma } from "@/lib/prisma";
import type { Prisma, User } from "generated/prisma/client";

import type { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data,
        });

        return user;
    }
}