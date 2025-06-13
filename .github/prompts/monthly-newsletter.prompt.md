--
mode: 'agent'
description: 'Generate a new Monthly Newsletter'
--

私が書いた記事をまとめてMonthly Newsletterを作成してください。

## ステップ:

1. ユーザーから対象記事を検索するために年月（YYYY-MM）を受け取ってください
2. 受け取った年限を用い`filter-by-month`を実行し、対象記事のパス一覧を取得してください
3. 「作成ファイル」に従い、出力先のファイルを作成してください
4. 各記事の内容を読み込み、「記事の要約方法」に従って要約してください
5. 記事をtagsごとに分類して出力してください
  - tagsが複数ある場合は、もっとも関連度の高いタグを使用してください
  
## 作成ファイル:

- `./src/pages/posts/{yyyy-mm-dd}/monthly-letter.mdx`というファイルを作成し、その中に出力形式に沿った内容を出力してください。
- `{yyyy-mm-dd}`はプロンプトを実行した日付に置き換えてください。


## 記事の要約方法:

- 各ファイルの`<Header {...frontmatter} />`以降の内容を要約してください。
- ファイルは最後まで読み込んでください。
- コードブロックやサンプルコードは含めず、記事の内容を簡潔にまとめてください。
- copilot-instructions.mdの内容に従ってください。

## 出力形式:

```
---
layout: ../../../layouts/Layout.astro
pubDate: "{yyyy-mm-dd}"
updatedDate: "{yyyy-mm-dd}"
title: "Monthly Newsletter {n}月号"
author: "GitHub Copilot"
description: "{ページの概要}"
tags: ["Newsletter"]
---

import Header from '../../../components/Header.astro'

<Header {...frontmatter} />

{以下で紹介する記事のトピックを簡潔にまとめてください。}

## {tag: 並び順はHTML、CSS、JavaScript、その他のtagの順にしてください}

### [{title}](記事のURL)

{記事の概要と要約}
```
