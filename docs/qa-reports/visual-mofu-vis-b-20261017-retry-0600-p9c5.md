# NIKO² ATELIER / ジロジロ隊B・独立ビジュアル監査

- 実施日：2026-10-17 JST（初回05:49頃、再試行06:00頃開始）
- 監査対象：Production https://niko2atelier.com/ （**実際の公開画面**）
- 監査端末：Playwright WebKit / mobile / touch / **430 × 932 CSS px**（Founder参考、物理iPhone 15 Plusではない）
- 方法：**最初にスクリーンショットを目視して初見評価**。過去のQA報告・CSS・修正履歴・設計意図を閲覧せずに監査した。DOMやcontrolsの情報は次の可視操作を選ぶためのみ使用。
- 専用セッション：初回 `mofu-vis-b-20261017-0548-k7r4`、再試行 `mofu-vis-b-20261017-retry-0600-p9c5`。どちらも `readOnly:true`。後者の記録は `blockedWrites:17`、一般訪問の書き込みをブラウザ側で遮断。
- 範囲：Garden 5発見、各FRAGMENT、戻る/再表示、5/5門、Ending、花弁、「持ち帰る」、WORLD MEMORY 2枚、言葉の展開と収納、モーダルの閉じ直後。
- 対象外：コード変更、配信、Identity、D1、自由文の記入・投稿、Diaryへの実保存。製品修理なし。

## 初見の総合判定

**全館PASSではない。** Garden・Endingは実画面で到達したが、Founder基準端末でGarden上下のぼかし帯が大きく、同一Garden内の画面占有率が門で急変。お土産受取後のモーダルを閉じると、花弁再タップでは再表示できない事象を観測した。WORLD MEMORY **1枚のみの表示は未到達**。2枚と1枚の直接比較はしていない。

## 1. 確定した画面上の不具合

### B-01 / P2 / 一度「持ち帰る」後、花弁を再タップしてもお土産を開き直せない

