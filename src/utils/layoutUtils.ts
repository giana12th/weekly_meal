/** データ行の最小高さ（EditableCell.module.css の min-height と一致） */
export const ROW_MIN_HEIGHT = 100;

/** border-collapse: collapse で行間に現れるセルの下ボーダー幅 */
export const CELL_BORDER_WIDTH = 1;

/** 行の実効高さ（min-height + ボーダー分。最終行のみ 0.5px 低いが余白として許容） */
const EFFECTIVE_ROW_HEIGHT = ROW_MIN_HEIGHT + CELL_BORDER_WIDTH;

/**
 * 利用可能な高さから表示できる行数を計算する
 * @param availableHeight - ラッパーの利用可能な高さ（px）
 * @param headerHeight - ヘッダー部分の高さ（px）
 * @returns 表示可能な行数（1以上）
 */
export function calcDisplayDays(availableHeight: number, headerHeight: number): number {
  return Math.max(1, Math.floor((availableHeight - headerHeight) / EFFECTIVE_ROW_HEIGHT));
}

/**
 * 表示行数とヘッダー高さからカレンダー全体の高さを計算する
 * @param displayDays - 表示行数
 * @param headerHeight - ヘッダー部分の高さ（px）
 * @returns カレンダーの高さ（px）
 */
export function calcCalendarHeight(displayDays: number, headerHeight: number): number {
  return headerHeight + displayDays * EFFECTIVE_ROW_HEIGHT;
}
