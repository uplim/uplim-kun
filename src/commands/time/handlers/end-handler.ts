import type { ChatInputCommandInteraction } from "discord.js";
import type { sheets_v4 } from "googleapis";
import { getSheets } from "../functions/get-sheets";
import { recordEndTime } from "../functions/record-end-time";
import { recordStartTime } from "../functions/record-start-time";

type Option = {
	sheets: sheets_v4.Sheets;
	interaction: ChatInputCommandInteraction;
};

export const endHandler = async ({ sheets, interaction }: Option) => {
	try {
		const result = await recordEndTime({ sheets, userId: interaction.user.id });
		await interaction.reply({
			content: `プロジェクト "${result.projectName}" の勤務を終了しました。\n開始時間: ${result.startTime}\n終了時間: ${result.endTime}\n勤務時間: ${result.totalHours}時間`,
			ephemeral: false,
		});
	} catch {
		await interaction.reply({
			content: "エラーが発生しました",
			ephemeral: false,
		});
	}
};
