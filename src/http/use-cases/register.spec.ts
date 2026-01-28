import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe('Register Use Case', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'securepassword123'
        })

        expect(user.id).toEqual(expect.any(String));
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
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
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const email = 'john.doe@example.com';

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: 'securepassword123'
        })

        await expect(() =>
            registerUseCase.execute({
                name: 'John Doe',
                email,
                password: 'securepassword123'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    })
})