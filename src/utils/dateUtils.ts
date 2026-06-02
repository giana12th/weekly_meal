/** 曜日名の配列（0=日曜日） */
const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'] as const;

/**
 * 日付を表示フォーマットに変換する
 * @param date - 変換する日付
 * @returns "5月24日(日)" 形式の文字列
 */
export function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = DAY_NAMES[date.getDay()];
  return `${month}月${day}日(${dayName})`;
}

/**
 * 日付をストレージキー形式に変換する
 * @param date - 変換する日付
 * @returns "2026-05-21" 形式の文字列
 */
export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 昨日からオフセット分遡った日を起点に、指定日数分の日付配列を返す（昇順）
 * @param count - 取得する日数
 * @param offset - 昨日からさらに遡る日数（0=昨日起点）
 * @returns 起点日を先頭とする Date の配列
 */
export function getDays(count: number, offset = 0): Date[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 1 - offset);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/**
 * 日付が土曜または日曜かどうかを返す
 * @param date - チェックする日付
 * @returns 土日の場合 true
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
