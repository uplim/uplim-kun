import { get } from "../../../clients/spreadsheets/get";
import { getSheetsClient } from "../../../libs/google-sheets";

type Options = {
	env: Env;
};

export const getSheets = async ({ env }: Options) => {
	const res = await get({
		spreadsheetId: env.TIMER_SPREADSHEET_ID,
		fields: "sheets.properties",
	});

	const sheetsData: { [key: string]: number | null | undefined } = {};

	if (res.sheets) {
		for (const sheet of res.sheets) {
			if (sheet.properties?.title) {
				sheetsData[sheet.properties.title] = sheet.properties?.sheetId;
			}
		}
	}

	return sheetsData;
};
