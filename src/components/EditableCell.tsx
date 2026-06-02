import { useState, useRef, useEffect } from 'react';
import styles from './EditableCell.module.css';

interface EditableCellProps {
  /** 表示・編集する文字列 */
  value: string;
  /** 編集確定時のコールバック */
  onChange: (value: string) => void;
  /** 最大文字数（デフォルト 100） */
  maxLength?: number;
  /** colspan 属性 */
  colSpan?: number;
  /** 追加 CSS クラス */
  className?: string;
}

/**
 * ダブルクリックで編集できるテーブルセルコンポーネント
 * @param value - 表示・編集する文字列
 * @param onChange - 編集確定時（blur）のコールバック
 * @param maxLength - 最大文字数
 * @param colSpan - テーブルの colspan
 * @param className - 追加 CSS クラス
 */
export function EditableCell({
  value,
  onChange,
  maxLength = 100,
  colSpan,
  className,
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 編集モード開始時にフォーカス・高さ調整
  useEffect(() => {
    if (editing && textareaRef.current) {
      const ta = textareaRef.current;
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
      adjustHeight(ta);
    }
  }, [editing]);

  /** textarea の高さを内容に合わせる */
  function adjustHeight(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  const handleDoubleClick = () => {
    setDraft(value);
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    adjustHeight(e.target);
  };

  const handleBlur = () => {
    setEditing(false);
    onChange(draft);
  };

  const cellClass = [styles.cell, className].filter(Boolean).join(' ');

  return (
    <td colSpan={colSpan} className={cellClass}>
      {editing ? (
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={draft}
          maxLength={maxLength}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <div
          className={styles.display}
          onDoubleClick={handleDoubleClick}
          title="ダブルクリックで編集"
        >
          {/* 空の場合もセルの高さを確保するため改行なしスペースを使う */}
          {value || ' '}
        </div>
      )}
    </td>
  );
}
