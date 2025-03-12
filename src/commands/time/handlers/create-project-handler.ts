import type { CommandContext } from 'discord-hono';
import { createSheet } from '../functions/create-sheet';

type Option = {
  context: CommandContext;
};

export const createProjectHandler = async ({ context }: Option) => {
  const projectName = context.var.project_name;

  if (!projectName) {
    return context.res('project_nameは必須です。');
  }

  try {
    await createSheet({ env: context.env, projectName });
    return context.res(`プロジェクト "${projectName}" を作成しました。`);
  } catch (e) {
    return context.res('エラーが発生しました');
  }
};
