import type { sheets_v4 } from 'googleapis';
import { fetcher } from '../fetcher';

export const get = async ({ spreadsheetId, fields }: sheets_v4.Params$Resource$Spreadsheets$Get) => {
  return fetcher<sheets_v4.Schema$Spreadsheet>(`/spreadsheets/${spreadsheetId}?fields=${fields}`, {
    method: 'GET',
  });
};
