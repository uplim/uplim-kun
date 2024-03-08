import { Client as NotionClient } from "@notionhq/client";
import { Client, GatewayIntentBits, Message, Partials } from "discord.js";
import { time } from "./commands/time";

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Message, Partials.Channel],
});

const notion = new NotionClient({
	auth: process.env.NOTION_API_KEY,
});

const prefix = "!";

client.once("ready", () => {
	console.log("Ready!");
});

// メッセージの投稿を監視
client.on("messageCreate", async (message: Message) => {
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	// コマンド部分と引数を抽出
	const [command, ...args] = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/);

	if (command === "time") {
		await time(notion, message, args);
	}
});

client.login(process.env.DISCORD_API_KEY);
