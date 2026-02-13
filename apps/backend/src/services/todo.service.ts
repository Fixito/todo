import type { PrismaClient } from '@/generated/prisma/client.js';

export default class TodoService {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserTodos(userId: string) {
    const todos = await this.prisma.todo.findMany({
      where: { userId },
      orderBy: { position: 'asc' },
    });

    return todos;
  }
}
