import { timeBuilder } from './time/builder';
import { timeHandler } from './time/handler';
import { undameshiBuilder } from './undameshi/builder';
import { undameshiHandler } from './undameshi/handler';

export const commands = [timeBuilder, undameshiBuilder];
export const handlers = {
  time: timeHandler,
  undameshi: undameshiHandler,
};
