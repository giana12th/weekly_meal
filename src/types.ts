/** 朝・昼・夜の区分 */
export type TimeKey = 'morning' | 'noon' | 'night';

/**
 * 1日分の献立データ
 * morning: [パパ, ぼく]
 * noon / night: [パパ, ママ, ぼく]
 */
export type DayMeals = {
  morning: [string, string];
  noon: [string, string, string];
  night: [string, string, string];
};

/** アプリ全体のデータ */
export type AppData = {
  /** ヘッダー行テキスト（編集可能） */
  headers: {
    title: string;
    morning: string;
    noon: string;
    night: string;
  };
  /**
   * 人物名行テキスト（編集可能）
   * 現在値のみ保持（日付ごとの履歴なし）
   */
  persons: {
    morning: [string, string];
    noon: [string, string, string];
    night: [string, string, string];
  };
  /**
   * 献立データ
   * キー: "2026-05-21" 形式の日付文字列
   */
  meals: Record<string, DayMeals>;
};
