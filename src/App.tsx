import { useState } from 'react';
import { useMealStorage } from './hooks/useMealStorage';
import { MealCalendar } from './components/MealCalendar';
import type { AppData, TimeKey } from './types';

/**
 * アプリのルートコンポーネント
 * 状態管理と各セル変更ハンドラを担当する
 */
function App() {
  const { data, save } = useMealStorage();
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  /** @param value - コピーするセルの値 */
  const handleCopy = (value: string) => setCopiedValue(value);

  /**
   * ヘッダー行セルの変更を保存する
   * @param key - 変更するヘッダーのキー
   * @param value - 新しい値
   */
  const handleHeaderChange = (key: keyof AppData['headers'], value: string) => {
    save({ ...data, headers: { ...data.headers, [key]: value } });
  };

  /**
   * 人物名セルの変更を保存する
   * @param time - 朝・昼・夜の区分
   * @param index - 列インデックス
   * @param value - 新しい値
   */
  const handlePersonChange = (time: TimeKey, index: number, value: string) => {
    // タプル型を維持しつつ更新
    const updated = data.persons[time].map((v, i) =>
      i === index ? value : v,
    ) as typeof data.persons[typeof time];
    save({ ...data, persons: { ...data.persons, [time]: updated } });
  };

  /**
   * 献立セルの変更を保存する
   * @param dateKey - 対象日付キー（"2026-05-21" 形式）
   * @param time - 朝・昼・夜の区分
   * @param index - 列インデックス
   * @param value - 新しい値
   */
  const handleMealChange = (
    dateKey: string,
    time: TimeKey,
    index: number,
    value: string,
  ) => {
    const existing = data.meals[dateKey] ?? {
      morning: ['', ''] as [string, string],
      noon: ['', '', ''] as [string, string, string],
      night: ['', '', ''] as [string, string, string],
    };
    const updatedTime = existing[time].map((v, i) =>
      i === index ? value : v,
    ) as typeof existing[typeof time];
    save({
      ...data,
      meals: {
        ...data.meals,
        [dateKey]: { ...existing, [time]: updatedTime },
      },
    });
  };

  return (
    <MealCalendar
      data={data}
      copiedValue={copiedValue}
      onCopy={handleCopy}
      onHeaderChange={handleHeaderChange}
      onPersonChange={handlePersonChange}
      onMealChange={handleMealChange}
    />
  );
}

export default App;
