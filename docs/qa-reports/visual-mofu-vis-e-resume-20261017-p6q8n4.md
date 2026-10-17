# ジロジロ隊E・継続ビジュアル監査 / Production

- 日付: 2026-10-17 JST
- 対象: `https://niko2atelier.com/` 公開画面
- 基準: WebKit / mobile / touch / 430×932 / `device: founder` / `readOnly: true`。実機iPhone Safari/PWAの実証ではない。
- 担当: E「文字と窓の検品」。対象は Diary、FROM THE ATELIER、記事、手紙、表示されたモーダルと入力フォーム。
- 継続セッション: `mofu-vis-e-resume-20261017-p6q8n4`
- 遡及して検証したE専用セッション: `mofu-vis-e-20261017-0555-cerulean-7k4p`、`mofu-vis-e-20261017-0606-pearl-4m8d`、`mofu-vis-e-20261017-0944-azur-9f6k2`、`mofu-vis-e-20261017-0955-pearl-5c8n`
- **終了状態: STOP CONFIRMED。** `state.lastCommand=e5-end-stop`、`state.stopReason="Completed E visual continuation: published GENESIS article, category filters, and public DEAR form; no personal data submitted."`。停止状態の反映時刻 `2026-10-17T04:43:10.679Z` (JST 13:43:10)。
- 操作範囲: 本番で閲覧・既存の表示操作のみ。自由文・実顧客情報の入力、投稿、日記の保存、連絡フォームの送信は行っていない。`blockedWrites: 27`。Codex / Work / NIKO2-AUTOは使用せず、製品コード・Production・Identity・D1・配信に変更なし。
- 証拠: 以下すべて **各観察時点のGit commitで固定した WebKit 実スクリーンショットURL**。GitHub Contents APIの状態やDOMクリック成功だけでビジュアルPASSとは判定しない。
- 前担当の部分報告: [E旧報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/docs/qa-reports/visual-mofu-vis-e-20261017-0555-cerulean-7k4p.md)。

## 確定した画面上の不具合

### E-03 / P1 / お手紙の公開記事の先頭「FROM THE ATELIERへ戻る」がヘッダーに重なる

- **現場・到達ルート:** HOME → 右上の封筒 → FROM THE ATELIER → 「はじめてのお手紙が届きました！」の記事へ進む (`#mofumofu-post-first-letter`)。
- **何を押したか:** 旧Eのセッションで該当記事をタップし、続けて表示待ち、上端にわずかに見える戻るリンクを試した。
- **何が見えたか:** 記事冒頭の戻るリンクが表示領域の **最上端 y≒0** に露出して、浮いている固定ナビの裏に潜っている。待った後も位置は変わらなかった。上端のリンクをタップしたときは一覧へ戻れたため「押下不能」とはしない。
- **なぜ異常に見えるか・比較対象:** 同じ「FROM THE ATELIER」配下の Genesis 記事では戻るリンクがヘッダー下の **y≒116** にあり、重ならない。意図的な共通デザイン差ではなく、記事種別の先頭レイアウトの不整合として画面で確認した。文字と戻る導線が視覚的に欠損する。
- **画像:** [手紙記事冒頭](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/446d7bd38ca95ec5887449e070b5c404ce60ab57/live-results/mofu-vis-e-20261017-0944-azur-9f6k2/current.jpg) / [待機後も不変](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/4bf384d70c57dab5b89df8dd78c2278c3aceaf72/live-results/mofu-vis-e-20261017-0944-azur-9f6k2/current.jpg) / [比較: 正常なGenesis記事冒頭](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/79a23c3ba6ea17cbac1ff420e3b4cbf0af25785d/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg)。

## 目立つ違和感

### E-01 / P2 / DREAM MEMORY の「何も残さず、アトリエへ戻る」が薄い

- **現場・到達ルート:** HOME → Intro → Garden → 「夢の見覚え」→ 静かな場面 → 「夢を離れる」→ DREAM MEMORY。
- **何を押したか:** 「夢を離れる」、以前のセッションでは「言葉を添える」も展開。今回も出口モーダルを表示して確認した。
- **何が見えたか:** 「Diaryへ持ち帰る」は明瞭な水色の幅広ボタン、一方の「何も残さず、アトリエへ戻る」は小さく灰色が薄く、白い背景に紛れる。展開した場合も傾向は同じ。実際に前者と後者の両方が画面上に存在し、後者のタップによる遷移は成功した。
- **なぜ異常に見えるか:** 同じ選択モーダルにある二つの主要な出口で、拒否・非保存の選択肢だけ認知しにくい。押下不能のバグではなく文字コントラストの視覚違和感。
- **画像:** [E旧モーダル](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5ea57e33e5e5b773446ffa7bd189687a166bdaf3/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/current.jpg) / [言葉を添える展開時](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e9a91d6e5a42c08244dd88f98c1f09ab19e27e3f/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/current.jpg) / [今回のモーダル](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/af9fcb187825fe2a3ecd8002a70943a9cbadde18/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg)。

