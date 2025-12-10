import process from 'node:process';

import { config } from 'dotenv';
import z from 'zod';

config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  LOG_LEVEL: z.enum(['debug', 'error', 'fatal', 'info', 'silent', 'trace', 'warn']).default('info'),
});

export type Env = z.infer<typeof EnvSchema>;

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
  // biome-ignore lint/suspicious/noConsole: only used to log critical env validation errors before process exit
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(z.treeifyError(result.error).properties, null, 2),
  );
  process.exit(1);
}

export default result.data;
