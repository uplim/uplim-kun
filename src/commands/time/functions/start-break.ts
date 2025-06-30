import { get } from '../../../clients/spreadsheets/values/get';
import { update } from '../../../clients/spreadsheets/values/update';
import { formatJSTDatetime } from '../../../functions/format-jst-datetime';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  env: Env;
  userId: string;
};

export const startBreak = async ({ userId, env }: Options): Promise<Result<{ breakStartTime: string }>> => {
  const sheetList = await getSheets({ env });
  const breakStartTimeFormatted = formatJSTDatetime(new Date());

  // 全てのシートをループして勤務中のレコードを探す
  for (const [sheetTitle] of Object.entries(sheetList)) {
    const res = await get({
      spreadsheetId: env.TIMER_SPREADSHEET_ID,
      range: `${sheetTitle}!A:G`,
    });
    const rows = res.values || [];

    // ヘッダー行をスキップして検索
    for (let i = 1; i < rows.length; i++) {
      if (rows?.[i]?.[0] === userId && rows?.[i]?.[2] && !rows?.[i]?.[3]) {
        // 勤務中のレコードが見つかった
        // 既に休憩中でないかチェック
        const breakData = rows?.[i]?.[4] || '';
        if (breakData.includes('休憩中')) {
          return {
            success: false,
            message: '既に休憩中です。',
          };
        }

        // 休憩開始時間を記録: 休憩中:休憩開始時刻
        const breakStartData = `休憩中:${breakStartTimeFormatted}`;
        const newBreakData = breakData ? `${breakData},${breakStartData}` : breakStartData;

        await update({
          spreadsheetId: env.TIMER_SPREADSHEET_ID,
          valueInputOption: 'USER_ENTERED',
          range: `${sheetTitle}!E${i + 1}`,
          requestBody: {
            values: [[newBreakData]],
          },
        });

        return {
          success: true,
          data: {
            breakStartTime: breakStartTimeFormatted,
          },
        };
      }
    }
  }

  return {
    success: false,
    message: '勤務中のプロジェクトが見つかりません。先に勤務を開始してください。',
  };
};
