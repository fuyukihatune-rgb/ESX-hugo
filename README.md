# Empowerment Society X (ESX) 公式サイト

このリポジトリは、言論プラットフォーム「Empowerment Society X」の公式サイトを生成する Hugo プロジェクトです。Cloudflare Pages 上でホストされ、寄稿フォームからの投稿は Cloudflare Worker を経由して GitHub リポジトリに Pull Request として登録されます。

## プロジェクトのゴール

- 多様な意見が安全に交わる場をテクノロジーで支援する
- 編集履歴と寄稿プロセスを Git/GitHub で完全に公開し、透明性を担保する
- 表現の自由・プライバシー・法令順守を両立させる運営モデルを実践する

## 主な特徴

- **レスポンシブ UI**: モバイル・タブレット・PC 向けに最適化したカードレイアウトと検索機能
- **ライト／ダーク テーマ**: システム設定に追従しつつ手動トグルで切り替え可能
- **寄稿ワークフローの自動化**: Cloudflare Worker がフォーム投稿を検証し、GitHub 上に自動でブランチ＆PR を作成
- **静的サイト生成**: [Hugo](https://gohugo.io/) 0.123 で高速ビルド、Cloudflare Pages へ自動デプロイ

## ローカル開発

1. 必要条件: Hugo Extended 0.123 以上、Node.js（検索で Fuse.js を利用する場合に便利）
2. リポジトリをクローン
   ```bash
   git clone git@github.com:fuyukihatune-rgb/ESX-hugo.git
   cd ESX-hugo
   ```
3. ローカルサーバーを起動
   ```bash
   hugo server -D
   ```
   `http://localhost:1313` でプレビューできます。

### 新規記事の作成

```bash
hugo new posts/my-new-article.md
```

- フロントマター `draft: false` で即時公開。ドラフトにしたい場合は `draft: true` を設定してください。
- サマリは本文の冒頭から自動生成されます。明示的に設定したい場合は `summary` フィールドを追加してください。

## 寄稿方法

### 1. GitHub から Pull Request

1. GitHub 上でこのリポジトリを fork します。
2. 自身の fork を clone し、作業用ブランチを作成します。
   ```bash
   git clone git@github.com:<your-account>/ESX-hugo.git
   cd ESX-hugo
   git checkout -b feature/my-article
   ```
3. Markdown ファイルを `content/posts/` 以下に追加・編集してください。デザイン修正や新しいテンプレートの追加も歓迎です。
4. 変更内容をコミットし、自分の fork に push します。
5. GitHub 上から本家リポジトリ (`fuyukihatune-rgb/ESX-hugo`) へ Pull Request を作成してください。

CI は導入していませんが、Pull Request がマージされる前に Cloudflare Pages でプレビューを確認します。レビューで修正が必要な場合はコメントに沿って更新をお願いします。

### 2. 寄稿フォーム経由

- サイト内「記事を寄稿 / 連絡」フォームから送信
- Cloudflare Worker が下記内容をバリデーションします
  - ファイル形式: `.md` / `.txt`
  - 最大ファイルサイズ: 10MB
  - ボット対策チェック（隠しフィールド）
- 問題がなければ GitHub に自動でブランチと Pull Request を生成します
- 生成された PR は公開リポジトリでレビューされ、そのまま静的サイトにデプロイされます

## デプロイフロー

## 管理者の開発環境

- OS: Windows 11 Pro + WSL2 (Ubuntu)
- エディタ: Visual Studio Code、Neovim
- ブラウザ: Firefox / Chrome
- その他: Node.js 18.x、npm 10.x

- ホスティング: Cloudflare Pages
- Production branch: `main`
- Build command: `hugo --minify`
- Output directory: `public`
- 推奨環境変数
  - `HUGO_VERSION=0.123.7`
  - `HUGO_EXTENDED=true`
  - `HUGO_ENV=production`
  - `TZ=Asia/Tokyo`
- フォーム送信先: `https://esx-form-handler.eitaro1694.workers.dev/`

## 今後の計画と協力募集

- **カスタムテーマへの移行**: 既存の `layouts/` と `static/` を再構成し、`themes/esx-theme/` として公開可能なテーマ化を進めます。Hugo のテーマ設計や CSS 設計に詳しい方を歓迎しています。
- **UI/UX 改善**: モバイルでの体験改善、アクセシビリティ向上のための提案・実装を募集しています。
- **Cloudflare Worker 拡張**: フォームのスパム対策やバリデーション、GitHub 連携の高度化に協力いただける方を探しています。

興味がある方は Pull Request や Issue でお気軽にコンタクトしてください。

## ライセンス

`LICENSE` を参照してください。ドキュメント／コンテンツの再利用については個別にお問い合わせください。
