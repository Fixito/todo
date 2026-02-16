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

  async createTodo(userId: string, text: string) {
    const maxPosition = await this.prisma.todo.aggregate({
      where: { userId },
      _max: { position: true },
    });

    const newPosition = (maxPosition._max.position ?? -1) + 1;

    const todo = await this.prisma.todo.create({
      data: {
        text,
        userId,
        position: newPosition,
      },
    });

    return todo;
  }
}
