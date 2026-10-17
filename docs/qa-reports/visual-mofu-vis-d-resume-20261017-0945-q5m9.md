# ジロジロ隊D 視覚監査報告 / ROOM NULL

- 実施日: 2026-10-17 JST
- Production: https://niko2atelier.com/
- 今回の固有セッション: `mofu-vis-d-resume-20261017-0945-q5m9`
- 引き継ぎ元・証拠再利用: `mofu-vis-d-final-20261017-0620-n6r2`（同担当D、06:51 JSTに `infrastructure_idle_timeout` 停止）
- その他の旧D試行: `mofu-vis-d-20261017-0555-qp8x2`, `mofu-vis-d-recover-20261017-0605-z7p4`, `mofu-vis-d-retry3-20261017-0614-p2v9`（途中で停止・途切れたため本判定は最終旧D＋今回の実画面）
- 環境: GitHub既存 observer-driven WebKit, `device: founder`, viewport 430×932, mobile/touch, `readOnly: true`
- 境界: Production・Productコード・Identity・D1に変更なし。外部フォーム送信・自由文投稿なし。今回の `blockedWrites: 17`。Codex/Work/NIKO2-AUTO/有料追加サービス不使用。
- **明示停止確認**: 今回の `state.json.lastCommand = "dr31-stop"`, `stopReason = "D visual audit complete: ROOM NULL door, interior, curtain/light visual taps, Diary link and back verified; predecessor Cabinet/CHANNEL 00 evidence reviewed."`; `error: null`。
- 判定契約: 操作は実画面の表示に基づく。実際の画像を取得して目視。DOMやクリック成功だけを「ビジュアルPASS」に代用していない。旧Dのスクショも実画像をダウンロードして目視確認した。

## 初見の印象（原因・過去設計を参照せず固定）

WORLDからROOM NULLへ至る扉は画面を大きく使い、白と金色の装飾・紫色の窓が画面中央にまとまっている。室内は柔らかな明るい写真表現で、寝具、本、PC、右側のチェストの画角に目立つ破綻や主要部品の過大cropなし。Cabinetの明るい展示画面、CHANNEL 00の暗いPC画面は異なる施設としての差があり、現状「ここだけ画風が突然破綻した」とまでは言えない。一方で、室内の見出しだけが明るい壁に溶け込んで読みにくい。

## 確定した画面上の不具合

**P3 / 扉銘板と室内タイトルの表記差**

- 現場: WORLD → 右のROOM NULL入口。扉上部の金色の銘板。
- 操作: WORLDのROOM NULLをタップし扉画面を表示（`dr24-roomnull`）。扉画像を拡大して目視。
- 観察: 銘板は **`ROOMNULL`** と間を空けずに印字されている。一方、室内見出し・WORLDのリンク名は **`ROOM NULL`**。
- 比較: 同一施設の名前として表記ルールが揃っていない。意図的なロゴ処理の可能性は残るためP3。
- 証拠: [実画面・扉 (mofu-vis-d-resume-20261017-0945-q5m9)](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/692eb3dae24593e4c7e8e2f29d7a218c765dfb02/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg) / [室内](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/91e3c1bb146ec5689282fc16654b9977eb00f263/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg)

## 目立つ違和感

**P2 / 室内左上の文字・サブラベルのコントラスト不足**

- 現場: ROOM NULL、扉を開いてアニメーションが落ち着いた室内。
- 操作: `dr25-open-door` → `dr26-room-settle`（`look` / 1800ms）。
- 観察: 左上の `WORLD / RN-00`、`ROOM NULL`、`a room that remembers you.`、右上の小さな `RN-00` が明るい壁の上で非常に薄い。大見出しは判読可能だが補足文と小ラベルは目を凝らす必要がある。
- 比較: WORLDの暗い背景上の明るい文字、Cabinetの明るい背景上の濃い見出しと比べ、**この室内だけ情報の輪郭が弱い**。画面美術の破綻ではなく局所的な読みやすさの問題。
- 証拠: [室内の静止フレーム](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/91e3c1bb146ec5689282fc16654b9977eb00f263/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg) / [Cabinet見出し](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c5a194610232e095f0969cb07f229feb7af0ea71/live-results/mofu-vis-d-final-20261017-0620-n6r2/current.jpg)

