/**
 * 分数をhh:mm形式で表示するヘルパー関数
 * @param minutes - 分数
 * @returns hh:mm形式の文字列
 */
export const formatDurationHourMin = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
