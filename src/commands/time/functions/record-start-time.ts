import type { sheets_v4 } from "googleapis";
import { sheetsClient } from "../../../libs/google-sheets";
import { getSheets } from "./get-sheets";

type Options = {
	projectName: string;
	userId: string;
	userName: string;
	sheets: sheets_v4.Sheets;
};

export const recordStartTime = async ({
	projectName,
	userId,
	userName,
	sheets,
}: Options) => {
	const sheetList = await getSheets({ sheets });

	if (!Object.keys(sheetList).includes(projectName)) {
		throw new Error(`プロジェクト ${projectName}が見つかりません。`);
	}

	const now = new Date();
	const startTime = now.toISOString();

	// 同じユーザーIDで既に勤務中のレコードがあるか確認
	const res = await sheetsClient.spreadsheets.values.get({
		spreadsheetId: process.env.TIMER_SPREADSHEET_ID,
		range: `${projectName}!A:E`,
	});
	const rows = res.data.values || [];
	for (let i = 1; i < rows.length; i++) {
		if (rows?.[i]?.[0] === userId && rows?.[i]?.[3] === "") {
			throw new Error("すでに勤務開始しています。先に勤務を終了してください。");
		}
	}

	// 新しい行を追加
	await sheetsClient.spreadsheets.values.append({
		spreadsheetId: process.env.TIMER_SPREADSHEET_ID,
		range: `${projectName}!A:E`,
		valueInputOption: "USER_ENTERED",
		requestBody: {
			values: [[userId, userName, startTime, "", ""]],
		},
	});

	return {
		projectName,
		startTime: now.toLocaleString(),
	};
};
