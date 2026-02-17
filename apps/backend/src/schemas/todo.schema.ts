import z from 'zod';

export const todoSchema = z.object({
  text: z
    .string()
    .min(1, 'Text must be at least 1 character long')
    .max(500, 'Text must not exceed 500 characters'),
});

export const todoParamsSchema = z.object({
  id: z.cuid(),
});

export const updateTodoSchema = z
  .object({
    text: z.string().min(1).max(500).optional(),
    position: z.number().int().min(0).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateTodoInput = z.infer<typeof todoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
