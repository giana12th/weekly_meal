# コピー機能 設計仕様

## 方針

- アプリ内コピペに絞る（外部ペーストはダブルクリック編集モードで）
- スマホ非対応
- クリップボード API 不使用（権限ダイアログが出るため）

## state

```ts
copiedValue: string | null  // null = コピーなし
```

セル1個分のみ保持。上書きあり、自動リセットなし。

## 操作フロー

```
ホバー（state = null）  → コピーボタンのみ表示
ホバー（state に値あり）→ コピー＋ペーストボタン表示

コピーボタン → copiedValue を上書き保存
ペーストボタン → セルに貼り付け・保存（copiedValue はリセットしない）

ダブルクリック → 編集モード（既存のまま・外部ペーストはここで）
```

## ボタン UI

- ホバー時に右上へ表示（`position: absolute; top: 4px; right: 4px`）
- 通常 `color: #bbb`、ホバー時 `color: #555`（`currentColor` で制御）
- コピー成功時は一瞬 `✓` でフィードバック
- `td` に `position: relative` を付与

### アイコン（SVG インライン直書き、14×14px）

**コピー**
```tsx
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <rect x="9" y="9" width="13" height="13" rx="2"/>
  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
</svg>
```

**ペースト**（矢印なしのクリップボードのみ）
```tsx
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <rect x="8" y="2" width="8" height="4" rx="1"/>
  <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
</svg>
```

## 変更するファイル

| ファイル | 変更内容 |
|---|---|
| `App.tsx` | `copiedValue` state の追加、コピー・ペーストハンドラの定義 |
| `MealCalendar.tsx` | ハンドラと `copiedValue` を `EditableCell` へ props 渡し |
| `EditableCell.tsx` | ホバー検知・ボタン表示・ボタン押下イベント |
| `EditableCell.module.css` | ボタンのスタイル追加 |
