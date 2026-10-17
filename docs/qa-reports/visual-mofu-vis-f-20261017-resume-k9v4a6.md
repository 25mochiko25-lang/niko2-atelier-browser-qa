# ジロジロ隊F 視覚監査・引き継ぎ完了レポート

- 監査日：2026-10-17（JST）
- 対象：Production `https://niko2atelier.com/`
- 基準：430×932、mobile/touch/WebKit、`device: founder`、`readOnly: true`
- 主担当：F「Hotel / Perfume / CHANNEL 00 と施設横断」
- 旧セッション：`mofu-vis-f-20261017-0945-xj72`（前担当が `f58` まで操作し、`infrastructure_idle_timeout` で終了）
- 引き継ぎセッション：`mofu-vis-f-20261017-resume-k9v4a6`（`r01` から `r55`。後述の並行操作による重複 `r37` を含む）
- **明示終了：`f-resume-stop-20261017-k9v4a6`、`state.stopReason` 反映確認済み（2026-10-17 13:26 JST）**
- 継続セッションの `blockedWrites: 34`。ブラウザ内でGET/HEAD以外をブロック。Production / Identity / D1 / Productコード / 配信は変更していない。
- 判定：実際に保存されたWebKit JPGを**表示して目視**。DOM情報やタップ成功のみで視覚PASSにしない。

## 1. 確定した画面上の不具合

### F-01 / P2：CHANNEL 00 ディレクトリ最下段のリンクが固定フッターに隠れる

- **現場・到達：** HOME → WORLD → ROOM NULL → ノートPC → CHANNEL 00 → POWER → リンクディレクトリ。
- **何をしたか：** `r49` でディレクトリへ戻り、`r50` で標準キーボード PageDown、`r53` で End を試み、`r51` で下端のごく細い可視部分をタップ。
- **何が見えたか：** 430×932の基準表示で `lost_page.html` のリンク領域が画面下の「閲覧の断片を持ち帰る」固定帯に大きく隠される。後で現れた `RESTORED: mirror/last_seen.html` は通常表示に収まらない。細い上端だけを押した `lost_page.html` は404演出へ遷移し、単純なリンク切れではない。
- **なぜ異常か：** 同じリンク一覧の先行7件は高さを持つ押せそうなボタンとして見えているのに、最下段だけ大部分が不可視で、操作の格が落ちる。
- **画像：** [ディレクトリ下部](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/4432b7f635765577e2996f48f1cc6d520ab08f83/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>) / [キーボード End 後も同じ](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/70a6943e697ba51b21e0040677ba0770aa6a6534/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>) / [細い部分から遷移した404](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/65d2dff30ce10aa9a904fd21db38e9201d5b702/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>)
- **限定：** 標準ホイール操作がモバイルWebKitランナーで非対応のため、**実機iPhoneの指スワイプでスクロールできるかまでは未証明**。「常にアクセス不可能」と断定しない。初期描画でリンクが隠れる視覚的不具合は確定。

### F-02 / P2：Hotel Somniaで二品選択後、追加メニューが選べそうに見えるのに反応を示さない

- **現場・到達：** CHANNEL 00 → Hotel Somnia公式頁 → 現在のホテル → CHECK IN → Tea for Nobody と Blue Hour を選択 → 「メニューを眺める」。
- **何をしたか：** 旧セッション `f38` で `2 / 2` 表示後に一覧を開き、`f39` で第三のメニュー行（Yesterday側、x150 y316）をタップ。
- **何が見えたか：** `2 / 2` なのにメニュー行は先行状態に近い見た目を保持し、タップ後も画面・選択数に変化も、明瞭な拒否フィードバックもなかった。
- **なぜ異常か：** 「お二つまで」という上限を示しているなら、追加選択できない項目を利用者が区別できる見た目が望ましい。価格や商品名だけでは状態が分からない。
- **画像：** [2/2でのメニュー](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/29808d68e58310078c6ae0662241d9ef08882557/live-results/mofu-vis-f-20261017-0945-xj72/current.jpg>) / [第三の行をタップ後も変わらない](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/528d429edcc3bf02ef524909ea35083500dcd390/live-results/mofu-vis-f-20261017-0945-xj72/current.jpg>)
- **限定：** この観察だけでは内部の disabled 属性や仕様意図を断定しない。**画面上の状態表示と反応の欠如**を指摘する。

