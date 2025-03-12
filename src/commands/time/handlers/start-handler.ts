import type { CommandContext } from "discord-hono";
import { recordStartTime } from "../functions/record-start-time";

type Option = {
	context: CommandContext;
};

export const startHandler = async ({ context }: Option) => {
	const projectName = context.var.project_name;
	const memo = context.var.memo;

	try {
		const result = await recordStartTime({
			projectName,
			memo,
			userId: context.interaction.member?.user?.id ?? "",
			userName: context.interaction.member?.user?.username ?? "",
			env: context.env,
		});

		return context.res(
			`${context.interaction.member?.user?.global_name}がプロジェクト "${result.projectName}" の勤務を開始しました。\n開始時間: ${result.startTime}\nメモ：${result.memo}`,
		);
	} catch (e) {
		return context.res("エラーが発生しました");
	}
};
