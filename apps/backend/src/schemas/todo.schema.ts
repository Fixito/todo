import z from 'zod';

export const todoSchema = z.object({
  text: z.string().min(1, 'Text must be at least 1 character long'),
});

export type CreateTodoInput = z.infer<typeof todoSchema>;
