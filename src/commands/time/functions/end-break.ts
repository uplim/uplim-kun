import { get } from '../../../clients/spreadsheets/values/get';
import { update } from '../../../clients/spreadsheets/values/update';
import { formatDurationHourMin } from '../../../functions/format-duration';
import { getJstDate } from '../../../functions/get-jst-date';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  env: Env;
  userId: string;
};

export const endBreak = async ({ userId, env }: Options): Promise<Result<{ breakDuration: string }>> => {
  const sheetList = await getSheets({ env });
  const breakEndTimeJst = getJstDate();

  // 全てのシートをループして休憩中のレコードを探す
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
        const breakData = rows?.[i]?.[4] || '';

        if (!breakData.includes('休憩中')) {
          return {
            success: false,
            message: '休憩中ではありません。',
          };
        }

        // 休憩開始時刻を取得: 休憩中:YYYY-MM-DD HH:MM
        const breakStartMatch = breakData.match(/休憩中:(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
        if (!breakStartMatch) {
          return {
            success: false,
            message: '休憩開始時間が見つかりません。',
          };
        }

        const breakStartTimeString = breakStartMatch[1];
        const breakStartTimeJst = new Date(breakStartTimeString);

        // JST時刻同士で差分をミリ秒で計算
        const breakDurationMs = breakEndTimeJst.getTime() - breakStartTimeJst.getTime();
        const breakDurationMinutes = breakDurationMs / (1000 * 60); // 分数（小数点含む）

        // hh:mm形式で表示
        const breakDurationFormatted = formatDurationHourMin(breakDurationMinutes);

        // 休憩データを更新（休憩中を削除し、休憩時間を記録）
        const updatedBreakData = breakData.replace(/休憩中:[^,]+,?/, '').replace(/,$/, '');
        const breakRecord = `休憩時間:${breakDurationFormatted}`;
        const newBreakData = updatedBreakData ? `${updatedBreakData},${breakRecord}` : breakRecord;

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
            breakDuration: breakDurationFormatted,
          },
        };
      }
    }
  }

  return {
    success: false,
    message: '休憩中のレコードが見つかりません。',
  };
};