### E-02 / P2 / Diary の気分・写真カテゴリの選択文字が淡い

- **現場・到達ルート:** HOMEの浮遊するDiary帳 → `#diary` → 「いまの気配」「PHOTO」。
- **何を押したか:** Diaryを開き、旧Eでは任意「言葉」を展開、写真カテゴリを切り替え、画像のカルーセル・ギャラリーを見た。
- **何が見えたか:** 「静か」「きらきら」などの気分選択肢、写真カテゴリのラベルと選択用丸印が非常に淡い。対して同じ画面の見出しや本文には明確な文字階層がある。写真カードの拡大ギャラリーは表示でき、次画像と「この写真にする」で選択状態への復帰を確認。
- **なぜ異常に見えるか:** 操作候補だけが無効化されたように見えやすい。タップ領域が狭いとの断定ではない。
- **画像:** [Diary初期](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/cb42487de24f085623d471fa03cae804ac4af9fc/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/current.jpg) / [写真カードと任意入力](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/92c67fab0da4997b0fc3bfd01bf9c1682fe61c68/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg) / [写真選択状態](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/4e2078c812496257795d728b3ebbc9ce7580667d/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg)。

### E-04 / P2 / FROM THE ATELIERのFOUNDERカテゴリが説明なしの完全空欄

- **現場・到達ルート:** HOME → 封筒 → FROM THE ATELIER → FOUNDERタブ。SPECIAL / NOTESタブと比較。
- **何を押したか:** NOTES → FOUNDER → SPECIAL を順にタップ。
- **何が見えたか:** FOUNDERを選ぶと、タブ下には記事も空状態説明もなく、「アトリエへ戻る」だけがあり、それ以下の大部分が単なる白い空白になる。SPECIAL / NOTESでは公開カードが通常表示される。
- **なぜ異常に見えるか:** 記事がまだないこと自体を不具合とはしないが、空の選択結果だとわかるテキストがなく、読み込み失敗にも見える。画面の持つ情報量の落差が大きい。
- **画像:** [FOUNDER空状態](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/ee9a6198d36986efc1f8651098e15d1be7a8d4ff/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg) / [SPECIAL比較](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/997a67839222e70e749e6c1c21bf7de8c8af9164/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg) / [NOTES比較](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5b2bb80622b76b4376c3e271cd89adb1076ce8bb/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg)。

### E-05 / P3 / DEAR ATELIERの補足ラベル・説明が薄い

- **現場・到達ルート:** HOME下部 → 「お手紙を送る」→ `#dear`。
- **何を押したか:** 公開のお手紙フォームを開き、PageDownで下部へ。入力や送信はしなかった。
- **何が見えたか:** 「お名前 なくても大丈夫」「返信先 返事が必要なら」などのラベルやプライバシー説明が淡い細字。主タイトルと入力欄は識別でき、430幅での明白な横はみ出しは見なかった。フォーム下部には「送信確認がうまくいきませんでした。少し待って、もう一度どうぞ。」と表示されたが、送信操作はしていない。
- **なぜ異常に見えるか:** 情報提供上必要な注記の判読性が相対的に弱い。ただし **エラーメッセージは readOnly による送信遮断の影響かもしれないため、本番の送信不良とは断定しない**。
- **画像:** [フォーム冒頭](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/98b8aa28517a3680585dd888abe9e4889fb7275a/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg) / [フォーム下部（停止時点）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c8112b19c883bd3f1246884be5aaf7b1197a44c8/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg)。

## 比較対象が足りないもの

