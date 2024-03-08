import { Client } from "@notionhq/client";
import { Message } from "discord.js";
import { formatText } from "../functions";

const startKeys = ["おはよう", "おっはー"];
const endKeys = ["おやすみ", "おつかれ", "おつかれさま"];

export const time = async (
	notion: Client,
	message: Message,
	args: string[],
) => {
	try {
		if (args[0] === "-h") {
			message.channel.send(
				formatText([
					`開始の打刻に使える文言：${startKeys.join(", ")}`,
					`終了の打刻に使える文言：${endKeys.join(", ")}`,
					"使用例：!time おはよう",
				]),
			);
		}

		if (startKeys.includes(args[0] ?? "")) {
			const response = await notion.pages.create({
				parent: { database_id: "4513a5affb06414a80d948ed39e75b49" },
				properties: {
					name: {
						title: [
							{ type: "text", text: { content: message.author.username } },
						],
					},
					start: {
						date: {
							start: new Date().toISOString(),
						},
					},
					working: { checkbox: true },
				},
			});

			message.channel.send("おはよーー！！Notionに勤怠を入力したよ🥰");
			console.log("Data recorded successfully in Notion:", response);
		}

		if (endKeys.includes(args[0] ?? "")) {
			const pages = await notion.databases.query({
				database_id: "4513a5affb06414a80d948ed39e75b49",
			});

			const page = pages.results.find((page) => {
				if ("properties" in page) {
					const name = page.properties.name;
					const working = page.properties.working;

					return (
						// タイトルがメッセージを投稿したユーザ名でかつ勤務中になっているものを抽出
						name?.type === "title" &&
						Array.isArray(name.title) &&
						name.title[0]?.plain_text === message.author.username &&
						working?.type === "checkbox" &&
						working.checkbox
					);
				}

				return false;
			});

			if (page) {
				const response = await notion.pages.update({
					page_id: page.id,
					properties: {
						working: { checkbox: false },
						end: {
							date: {
								start: new Date().toISOString(),
							},
						},
					},
				});

				message.channel.send("おつかれさま！");
				console.log("Data recorded successfully in Notion: ", response);
			} else {
				message.channel.send("え、君、働いてた？開始時刻の打刻がないよ😢");
			}
		}
	} catch (error) {
		console.error("Error recording data in Notion:", error);
		message.channel.send(
			"不明なエラーが起こっちゃった。。サーバーログを確認してね😢",
		);
	}
};
