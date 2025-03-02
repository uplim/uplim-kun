import { SlashCommandBuilder } from "discord.js";

export const timeBuilder = new SlashCommandBuilder()
	.setName("time")
	.setDescription("勤怠を打刻するよ")
	.addSubcommand((subCommand) =>
		subCommand
			.setName("create_project")
			.setDescription("新しいプロジェクトを作成するよ")
			.addStringOption((option) =>
				option
					.setName("name")
					.setDescription("プロジェクト名")
					.setRequired(true),
			),
	)
	.addSubcommand((subCommand) =>
		subCommand
			.setName("start")
			.setDescription("勤務を開始するよ")
			.addStringOption((option) => option.setName("project").setRequired(true))
			.addStringOption((option) =>
				option
					.setName("memo")
					.setDescription("仕事内容のメモ")
					.setRequired(true),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("end").setDescription("勤務を終了するよ"),
	)
	.addSubcommand((subCommand) =>
		subCommand
			.setName("list")
			.setDescription("既存のプロジェクト一覧を表示するよ"),
	);