- Diaryの写真カルーセルの左右端が切れて見えるのは、次カードを示す意図的なUIの可能性が高い。写真全画面表示は機能したため、これを画面欠損バグと断定しない。[Gallery 1](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/10a5f6d3febf9cc659c220ac9363adf4c6f4287a/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg) / [Gallery 2](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/855e953052d63bd7878f988e27dfc4dd608febc4/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg)。
- ギャラリーで「その他」のカテゴリだけ2段目に折り返す配置は430幅では確認できたが、設計意図や他カテゴリ状態での比較が十分ではない。[写真ギャラリー](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/10a5f6d3febf9cc659c220ac9363adf4c6f4287a/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg)。
- DiaryのArchive 日々・月・年タブを開閉して確認。空の日付に表示される「この日には、まだ何も残っていません。」、月のカレンダーと年一覧、WHAT REMAINED→Cabinetまで到達した。画面の見え方だけでは、実際に日記データを書いたときの表示を判断しない。[Archive日](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/6e6a71cdb5527020c689d60d0d776e9b35b7ae4c/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg) / [月](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/bd58dfe4eef8ab6b9ba80b1f631cd1d52c0d0ae8/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg) / [年](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/48c01c6521c1a5d38b7c798f8203b3a6de131044/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg) / [Cabinet](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5f287d3cca57a3aee4de356bf7be53abb1c5d443/live-results/mofu-vis-e-20261017-0955-pearl-5c8n/current.jpg)。
- `#genesis` 記事は先頭・中段・末尾を実画像で確認。通常の本文幅、区切り、見出しと戻るリンクには目立つ崩れが見られない。[冒頭](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/79a23c3ba6ea17cbac1ff420e3b4cbf0af25785d/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg) / [中段](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1fb31393a586ce8db6dcb232184d376158660509/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg) / [末尾](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/206e1db50496c9e919c8ece782f3c59f3a00c4de/live-results/mofu-vis-e-resume-20261017-p6q8n4/current.jpg)。
- `#issue000` の大きなHero画像と記事本文は表示でき、PageDownで下部へ進行。長文記事に必要な縦スクロール自体を異常とはしない。[Hero](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/df40ed464c35d0d5ac5dfdfe1dc411d2e80be923/live-results/mofu-vis-e-20261017-0944-azur-9f6k2/current.jpg) / [途中](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/d0162dc0ba632f50bfe6ae1ab5a86d941feaeb4b/live-results/mofu-vis-e-20261017-0944-azur-9f6k2/current.jpg) / [本文](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/02a1fedff8f3a12615ab5c778bb93a5f71d57965/live-results/mofu-vis-e-20261017-0944-azur-9f6k2/current.jpg)。

## 未到達・未確認

- HOME直後の**初回お手紙ポップアップ**はこのEセッション群では実画面として捕捉できなかった。お手紙の **記事** は確認済みだが、初回ポップアップの形状・重なり・「わーい！」/「とじる」の画面判定はしていない。
- 実機iPhoneのソフトウェアキーボード発生時の画面ジャンプ・指のスワイプ時のバウンド・実機PWAの見え方・FPS・音質は未検証。モバイルWebKitで `scroll` 疑似ホイールが非対応になった箇所があり、その後 `key: PageDown` で記事を閲覧した。PageDown実施を指スワイプ実証と呼ばない。
- 本番へのPOST・日記「残す」・手紙「預ける」などの送信結果は **readOnly保護および公開QAルールにより未実行**。入力後にのみ出る通知・保存後のダイアログは判定対象外。存在しない画面の合格を推測しない。

## 実行履歴と確定停止

1. E前任4セッションを照合。`mofu-vis-e-20261017-0555-cerulean-7k4p`、`mofu-vis-e-20261017-0606-pearl-4m8d`、`mofu-vis-e-20261017-0944-azur-9f6k2` は `failure.json.stopReason=infrastructure_error`（GitHub 409競合）、`mofu-vis-e-20261017-0955-pearl-5c8n` は `state.stopReason=infrastructure_idle_timeout`。そのため旧セッションを再開しなかった。
2. 新規 `live-requests/mofu-vis-e-resume-20261017-p6q8n4.json` を GitHub QA repo のみに作成。セッション固有・`readOnly:true`・`device:founder`。1操作ずつ `live-control/mofu-vis-e-resume-20261017-p6q8n4.json` を更新し、その操作IDが `state.lastCommand` に反映された後、スクリーンショットと次の操作を判断。
3. 公開画面のGenesis記事、Notes各タブ、DEAR ATELIERのフォームを補完。以前に見たDiary保存を重複実行しなかった。内容の意味や自由文の解析は行わない。
4. `live-control/mofu-vis-e-resume-20261017-p6q8n4.json` に **`{"id":"e5-end-stop","op":"stop",...}`** を送信。コミット `221f73e306cd7dc2ded1610ac1e39e1550536fb7`。
5. `live-results/mofu-vis-e-resume-20261017-p6q8n4/state.json` で `lastCommand=e5-end-stop` と記載の `stopReason` を確認。**停止ACK取得済み。ブラウザを動かしたまま残していない。**
6. この報告はQAリポジトリの本ファイルに独立保存。旧報告、他隊員セッション、製品リポジトリ、Cloudflareには変更なし。
