# NIKO² 2026-10-17 Production / Founder端末 監査実測

**名札:** `mofumofu-founder-readonly-prod-20261017`（GitHub監査セッションID、正式Identity署名名札ではない）

**環境:** 本番 `https://niko2atelier.com` / WebKit mobile touch / 430×932 / fresh isolated browser / `readOnly:true` / no Codex, no Work, no NIKO2-AUTO. GitHub Actionsのpublic標準Ubuntu runnerを使用。

**完了:** 35観測点。Gardenの記憶5/5→門→Ending→花弁を持ち帰る→WORLD MEMORY（2枚）→Diary→Home→WORLD→Research Lab入口・入室→Home→WORLD→ROOM NULL扉・開いた室内。停止命令 `m34-stop` 確認。

**外部書き込みの遮断:** `blockedWrites=26`、`pageErrors=[]`、`httpErrors=[]`。これらはブラウザ側の記録であり、サーバ側の署名QA受領証ではない。ブラウザは非GET/HEADリクエストをnavigation前から全遮断。Production / Identity / D1のコード・構成を変更していない。

## 再現済み・修理優先

1. **P1 GardenのFounder端末上下帯:** 初回Garden / 探索中の背景原画は430×645px相当の画像フレームで、画面430×932の上下に約144px/143pxの曇りガラス状帯が見える。Founderの基準端末でこれは救済表示が出ている状態。Gardenの画像・操作位置の基準frameを同時に合わせ、重要なものをcropしないこと。証拠: [Garden WebKit](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e34de3b907b46d9be2d97a37787b62434548268c/live-results/mofumofu-founder-readonly-prod-20261017/current.jpg)。
2. **P1 WORLD MEMORYの主写真が小さすぎる:** 392px幅のdialogに対し主写真printは約142px幅、空いた面積が大きい。SECOND printが重なっても主写真の存在感が薄い。Visual PASSとDOM/overflow PASSを混同しない。証拠: [World Memory / 二枚持ち帰り](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e9a12188f022817c8449108e9e7fabd80f0f1d73/live-results/mofumofu-founder-readonly-prod-20261017/current.jpg)。2026-10-13の別検査は幅147pxを横はみ出し無しとしてPASS扱いしていたが、現在のFounder見た目基準を満たす根拠にはならない。現在GitHubのmain CSS末尾に `α185 recovery` として主写真最大220pxの指定があるものの、今回の実配信は142px。Productionへ無差分で自動昇格しない。

## 追加観察（断定せず）

- **WORLDの画面上下:** 大きな暗色の上下領域があり、画像の美術領域が中央寄り。意図的な余韻か、画面比率の救済帯かをFounder基準で照合する価値がある。Gardenと同じ一律のcrop修正は禁物。[WORLD WebKit](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/00ba955590e4287eb7ca500c4ddd2884ea06b6e5/live-results/mofumofu-founder-readonly-prod-20261017/current.jpg)。
- **ROOM NULL扉・室内:** この2状態は画面全体を使用し、大きな上下の曇り帯は見えなかった。[開いた室内 WebKit](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/59e274a29ad3c356cfcd87d16a0927b5956d73c5/live-results/mofumofu-founder-readonly-prod-20261017/current.jpg)。全操作のPASSではない。
- Garden探索後、Diaryへローカルの持ち帰り表示までは進めた。外部保存の成功は遮断モードでは検証していない。

## 未完了

Hotel / Perfume / Labの各資料や奥の保管室 / ROOM NULL内のChannel・Cabinet・曜日ドア全体 / 記念品の言葉入力を開いたときの縦スクロール / 訪問を跨ぐデータ保存 / 画像読込速度の継続計測 / 実機iPhone PWAの指スクロールとbounce / 音声・連続アニメーション品質 / PCや他スマホは未監査。未実施をPASSとしない。

## コスト・復旧しやすさ

GitHub Actionsのpublic標準runnerはGitHub料金ルール上実行分無料。別サービスのブラウザ画像処理等はその料金ルールに含めない。 `docs/CHAT_READONLY_FOUNDER_QA.md` に新しいChatが継続して操作するための手順を保管。正式なQA名札を後付け創作しない。

[実際の35観測点・各スクリーンショット](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofumofu-founder-readonly-prod-20261017/state.json)