## 比較対象が足りないもの / 不具合認定しない

**カーテン・照明の切替操作は現行Productionで未確認**

- 現場: ROOM NULL室内の左レースカーテンと右側壁灯。
- 操作: 扉開放後 `dr27-curtain`（31,241をタップ・1200ms待機）、`dr28-wall-light`（366,171・1200ms待機）。
- 観察: どちらも `#room0` のままで表示、操作ボタン一覧、画面内の変化なし。**3つの撮影済み画像（前・カーテン後・照明後）のJPEGファイル・RGBピクセルは完全一致**。室内で確実に見える操作はCHANNEL 00、Cabinet、Diaryへの接続。
- 判断: 現行のROOM NULLではカーテン・照明は装飾だけの可能性がある。**曜日部屋の操作仕様をROOM NULLに押し付けて「故障」とは判定しない**。
- 証拠: [前](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/91e3c1bb146ec5689282fc16654b9977eb00f263/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg) / [カーテンタップ後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/28b07ace02d9277d9f47fdf7f7ae3cdc09dfa8cf/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg) / [照明タップ後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/bb437e295336508f1250acd9cbb65e0cdce7ebd8/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg)

## 実画面で確認できた正常な経路

- **扉の開閉**: WORLD → ROOM NULL扉 → `ひらく`。開扉遷移を経て室内の静止画に落ち着く。横幅430pxに対する主役の不自然な欠落、巨大な救済帯、突然の余白膨張を確認しなかった。[扉](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/692eb3dae24593e4c7e8e2f29d7a218c765dfb02/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg) / [開放直後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/a535718168a5adcdd529f7e3f6d2d5e67a5d7609/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg) / [落ち着いた室内](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/91e3c1bb146ec5689282fc16654b9977eb00f263/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg)
- **Cabinet**: 室内右チェストをタップし展示画面へ遷移。明るい展示画像と戻るボタンを表示し、室内へ戻る。旧Dセッションの実画像・操作履歴で確認。[Cabinet](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c5a194610232e095f0969cb07f229feb7af0ea71/live-results/mofu-vis-d-final-20261017-0620-n6r2/current.jpg) / [戻った室内](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/8cfda7ec274bd5ee05d7219440b6c33b49adc32b/live-results/mofu-vis-d-final-20261017-0620-n6r2/current.jpg)
- **CHANNEL 00**: 室内左PCをタップし専用のレトロPC画面へ遷移。初期画面には `POWER / 接続する` が見える。ここから先の内容・ページ数はDでは未検査。旧D実画面で確認。[CHANNEL 00](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/d338c00112a77ddd932f47a5075c20bc49ba60fc/live-results/mofu-vis-d-final-20261017-0620-n6r2/current.jpg)
- **Diary**: 今回新規にベッド上の大きな本（288,711）をタップして `#diary` に遷移。ページに `← ROOM NULLへ戻る` が表示され、`dr30-diary-return` で `#room0` に復帰。本文入力・保存操作なし。[Diary遷移先](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/48992b2e7f583715e1a502ec249059ab88e658a1/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg) / [帰還したROOM NULL](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/bcd2e84f9d2b12561daaddcb4642be4b91cf08e3/live-results/mofu-vis-d-resume-20261017-0945-q5m9/current.jpg)

## 未到達 / 判定保留

- 曜日ごとの扉・部屋、カーテン開閉の2状態、照明ON/OFFの2状態: 今回Productionの通常WORLD→ROOM NULL導線からは到達しなかった。Previewの姿をProductionの合格根拠にしない。
- CHANNEL 00で `POWER / 接続する` 後の内容と再生動作、音質/FPS、物理iPhone Safari/PWA: 本D監査の判定対象外・未測定。
- 外部からは製品の意図が確認できない場合、上記は必ず「未確認」に留める。

## 結論

- **P1: 0件確認**（監査した範囲に限定）
- **P2: 1件**（室内の文字コントラスト）
- **P3: 1件**（扉のROOMNULL表記差）
- **操作不能と断定できる故障: 0件**
- 本番変更なし。QAリポジトリのこの新規報告ファイルとセッション操作だけ作成。セッション停止確認済み。
