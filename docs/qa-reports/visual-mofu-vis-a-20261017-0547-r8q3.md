# ジロジロ隊A / 初見ビジュアル監査（独立・Production）

- **Session:** `mofu-vis-a-20261017-0547-r8q3`
- **対象:** https://niko2atelier.com/ （固有 `mofumofu_qa` クエリ付き）
- **検査環境:** WebKit / mobile touch emulation / `device: founder` / **430×932**
- **権限境界:** `readOnly: true`。Productionコード・設定・配信・D1変更なし。スクリーンショットの保存先は既存GitHub Browser QAリポジトリ。
- **視覚ブラインド:** 過去のQAレポート・CSS・修理履歴・設計説明を参照しないまま、実WebKit画像を毎画面確認して初見の所見を確定。
- **実施範囲:** Arrival → Intro 1/2/3 → Garden入口 → 探索開始 → カップ発見・窓を閉じる → 「夢の見覚え」→ クマの別画面 →「夢を離れる」DREAM MEMORY → 窓を閉じる。訪問14状態（到着と停止を含む）。
- **終了確認:** `lastCommand: a13-stop`, `stopReason` 記録あり。 `readOnly: true`、`blockedWrites: 9`。停止済み。
- **判定の厳密性:** これは物理iPhone Safari/PWA検査ではない。DOMの表示・クリック成功だけをVisual PASSとはしない。動画・音・本物の指スワイプ/bounceは未判定。

## 先入観なしの観察結果

### 1. 目立つ違和感 / P1 / Gardenの写真面積と上下帯

**現場・操作:** Intro 3から「夢へ入る」でGarden入口、続いて「この空へ入る」で探索開始。

**実画面:** 430×932でも上下に広い淡い帯が残り、主な写真の範囲はおおむね縦143〜788px（約645px）に縮んでいる。入口だけでなく探索画面でも維持される。上下の帯は合計約287pxで、viewport高さの約31%に相当する。上部には小さな操作、下部には入口ボタンまたはカウンタが載るものの、写真が狭く見えるほどの余白を使っている。

**比較:** Introの写真フレーム（おおむね縦70〜814px）よりGardenの舞台が低くなり、隣接「夢の見覚え」のクマ画面では写真が上下いっぱいになる。同じ庭周辺でカメラの占有面積が急に変わる。**見えた差は確定、設計上必要なのか・誤設定なのかの原因は未確定**。Founder参照端末なので優先度P1。

