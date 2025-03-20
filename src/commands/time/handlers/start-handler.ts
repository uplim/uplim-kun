import type { CommandContext } from 'discord-hono';
import { appendStartTime } from '../functions/append-start-time';

type Option = {
  context: CommandContext;
};

export const startHandler = async ({ context }: Option) => {
  const projectName = context.var.project_name;
  const memo = context.var.memo;

  try {
    const result = await appendStartTime({
      projectName,
      memo,
      userId: context.interaction.member?.user?.id ?? '',
      userName: context.interaction.member?.user?.username ?? '',
      env: context.env,
    });

    if (!result.success) {
      return context.res(result.message);
    }

    return context.res(
      `${context.interaction.member?.user?.global_name}がプロジェクト "${projectName}" の勤務を開始しました。\n開始時間: ${result.data.startTime}\nメモ：${memo}`
    );
  } catch (e) {
    return context.res('エラーが発生しました');
  }
};
