import request from 'supertest';

import { createApp } from '../../src/app.js';

const app = createApp();

// biome-ignore lint/style/noProcessEnv: needed for test configuration
const prefix = process.env.API_PREFIX ?? '/api/v1';

describe('POST /auth/logout', () => {
  it('should clear auth cookie on logout', async () => {
    const res = await request(app).post(`${prefix}/auth/logout`).expect(204);

    const cookies = res.headers['set-cookie'];

    expect(cookies).toBeDefined();
    expect(Array.isArray(cookies)).toBe(true);

    if (Array.isArray(cookies)) {
      expect(cookies[0]).toContain('token=');
      expect(cookies[0]).toMatch(/Max-Age=0|Expires=/);
    }
  });
});
