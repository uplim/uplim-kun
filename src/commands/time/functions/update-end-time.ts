import { get } from '../../../clients/spreadsheets/values/get';
import { update } from '../../../clients/spreadsheets/values/update';
import { formatDatetime } from '../../../functions/format-datetime';
import { formatDurationHourMin } from '../../../functions/format-duration';
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

        // 総勤務時間を計算（分単位）
        const totalWorkMinutes = (endTimeJst.getTime() - startTimeJst.getTime()) / (1000 * 60);

        // 休憩時間を計算（分単位）
        const totalBreakMinutes = calculateTotalBreakMinutes(breakData);

        // 実際の稼働時間を計算（総勤務時間 - 休憩時間）
        const actualWorkMinutes = totalWorkMinutes - totalBreakMinutes;
        const actualWorkHours = actualWorkMinutes / 60;

        // 休憩時間をhh:mm形式で表示
        const breakTimeDisplay = totalBreakMinutes > 0 ? formatDurationHourMin(totalBreakMinutes) : '';

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
          projectName: rows?.[i]?.[1] ?? '',
          startTime: rows?.[i]?.[2] ?? '',
          endTime: formatDatetime(endTimeJst),
          totalHours: actualWorkHours.toFixed(2),
          breakTime: breakTimeDisplay,
        };
        break;
      }
    }

    if (endedProject) break;
  }

  if (!endedProject) {
    return {
      success: false,
      message: '勤務中のプロジェクトが見つかりません。',
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
    // 新しい形式: 休憩時間:hh:mm
    const hhmmMatch = record.match(/休憩時間:(\d{2}):(\d{2})/);
    if (hhmmMatch?.[1] && hhmmMatch?.[2]) {
      const hours = Number.parseInt(hhmmMatch[1], 10);
      const minutes = Number.parseInt(hhmmMatch[2], 10);
      totalMinutes += hours * 60 + minutes;
      continue;
    }

    // 従来の形式との互換性: (X分)
    const oldMatch = record.match(/\((\d+)分\)/);
    if (oldMatch?.[1]) {
      totalMinutes += Number.parseInt(oldMatch[1], 10);
    }
  }

  return totalMinutes;
};
