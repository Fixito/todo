import { compare } from 'bcryptjs';

import { EmailAlreadyExistsError, InvalidCredentialsError } from '@/errors/index.js';
import { Prisma, type PrismaClient } from '@/generated/prisma/client.js';

import type { JwtPayload } from '@/lib/jwt.js';
import type { RegisterInput } from '@/schemas/auth.schema.js';

type HashFunction = (password: string) => Promise<string>;
type SignTokenFunction = (payload: JwtPayload) => string;
export default class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly hashPassword: HashFunction,
    private readonly generateToken: SignTokenFunction,
  ) {}

  public async register(userInput: RegisterInput) {
    const hashedPassword = await this.hashPassword(userInput.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: userInput.email,
          password: hashedPassword,
        },
        select: { id: true, email: true },
      });

      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }

  public async login(userInput: RegisterInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: userInput.email },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await compare(userInput.password, user.password);

    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = this.generateToken(userWithoutPassword);
    return { user: userWithoutPassword, token };
  }
}
