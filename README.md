# Simple Pomodoro Timer

ポモドーロテクニックを使用して作業や勉強の効率を高めるためのシンプルなタイマーアプリケーションです。

## 機能

- 作業時間、短い休憩時間、長い休憩時間の設定
- 長い休憩までの作業セッション数の設定
- 自動開始機能（作業→休憩、休憩→作業）
- ダーク/ライトモード切り替え
- 完了したポモドーロの記録
- 設定の永続化（LocalStorage）
- タイマー完了時の通知音

## 技術スタック

- [Next.js](https://nextjs.org/) - React フレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型付け言語
- [Tailwind CSS](https://tailwindcss.com/) - スタイリング
- [Jotai](https://jotai.org/) - 状態管理
- [Shadcn UI](https://ui.shadcn.com/) - UIコンポーネント
- [Lucide Icons](https://lucide.dev/) - アイコン

## 開発

### 環境構築

```bash
# リポジトリをクローン
git clone https://github.com/snd-primary/iteract-web.git
cd iteract-web

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

### ビルド

```bash
pnpm build
```

## 使い方

1. 「開始」ボタンをクリックしてタイマーを開始します
2. 作業セッションが終了すると、通知音が鳴ります
3. 設定に応じて休憩モードに自動的に切り替わります
4. 設定アイコンをクリックして、タイマーの設定をカスタマイズできます
5. テーマアイコンをクリックして、ライト/ダークモードを切り替えられます

## ライセンス

MIT