## 2. 目立つ違和感・可読性懸念

### F-03 / P2候補：Hotel Somniaのルームサービス窓の低コントラスト

- **現場：** 最初の CHECK IN 後の `0 / 2` メニュー、および `2 / 2` へ戻した状態。
- **何を見たか：** 白い半透明パネルにさらに薄いセリフ体の注記、価格、`SOLD OUT`。背景のベッドやテーブルが透けて、情報が溶け込む。
- **比較：** 同施設のFRONT DESKやチェックアウト画面では重要テキストのまとまりが比較的明確。CHANNEL 00のBBSやディレクトリは実用テキストの輪郭がかなり強い。施設固有の雰囲気は保てているが、実用メニューの判読性が落ちる。
- **画像：** [Hotel最初のメニュー](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/ec70af8ff3fba7720782430c7762f62858f61581/live-results/mofu-vis-f-20261017-0945-xj72/current.jpg>) / [2/2時](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/29808d68e58310078c6ae0662241d9ef08882557/live-results/mofu-vis-f-20261017-0945-xj72/current.jpg>)
- **分類：** 美的違和感としてP2候補。輝度の異なる実機画面で可読性確認が望まれる。

### F-04 / P2候補：Perfume Morgueの調香台で文字の縮尺が急に細かくなる

- **現場・到達：** Garden完了後のNEXT PLACES → `PERFUME MORGUE` → `調香台へ` → TOP / MIDDLE / LAST素材追加 → 香りを定着。
- **何を見たか：** 入口では短い文章と大きなボトルが主役、完成画面では生成ボトルと香水タイトルが大きく出る。一方、中央の素材選択・濃度選択では二列メニュー、三段管理、注記、5種類の濃度ラベルが縦に密集して、一部の注記・副題がかなり細い。
- **比較：** 同じPerfume施設の入口・完成画面と比べて、操作中だけ印象が「美術鑑賞」から「小型の管理表」に急変する。3層の独立選択は視覚上分かるので、全体破綻とはしない。
- **画像：** [調香台初期](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/0c8df4db1c035fcdd1e1b7c71d1dea44156545cf/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>) / [3層選択済み](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/2df456b8fa769792bc3436820b9c5c11f01d1c5e/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>) / [完成画面](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/795108dbf8bdfd30cb09cf38951f41b3e6ad0e94/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>)
- **分類：** 可読性と施設内縮尺の比較に基づくP2候補。演出上の異なる段階を一律に同じ大きさにする提案ではない。

## 3. 比較対象が足りない / 判定対象外

- **iPhone実機操作：** WebKitのモバイル `mouse.wheel` は2回とも未対応だった（旧 `f54/f55`）。引き継ぎ側は `PageDown/End` キーでページの一部を見たが、指スワイプ、bounce、PWA表示、長い連続アニメーション、音声の良否は検証していない。
- **CHANNEL 00のスタイル差：** 花のページ、古い日記、BBS、旧NIKO²サイト、404、天気の白いHTML的なレイアウトはそれぞれ独立した古いWebサイトという世界内演出であり、施設間のデザイン不統一を直ちにバグ扱いしない。代表画像：[花](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1948db8fda22a2d3543c5c2be17aba0036699673/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>) / [BBS](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/585906f772b0fa383789a30b7259be3312ef3b92/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>) / [日記](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/bd5560a341fb6b2d60b73023ab1d9f084ba8d210/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>) / [旧サイト](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/d3b0869e6dcf1562ce6b81892854e56ce8d11ad6/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>)
- **Hotel持ち帰りの意味：** Hotelでは「今夜をDiaryへ持ち帰る」と「CHECK OUT」が別に表示されたが、後者の結果画面でも「今夜の断片はDiaryへ届きました」と出た（旧 `f40`）。仕様上の自動持ち帰りかは不明、**仕様確定なしにProductバグ認定しない**。[結果画像](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/b711cc5d66a18adcb73e2bb1372139e124633f87/live-results/mofu-vis-f-20261017-0945-xj72/current.jpg>)
- **CHANNEL → Diary：** 「閲覧の断片を持ち帰る」でDiaryへ移る操作と画面が観察された（`r54`）。読み取り専用ブラウザ内のローカル表示が中心で、実サーバー永続化の成功を宣言しない。[画面](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/aeb5ae1d8edb3ee625c08dd40fea385eec83e37/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>)
- **ログ上の並行操作について：** `r37` というIDが異なる内容で2回現れる。複数のChat操作が同セッションへ並行送信され、後の `r37` がCHANNELディレクトリ上で別ページを開いた。`r40` の意図と画面が一致しない件は、この操作競合によるものと判断して**本番の誤リンク不具合に算入しない**。ディレクトリに戻した後の `r42` は、目的の `MARI'S PRESSED FLOWERS` を正しく開いた。以後衝突回避のため余計な操作書き込みを中止し、画像検品のみ実施した。

