# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 方針
simple is best

## コーディングルール
JSDocは日本語で書く  
引数や戻り値の説明も書く

## コマンド

```bash
bun dev          # 開発サーバー起動
bun run build    # TypeScript チェック + Vite ビルド（dist/ に出力）
```

## アーキテクチャ

### 概要
週間献立管理アプリ。`vite-plugin-singlefile` で単一 HTML ファイル（`dist/index.html`）としてビルドされ、サーバー不要で `file://` から直接開ける。

### データフロー
```
localStorage
  └─ useMealStorage (src/hooks/)   ← load / save
       └─ App.tsx                  ← 状態管理・ハンドラ定義
            └─ MealCalendar        ← テーブルレイアウト（10日分を表示）
                 └─ EditableCell   ← ダブルクリックで textarea 編集
```

### 主要ファイルの役割
| ファイル | 役割 |
|---|---|
| `src/types.ts` | コア型定義（`TimeKey`, `DayMeals`, `AppData`） |
| `src/hooks/useMealStorage.ts` | localStorage の読み書き。30日以上古いエントリを自動削除 |
| `src/components/MealCalendar.tsx` | メインテーブル。昨日〜9日後の10日分を表示 |
| `src/components/EditableCell.tsx` | ダブルクリックで編集、blur で確定する `<td>` コンポーネント |
| `src/utils/dateUtils.ts` | 日付フォーマット・キー生成ユーティリティ |

### データ構造
- **ストレージキー**: `weekly-meal-data`（localStorage）
- **日付キー形式**: `"YYYY-MM-DD"`
- **朝食の列数**: 2列（morning のみ）、昼・夜は3列
- `AppData.persons` はアプリ全体で共通（日付ごとの履歴なし）
