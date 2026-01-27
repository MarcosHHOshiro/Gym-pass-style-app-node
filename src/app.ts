import { PrismaClient } from '@prisma/client/extension';
import fastify from 'fastify';

export const app = fastify();

const prisma = new PrismaClient()
