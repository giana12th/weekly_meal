# 献立カレンダー

家族の献立を書き込めるカレンダーアプリ。

## デモ

https://giana12th.github.io/weekly_meal/

## 使い方

`dist/index.html` をブラウザで開くだけで動作する（サーバー不要）。  
Microsoft Edge のタブに常時表示しておくことを想定している。

| 操作 | 動作 |
|------|------|
| ダブルクリック | セルを編集モードに切り替え |
| フォーカスを外す | 編集確定・自動保存 |
| ホイールスクロール | 表示日付を前後に移動（最大30日前まで） |

- 日付セル以外のすべてのセル（タイトル・朝/昼/夜・人物名・献立）が編集できる
- 入力した内容はブラウザの **localStorage に自動保存**される（30日分）。サーバーへの送受信は一切ない
- ページをリロードすると今日を基準に表示が更新される

## 開発

```bash
bun dev          # 開発サーバー起動
bun run build    # ビルド（dist/index.html を生成）
bun run lint     # ESLint
```

ビルドすると `vite-plugin-singlefile` により CSS・JS がすべてインライン化された単一 HTML が `dist/index.html` に生成される。

## 技術スタック

| | |
|---|---|
| 言語 | TypeScript |
| フレームワーク | React 19 |
| ビルドツール | Vite + vite-plugin-singlefile |
| パッケージマネージャー | Bun |
| スタイリング | CSS Modules |
| データ永続化 | localStorage |

## Claude Code 設定

このリポジトリは Claude Code での開発を想定した設定が含まれている。取り込み先のプロジェクトにそのまま配置して使える。

### CLAUDE.md

コーディング方針・アーキテクチャ概要・コマンドをまとめた Claude Code 向け設定ファイル。Claude Code が自動的に読み込む。

### .claude/settings.json

TypeScript/TSX ファイルを編集するたびに `bun run lint` を自動実行する PostToolUse hook が設定されている。  
hook 内で `jq` を使用しているため、事前にインストールが必要。

## ドキュメント

### docs/

| ファイル | 内容 |
|---|---|
| `idea.md` | アプリのアイデア・要件の初期メモ |
| `SPEC.md` | 機能仕様・データ構造・コンポーネント仕様 |
| `DESIGN.md` | デザインシステム（カラー・タイポグラフィ・スペーシング） |

### blog/

Claude Code との開発セッションを振り返った記事。

| ファイル | 内容 |
|---|---|
| `weekly-meal-calendar.md` | アプリを Claude Code と作った経緯と実装の全体像 |
| `css-no-tatakai-kata.md` | CSS でエクセルっぽさを脱するデザイン改善の記録 |
| `wheel-scroll-history.md` | ホイールスクロールで過去の献立を遡る機能の追加 |
