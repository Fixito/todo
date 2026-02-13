import { signToken } from '@/lib/jwt.js';
import { hash } from '@/lib/password.js';
import { prisma } from '@/lib/prisma.js';

import AuthService from '@/services/auth.service.js';
import TodoService from '@/services/todo.service.js';

export const authService = new AuthService(prisma, hash, signToken);
export const todoService = new TodoService(prisma);
