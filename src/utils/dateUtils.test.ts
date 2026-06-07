import { describe, test, expect, afterEach, setSystemTime } from 'bun:test';
import { formatDate, getDateKey, getDays, isWeekend } from './dateUtils';

describe('formatDate', () => {
  test('平日（水曜）を正しくフォーマットする', () => {
    // 2026-06-10 は水曜日
    expect(formatDate(new Date(2026, 5, 10))).toBe('6月10日(水)');
  });

  test('日曜日を正しくフォーマットする', () => {
    // 2026-01-04 は日曜日
    expect(formatDate(new Date(2026, 0, 4))).toBe('1月4日(日)');
  });

  test('土曜日を正しくフォーマットする', () => {
    // 2026-01-03 は土曜日
    expect(formatDate(new Date(2026, 0, 3))).toBe('1月3日(土)');
  });

  test('12月末日を正しくフォーマットする', () => {
    // 2025-12-31 は水曜日
    expect(formatDate(new Date(2025, 11, 31))).toBe('12月31日(水)');
  });
});

describe('getDateKey', () => {
  test('通常の日付を YYYY-MM-DD 形式に変換する', () => {
    expect(getDateKey(new Date(2026, 5, 7))).toBe('2026-06-07');
  });

  test('月・日が1桁のとき0埋めする', () => {
    expect(getDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  test('12月31日を正しく変換する', () => {
    expect(getDateKey(new Date(2025, 11, 31))).toBe('2025-12-31');
  });
});

describe('isWeekend', () => {
  test('日曜（0）は true を返す', () => {
    expect(isWeekend(new Date(2026, 0, 4))).toBe(true);
  });

  test('土曜（6）は true を返す', () => {
    expect(isWeekend(new Date(2026, 0, 3))).toBe(true);
  });

  test('月曜は false を返す', () => {
    expect(isWeekend(new Date(2026, 0, 5))).toBe(false);
  });

  test('金曜は false を返す', () => {
    expect(isWeekend(new Date(2026, 0, 9))).toBe(false);
  });
});

describe('getDays', () => {
  afterEach(() => {
    // システム日付のモックをリセット
    setSystemTime();
  });

  test('count 分の配列を返す', () => {
    setSystemTime(new Date(2026, 5, 7)); // 2026-06-07（日曜）
    const days = getDays(5);
    expect(days).toHaveLength(5);
  });

  test('昨日を起点に昇順で並ぶ', () => {
    setSystemTime(new Date(2026, 5, 7)); // 2026-06-07
    const days = getDays(3);
    const keys = days.map(getDateKey);
    // 昨日(06-06)〜明後日(06-08)
    expect(keys).toEqual(['2026-06-06', '2026-06-07', '2026-06-08']);
  });

  test('offset=1 でさらに1日前を起点にする', () => {
    setSystemTime(new Date(2026, 5, 7)); // 2026-06-07
    const days = getDays(1, 1);
    expect(getDateKey(days[0])).toBe('2026-06-05');
  });

  test('月をまたぐ場合も正しく動作する', () => {
    setSystemTime(new Date(2026, 5, 1)); // 2026-06-01
    const days = getDays(2);
    const keys = days.map(getDateKey);
    // 昨日(05-31)〜今日(06-01)
    expect(keys).toEqual(['2026-05-31', '2026-06-01']);
  });
});
