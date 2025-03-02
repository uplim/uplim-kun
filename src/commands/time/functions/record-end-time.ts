import type { sheets_v4 } from "googleapis";
import { sheetsClient } from "../../../libs/google-sheets";
import { getSheets } from "./get-sheets";

type Option = {
	sheets: sheets_v4.Sheets;
	userId: string;
};

export const recordEndTime = async ({ userId, sheets }: Option) => {
	const sheetList = await getSheets({ sheets });

	let endedProject = null;
	const endTime = new Date();

	// 全てのシートをループして未終了の勤務を探す
	for (const [sheetTitle] of Object.entries(sheetList)) {
		const res = await sheetsClient.spreadsheets.values.get({
			spreadsheetId: process.env.TIMER_SPREADSHEET_ID,
			range: `${sheetTitle}!A:E`,
		});

		const rows = res.data.values || [];

		// ヘッダー行をスキップして検索
		for (let i = 1; i < rows.length; i++) {
			if (rows?.[i]?.[0] === userId && rows?.[i]?.[2] && !rows?.[i]?.[3]) {
				const startTime = new Date(rows?.[i]?.[2]);
				const totalHours =
					(endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

				// 終了時間と勤務時間を更新
				await sheetsClient.spreadsheets.values.update({
					spreadsheetId: process.env.TIMER_SPREADSHEET_ID,
					range: `${sheetTitle}!D${i + 1}:E${i + 1}`,
					valueInputOption: "USER_ENTERED",
					requestBody: {
						values: [[endTime.toISOString(), totalHours.toFixed(2)]],
					},
				});

				endedProject = {
					projectName: sheetTitle,
					startTime: startTime.toLocaleString(),
					endTime: endTime.toLocaleString(),
					totalHours: totalHours.toFixed(2),
				};

				break;
			}
		}

		if (endedProject) {
			break;
		}
	}

	if (!endedProject) {
		throw new Error(
			"勤務中のプロジェクトが見つかりません。先に勤務を開始してください。",
		);
	}

	return endedProject;
};
