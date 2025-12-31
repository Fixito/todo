import { EmailAlreadyExistsError } from '@/errors/index.js';

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
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }
}
