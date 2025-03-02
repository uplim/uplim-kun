import { timeBuilder } from "./time/builder";
import { timeHandler } from "./time/handler";

export const commands = [timeBuilder].map((builder) => builder.toJSON());
export const handlers = {
	time: timeHandler,
};
