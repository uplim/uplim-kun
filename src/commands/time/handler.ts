import type { CommandContext } from 'discord-hono';
import { breakEndHandler } from './handlers/break-end-handler';
import { breakStartHandler } from './handlers/break-start-handler';
import { createProjectHandler } from './handlers/create-project-handler';
import { endHandler } from './handlers/end-handler';
import { listHandler } from './handlers/list-handler';
import { startHandler } from './handlers/start-handler';

type Options = {
  context: CommandContext;
};

export const timeHandler = async ({ context }: Options) => {
  const subCommand = context.sub.string;

  switch (subCommand) {
    case 'create_project':
      return await createProjectHandler({ context });
    case 'list':
      return await listHandler({ context });
    case 'start':
      return await startHandler({ context });
    case 'end':
      return await endHandler({ context });
    case 'break_start':
      return await breakStartHandler({ context });
    case 'break_end':
      return await breakEndHandler({ context });
    default:
      return await startHandler({ context });
  }
};
