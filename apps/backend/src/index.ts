import { createApp } from './app.js';
import env from './config/env.js';
import { logger } from './config/logger.js';

const app = createApp();

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
