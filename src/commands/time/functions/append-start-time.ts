import { append } from '../../../clients/spreadsheets/values/append';
import { get } from '../../../clients/spreadsheets/values/get';
import { formatJSTDatetime } from '../../../functions/format-jst-datetime';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  projectName: string;
  userId: string;
  userName: string;
  memo: string;
  env: Env;
};

export const appendStartTime = async ({
  projectName,
  memo,
  userId,
  userName,
  env,
}: Options): Promise<Result<{ startTime: string }>> => {
  const sheetList = await getSheets({ env });

  if (!Object.keys(sheetList).includes(projectName)) {
    return {
      success: false,
      message: `プロジェクト ${projectName}が見つかりません。`,
    };
  }

  const startTime = formatJSTDatetime(new Date());

  // 同じユーザーIDで既に勤務中のレコードがあるか確認
  const res = await get({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!A:E`,
  });

  const rows = res.values || [];
  for (let i = 1; i < rows.length; i++) {
    if (rows?.[i]?.[0] === userId && rows?.[i]?.[3] === '') {
      return {
        success: false,
        message: 'すでに勤務開始しています。先に勤務を終了してください。',
      };
    }
  }

  // 新しい行を追加
  await append({
    spreadsheetId: env.TIMER_SPREADSHEET_ID,
    range: `${projectName}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[userId, userName, startTime, '', '', memo]],
    },
  });

  return {
    success: true,
    data: {
      startTime,
    },
  };
};
