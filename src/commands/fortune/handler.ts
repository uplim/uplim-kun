import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

type Options = {
	interaction: ChatInputCommandInteraction;
};

// 運試しの結果リスト
const fortuneResults = [
	{
		result: "大吉",
		emoji: "🌟",
	},
	{ result: "中吉", emoji: "✨" },
	{ result: "小吉", emoji: "🌼" },
	{ result: "吉", emoji: "🍀" },
	{
		result: "末吉",
		emoji: "🌱",
	},
	{
		result: "凶",
		emoji: "☁️",
	},
	{ result: "大凶", emoji: "⚡" },
];

export const fortuneHandler = async ({ interaction }: Options) => {
	// ランダムに運試し結果を選択
	const fortune =
		fortuneResults[Math.floor(Math.random() * fortuneResults.length)];

	// 埋め込みメッセージの作成
	const fortuneEmbed = new EmbedBuilder()
		.setTitle(
			`${fortune?.emoji} 今日の運勢: ${fortune?.result} ${fortune?.emoji}`,
		)
		.setTimestamp();

	await interaction.reply({ embeds: [fortuneEmbed] });
};
