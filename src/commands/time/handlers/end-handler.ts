import type { CommandContext } from 'discord-hono';
import { updateEndTIme } from '../functions/update-end-time';

type Option = {
  context: CommandContext;
};

export const endHandler = async ({ context }: Option) => {
  try {
    const result = await updateEndTIme({
      env: context.env,
      userId: context.interaction.member?.user?.id ?? '',
    });

    if (!result.success) {
      return context.res(result.message);
    }

    const breakInfo = result.data.breakTime ? `\n休憩時間: ${result.data.breakTime}` : '';

    return context.res(
      `${context.interaction.member?.user?.global_name}がプロジェクト "${result.data.projectName}" の勤務を終了しました。\n開始時間: ${result.data.startTime}\n終了時間: ${result.data.endTime}${breakInfo}\n稼働時間: ${result.data.totalHours}時間`
    );
  } catch {
    return context.res('エラーが発生しました');
  }
};
