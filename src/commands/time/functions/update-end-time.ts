import { get } from '../../../clients/spreadsheets/values/get';
import { update } from '../../../clients/spreadsheets/values/update';
import { formatDatetime } from '../../../functions/format-datetime';
import { getJstDate } from '../../../functions/get-jst-date';
import type { Result } from '../../../types/result';
import { getSheets } from './get-sheets';

type Options = {
  env: Env;
  userId: string;
};

export const updateEndTIme = async ({
  userId,
  env,
}: Options): Promise<
  Result<{
    projectName: string;
    startTime: string;
    endTime: string;
    totalHours: string;
    breakTime: string;
  }>
> => {
  const sheetList = await getSheets({ env });

  let endedProject = undefined;
  const endTimeJst = getJstDate();

  // 全てのシートをループして未終了の勤務を探す
  for (const [sheetTitle] of Object.entries(sheetList)) {
    const res = await get({
      spreadsheetId: env.TIMER_SPREADSHEET_ID,
      range: `${sheetTitle}!A:G`,
    });
    const rows = res.values || [];

    // ヘッダー行をスキップして検索
    for (let i = 1; i < rows.length; i++) {
      if (rows?.[i]?.[0] === userId && rows?.[i]?.[2] && !rows?.[i]?.[3]) {
        const startTimeJst = new Date(rows?.[i]?.[2] ?? '');
        const breakData = rows?.[i]?.[4] || '';

        // 休憩中の場合はエラー
        if (breakData.includes('休憩中')) {
          return {
            success: false,
            message: '休憩中です。先に休憩を終了してください。',
          };
        }

        // 総勤務時間を計算
        const totalWorkMinutes = (endTimeJst.getTime() - startTimeJst.getTime()) / (1000 * 60);

        // 休憩時間を計算
        const totalBreakMinutes = calculateTotalBreakMinutes(breakData);

        // 実際の稼働時間を計算（総勤務時間 - 休憩時間）
        const actualWorkMinutes = totalWorkMinutes - totalBreakMinutes;
        const actualWorkHours = actualWorkMinutes / 60;

        const breakTimeDisplay = totalBreakMinutes > 0 ? `${totalBreakMinutes}分` : '';

        // 終了時間、休憩時間、稼働時間を更新
        await update({
          spreadsheetId: env.TIMER_SPREADSHEET_ID,
          valueInputOption: 'USER_ENTERED',
          range: `${sheetTitle}!D${i + 1}:F${i + 1}`,
          requestBody: {
            values: [[formatDatetime(endTimeJst), breakTimeDisplay, actualWorkHours.toFixed(2)]],
          },
        });

        endedProject = {
          projectName: sheetTitle,
          startTime: formatDatetime(startTimeJst),
          endTime: formatDatetime(endTimeJst),
          totalHours: actualWorkHours.toFixed(2),
          breakTime: breakTimeDisplay,
        };

        break;
      }
    }

    if (endedProject) {
      break;
    }
  }

  if (!endedProject) {
    return {
      success: false,
      message: '勤務中のプロジェクトが見つかりません。先に勤務を開始してください。',
    };
  }

  return {
    success: true,
    data: endedProject,
  };
};

// 休憩時間を分単位で計算する関数
const calculateTotalBreakMinutes = (breakData: string): number => {
  if (!breakData) return 0;

  const breakRecords = breakData.split(',');
  let totalMinutes = 0;

  for (const record of breakRecords) {
    const match = record.match(/\((\d+)分\)/);
    if (match?.[1]) {
      totalMinutes += Number.parseInt(match[1], 10);
    }
  }

  return totalMinutes;
};
