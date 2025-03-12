import type { sheets_v4 } from 'googleapis';
import { fetcher } from '../../fetcher';

export const get = async ({ spreadsheetId, range }: sheets_v4.Params$Resource$Spreadsheets$Values$Get) => {
  return fetcher<sheets_v4.Schema$ValueRange>(`/spreadsheets/${spreadsheetId}/values/${range}`, {
    method: 'GET',
  });
};
