# ジロジロ隊C｜独立ビジュアル監査（2026-10-17）

## 実施条件と終了確認

- **対象：** Production `https://niko2atelier.com/`
- **担当：** WORLD／Research Lab。HOMEから進み、観測台、記録4件、奥の保管室、保管記録・旧端末、運用クリップボード、戻る導線を観察。
- **セッション：** `mofu-vis-c-20261017-0551-j7x4`（他隊員と非共有の新規セッション）
- **表示環境：** Playwright WebKit、`device: founder`、430×932 CSS px、mobile / touch。物理iPhone実機テストではない。
- **安全設定：** `readOnly: true`。初回navigation前のService Worker遮断とGET/HEAD以外のHTTP遮断。最終 `blockedWrites: 29`。正式Identity署名を伴うQA名札ではない。
- **停止：** `c51` に `op: stop` を送信、`state.lastCommand = c51`、`state.stopReason` に監査完了理由の保存を確認。**明示停止済み**。
- **変更：** Productionのコード・設定・データ・配信、他隊員ログには触れていない。QAリポジトリ内のC専用リクエスト、操作、生成画像、当報告のみ。
- **初見の独立性：** 共通マニュアルとブラウザ操作仕様だけを読んで巡回。以下の初見所見を固定するまで過去QA・CSS・他隊員のレポート・設計意図を参照していない。修理・原因調査は未実施。
- [Cセッション状態（停止確認）](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofu-vis-c-20261017-0551-j7x4/state.json)

## 初見の監査結果

**総評：** Research Labの移動・開閉は今回見えた範囲で成立し、MAIN LABとARCHIVE CHAMBERのステージ画像は同等サイズ。記録画像に大きな欠損や横方向の内容重なりは視認しなかった。一方、**Founder基準サイズにしては大きすぎる上下の不使用領域、記録一覧と運用クリップボードの過大な空白**が目立つ。長文の末尾は画面外へ続くが、WebKit QA環境で指スワイプを実証できていないため、閲覧不能とは断定しない。全館PASSではない。

### 確定した画面上の不具合

今回の実画像・操作だけでは、押せない表示ボタン、画像が欠落した状態、本文とボタンの決定的な重なり、横方向にはみ出して読めない記録を**確定できなかった**。以下はまず、観察事実と評価を分けて記録する「目立つ違和感」。

### 目立つ違和感

#### C-01［P2］WORLD：430×932に対して風景が上下に強くレターボックス化

