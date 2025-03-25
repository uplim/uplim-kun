import { type CommandContext, Embed } from 'discord-hono';
import { OMIKUZI_LIST } from './constant';

type Options = {
  context: CommandContext;
};

export const omikuziHandler = async ({ context }: Options) => {
  // ランダムに運試し結果を選択
  const fortune = OMIKUZI_LIST[Math.floor(Math.random() * OMIKUZI_LIST.length)];

  if (fortune) {
    return context.res({
      embeds: [
        new Embed()
          .title(`${fortune.emoji} 今日の運勢: ${fortune.result} ${fortune.emoji}`)
          .description(fortune.comment || ''),
      ],
    });
  }

  return context.res({
    embeds: [new Embed().title('運勢が見つかりませんでした').description('もう一度お試しください。')],
  });
};
