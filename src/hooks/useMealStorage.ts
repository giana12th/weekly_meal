import { useState, useCallback } from 'react';
import type { AppData } from '../types';

/** localStorage のキー */
const STORAGE_KEY = 'weekly-meal-data';

/** 保持する日数 */
const KEEP_DAYS = 30;

/** デフォルトのアプリデータ */
const DEFAULT_DATA: AppData = {
  headers: {
    title: '今週の献立',
    morning: '朝',
    noon: '昼',
    night: '夜',
  },
  persons: {
    morning: ['パパ', 'ぼく'],
    noon: ['パパ', 'ママ', 'ぼく'],
    night: ['パパ', 'ママ', 'ぼく'],
  },
  meals: {},
};

/**
 * 30日より古い献立エントリを削除する
 * @param meals - 献立データ
 * @returns クリーンアップ後の献立データ
 */
function cleanupOldMeals(meals: AppData['meals']): AppData['meals'] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - KEEP_DAYS);
  // "YYYY-MM-DD" 形式の文字列比較で判定
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  return Object.fromEntries(
    Object.entries(meals).filter(([key]) => key >= cutoffKey),
  );
}

/**
 * localStorage からアプリデータを読み込む
 * @returns 保存済みデータ、またはデフォルト値
 */
function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      headers: { ...DEFAULT_DATA.headers, ...parsed.headers },
      persons: { ...DEFAULT_DATA.persons, ...parsed.persons },
      meals: parsed.meals ?? {},
    };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

/**
 * 献立データの localStorage 永続化フック
 * @returns data - 現在のアプリデータ、save - 保存関数
 */
export function useMealStorage() {
  const [data, setData] = useState<AppData>(loadData);

  /**
   * データを state と localStorage の両方に保存する
   * @param newData - 新しいアプリデータ
   */
  const save = useCallback((newData: AppData) => {
    const cleaned: AppData = {
      ...newData,
      meals: cleanupOldMeals(newData.meals),
    };
    setData(cleaned);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    } catch (e) {
      console.error('localStorage への保存に失敗しました', e);
    }
  }, []);

  return { data, save };
}