- **現場・到達：** HOME下部のWORLDカード → WORLD。
- **操作：** `c21`、HOMEで見えているWORLDカード部分をタップ。
- **見えたもの：** 430px幅いっぱいのWORLD風景は概ね **y=197〜734（高さ537px）**。上部にタイトルはあるが、タイトル下〜画面中央風景前の暗い帯が約100px、風景の下 **y=735〜932に約197px** の暗い空間が残る。左右の扉は風景の内部で小さめに配置。
- **比較：** 隣接するResearch Labの背景写真は **y=143〜789（646px）** と約109px縦に長い。施設独自の演出は尊重するが、WORLDだけ風景が小さく感じられ、縦長基準端末を十分使い切っていない疑い。
- **画像：** [WORLD全画面（c21）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c70601bbbe3b0faf7d652139f1fb87d93afe98f0/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[Research Lab入口（c22）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/dfc3698399e75c77edc327d7a53abcd6ba28a4ea/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)

#### C-02［P2］Research Lab：メイン・保管室とも下側に大きな曖昧な帯

- **現場・到達：** WORLD左扉 → Research Lab入口 →「入る」→観測台／奥の保管室。
- **操作：** `c22, c23, c35, c42`。
- **見えたもの：** MAIN LABとARCHIVE CHAMBERはいずれも写真が **y=143〜789** 程度で止まり、**下端から画面底まで約143pxが内容のない曇ったグレー背景**。上にはヘッダーがあるので全てを空白とは言わないが、下端は操作にも説明にも使われていない。中央の写真は明瞭。
- **比較：** MAIN LABと保管室では寸法は統一されているため、**「保管室だけ変」ではない**。WORLDとも別の上下帯の作りで、Founderサイズへの適合感に疑いが残る。隠れた操作を拡大して探すことはしていない。
- **画像：** [MAIN LAB（c23）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/64cfa37019f9144317103b4c646fcc97717b1d11/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[ARCHIVE CHAMBER（c35）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/b1eb9041c2caee70cae5ea57e6db7145a02fd633/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)

#### C-03［P2］観測台の一覧ウィンドウ：4件しかないのに下部が広く空いている

- **現場・到達：** Research Lab「入る」→左の観測台。
- **操作：** `c24` で開き、`c25〜c33` で4件を順番に読み、閉じるたび一覧へ戻った。
- **見えたもの：** READING TABLEの窓はおよそ **x=8〜422, y=137〜875**。4件の行は **y=260〜604** に収まるが、最後の行の下 **y=604〜875（約271px）** が白い無地の空き。読める内容のためには明らかに窓が縦長。
- **比較：** 同じ施設の個別記録は写真・本文で縦を使い、同じ大きさの窓にも内容が入っている。「資料一覧」だけ下1/3近くが空く。余白ではなく空の用紙が続く印象。
- **画像：** [一覧（c24）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/02abaec724d83fe61af478fe834a95b80cb4a663/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[資料01（c25）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/f5128fd4f09d10c01fd7ef90eda21e04376e9081/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)

#### C-04［P2］運用クリップボード：通常状態の下部約310pxが空白

- **現場・到達：** MAIN LAB右下の機材→「運用モード」。
- **操作：** `c43` 通常状態を開く、`c46` 小さな異常（画面内演習）を表示、`c47` 切り分けの表示に進む、`c48` で観測台へ戻った。実際のシステム復旧・保存操作は行わなかった。
- **見えたもの：** 窓は **y=137〜874**。NORMAL状態で内容とボタンが **y=563** 付近で終わり、**その下約310px** が空白。DELAYED / CHECKING状態ではテキストが増えて **y=737** 付近まで使うが、同じ大きさの窓なので下の空白は残る。
- **比較：** 直前の観測台一覧と同系統の過大な縦固定。NORMALが最もスカスカ。状態バッジと本文・ボタン自体は見える。
- **画像：** [NORMAL（c43）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e885f5dbff8ce3109cc6ef001aa03b37fd953779/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[DELAYED（c46）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/a138d1fed99ecb7aa6dca265404f18ff6e5ce96f/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[CHECKING（c47）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5477d5d3c61538748f17cfc971cf71de94952ef5/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)

#### C-05［P3］研究資料の極小メタラベルは読みにくい

- **現場・到達：** 観測台の記録1〜4、保管室の資料、運用クリップボード。
- **操作：** `c25, c27, c29, c32, c36, c38, c40, c44` など。
- **見えたもの：** 本文や見出しは概ね判別できる。一方、`MAIN LAB // RECORD`、`OBSERVATION IMAGE`、`RELATED`、`ARCHIVE COPY / VIEW ONLY`、右端の「読む／既読」など一部の小さく薄い文字は、430pxの画像では細く読む負担がある。
- **比較：** 4資料で共通しているため特定1枚の文字縮尺事故ではない。研究所の美術上の細密文字と実用可読性の境目という軽い違和感。
- **画像：** [記録04（c32）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/9fd2678469e3ad6d061f6bbe90d918552c9f6bea/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[一覧（c24）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/02abaec724d83fe61af478fe834a95b80cb4a663/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)

### 比較対象・操作証明が足りないもの

#### C-06［保留・P2候補］長い資料の末尾が窓下端に隠れ、スクロール到達を確認できない

- **現場・操作：** 観測台→記録03「白い試料 M-00」（`c29`）、運用モード→「以前の対応記録を読む」（`c44`）。
- **見えたもの：** 記録03は `Known behavior` 箇条書きの途中で **y=860** に切れ、その先の「Relation」「本人供述」等は画面には現れない。以前の対応記録も「Cause」の行付近で下端に達し、後続の記述が見えない。DOMが保持する後続テキストを目視で読めた扱いにはしない。
- **操作環境の限界：** モバイルWebKitへの `scroll` は `mouse.wheel: Mouse wheel is not supported in mobile WebKit` と失敗（`c20`）。`PageDown` の代替試行（`c30`）でも記録03の表示は移動しなかった。これは**指スワイプで読めない証拠ではない**。実機または指スワイプ可能な別のQA方式での確認待ち。
- **比較：** 記録01・02・04と保管室の短い資料は本文が窓内で読み切れる。長文時だけ続きへの手がかりが視覚的に乏しい。
- **画像：** [記録03（c29）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c8af9ad4a8da490240c92c7619d12f7818d2fe7f/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[PageDown後（c30）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/73b7746c7e2241d10d9cbbbaa3cce029caf5c9b8/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)、[運用の長文記録（c44）](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/f2370a22e5cc0bccb0f00a7074f65bc9624bd1f9/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg)

### 操作を実見して確認できた範囲

- HOME → WORLDカード→WORLD→左扉Research Lab→「入る」→観測台→記録01/02/03/04の開閉。
- MAIN LABから中央奥の保管室→青い返却トレイ資料／オレンジの保留ポッド資料／旧端末N²-Ωの開閉。各資料の画像とフォーマットを比較。
- 保管室の戻る→MAIN LAB、運用クリップボードの「観測台へ戻る」→MAIN LAB、MAIN LABの戻る→WORLD、WORLDの戻る→HOME。**4方向の戻りが画面上で成立**。
- 主要写真はこのJPEG観察では概ね鮮明。画像が未読込のまま残る様子やボタンの目立つ衝突は見えなかった。ただし単発画像から負荷時読み込み速度・原版解像度・動画の滑らかさを合格にしない。
- 読み取り専用の一般Visitorと区別される正式署名QAではなく、HTTP書き込み遮断29件は`state`の記録に基づく。セッション中の一般ユーザーデータの保存・投稿は実施していない。

### 未到達／未検証

- WORLD内右側のROOM NULLとその先の部屋。C担当外でありD担当の検査対象。
- 物理iPhone 15 Plus Safari／PWA、指スワイプとbounce、キーボード表示によるレイアウト変動。GitHub runner WebKitの430×932表示のみ。
- 音質、実時間の演出滑らかさ・FPS、回線速度差や低速読込時の画像遅延。
- Research Labに見えない隠しUI、設計上未公開の施設、他隊員が担当する部分。

## 画像証拠（GitHub上の固定コミット）

以下はQA runner自身がGitHubに保存した実WebKit `current.jpg` を、**画像保存時のコミットSHAを固定して参照**したもの。ブラウザ状態の後続更新で同名ファイルが変わってもリンク先の画像は変わらない。

| 場所 | WebKitスクリーンショット |
| --- | --- |
| WORLD | [c21](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c70601bbbe3b0faf7d652139f1fb87d93afe98f0/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) |
| Research Lab入口／MAIN LAB | [c22](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/dfc3698399e75c77edc327d7a53abcd6ba28a4ea/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [c23](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/64cfa37019f9144317103b4c646fcc97717b1d11/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) |
| 観測台の一覧／資料01〜04 | [c24](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/02abaec724d83fe61af478fe834a95b80cb4a663/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [01](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/f5128fd4f09d10c01fd7ef90eda21e04376e9081/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [02](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5e493c0874118fc4d7a46acef0578f1baf7dee96/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [03](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c8af9ad4a8da490240c92c7619d12f7818d2fe7f/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [04](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/9fd2678469e3ad6d061f6bbe90d918552c9f6bea/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) |
| 奥の保管室／資料／旧端末 | [入口](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/b1eb9041c2caee70cae5ea57e6db7145a02fd633/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [青](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/32bf075eeb8cf33748e27d936840aa854da6c123/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [橙](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/de1dff39fac739fd5dc501a3218e6c0c2c42d9f7/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [端末](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e30ad34849caa611010bb99da641031d3fb49db5/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) |
| 運用クリップボード | [NORMAL](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e885f5dbff8ce3109cc6ef001aa03b37fd953779/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [DELAYED](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/a138d1fed99ecb7aa6dca265404f18ff6e5ce96f/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [CHECKING](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/5477d5d3c61538748f17cfc971cf71de94952ef5/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) |
| 運用の長文記録 | [c44](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/f2370a22e5cc0bccb0f00a7074f65bc9624bd1f9/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) |
| WORLDへ戻る→HOMEへ戻る | [c49](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/2a866a519d7b6baed2a21e5b0d90557790c96db3/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) ・ [c50](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/4cc45bcd2807dd46f2ce20a709bf53647279c545/live-results/mofu-vis-c-20261017-0551-j7x4/current.jpg) |

**優先度の意味：** P1=Founder端末で目立つ明確な崩れ、P2=局所的なスケール/余白/見切れ、P3=軽微な違和感。今回のP2は「画面上で見た強い不自然さ」の評価で、コード原因や事前の修正方針を認定したものではない。

**結論：** Cの担当部分に全館PASSは付けない。WORLDとResearch Labの大きな天地帯、Research Labの記録一覧／運用クリップボードの空白はビジュアル改善候補として残す。長文の読了可能性は未実証。修理・配信・Production変更は実行していない。