**証拠:** [Intro 2](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/8873d7c069ad32fe72e7889e21206967a75f296f/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [Garden入口](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/2a0fb818a3446f3128b722ab4c466aeb3eaca193/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [探索開始](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/685ad14ea226f02d82752c5a24a4d7c12c21bace/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [クマの全面写真（安定後）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1ee5725bafc14e2c96b92fb45811b90dce68ee75/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)

### 2. 目立つ違和感 / P2 / Intro 2の操作説明の文字コントラスト

**現場・操作:** Arrivalの「Enter the dream」→ 最初のIntroの「次へ」。

**実画面:** 「INTERACTION」の透明パネル内で `Sound On / Sound Off` と「触れる / 持ち帰る / 仕舞う」が明るい背景と一体化し、文字・輪郭が細く薄い。写真の美しさは保たれているが、説明を読むための情報階層が弱くなる。Intro 1の下部説明窓は比較的読める。

**比較:** 同じIntroの1枚目と2枚目。**可読性の視覚的懸念**であり、ボタン操作不良の確定ではない。

**証拠:** [Intro 1](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/93d8880ef1ff08fc73070b817111e7722af4e808/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [Intro 2](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/8873d7c069ad32fe72e7889e21206967a75f296f/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)

### 3. 目立つ違和感 / P2 / Intro 3の門の主役切れ

**現場・操作:** Intro 2の「次へ」。

**実画面:** WELCOMEの写真では大きな円形門の右端がカード写真領域の外へ続いており、門全体を見渡せない。前2枚より主役の画面占有率が高い。

**比較:** Intro 1の中央奥の景色、Intro 2の遠景の門と対比。**意図的な接写の可能性あり**。画像エラーや明確なCSS欠陥とは断定しない。

**証拠:** [Intro 3](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/6a1685884f9104b00210ed5c2ab6e7b32e4f752e/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [Intro 2](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/8873d7c069ad32fe72e7889e21206967a75f296f/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)

### 4. 目立つ違和感 / P2 / Garden初回発見の小さい窓・閉じるボタン

**現場・操作:** Garden探索で「まだあたたかいカップ」に触れる。

**実画面:** 右下に発見ウィンドウが現れる。写真に対して小さく、FRAGMENT見出し・説明も細く小さい。閉じる `×` の測定上の当たり矩形は約24×23px。実際に `×` をタップして閉じることはでき、元の画面へ戻った。戻った後の写真位置は目視で変化なし。

**比較:** 同じ庭の下部「1 / 5」カウンタやIntro説明窓と並べると、情報表示のスケール感が違う。窓が小さいこと自体の意図は未確認。特に右下と端に寄った文字の可読性を追加比較対象とする。

**証拠:** [カップ発見](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/0da1388ab99eb916a6f907dc7df7590a0108effa/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [閉じた後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5d7f906f1fa3b2ad8f5c1ff0af23f14b7f198754/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)

### 5. 目立つ違和感 / P3 / 右上「夢の見覚え」の存在感

**現場・操作:** Garden入口・探索画面右上。

**実画面:** `夢の見覚え ✧︎` は右上に細く白い小文字。制御領域は約61×30pxで、淡い背景では認識しにくい。ただしタップで**別の全面クマ写真**へ遷移した。

**比較:** 同画面の「この空へ入る」入口ボタン、およびクマ画面左下「夢を離れる」ボタンは、はるかに視認しやすい。右上の操作を目立たせない意図があるかは未調査。

**証拠:** [Garden探索](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/685ad14ea226f02d82752c5a24a4d7c12c21bace/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [クマ画面](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1ee5725bafc14e2c96b92fb45811b90dce68ee75/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)

### 6. 比較対象が足りないもの / 別ルートのDREAM MEMORY

**現場・操作:** 探索中に右上「夢の見覚え」→ クマの画面 →「夢を離れる」。

**実画面:** 大きな白いDREAM MEMORYの窓が現れ、1枚の小さな写真・説明・`言葉を添える`・`Diaryへ持ち帰る` 等が見える。「日記を閉じる」で元のクマ画面へ戻る。

**比較:** B担当が確認する通常Gardenの5発見/Ending/WORLD MEMORYとは**異なる到達ルート**。サイズの統一や1枚/2枚差分はこのセッションでは未比較。現状の別ルートを全館・全GardenのPASSへ一般化しない。

**証拠:** [クマの全面写真](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1ee5725bafc14e2c96b92fb45811b90dce68ee75/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [DREAM MEMORY](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e7f1b575f93e6f970507e0fec4b84b1c3aea17a8/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [窓を閉じた後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/429bf8f069fb4cd2b1dba71f00676b2127b161ab/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)

### 7. 確定した画面上の不具合（判定）

今回の目視範囲で、操作不能や画面完全欠落のような**確定的な本番表示故障は採取していない**。上記P1〜P3は現場で見た違和感であり、原因や回帰であることは未確定。

- 発見窓の閉じ操作：実行成功し、元の画面へ復帰。
- 右上経路：タップ後の初回フレームは淡く見えたが、1.5秒後の再観察画像では鮮明。**淡い遷移中のフレーム単独を画質不良とは判定しない。** [遷移直後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/02a32a3c789d4c3f9f3827aa2f18ad7af30d34d3/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) / [安定後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1ee5725bafc14e2c96b92fb45811b90dce68ee75/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)
- `documentWidth: 430` が観測されたとしても、視覚品質や全ルートの横方向をPASSとは言わない。

## 未到達・未判定

- Gardenの発見残り4つ、再表示、門、Ending、通常のお土産、WORLD MEMORYの1枚/2枚、「言葉を添える」各状態。**隊B等に引き継ぐべき詳細分岐**。
- 入口を越えたHomeの全施設（WORLD/Research Lab/ROOM NULL/Hotel/Perfume/Diary）の巡回。隊Aの担当外。
- 意味のない縦スクロールとbounce：スクロール試行（`a08-scroll-check`）は **WebKit harnessが `mouse.wheel: Mouse wheel is not supported in mobile WebKit` と返して失敗**。本番スクロール障害とは扱わず、スクロール可否は未判定。 [試行時の画面](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1169e3026884a883dc08a4dc6eb81aa9dd57893d/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg)
- サウンド・FPS・継続アニメーション・PWA実機の完成度は未判定。画像の全シーンのロード時間・通信速度は実測していない。

## 証拠画像（GitHub内保存済・コミット固定URL）

次の画像はすべて既存WebKit runnerがGitHubに保存した**実スクリーンショット**。固定commit URLにより後日の `current.jpg` 上書きとは独立して参照できる。

| 画面 | 固定画像 |
| --- | --- |
| Arrival / HOME前 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/530f590d3a5abd8ee61ca613453fad1d416b699b/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| Intro 1 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/93d8880ef1ff08fc73070b817111e7722af4e808/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| Intro 2 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/8873d7c069ad32fe72e7889e21206967a75f296f/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| Intro 3 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/6a1685884f9104b00210ed5c2ab6e7b32e4f752e/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| Garden入口 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/2a0fb818a3446f3128b722ab4c466aeb3eaca193/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| Garden探索 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/685ad14ea226f02d82752c5a24a4d7c12c21bace/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| カップ発見 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/0da1388ab99eb916a6f907dc7df7590a0108effa/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| カップ閉じる | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5d7f906f1fa3b2ad8f5c1ff0af23f14b7f198754/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| クマ別ルート安定後 | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1ee5725bafc14e2c96b92fb45811b90dce68ee75/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| DREAM MEMORY | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e7f1b575f93e6f970507e0fec4b84b1c3aea17a8/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |
| DREAM MEMORY閉じる | [画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/429bf8f069fb4cd2b1dba71f00676b2127b161ab/live-results/mofu-vis-a-20261017-0547-r8q3/current.jpg) |

### ハンドオフ
同じGardenでも入口・通常探索・「夢の見覚え」分岐・DREAM MEMORYでは異なる画像レイアウトが見えた。**ルート / 操作 / 状態ごとに独立した検査単位として扱う。** 隣接シーンとの差があること自体は証拠だが、施設全体のデザイン違反という判定には他ルート側の比較を要する。修理指示ではなく、独立した初見視覚所見を残す。
