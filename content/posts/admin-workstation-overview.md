---
title: "管理者開発環境の紹介"
date: 2025-09-25T17:30:00+09:00
author: "@ncc1030"
draft: false
description: "ESX 管理者が実際に利用している開発環境とワークフローのメモ"
categories:
  - 運営ノート
tags:
  - ワークフロー
  - ツール
---

サイト運営の透明性を高めるため、管理者が日常的に利用している開発ツールやワークフローをまとめました。寄稿や改善を検討する際の参考にしてください。

## ハードウェア・OS

- マシン: Windows 11 Pro (Ryzen 5 4500 搭載デスクトップ)
- 仮想環境: Windows Subsystem for Linux 2 (Ubuntu 24.04)
- GPU: GeForce GTX 1060 6GB
- メモリ: 16GB

## 開発ツール

- エディタ: Visual Studio Code, Vim
- 端末: Windows Terminal + PowerShell, WSL2 上の `zsh`
- バージョン管理: Git + GitHub CLI
- フロントエンド補助: Node.js 18.x / npm 10.x
- AI アシスタント: OpenAI ChatGPT (Codex モード)

## サイト運用フロー

1. `hugo server --bind 0.0.0.0 --baseURL http://<local-ip>:1313 -D` でプレビュー
2. モバイル確認: 同一ネットワークのスマホからアクセスし、ナビゲーションやテーマ切替を実機でチェック
3. 寄稿内容のレビュー: Pull Request を通じて diff を確認し、必要に応じてコメント
4. マージ後は Cloudflare Pages のデプロイ結果をチェック

## チームへのメッセージ

この構成はあくまで一例です。フォークや寄稿の際には、ご自身が使いやすいエディタや OS を自由に組み合わせて構いません。改善アイデアがあれば遠慮なく Pull Request で提案してください。
