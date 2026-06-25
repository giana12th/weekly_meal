import { useState, useRef, useEffect } from 'react';
import styles from './EditableCell.module.css';

interface EditableCellProps {
  /** 表示・編集する文字列 */
  value: string;
  /** 編集確定時のコールバック */
  onChange: (value: string) => void;
  /** コピーされた値（null = コピーなし） */
  copiedValue?: string | null;
  /** コピーボタン押下時のコールバック */
  onCopy?: (value: string) => void;
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
 * @param copiedValue - コピーされた値（null = コピーなし）
 * @param onCopy - コピーボタン押下時のコールバック
 * @param maxLength - 最大文字数
 * @param colSpan - テーブルの colspan
 * @param className - 追加 CSS クラス
 */
export function EditableCell({
  value,
  onChange,
  copiedValue,
  onCopy,
  maxLength = 100,
  colSpan,
  className,
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy?.(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  const handlePasteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (copiedValue != null) onChange(copiedValue);
  };

  const cellClass = [styles.cell, className].filter(Boolean).join(' ');

  return (
    <td
      colSpan={colSpan}
      className={cellClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
          {value || ' '}
        </div>
      )}
      {!editing && hovered && onCopy && (
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleCopyClick} title="コピー">
            {copied ? (
              '✓'
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            )}
          </button>
          {copiedValue != null && (
            <button className={styles.button} onClick={handlePasteClick} title="ペースト">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="8" y="2" width="8" height="4" rx="1"/>
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </td>
  );
}
