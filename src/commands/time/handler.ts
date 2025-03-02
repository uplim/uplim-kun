import type { ChatInputCommandInteraction } from "discord.js";
import type { sheets_v4 } from "googleapis";
import { createSheet } from "./functions/create-sheet";
import { createProjectHandler } from "./handlers/create-project-handler";
import { endHandler } from "./handlers/end-handler";
import { listHandler } from "./handlers/list-handler";
import { startHandler } from "./handlers/start-handler";

type Options = {
	sheets: sheets_v4.Sheets;
	interaction: ChatInputCommandInteraction;
};

export const timeHandler = async ({ sheets, interaction }: Options) => {
	const subCommand = interaction.options.getSubcommand();

	switch (subCommand) {
		case "create_project":
			await createProjectHandler({ interaction, sheets });
			break;
		case "list":
			await listHandler({ interaction, sheets });
			break;
		case "start":
			await startHandler({ interaction, sheets });
			break;
		case "end":
			await endHandler({ interaction, sheets });
			break;
		default:
			break;
	}
};
