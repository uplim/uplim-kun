import type { CommandContext } from "discord-hono";
import { getSheets } from "../functions/get-sheets";
import { recordEndTime } from "../functions/record-end-time";
import { recordStartTime } from "../functions/record-start-time";

type Option = {
	context: CommandContext;
};

export const endHandler = async ({ context }: Option) => {
	try {
		const result = await recordEndTime({
			env: context.env,
			userId: context.interaction.member?.user?.id ?? "",
		});

		return context.res(
			`${context.interaction.member?.user?.global_name}がプロジェクト "${result.projectName}" の勤務を終了しました。\n開始時間: ${result.startTime}\n終了時間: ${result.endTime}\n勤務時間: ${result.totalHours}時間`,
		);
	} catch {
		return context.res("エラーが発生しました");
	}
};
