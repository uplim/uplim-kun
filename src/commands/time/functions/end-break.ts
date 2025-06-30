import { get } from '../../../clients/spreadsheets/values/get';
import { update } from '../../../clients/spreadsheets/values/update';
import { formatJSTDatetime } from '../../../functions/format-jst-datetime';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  env: Env;
  userId: string;
};

export const endBreak = async ({ userId, env }: Options): Promise<Result<{ breakDuration: number }>> => {
  const sheetList = await getSheets({ env });
  const breakEndTime = formatJSTDatetime(new Date());

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

        // 休憩開始時間を取得
        const breakStartMatch = breakData.match(/休憩中:([^,]+)/);
        if (!breakStartMatch) {
          return {
            success: false,
            message: '休憩開始時間が見つかりません。',
          };
        }

        const breakStartTime = new Date(breakStartMatch[1]);
        const breakEndTimeDate = new Date();
        const breakDuration = Math.round((breakEndTimeDate.getTime() - breakStartTime.getTime()) / (1000 * 60)); // 分単位

        // 休憩データを更新（休憩中を削除し、休憩時間を記録）
        const updatedBreakData = breakData.replace(/休憩中:[^,]+,?/, '').replace(/,$/, '');
        const breakRecord = `${breakStartMatch[1]}-${breakEndTime}(${breakDuration}分)`;
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
            breakDuration,
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
