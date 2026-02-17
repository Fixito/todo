import { ForbiddenError, NotFoundError } from '@/errors/index.js';

import type { PrismaClient } from '@/generated/prisma/client.js';
import type { UpdateTodoInput } from '@/schemas/todo.schema.js';

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
    const todo = await this.prisma.$transaction(async (tx) => {
      const maxPosition = await tx.todo.aggregate({
        where: { userId },
        _max: { position: true },
      });

      const newPosition = (maxPosition._max.position ?? -1) + 1;

      return await tx.todo.create({
        data: {
          text,
          userId,
          position: newPosition,
        },
      });
    });

    return todo;
  }

  async updateTodo(userId: string, todoId: string, data: UpdateTodoInput) {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new NotFoundError('Todo');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenError();
    }

    const updatedTodo = await this.prisma.todo.update({
      where: { id: todoId },
      data,
    });

    return updatedTodo;
  }

  async deleteTodo(userId: string, todoId: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new NotFoundError('Todo');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenError();
    }

    await this.prisma.todo.delete({
      where: { id: todoId },
    });
  }
}
