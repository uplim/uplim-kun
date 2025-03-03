import {
	Client,
	Events,
	GatewayIntentBits,
	Partials,
	REST,
	Routes,
} from "discord.js";
import { commands, handlers } from "./commands";
import { sheetsClient } from "./libs/google-sheets";

const rest = new REST({ version: "10" }).setToken(
	process.env.DISCORD_API_KEY ?? "",
);

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

client.once("ready", async () => {
	console.log("Ready!");
	await rest.put(
		Routes.applicationCommands(process.env.UPLIM_KUN_APPLICATION_ID ?? ""),
		{
			body: commands,
		},
	);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "time") {
		await handlers.time({ interaction, sheets: sheetsClient });
	} else if (interaction.commandName === "fortune") {
		await handlers.fortune({ interaction });
	}
});

client.login(process.env.DISCORD_API_KEY);
