import type { ChatInputCommandInteraction } from "discord.js";
import type { sheets_v4 } from "googleapis";
import { getSheets } from "../functions/get-sheets";

type Option = {
	sheets: sheets_v4.Sheets;
	interaction: ChatInputCommandInteraction;
};

export const listHandler = async ({ sheets, interaction }: Option) => {
	try {
		const sheetList = await getSheets({ sheets });
		const projectNames = Object.keys(sheetList);

		if (projectNames.length === 0) {
			await interaction.reply({
				content:
					"プロジェクトが存在しません。先に `/time create_project` でプロジェクトを作成してください。",
				ephemeral: false,
			});
			return;
		}

		let response = "📋 **プロジェクト一覧**\n\n";
		projectNames.forEach((name, index) => {
			response += `${index + 1}. ${name}\n`;
		});

		await interaction.reply({ content: response, ephemeral: false });
	} catch {
		await interaction.reply({
			content: "エラーが発生しました",
			ephemeral: false,
		});
	}
};
