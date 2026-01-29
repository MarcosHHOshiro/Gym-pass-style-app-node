import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    })

    it('should be able to register', async () => {
        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'securepassword123'
        })

        expect(user.id).toEqual(expect.any(String));
    })

    it('should hash user password upon registration', async () => {
        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'securepassword123'
        })

        const isPasswordCorrectlyHashed = await compare(
            'securepassword123',
            user.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true);
    })

    it('should not be able to register with an already used email', async () => {
        const email = 'john.doe@example.com';

        await sut.execute({
            name: 'John Doe',
            email,
            password: 'securepassword123'
        })

        await expect(() =>
            sut.execute({
                name: 'John Doe',
                email,
                password: 'securepassword123'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    })
})