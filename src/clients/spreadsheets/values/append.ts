import type { sheets_v4 } from 'googleapis';
import { fetcher } from '../../fetcher';

export const append = async ({
  spreadsheetId,
  range,
  requestBody,
  valueInputOption,
}: sheets_v4.Params$Resource$Spreadsheets$Values$Append) => {
  return fetcher<sheets_v4.Schema$AppendValuesResponse>(
    `/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=${valueInputOption}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );
};
