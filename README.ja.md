# PatentLens 製品からの特許候補調査

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

## できること
公開された製品ページから関連しそうな特許・意匠を絞り込み、出典、図面、請求項、調査で確認できなかった点を対比レポートにまとめます。製品企画、設計レビュー、専門家への引き継ぎに使えます。キーワードの一致は候補の発見に使い、判断には原資料と対応する製品の特徴を使います。

## インストールと実行
```sh
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
cd patentlens-product-search-skill
node app/server.mjs
```

Node.js 22 以上で起動し、ブラウザーで `http://127.0.0.1:48972` を開きます。Codex で使うにはフォルダー一式を `~/.codex/skills/patentlens-product-search` に配置し、`$patentlens-product-search` で呼び出します。米国の公開 PDF を描画する場合は Python 3.10 以上と `pypdf`、`pypdfium2` が必要です。

## 入力・出力と確認
製品 URL、対象国・地域、調査基準日を指定します。製品の画像や既知の文献番号があれば追加します。候補を最大 3 件並べ、図面または独立請求項の要素と製品を比較し、HTML、JSON、CSV を出力します。公式登録簿で権利者と法的状態を確認し、不明な情報は `unknown` と記録します。自動検索はキーワードと公開索引を使う予備調査です。網羅的な検索、画像の類似検索、正式な法的判断は別途必要です。

## 模擬事例
架空のケーブルクリップを対象に、36 件の手掛かりを 19 件に整理し、原文を確認できた 7 件のうち 3 件を比較します。結論は、外観の重なりが小さい 1 件、内部構造の確認が必要な 1 件、外観の詳細確認が必要な 1 件です。[図解事例を開く（英語）](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html)。

[Full Skill workflow](SKILL.md) · [License](LICENSE)
