import { describe, test, expect } from 'bun:test';
import { calcDisplayDays, calcCalendarHeight, ROW_MIN_HEIGHT, CELL_BORDER_WIDTH } from './layoutUtils';

const EFFECTIVE = ROW_MIN_HEIGHT + CELL_BORDER_WIDTH; // 101

describe('calcDisplayDays', () => {
  test('通常ケース: 余りを切り捨てて行数を返す', () => {
    // (900-60)/101 = 8.317 → 8
    expect(calcDisplayDays(900, 60)).toBe(8);
  });

  test('実効行高さでぴったりの場合', () => {
    // (868-60)/101 = 8.0 → 8
    expect(calcDisplayDays(60 + EFFECTIVE * 8, 60)).toBe(8);
  });

  test('1行未満でも最小 1 を返す', () => {
    expect(calcDisplayDays(100, 100)).toBe(1);
  });

  test('ヘッダーが利用可能高さを超えても最小 1 を返す', () => {
    expect(calcDisplayDays(50, 60)).toBe(1);
  });

  test('ヘッダーが 0 のとき', () => {
    // floor(700/101) = 6
    expect(calcDisplayDays(700, 0)).toBe(6);
  });
});

describe('calcCalendarHeight', () => {
  test('行数 × 実効行高さ + ヘッダー高さを返す', () => {
    expect(calcCalendarHeight(8, 60)).toBe(60 + EFFECTIVE * 8); // 868
  });

  test('ヘッダーが 0 のとき', () => {
    expect(calcCalendarHeight(7, 0)).toBe(EFFECTIVE * 7); // 707
  });

  test('1行のとき', () => {
    expect(calcCalendarHeight(1, 60)).toBe(60 + EFFECTIVE); // 161
  });

  test('1行・ヘッダーなしのとき実効行高さと一致する', () => {
    expect(calcCalendarHeight(1, 0)).toBe(EFFECTIVE); // 101
  });
});
