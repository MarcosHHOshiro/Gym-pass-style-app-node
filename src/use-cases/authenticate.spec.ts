import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-erros";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    })

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('securepassword123', 6),
        });

        const { user } = await sut.execute({
            email: 'john.doe@example.com',
            password: 'securepassword123'
        })

        expect(user.id).toEqual(expect.any(String));
    })

    it('should not be able to authenticate with wrong email', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('securepassword123', 6),
        })

        await expect(
            sut.execute({
                email: 'john2.doe@example.com',
                password: 'securepassword123',
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('securepassword123', 6),
        })

        await expect(
            sut.execute({
                email: 'john.doe@example.com',
                password: 'wrong-password',
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})
