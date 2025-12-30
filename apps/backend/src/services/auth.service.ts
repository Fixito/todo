import { EmailAlreadyExistsError } from '@/errors/index.js';

import { signToken } from '@/lib/jwt.js';
import { hash } from '@/lib/password.js';
import { prisma } from '@/lib/prisma.js';

import type { RegisterInput } from '@/schemas/auth.schema.js';

export default class AuthService {
  public async register(userInput: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userInput.email },
    });

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await hash(userInput.password);

    const user = await prisma.user.create({
      data: {
        email: userInput.email,
        password: hashedPassword,
      },
      select: { id: true, email: true },
    });

    const token = signToken(user);

    return { user, token };
  }
}
