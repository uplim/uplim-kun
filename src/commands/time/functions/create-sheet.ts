import { batchUpdate } from "../../../clients/spreadsheets/batch-update";
import { update } from "../../../clients/spreadsheets/values/update";

type Options = {
	projectName: string;
	env: Env;
};

export const createSheet = async ({ projectName, env }: Options) => {
	const res = await batchUpdate({
		spreadsheetId: env.TIMER_SPREADSHEET_ID,
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

	const sheetId = res.replies?.[0]?.addSheet?.properties?.sheetId;

	// ヘッダの設定
	if (sheetId) {
		await update({
			spreadsheetId: env.TIMER_SPREADSHEET_ID,
			range: `${projectName}!A1:F1`,
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
