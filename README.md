a

**依頼: i18n対応のための翻訳ファイル（json）作成**

共有したgithubリポジトリを見て、内部のテキストを確認し、i18n対応用のJSONファイルを作成してください

## 手順

**1. フォルダ・ファイルの作成**

~/messages/en.json
~/messages/ja.json


**2. json作成**

現在すべて英語である。

- まず現在のテキストを`en.json`に収める
- `en.json`をもとに、`ja.json`を作成する

`next-intl`というnpmパッケージを使用する。`json`は以下の形式をとること

```
{
  "About": {
    "title": "About us"
  }
}
```

