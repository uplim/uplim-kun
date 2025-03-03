import type { sheets_v4 } from "googleapis";

type Option = {
	sheets: sheets_v4.Sheets;
	projectName: string;
};

export const createSheet = async ({ sheets, projectName }: Option) => {
	const res = await sheets.spreadsheets.batchUpdate({
		spreadsheetId: process.env.TIMER_SPREADSHEET_ID,
		requestBody: {
			requests: [
				{
					addSheet: {
						properties: {
							title: projectName,
						},
					},
				},
			],
		},
	});

	const sheetId = res.data.replies?.[0]?.addSheet?.properties?.sheetId;

	// ヘッダの設定
	if (sheetId) {
		await sheets.spreadsheets.values.update({
			spreadsheetId: process.env.TIMER_SPREADSHEET_ID,
			range: `${projectName}!A1:E1`,
			valueInputOption: "USER_ENTERED",
			requestBody: {
				values: [
					[
						"ユーザーID",
						"ユーザー名",
						"開始時刻",
						"終了時刻",
						"稼働時間（時）",
						"メモ",
					],
				],
			},
		});
	}

	return { sheetId };
};
