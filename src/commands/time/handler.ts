import type { CacheType, CommandInteraction } from "discord.js";
import type { sheets_v4 } from "googleapis";

type Options = {
	sheets: sheets_v4.Sheets;
	interaction: CommandInteraction<CacheType>;
};

export const timeHandler = async ({ sheets, interaction }: Options) => {
	interaction.reply("あぷりむくんだよー");
};
