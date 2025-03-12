import type { sheets_v4 } from "googleapis";
import { fetcher } from "../../fetcher";

export const update = async ({
	spreadsheetId,
	range,
	requestBody,
	valueInputOption,
}: sheets_v4.Params$Resource$Spreadsheets$Values$Update) => {
	return fetcher<sheets_v4.Schema$UpdateValuesResponse>(
		`/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=${valueInputOption}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		},
	);
};
