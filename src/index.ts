import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { handlers } from "./commands";
import { sheetsClient } from "./libs/google-sheets";

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

client.once("ready", () => {
	console.log("Ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === "time") {
		await handlers.time({ interaction, sheets: sheetsClient });
	}
});

client.login(process.env.DISCORD_API_KEY);
