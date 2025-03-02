import type { ChatInputCommandInteraction } from "discord.js";
import type { sheets_v4 } from "googleapis";
import { createSheet } from "../functions/create-sheet";

type Option = {
	sheets: sheets_v4.Sheets;
	interaction: ChatInputCommandInteraction;
};

export const createProjectHandler = async ({ interaction, sheets }: Option) => {
	const projectName = interaction.options.getString("project_name");

	if (!projectName) {
		await interaction.reply({
			content: "project_nameは必須です。",
			ephemeral: false,
		});
		throw new Error("project_nameは必須です");
	}

	try {
		await createSheet({ sheets, projectName });
		await interaction.reply({
			content: `プロジェクト "${projectName}" を作成しました。`,
			ephemeral: false,
		});
	} catch {
		await interaction.reply({
			content: "エラーが発生しました",
			ephemeral: false,
		});
	}
};