- **現場と到達ルート**：HOME → Garden発見5/5 → 門 → Ending → 帰る花弁 → 「持ち帰る」 → WORLD MEMORY 2枚画面。
- **操作**：WORLD MEMORYの×をタップしEndingに戻る。同じ花弁（画面下部、約 x119/y823）を再タップし、さらに約1.2秒待機。
- **実際に見えたこと**：×でモーダルは閉じたが、花弁の2回目のタップ後は説明文も「持ち帰る」も出ず、同じEnding風景のまま。画像上にある花弁自体は消えず、DOM上の同名ボタンも有効のまま。
- **比較**：最初の花弁タップでは説明文と「持ち帰る」が現れ、次のタップで2枚カードを開けた。以後、同じ可視オブジェクトからは再表示できなかった。**「再取得を許すべきか」という設計上の決定とは別に、見えている操作に反応がない**点を不具合候補と判定。
- **証拠**：[初回の花弁反応](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/7c9e984a7988142bf43c69940983eb467d06bf09/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [受取画面](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/1674a3af49576465eb6bd866cd7718a2777ce464/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [×で閉じた](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/b0e73a93f68f61200d4032061f226161408d806b/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [再タップしても無反応](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/8d00c0d75b548c3b508d4c93a15c8fcd37fa5550/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [待機後も変化なし](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/925cb366ef5c5938ce746fd05ad1d3a043197875/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg)
- **限定**：ページ再読込や新規訪問での再現は行っていない。別の正式な「再表示」入口が存在するかは未確認。

## 2. 目立つ違和感

### B-02 / P1 / 430×932のGardenで風景が中央の細長い帯に押し込まれ、上下が大きくぼける

- **現場**：Garden 0/5〜4/5の探索画面、発見カード表示・収納後も同様。
- **実画面**：鮮明な庭写真はおよそ画面 y143〜788。上下それぞれ約140pxに、ぼかしたグレー〜淡色の帯が残る。主役のくま、テーブル、門は見えるが、画面全体を庭として使っていない印象。下には小さな「x/5 見つけたもの」窓が独立して存在。
- **隣接比較**：同じGardenの5/5門接近場面では写真が430×932いっぱいに広がり、Endingもフルスクリーン。0/5〜4/5だけ画面の占有率が大きく違う。**構図の遷移表現があることと、Founder端末に余白帯が出ることを区別して指摘**。無条件のcover拡大を推奨するものではない。
- **証拠**：[Garden通常](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/7dba1659c5f10fbaa85d18bd3cb6328301fcc275/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [5/5門](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/0ab817611bd7404115612e5379b92a8eb0d568c5/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [Ending](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/713588467ac7b5d8725a5b4d27b8549ada3c17b7/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg)

### B-03 / P2 / Gardenの記憶ウィンドウが小さく、情報・閉じる操作が読み取りにくい

- **現場**：各発見直後、画面右下に重なるFRAGMENT / 01〜05。
- **実画面**：ウィンドウは概ね横約273〜290px、高さ約117〜137px。小さい英字識別子・時刻・FRAGMENT文字が明るい写真／半透明背景上で薄く見える。×閉じるは約24×23pxと小さい。本文は一応判読できるが、デザインの繊細さが可読性に勝っている。
- **隣接比較**：カードの左端が x147 / x139 / x131 付近、上端 y755 / y735 と作品によって微妙に変動する。文章量に応じた自然な寸法差の可能性はあるが、同格5枚の連続閲覧で窓枠の大きさ・高さが微妙に揺れて見える。**見切れ・クリック不可の確定ではない**。
- **証拠**：[砂時計01](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/4de1e8bad3d8fb6bea4d40cef9f70633852edd70/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [香水02](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/826fdc8a74aecdb573f50971f6ed90506bc38c82/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [カップ03](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/fcc406c5296ee09751c4d7dd655640cf46c76378/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [くま04](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/f66bf106f5212b0eb04d8c5c8613ec9c6dc5f718/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [鍵05](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/0f9dfad75217f110da5ed6f407b3c6e62f99d98d/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg)

### B-04 / P2 / WORLD MEMORYの2枚写真がモーダル中央寄りに小さく集まり、写真の細部を鑑賞しにくい

- **現場**：Ending花弁 → 「持ち帰る」 → 「夢から残ったもの」の白いモーダル。
- **実画面**：モーダル自体は画面横幅約390pxあるが、左WORLD MEMORY画像の実表示は約130×170px、右「THING THAT REMAINED」は約90×115px。2枚が中央〜右に寄り、周囲の白い空間が目立つ。重ねたポラロイドの意図は読み取れるが、庭の細部は縮小されている。
- **隣接比較**：Ending背景は写真を画面全面で大きく見せるが、記憶を持ち帰った瞬間に写真がかなり小型化する。写真を「持ち帰る」価値が視覚的に弱くなる印象。**1枚のみの状態が未到達なので、1枚/2枚の相互比較による合否は保留**。
- **証拠**：[Ending](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/713588467ac7b5d8725a5b4d27b8549ada3c17b7/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [WORLD MEMORY 2枚](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/1674a3af49576465eb6bd866cd7718a2777ce464/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg)

### B-05 / P3 / 「言葉を添える」展開後は縦長になるが、閉じれば正常に元の窓へ戻る

- **現場**：WORLD MEMORYの「言葉を添える」。
- **実画面**：展開でモーダルが約 y61〜870 まで伸び、白い入力欄と下部の大きなCTAが現れる。文字入力なしでもテキストエリアが広い。画面外へのボタン消失は観察されず、「言葉を閉じる」を押すと元の2枚表示に戻った。
- **位置づけ**：**確定バグではなく、比較用の観測記録**。擬似ホイールや実機キーボード起動は試していない。キーボード表示によるレイアウトシフトは未検証。
- **証拠**：[言葉展開](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/3b2306df1136f75ef93d4d87fc7a7dc326d0c778/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [言葉収納](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/6f5255aea87606c75c4dd411f6bc6a1b65f19e51/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg)

## 3. 比較対象が足りないもの

- **WORLD MEMORY 1枚表示**：今回、可視操作を進めるとWORLD MEMORY + THING THAT REMAINEDの2枚となった。1枚版へ安全に到達する可視ルートは発見できなかった。**1枚/2枚の見た目一致・サイズのPASS/FAILは付けない**。
- **Ending後の別ルート**：右上「夢の見覚え ✧︎」を押すとHOMEに戻り「AFTER THE GARDEN」説明が表示された。[証拠](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/afdd3befa77b8f02d5732060dd1405e2fc7a51c3/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg)。その後のHOMEで「Enter the dream」をタップした際、一度`#perfume`に到達した。[証拠](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/5ccfbc1032788a972893024752aefaaaaa28eb4c/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg)。Garden再訪の確実な可視導線は今回確立できず、単発経路結果のためGarden自身の不具合とは断定しない。
- **画像読み込み・画質**：スクショのGarden/Ending画像に目立つ全面低解像度化や未読み込みブランクは観察しなかった。ただし表示開始直後から最終表示までの通信・滑らかな動画・FPS・音質は判定していない。

## 4. 未到達・意図的に行わなかったもの

- WORLD MEMORY **1枚版**の実画面と2枚版との直接比較。
- Diaryへの実保存、自由文入力・送信、Private顧客画面、持ち帰りの永続性確認（`readOnly:true`遵守）。
- 物理iPhone 15 Plus実機Safari/PWA、指スワイプのbounce、入力時キーボードとの干渉、音声や動画の時間的品質。
- Garden以外の他隊員担当施設や隠しUI。

## 達成した巡回と代表スクリーンショット

全画像は**GitHubのコミットで固定**。リンク先を開いた時に別時点の `current.jpg` へ置き換わることはない。

| 確認箇所 | 目視証拠 |
|---|---|
| Garden 0/5、写真の上下帯 | [Garden](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/7dba1659c5f10fbaa85d18bd3cb6328301fcc275/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 1/5 砂時計 | [FRAGMENT 01](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/4de1e8bad3d8fb6bea4d40cef9f70633852edd70/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 砂時計を閉じる→再度開く | [閉じる](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/e61227cb6571a9368de9c10830ff37d10b1d4b97/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [再表示](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/68413976fae25bcade2e1bd68b25338b8fbe48ae/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 2/5 香水 | [FRAGMENT 02](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/826fdc8a74aecdb573f50971f6ed90506bc38c82/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 3/5 カップ | [FRAGMENT 03](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/fcc406c5296ee09751c4d7dd655640cf46c76378/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 4/5 くま | [FRAGMENT 04](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/f66bf106f5212b0eb04d8c5c8613ec9c6dc5f718/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 5/5 鍵 | [FRAGMENT 05](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/0f9dfad75217f110da5ed6f407b3c6e62f99d98d/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 5/5 門 | [門](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/0ab817611bd7404115612e5379b92a8eb0d568c5/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| Ending | [Ending](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/713588467ac7b5d8725a5b4d27b8549ada3c17b7/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) |
| 花弁→持ち帰る | [花弁の説明とボタン](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/7c9e984a7988142bf43c69940983eb467d06bf09/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) |
| WORLD MEMORY / 2枚 | [受取モーダル](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/1674a3af49576465eb6bd866cd7718a2777ce464/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) |
| 言葉展開→収納 | [展開](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/3b2306df1136f75ef93d4d87fc7a7dc326d0c778/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [収納](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/6f5255aea87606c75c4dd411f6bc6a1b65f19e51/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) |
| 受取画面を閉じる→花弁再タップ→待機 | [閉じる](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/b0e73a93f68f61200d4032061f226161408d806b/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [再タップ](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/8d00c0d75b548c3b508d4c93a15c8fcd37fa5550/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) / [待機後](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/925cb366ef5c5938ce746fd05ad1d3a043197875/live-results/mofu-vis-b-20261017-retry-0600-p9c5/current.jpg) |

## セッション・停止・境界の最終記録

- 初回セッション：[`mofu-vis-b-20261017-0548-k7r4`](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/tree/main/live-results/mofu-vis-b-20261017-0548-k7r4)。Run [38964979437](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38964979437) はGitHub Contents API 409競合で異常終了。最後に公開された状態は `b15-ending-settle`。花弁操作の結果画像は保存できていない。
- 再試行セッション：[`mofu-vis-b-20261017-retry-0600-p9c5`](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/tree/main/live-results/mofu-vis-b-20261017-retry-0600-p9c5)。Run [38966114242](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38966114242) もGitHub Contents API 409競合により終了した。
- **明示停止命令は発行・保存済み**：[`live-control/mofu-vis-b-20261017-retry-0600-p9c5.json`](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/d412acedaaa96b74b4467ff3cb96031c1c824e40/live-control/mofu-vis-b-20261017-retry-0600-p9c5.json) に `{"id":"br24-stop","op":"stop",...}` を書き込んだ。しかし runner が出力する `state.lastCommand=br24-stop` / `state.stopReason` は**確認できなかった**。最終stateは `br23-reenter-dream`、`stopReason:null`。**両runのプロセスがGitHub上でcompleted/failureとなったことは確認**。セッションは現在稼働していないが、正常停止としてのPASSは付けない。
- 競合はGitHub結果ファイルへの楽観更新時の409であり、NIKO²本番画面の不具合とは別件。他隊員のcontrol/記録は操作していない。
- Productionコード・データ・設定・配信・Identity・D1は一切変更していない。本レポートとQA用命令・スクショのみQAリポジトリに残した。
