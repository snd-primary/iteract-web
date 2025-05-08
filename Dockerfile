# ベースイメージを指定 (Node.jsのバージョンはプロジェクトに合わせて調整してください)
FROM node:22-alpine

# 作業ディレクトリを作成・設定
WORKDIR /home/snd/dev/iteract-web

# pnpmをインストール
RUN npm install -g pnpm 

# 依存関係のファイルをコピー (package-lock.json や yarn.lock も忘れずに)
COPY package*.json ./
# COPY yarn.lock ./ # Yarn を使用している場合

# 依存関係をインストール
RUN pnpm install

# プロジェクトのソースコードをコピー
COPY . .

# Next.jsが使用するポートを公開 (デフォルトは3000)
EXPOSE 3000

# 開発サーバーを起動するコマンド
CMD ["npm", "run", "dev"]
# CMD ["yarn", "dev"] # Yarn を使用している場合