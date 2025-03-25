import { DiscordHono } from 'discord-hono';
import { handlers } from './commands';

const app = new DiscordHono()
  .command('undameshi', (context) => handlers.omikuzi({ context }))
  .command('time', async (context) => await handlers.time({ context }));

export default app;
