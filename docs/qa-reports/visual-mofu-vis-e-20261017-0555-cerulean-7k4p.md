# ジロジロ隊E / Production 文字と窓の視覚監査

- 監査日: 2026-10-17 JST
- 対象: https://niko2atelier.com/ の公開UIのみ
- 環境: WebKit / 430×932 / mobile / touch / `device: founder` / `readOnly: true`
- セッション: `mofu-vis-e-20261017-0555-cerulean-7k4p`、復旧用 `mofu-vis-e-20261017-0606-pearl-4m8d`
- **結果: PARTIAL / インフラ中断。見ていない部分を合格扱いしない。**
- 手順: 共通マニュアルと実行手順だけを読んで開始し、過去のQA報告・Product実装コードを参照せずに実画像を初見評価。初回観察後にのみ、停止原因切り分けのため既存QAランナーを参照した。
- 個人情報・自由文: 入力・送信なし。Product実装、Production、Identity、D1、配信は変更なし。

## 確定した画面上の不具合

- **本監査で見えた範囲には、確定できる表示破綻・ボタンの重なり・横はみ出しは記録なし。** ただし全画面を検査できていない。タップが成功したことは視覚PASSと扱っていない。

## 目立つ違和感

### E-01 / P2 / DREAM MEMORY の「何も残さず、アトリエへ戻る」が薄く小さい

- **現場・到達ルート:** HOME → Enter the dream → Intro完了 → Garden「この空へ入る」 → 画面右上の「夢の見覚え ✧︎」 → 白い街 → 「夢を離れる」 → DREAM MEMORY。
- **何を押したか:** 「夢を離れる」でダイアログを表示。続けて「言葉を添える」を押し、入力欄を表示（自由文は入力しない）。
- **何が見えたか:** 白系の大きなモーダルで、主操作「Diaryへ持ち帰る」は水色の幅354px×高さ48pxと明瞭。対して下の「何も残さず、アトリエへ戻る」は極めて淡い細字で白背景に埋もれがち。入力欄を出して縦長になった状態でも同傾向。実際に後者はタップして戻れたため、押下不能とは判定しない。
- **なぜ異常に見えるか:** 同じモーダルにある2つの出口の視認性差が大きく、保存しない選択肢が視覚的に消えかけている。Founder基準430×932でも目視で読み取りづらい。
- **画像（コミット固定）:**
  - [入力欄を閉じたDREAM MEMORY](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5ea57e33e5e5b773446ffa7bd189687a166bdaf3/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/current.jpg)
  - [「言葉を添える」で伸びたDREAM MEMORY](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e9a91d6e5a42c08244dd88f98c1f09ab19e27e3f/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/current.jpg)

### E-02 / P2 / Diary の気分選択・写真カテゴリの文字が淡すぎる

- **現場・到達ルート:** 上記DREAM MEMORYで「何も残さず、アトリエへ戻る」→ AFTER THE GARDEN導線を「完了」→ HOME左側の浮遊する本（Diary）をタップ。
- **何を押したか:** HOMEのDiaryリンク。写真選択「自販機」を続けて押そうとしたが、監査インフラが処理する前に停止し、選択結果は見られなかった。
- **何が見えたか:** Diary見出しと本文には階層がある一方、「静か」「きらきら」「ぼんやり」「ざわざわ」「甘い」「雨っぽい」「眠い」「何もない」のボタン文字と丸印が非常に淡い。写真カテゴリも淡色の白い面に小さな細字。ラベルの一部は非活性要素に見えかねない。
- **なぜ異常に見えるか:** 同じDiary内の青い見出し・通常本文は識別できるのに、操作の選択肢だけ文字色と背景の差が乏しい。44px程度のタップ高そのものより、選べる対象としての視認性が課題。
- **画像（コミット固定）:** [Diary初期表示（最初の930px）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/cb42487de24f085623d471fa03cae804ac4af9fc/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/current.jpg)

## 比較対象が足りないもの

- Diary写真一覧は初期表示で横並びの右端が切れたカードとして見えるが、カルーセルの意図的な見せ方か表示欠けか、ページ移動や選択後の画面を検証できず断定しない。証拠はE-02と同じDiary画像。
- 「言葉を添える」でDREAM MEMORYのモーダルが約上端178pxから約73pxへ伸び、下端まで入りきることは画像で確認。これは入力欄展開に伴うレイアウト変更であり、不要な画面飛び・ネイティブキーボードのズレとは判定しない。
- Home上のFROM THE ATELIERの封筒リンクは表示まで確認したが、開く操作は実行できなかった。[HOME表示](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e49533b8cc5c13e8b18f9d91d3a9378379c6ba3a/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/current.jpg)

## 未到達 / 未確認

- Diary写真の**選択結果**、写真を眺める操作、ページ下部の自由文・「残す」、月の景色、Archive、WHAT REMAINED、無駄な縦スクロールの有無、入力フォーカス・iPhone実機キーボード。
- FROM THE ATELIER本体、記事一覧・長文記事・個々のダイアログ、初回手紙ポップアップ、記事のスクロール・閉じる操作、通知。他チームや既往報告の推測で埋めていない。
- モバイルWebKitのwheel式`scroll`と実機の指スワイプ/bounceは別物であり、未実施の操作を実証済みとしない。

## インフラ停止・終了手続き

- セッション1: `mofu-vis-e-20261017-0555-cerulean-7k4p` は `e15-open-diary` まで `state.json.lastCommand` で確認し、次の `e16-diary-photo-select` を取り込めないまま停止。`failure.json.stopReason = infrastructure_error`、GitHub Contents APIの **409 conflict**。
- セッション2: `mofu-vis-e-20261017-0606-pearl-4m8d` は `r10-after1` までstateで確認。次の`r11-after2` の処理中に同様の **409 conflict**。いずれもProductの画面バグと混同しない。
- 両セッションとも既存GitHub QAランナーが `infrastructure_error` で終了済み。終了後にそれぞれ専用 `live-control/<session>.json` へ `op:"stop"` を記録したが、ランナーが既にいないため **state.stopReasonがnullのまま**。正常なstop ACKは得られなかった。終了済みランナーに続行処理をさせていない。
- [セッション1 failure.json](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofu-vis-e-20261017-0555-cerulean-7k4p/failure.json) / [セッション2 failure.json](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofu-vis-e-20261017-0606-pearl-4m8d/failure.json)

## 判定境界

画面を見て判断できた2項目のみP2（視覚的な違和感）。それ以外にPASSを付けない。再検査時は共有mainへの複数runner同時書き込みによる409競合を解消または減らしてから、Diary下部とFROM THE ATELIERを確認する。
