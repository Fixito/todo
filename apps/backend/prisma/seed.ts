import bcrypt from 'bcryptjs';

import { prisma } from '../src/lib/prisma.js';

async function main() {
  const password = await bcrypt.hash('secret123', 10);

  // Create a test user with todos
  const user = await prisma.user.create({
    data: {
      email: 'test-user@todo.dev',
      password,
      todos: {
        create: [
          { text: 'Première tâche', completed: false, position: 0 },
          { text: 'Deuxième tâche', completed: true, position: 1 },
          { text: 'Troisième tâche', completed: false, position: 2 },
        ],
      },
    },
    include: {
      todos: true,
    },
  });

  // biome-ignore lint/suspicious/noConsole: needed for seeding
  console.log('Created user:', user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // biome-ignore lint/suspicious/noConsole: needed for seeding
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
