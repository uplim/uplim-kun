import type { sheets_v4 } from "googleapis";
import { sheetsClient } from "../../../libs/google-sheets";

type Option = {
	sheets: sheets_v4.Sheets;
};

export const getSheets = async ({ sheets }: Option) => {
	const res = await sheets.spreadsheets.get({
		spreadsheetId: process.env.TIMER_SPREADSHEET_ID,
		fields: "sheets.properties",
	});

	const sheetsData: { [key: string]: number | null | undefined } = {};

	if (res.data.sheets) {
		for (const sheet of res.data.sheets) {
			if (sheet.properties?.title) {
				sheetsData[sheet.properties.title] = sheet.properties?.sheetId;
			}
		}
	}

	return sheetsData;
};
