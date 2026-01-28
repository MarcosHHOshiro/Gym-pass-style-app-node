import { prisma } from "@/lib/prisma";
import type { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ name, email, password }: RegisterUseCaseRequest) {
        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new Error("Email already in use");
        }

        const password_hash = await hash(password, 6)
        await this.usersRepository.create({
            name,
            email,
            password_hash
        });

        return;
    }
}