## 4. 未到達・未検証

- CHANNEL 00の `RESTORED: mirror/last_seen.html` はDOMテキストには出現するが画面では下端に隠れ、正規の可視操作だけでは訪問を確認できなかった。強制DOMクリックは実施しない。
- Hotel 2泊目・3泊目の差分、`Yesterday` / `Someone Else's Rain` など別ルートの全画面、ゲストブックの書き込みは未検証。
- Perfumeの全素材・全濃度の組合せ、実際の保存・持ち帰りは未検証。
- アニメーションのフレーム品質、音質・遅延、iPhone Safari実機でのタップ・スクロール・キーボード挙動は未検証。

## 良好だった範囲

- HotelのFRONT DESK→CHECK IN→2品の演出→CHECK OUTの主要画面が表示され、カットシーン後に実際の画像が差し替わる様子を確認した。[Tea for Nobody安定画面](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/82545d66deeae63f615e681f51a9ea3fd7d597cd/live-results/mofu-vis-f-20261017-0945-xj72/current.jpg>)
- PerfumeのTOP/MIDDLE/LAST各1素材、完成ボトル・タイトル・処方内容まで到達。[完成](<https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/795108dbf8bdfd30cb09cf38951f41b3e6ad0e94/live-results/mofu-vis-f-20261017-resume-k9v4a6/current.jpg>)
- CHANNEL 00のディレクトリ、花、BBS、sodaの日記、Cloud Garden Weather、Hotel旧頁、Moonlight Web Ring、旧NIKO²頁、404復帰を観察。単なるエラー画面の404は**意図的演出**と捉え、障害扱いしない。
- 全施設を1つの共通レイアウトへ強制せず、同じ施設内での相対的な縮尺・文字・押しやすさを判断対象にした。

## Founder実機で優先して目視する項目

1. CHANNEL 00 ディレクトリ最下段で指スワイプすると `lost_page.html` と `RESTORED` の全ボタンが視認・タップ可能になるか（F-01）。
2. Hotel Somniaの `2 / 2` メニューが実機でも追加選択できそうに見えるか、押した時の状態が分かるか（F-02）。価格・補足文字・`SOLD OUT` の見やすさも同時に確認（F-03）。
3. Perfume調香台で素材説明、TOP/MIDDLE/LAST管理、5種の濃度副題が通常の端末閲覧距離で快適に読めるか（F-04）。
4. HOTEL 2泊目/3泊目など今回選んでいない分岐。実際のSafari/PWAではスクロール・音・動きの確認は別軸。

## 実行証跡

- [旧F state.json](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofu-vis-f-20261017-0945-xj72/state.json)
- [引き継ぎF state.json（明示停止）](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofu-vis-f-20261017-resume-k9v4a6/state.json)
- [引き継ぎF最終control（stop）](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-control/mofu-vis-f-20261017-resume-k9v4a6.json)
- 公開レポート・スクリーンショットに、私的自由文、認証情報、実顧客情報は含めていない。

**結論：明白な全画面崩壊はこのF経路で見つからず、P2確定2件、P2候補2件。総館・全分岐のVisual PASSは宣言しない。**
