import type { sheets_v4 } from "googleapis";
import { fetcher } from "../fetcher";

export const batchUpdate = async ({
	spreadsheetId,
	requestBody,
}: sheets_v4.Params$Resource$Spreadsheets$Batchupdate) => {
	return fetcher<sheets_v4.Schema$BatchUpdateSpreadsheetResponse>(
		`/spreadsheets/${spreadsheetId}:batchUpdate`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		},
	);
};
