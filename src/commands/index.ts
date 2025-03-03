import { fortuneBuilder } from "./fortune/builder";
import { fortuneHandler } from "./fortune/handler";
import { timeBuilder } from "./time/builder";
import { timeHandler } from "./time/handler";

export const commands = [timeBuilder, fortuneBuilder].map((builder) =>
	builder.toJSON(),
);
export const handlers = {
	time: timeHandler,
	fortune: fortuneHandler,
};
