import { type CommandContext, Embed } from "discord-hono";

type Options = {
	context: CommandContext;
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

export const undameshiHandler = async ({ context }: Options) => {
	// ランダムに運試し結果を選択
	const fortune =
		fortuneResults[Math.floor(Math.random() * fortuneResults.length)];

	// 埋め込みメッセージの作成
	return context.res({
		embeds: [
			new Embed().title(
				`${fortune?.emoji} 今日の運勢: ${fortune?.result} ${fortune?.emoji}`,
			),
		],
	});
};
