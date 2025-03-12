import type { CommandContext } from 'discord-hono';
import { recordEndTime } from '../functions/record-end-time';

type Option = {
  context: CommandContext;
};

export const endHandler = async ({ context }: Option) => {
  try {
    const result = await recordEndTime({
      env: context.env,
      userId: context.interaction.member?.user?.id ?? '',
    });

    if (!result.success) {
      return context.res(result.message);
    }

    return context.res(
      `${context.interaction.member?.user?.global_name}がプロジェクト "${result.data.projectName}" の勤務を終了しました。\n開始時間: ${result.data.startTime}\n終了時間: ${result.data.endTime}\n勤務時間: ${result.data.totalHours}時間`
    );
  } catch {
    return context.res('エラーが発生しました');
  }
};
