# ジロジロ隊B：Production Garden / お土産 ビジュアル監査

- 監査日：2026-10-17（JST）
- 本番：`https://niko2atelier.com/`
- 基準：WebKit / 430×932 / mobile touch / `device:founder` / `readOnly:true`
- 判定：実際にWebKitが取得したスクリーンショットを目視。DOM上のclick成功をビジュアルPASSと解釈しない。
- 初見のGarden評価を先に行い、製品のCSS・過去QA・設計意図には依拠しない。修理・Product変更・配信なし。公開可能な画面のみ観察し、自由文・個人情報は入力・送信していない。
- 本報告は同じB監査の引き継ぎ記録のみ。A/C/D/E/Fなど他隊員の結果は統合しない。

## セッション・停止証跡

| セッション | 確認範囲 | 終了 |
| --- | --- | --- |
| `mofu-vis-b-20261017-0548-k7r4` | Intro→Gardenの5発見、5カード、閉じる/再表示、門、Ending | GitHub保存時の409競合でrunner異常終了。最後に処理されたのは `b15-ending-settle`。未処理 `b16` を実施済みとは扱わない |
| `mofu-vis-b-recovery-20261017-s7k2f91` | Garden再入場→5発見→門→くまの椅子のEnding/糸結び表示 | `br14-ending-wait` の後にGitHub 409競合でrunner異常終了。糸結びのタップ結果は取得できず |
| `mofu-vis-b-recovery3-20261017-v8n6p2` | Garden入口から見える「夢の見覚え」→Ending→花弁のお土産→WORLD MEMORY（二枚）→言葉欄開閉→閉じる→再操作→帰還 | **明示 `bc19-stop` 実行、`state.lastCommand=bc19-stop`、`state.stopReason` 記録済み。 `error:null`、`readOnly:true`、`blockedWrites:12`** |

