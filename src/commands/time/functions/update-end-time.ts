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
  }>
> => {
  const sheetList = await getSheets({ env });

  let endedProject = undefined;
  const endTimeJst = getJstDate();

  // 全てのシートをループして未終了の勤務を探す
  for (const [sheetTitle] of Object.entries(sheetList)) {
    const res = await get({
      spreadsheetId: env.TIMER_SPREADSHEET_ID,
      range: `${sheetTitle}!A:E`,
    });
    const rows = res.values || [];

    // ヘッダー行をスキップして検索
    for (let i = 1; i < rows.length; i++) {
      if (rows?.[i]?.[0] === userId && rows?.[i]?.[2] && !rows?.[i]?.[3]) {
        const startTimeJst = new Date(rows?.[i]?.[2] ?? '');
        const totalHours = (endTimeJst.getTime() - startTimeJst.getTime()) / (1000 * 60 * 60);

        // 終了時間と勤務時間を更新
        await update({
          spreadsheetId: env.TIMER_SPREADSHEET_ID,
          valueInputOption: 'USER_ENTERED',
          range: `${sheetTitle}!D${i + 1}:E${i + 1}`,
          requestBody: {
            values: [[formatDatetime(endTimeJst), totalHours.toFixed(2)]],
          },
        });

        endedProject = {
          projectName: sheetTitle,
          startTime: formatDatetime(startTimeJst),
          endTime: formatDatetime(endTimeJst),
          totalHours: totalHours.toFixed(2),
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
