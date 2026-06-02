import { useState, useRef, useEffect } from 'react';
import { getDays, getDateKey, formatDate, isWeekend } from '../utils/dateUtils';
import { EditableCell } from './EditableCell';
import type { AppData, DayMeals, TimeKey } from '../types';
import styles from './MealCalendar.module.css';

/** 表示する日数 */
const DISPLAY_DAYS = 7;

/** スクロールで遡れる最大オフセット日数（30日前まで） */
const MAX_OFFSET = 29;

/** 空の献立データのデフォルト値 */
const EMPTY_MEALS: DayMeals = {
  morning: ['', ''],
  noon: ['', '', ''],
  night: ['', '', ''],
};

interface MealCalendarProps {
  /** アプリ全体のデータ */
  data: AppData;
  /** ヘッダー行セル変更コールバック */
  onHeaderChange: (key: keyof AppData['headers'], value: string) => void;
  /** 人物名セル変更コールバック */
  onPersonChange: (time: TimeKey, index: number, value: string) => void;
  /** 献立セル変更コールバック */
  onMealChange: (dateKey: string, time: TimeKey, index: number, value: string) => void;
}

/**
 * 献立カレンダーのメインコンポーネント
 * @param data - アプリデータ
 * @param onHeaderChange - ヘッダー変更ハンドラ
 * @param onPersonChange - 人物名変更ハンドラ
 * @param onMealChange - 献立変更ハンドラ
 */
export function MealCalendar({
  data,
  onHeaderChange,
  onPersonChange,
  onMealChange,
}: MealCalendarProps) {
  /** 昨日から遡る日数（0=昨日起点、リロードでリセット） */
  const [offset, setOffset] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        // ホイール上: 過去へ
        setOffset((o) => Math.min(o + 1, MAX_OFFSET));
      } else if (e.deltaY > 0) {
        // ホイール下: 現在へ
        setOffset((o) => Math.max(o - 1, 0));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const days = getDays(DISPLAY_DAYS, offset);
  const { headers, persons, meals } = data;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <table className={styles.table}>
        <thead>
          {/* ヘッダー行: タイトル + 朝/昼/夜 */}
          <tr>
            <EditableCell
              value={headers.title}
              onChange={(v) => onHeaderChange('title', v)}
              className={styles.titleCell}
            />
            <EditableCell
              value={headers.morning}
              colSpan={2}
              onChange={(v) => onHeaderChange('morning', v)}
              className={styles.timeCell}
            />
            <EditableCell
              value={headers.noon}
              colSpan={3}
              onChange={(v) => onHeaderChange('noon', v)}
              className={styles.timeCell}
            />
            <EditableCell
              value={headers.night}
              colSpan={3}
              onChange={(v) => onHeaderChange('night', v)}
              className={styles.timeCell}
            />
          </tr>
          {/* 人物名行 */}
          <tr>
            <td className={styles.emptyCell}></td>
            {persons.morning.map((name, i) => (
              <EditableCell
                key={`morning-person-${i}`}
                value={name}
                onChange={(v) => onPersonChange('morning', i, v)}
                className={styles.personCell}
              />
            ))}
            {persons.noon.map((name, i) => (
              <EditableCell
                key={`noon-person-${i}`}
                value={name}
                onChange={(v) => onPersonChange('noon', i, v)}
                className={styles.personCell}
              />
            ))}
            {persons.night.map((name, i) => (
              <EditableCell
                key={`night-person-${i}`}
                value={name}
                onChange={(v) => onPersonChange('night', i, v)}
                className={styles.personCell}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((date) => {
            const dateKey = getDateKey(date);
            const dayMeals = meals[dateKey] ?? EMPTY_MEALS;
            const weekend = isWeekend(date);

            return (
              <tr key={dateKey} className={weekend ? styles.weekend : ''}>
                <td className={styles.dateCell}>{formatDate(date)}</td>
                {dayMeals.morning.map((v, i) => (
                  <EditableCell
                    key={`${dateKey}-morning-${i}`}
                    value={v}
                    onChange={(val) => onMealChange(dateKey, 'morning', i, val)}
                  />
                ))}
                {dayMeals.noon.map((v, i) => (
                  <EditableCell
                    key={`${dateKey}-noon-${i}`}
                    value={v}
                    onChange={(val) => onMealChange(dateKey, 'noon', i, val)}
                  />
                ))}
                {dayMeals.night.map((v, i) => (
                  <EditableCell
                    key={`${dateKey}-night-${i}`}
                    value={v}
                    onChange={(val) => onMealChange(dateKey, 'night', i, val)}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