最終の停止状態： [state.json](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/state.json) / [最後の固定スクリーンショット](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/d2694cdb2bafd9e6614da0e3453ffd70be9ff66d/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。

## 1. 確定した画面上の不具合

### B-01 | P1 | 持ち帰り後の花弁が見えているのに再表示しない

- **現場・ルート：** Ending（`#quiet`）→「帰る花弁」→「持ち帰る」→二枚のDREAM MEMORY→右上の×で閉じる。
- **押した操作：** 画面下部の同じ花弁のタップ領域（約 x86–155, y789–858）を押す。その後1.4秒待ち、もう一度押す。
- **見た結果：** 花弁の操作領域は引き続き `disabled:false` として表示されるが、どちらのタップでも「持ち帰る」や記憶ウィンドウが出ない。画面変化は確認できず。
- **比較対象：** 持ち帰る前の同じ花弁は、1回目で「持ち帰る」を表示、2回目で閉じ、3回目で再表示できた。持ち帰り後でも「夢を離れる」を押すと二枚のDREAM MEMORYが開く。つまり持ち帰り状態によって花弁側だけ操作感が変化。
- **証拠：** [持ち帰る前の表示](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/b360aa1faecb8cb82747f4322e20cb358fffdd4a/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg) / [持ち帰る操作後の二枚カード](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/f9c2564e103dd94ee5c0ce6a0989508574d551d6/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg) / [閉じた画面](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/f7c8bc4d25f0ad63935d48ac46a5046b20083f20/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg) / [再タップ後変化なし](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/fbeaf7d026efff424e7fb049138239be11c293b8/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg) / [「夢を離れる」では開く](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/c30cc59c4c6948d10d1883c4eee8cc6a1947e4e5/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。
- **留保：** 保存を伴うサーバー処理の成否を評価したものではなく、読み取り専用WebKitでの見た目・操作遷移の観察。

## 2. 目立つ違和感

### B-02 | P1 | Founder基準430×932でGarden通常探索に大きな上下ぼかし帯

- **現場・操作：** Intro後「この空へ入る」→Garden通常探索画面。
- **見た結果：** 写真の主領域は概ね y143–789 の約646px。上下それぞれ約143pxのぼかし帯があり、合計で画面高さの約31%を占める。特に上帯が広く見える。
- **比較対象：** 5/5後の門接近、およびEndingは同じ430×932で写真が画面全体に広がり、段階間で急に画像の占有率が変化。写真を単純にcoverして主役を切る案を意味するものではない。
- **証拠：** [通常Garden](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/7dba1659c5f10fbaa85d18bd3cb6328301fcc275/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [門の接近画面](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/0ab817611bd7404115612e5379b92a8eb0d568c5/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [Ending全面](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/bf2088d2ac82dc8730e51ee6af352aefd745f373/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。

### B-03 | P2 | Endingの「持ち帰る」が明るい水面に埋没

- **現場・操作：** Endingの花弁を1回タップ。
- **見た結果：** 中央の「空へ昇った庭から、一枚だけ残った。」と「持ち帰る」が明るい水面の細かい模様に直接重なり、文字とボタン境界が淡く、視認しづらい。押下領域は112×44pxと確保されているが、見た目で主操作と認識しにくい。
- **比較対象：** 同じ画面の左下「夢を離れる」は暗めのピル型で可読性が高い。重要な「持ち帰る」の方が目立たない。
- **証拠：** [花弁を開いた実画面](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/b360aa1faecb8cb82747f4322e20cb358fffdd4a/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。

### B-04 | P2 | 5つの記憶カードが小さく、閉じる部分も狭い

- **現場・操作：** Gardenで砂時計、香水、カップ、くま、鍵をタップして記憶カードを表示。砂時計は閉じて再表示も実施。
- **見た結果：** 各カードは画面の右下に約270–290px幅で表示。薄い本文・小さな英字メタ情報が背景と重なり読みにくい。閉じる×の実測領域は24×23pxと小さい。本文量に合わせてカードの左端/上端が少し動く。
- **比較対象：** その後のWORLD MEMORYでは、約391px幅の明るい大きなウィンドウと44×44pxの閉じるボタンが使われる。両者に固有のスタイルがあることは尊重するが、Garden断片の可読性と閉じやすさは相対的に弱い。
- **証拠：** [01砂時計](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/4de1e8bad3d8fb6bea4d40cef9f70633852edd70/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [02香水](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/826fdc8a74aecdb573f50971f6ed90506bc38c82/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [03カップ](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/fcc406c5296ee09751c4d7dd655640cf46c76378/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [04くま](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/f66bf106f5212b0eb04d8c5c8613ec9c6dc5f718/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg) / [05鍵](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/0f9dfad75217f110da5ed6f407b3c6e62f99d98d/live-results/mofu-vis-b-20261017-0548-k7r4/current.jpg)。

### B-05 | P3 | WORLD MEMORYカードの飾りラベルが極小

- **現場・操作：** 「持ち帰る」で二枚カードのDREAM MEMORYを開く。
- **見た結果：** `WORLD MEMORY` / `THING THAT REMAINED` の写真直下ラベルと `WORLD MEMORY + REMAINS` はかなり細く小さい。一方、メインタイトル・ボタン・文章は読め、全体ウィンドウは430×932の範囲に収まる。
- **比較対象：** 同じウィンドウ内の「夢から残ったもの」「Diaryへ持ち帰る」よりずっと弱い情報階層。装飾的ラベルと考えれば軽微。
- **証拠：** [二枚カード](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/f9c2564e103dd94ee5c0ce6a0989508574d551d6/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。

## 3. 比較対象が足りないもの

- 「夢の見覚え ✧︎」をGarden入口（0/5）でタップすると、画面上の操作だけで `#quiet` へ移動した。ショートカットなのか意図しないスキップなのかは未判定。 [遷移先の実画面](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/32df74569e23f6ebb9dcc87528546eedafedf885/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。
- Endingの景色がセッションで異なり、水面の花弁とくまの椅子の糸結びを実見した。バリエーション自体を不具合認定しない。 [花弁](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/bf2088d2ac82dc8730e51ee6af352aefd745f373/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg) / [糸結び](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/919250958098a6980bf622b1a051858015682dff/live-results/mofu-vis-b-recovery-20261017-s7k2f91/current.jpg)。
- 「言葉を添える」の展開時、DREAM MEMORYは画面内の大きい縦長ウィンドウに変化し、空のtextareaと下部2ボタンは同時に画面内へ収まった。閉じると二枚の元の高さに戻る。入力フォーカス時のキーボード・スクロール移動は実証していない。 [文字欄を開いた状態](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/4a644ab91801da9c609f902416fc42af836477fe/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg) / [閉じた状態](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/6ae4365595a5f50389dcbc3101dace8af5c623c8/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。
- 「アトリエへ戻る」を押すとHOMEに帰り、`AFTER THE GARDEN` の案内が出た。これが予定された帰還演出かは未判定。 [帰還画面](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/2ff5602c6fd8a803794162b628fcc08b81a6401a/live-results/mofu-vis-b-recovery3-20261017-v8n6p2/current.jpg)。

## 4. 未到達・未実証

- **WORLD MEMORYの一枚だけの状態**：二枚（WORLD MEMORY + REMAINS）は確認したが、一枚表示への自然な導線は今回未到達。二枚から一枚へのサイズ比較をPASSとしない。
- `Diaryへ持ち帰る` ボタンの遷移先、投稿・保存の結果：押下していない。readOnlyのため実データ保存を伴う評価は対象外。
- 物理iPhoneの指スワイプ/bounce、画像遅延の定量、音声・連続アニメーションの滑らかさは未検証。WebKitの静止画とUI状態のみからPASSとはしない。
- 縦方向の不要スクロールの再現試験は、対象状態で能動的なスクロール操作をしておらず未判定。

## 非問題として確認したこと

- Gardenの主要5発見は全て操作到達。砂時計の閉じる→同じカード再表示は成功。各カードの内容が入れ替わることは確認した。
- 持ち帰り**前**のEnding花弁は、開く→閉じる→開くを同じタップ箇所で行えた。
- 持ち帰る操作から二枚のDREAM MEMORYへ到達し、言葉欄を開く/閉じる、メインの×で閉じる、さらに「夢を離れる」で二枚に入り直す動作を確認。閉じる操作だけで画面が飛んだとは認定しない。

## QAインフラの別件

最初の2セッションは既存の `qa/live-observer.mjs` がGitHub保存時409競合で異常終了した。Productの表示不具合ではなく、スクリーンショット保存処理の競合。QA・製品コードの修正は今回実施していない。第三セッションは明示stopまで成功。旧二件についてはrunner自体が終了しており、`state.stopReason` は設定されていない。利用者操作の自然終了と偽らない。
