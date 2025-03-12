import type { CommandContext } from 'discord-hono';
import { getSheets } from '../functions/get-sheets';

type Option = {
  context: CommandContext;
};
export const listHandler = async ({ context }: Option) => {
  try {
    const sheetList = await getSheets({ env: context.env });
    const projectNames = Object.keys(sheetList);

    if (projectNames.length === 0) {
      return context.res('プロジェクトが存在しません。先に `/time create_project` でプロジェクトを作成してください。');
    }

    let response = '📋 **プロジェクト一覧**\n\n';
    projectNames.forEach((name, index) => {
      response += `${index + 1}. ${name}\n`;
    });

    return context.res(response);
  } catch (e) {
    return context.res('エラーが発生しました');
  }
};
