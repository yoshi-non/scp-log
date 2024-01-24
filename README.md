# SCP Log
某プレイリストの自分用にカスタマイズしたものです。
名前の由来は自分がドメインを検索する時に他の予測変換が出にくいものにしました。
SCPは某財団ではなくSCPコマンドのように自分の環境に転送できたらいいなという思いのもとです。

## 環境構築
NodeJSバージョン: v18.17.0

```bash
# パッケージインストール
npm i
# 開発サーバ起動
npm run dev
# ビルド
npm run build
# ビルドサーバ起動
npm start
```

## デスクトップアプリ化(Electron)

デスクトップアプリ化するときにはAPI_KEYを自身で設定する必要があります。
.envファイルを.env.exampleと同じ階層に作成しNEXT_PUBLIC_YOUTUBE_API_KEYにYoutube Data APIのKeyを自身で取得して貼り付けてください。
※Youtube Data APIは検索で使用します(無料枠で大丈夫です)。

以下作業をしてからコマンドを使用してください。
'use server'と書かれているコードは全てコメントアウトしてください。
next.config.jsのoutput: 'export'のコメントアウトは元に戻してください。

```bash
# 開発サーバ起動
npm run dev-electron
# デスクトップアプリの作成
# 作成されたアプリの場所: dist/mac-arm64/SCP Log
# アプリサイズ: 約800MB
npm run dist
```

## shadcn/ui
https://ui.shadcn.com/docs

## icon
https://www.radix-ui.com/icons
