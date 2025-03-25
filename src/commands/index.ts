import { timeBuilder } from './time/builder';
import { timeHandler } from './time/handler';
import { omikuziBuilder } from './omikuzi/builder';
import { omikuziHandler } from './omikuzi/handler';

export const commands = [timeBuilder, omikuziBuilder];
export const handlers = {
  time: timeHandler,
  omikuzi: omikuziHandler,
};
