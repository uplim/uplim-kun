import type { ChatInputCommandInteraction } from "discord.js";
import type { sheets_v4 } from "googleapis";
import { getSheets } from "../functions/get-sheets";
import { recordStartTime } from "../functions/record-start-time";

type Option = {
	sheets: sheets_v4.Sheets;
	interaction: ChatInputCommandInteraction;
};

export const startHandler = async ({ sheets, interaction }: Option) => {
	const projectName = interaction.options.getString("project_name");
	const memo = interaction.options.getString("memo");

	try {
		if (!projectName || !memo) {
			await interaction.reply({
				content: "project_nameとmemoは必須です。",
				ephemeral: false,
			});
			return;
		}

		const result = await recordStartTime({
			sheets,
			projectName,
			memo,
			userId: interaction.user.id,
			userName: interaction.user.username,
		});
		await interaction.reply({
			content: `プロジェクト "${result.projectName}" の勤務を開始しました。開始時間: ${result.startTime}\nメモ：${result.memo}`,
			ephemeral: false,
		});
	} catch {
		await interaction.reply({
			content: "エラーが発生しました",
			ephemeral: false,
		});
	}
};
