# simple-react-app

## 概要

React + TypeScript + Vite を用いたシンプルなフロントエンドアプリケーションです。

## 技術スタック

- [React](https://react.dev/) 19.x
- [TypeScript](https://www.typescriptlang.org/) 5.x
- [Vite](https://vitejs.dev/) 7.x
- [Tailwind CSS](https://tailwindcss.com/) 4.x（CSS フレームワーク）
- [Jotai](https://jotai.org/) 2.x（状態管理）
- [Biome](https://biomejs.dev/) 2.x（コードリント・フォーマット）
- [Vitest](https://vitest.dev/) 3.x（ユニットテスト）

## ディレクトリ構成

```
src/
  features/         機能別コンポーネント
  pages/            ページコンポーネント
  app.css           グローバルスタイル（Tailwind CSS）
  main.tsx          エントリーポイント
  vite-env.d.ts     Vite型定義
public/             静的ファイル
```

## 主な npm scripts

| コマンド           | 説明                                 |
| ------------------ | ------------------------------------ |
| npm run dev        | 開発サーバーを起動（ホットリロード） |
| npm run build      | 本番ビルド（型チェック含む）         |
| npm run preview    | ビルド後のプレビューサーバー起動     |
| npm run lint       | Biome によるコードチェック           |
| npm run lint:fix   | Biome による自動修正                 |
| npm run test       | Vitest によるテスト実行              |
| npm run test:watch | Vitest によるテストのウォッチ実行    |

## セットアップ・起動方法

1. 依存パッケージのインストール
   ```bash
   npm install
   ```
2. 開発サーバーの起動
   ```bash
   npm run dev
   ```

## テストの実行方法

Vitest を使ったユニットテストが利用できます。

```bash
npm run test        # 一度だけテストを実行
npm run test:watch  # ファイル変更を監視してテストを自動実行
```
