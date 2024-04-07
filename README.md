# SCP Log
某プレイリストの自分用にカスタマイズしたものです。
名前の由来は自分がドメインを検索する時に他の予測変換が出にくいものにしました。
SCPは某財団ではなくSCPコマンドのように自分の環境に転送できたらいいなという思いのもとです。

## 環境構築
NodeJSバージョン: v20.9.0

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

## フォルダ構成
```
├ api // Next.js環境で作成できなかったapi
├ src
│ ├ app // Next.jsのルーティング
│ ├ components // コンポーネント
│ │ ├ features // 特定の機能を実現するコンポーネント
│ │ │ ├ sample // サンプルコンポーネント
│ │ │ │ ├ hooks // サンプルコンポーネントのみで使用するhook(不要な場合もある)
│ │ │ │ ├ logics // サンプルコンポーネントのみで使用するロジック(不要な場合もある)
│ │ │ │ ├ tests // テスト専用
│ │ │ │ ├ index.tsx // エントリーポイント
│ │ ├ functions // UIとして表示されないコンポーネント
│ │ ├ ui // UIコンポーネント, shadcn/uiは全てここに入る
│ ├ constants // 全体に共通の定数ファイルを配置する
│ ├ libs // ライブラリのラッパーや使いまわしやすいようにする
│ ├ types // 全体に共通の型定義ファイルを配置する
│ ├ usecases // 共通で使い回すhooks
│ ├ utils // 使い回すロジックなど
```

## デスクトップアプリ化(Electron)

デスクトップアプリ化するときにはAPI_KEYを自身で設定する必要があります。
settingページでYoutube Data APIのKeyを自身で取得して貼り付けてください。
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

### メモ
| apiファイル | 使う箇所 | 
| ----- | ----- |
| api/kuromoji | vercel dev, 本番 |
| api/youtube-download | vercel dev |
| apis/kuromoji | npm run dev, build |
| apis/youtube-audio-donwload | npm run dev, build |

## shadcn/ui
https://ui.shadcn.com/docs

## icon
https://www.radix-ui.com/icons
