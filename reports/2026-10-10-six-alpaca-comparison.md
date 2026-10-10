# NIKO² ATELIER β｜6体の証拠監査と横断比較（2026-10-10）

## 評価の扱い

6体は、異なる批評の視点を与えたAIの模擬鑑賞者である。人間の評価分布、離脱率、満足度、再訪率を統計的に再現した結果ではない。各観察はCombined Previewの実画面・操作に沿っており、固定スクリプトの診断結果を感想へ変換していない。訪問終了、作品の品質、QA workflowの成功は別々に判断する。

全6sessionの最終controlは `op=stop` で、id・理由がstateに一致した。6observer runsはすべてcompleted/success。合計107件の画面記録・101件の到着後commandがあり、各eventの到達URLはCombined Preview内、スクリーンショットはcommit固定だった。到達範囲のevent error/pageErrors/httpErrorsは0。最終照合時点で実行中Actionsは無かった。[照合データ](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-codex-verification.json)。

この統括担当は初見鑑賞を担当せず、報告確定後に作者の制作思想と他個体の結果を比較した。新規ゲーム担当には作者思想・Issue本文・他評価を渡さず、会話履歴を継承しない担当を用いた。既存5体は固有request/control/fresh WebKit contextと実操作を確認したが、過去のモデル会話contextや作者思想の事前未読まではGitHub証拠から確認できない。ブラウザ状態の分離を、モデル履歴の隔離や実在人間の独立性と同一視しない。

既存5体の事前情報隔離を厳密に確認する最短の方法は、元担当の観察開始前の会話記録・引継ぎ内容を確認すること。その記録が残っていなければ、厳密確認が必要な人格だけを履歴を継承しない担当と新しいfresh sessionで再審査する必要がある。今回は、指定人格の既存の実観察記録として再利用し、独立性を証明済みとは表現しない。記録不足だけを理由に5体を重複起動していない。

同じCombined Preview URLを用いたが、製品のsource SHAを固定した比較ではない。正確な観察状態は各eventの時刻とcommit固定スクリーンショットで参照する。

## 個体別の到達・終了・再訪

| 個体 | 実際の到達・操作 | 初回終了の理由 | 再訪意欲の扱い | 個別証拠 |
| --- | --- | --- | --- | --- |
| 審美眼 | Tutorial→Garden 5/5、隠しメモ→白い街→タイルをDiaryへ持ち帰る。23 events | 1つの持ち帰りループに満足して終了。別mapへ即座に進む動機は生じなかったという自己報告 | 満足終了は拒否ではない。実際の再訪は未検証 | [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/aesthetic-20261010-01.md)・[詳細](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-aesthetic-01.md)・[state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/aesthetic-20261010-01/state.json)・[run](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38016402706) |
| 反AI | 入口→Tutorial 3枚→Gardenの入口。Garden開始を押していない。6 events | 反AIの事前抵抗感と入口美術の既視感から興味を失ったという模擬判断 | 未探索の操作や深部の品質を否定する根拠にはならない。再訪実績なし | [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-ai-skeptic-02.md)・[state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/anti-ai-20261010-02/state.json)・[run](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38017126729) |
| 一般人 | Tutorial→Garden、くま・カップで2/5、花付近をtapしてカウンタ不変。12 events | あと3つ触りたい理由がまだ感じられず、その日の探索を終了という自己報告 | 5/5の後・門・Diaryは未到達。長期再訪や一般利用者の離脱傾向は不明 | [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-ordinary-03.md)・[state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/ordinary-20261010-03/state.json)・[run](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38017370387) |
| 夢核 | Garden開始前の「夢の見覚え」をtap→浮上する庭→花弁→Diary。11 events | 予期しない寄り道と1つの持ち帰りに満足して終了 | 隠し分岐で印象が変わったという記録。通常Garden 5/5等は未検証。再訪実績なし | [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-dreamcore-04.md)・[state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/dreamcore-20261010-04/state.json)・[run](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38017708893) |
| ゲーム | 初回Garden 2/5→「夢の見覚え」直後に城の景色→花弁と一言をDiaryで再表示。Homeの振り返り→二周目Garden 5/5→門→くまの椅子→青い糸をDiaryへ。42 events | 2種類の到達と記念が揃い満足。三周目は今すぐ進まず後日に別の選び方を残したい、と明示して終了 | 同一session内の二周目は実行済み。後日の再訪は本人役の意向で、実測ではない。全分岐数・分岐条件は不明 | [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-game-codex-05.md)・[state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/game-20261010-codex-05/state.json)・[run](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38018079256) |
| 文学 | Tutorial→Garden導入詩→隠しメモ→砂時計・香水瓶・鍵で3/5。13 events | 読みに来た短文を3つ鑑賞して十分と判断し終了 | 残る2つ・門・Diaryは未到達。再訪の意向は報告されておらず、未評価 | [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-literary-05.md)・[state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/literary-20261010-05/state.json)・[run](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38018061081) |

審美眼の2つの報告は同じsessionの要約版と詳細版であり、2体として数えない。上の終了理由は本人役の模擬判断であり、技術的打ち切りから推定したものではない。

## 証拠を点検した結果

一般人レポートの「花を押して詩的な一行が現れた」は、厳密には `tap(61,353)` の狙い、DOM textの石の応答、2/5の維持まで確認できる。花と石の領域のどちらが反応したか、詩句がその時点の画面内で読めたかは確認できないため、花ハンドラ成功・可視の詩鑑賞の証拠には採用しない。runnerの `state.text` は文書全体のinnerTextを含み、全てがviewport内とは限らない。

審美眼は5/5達成を確認できるが、名前・ID・時刻・短文を表示した直接のカード証拠は最初の4枚で、5番目カードの全内容は記録されていない。「全5カードの内容を読んだ」と拡張しない。

固定画像とevent/controlの照合に加え、代表画像を各個体について目視した。文学は砂時計カードと1/5の文字を監査者が直接確認し、4つの画像URLと13event・停止control・報告を照合した。詳細は[既存5体の証拠監査](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-codex-evidence-audit.md)。明らかなコンソール例外やHTTP失敗が無かったことは、到達範囲での観測であり、作品全体のPASSではない。

## 観点別の比較

### 操作性と導線

6体は入口とTutorialを進め、実行した範囲でaction error/pageErrors/httpErrorsは無かった。Gardenの収集、門、隠し分岐、Diaryへの持ち帰りは到達証拠がある。一般人の2/5離脱、反AIの開始前離脱は操作不能による停止ではない。ゲームは初回2/5で門をtapした際は庭に留まり、二周目5/5で門への案内が出た後に別の景色へ進めた。2/5時点の無反応を、条件不明のまま壊れた門とは扱わない。

ゲームの初回寄り道は「夢の見覚え」を押した直後に城の画面へ移った、という操作順の事実まで。押したことが遷移原因か、全分岐の条件や数がどうなっているかは検証していない。夢核の同ラベルからの浮上する庭への到達とまとめて、同じ操作が必ず同じ行き先になるとは主張しない。

ゲームには、くまの断片の丸い＋を保存ボタンと読んでtapしたがカードが閉じた、記録表示と予想した「夢の見覚え」直後に城へ移り少し置いていかれた感じがした、という具体的な摩擦があった。[くまカード](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/bfeb80f50eae9e90e77359f7e40da106089d3f03/live-results/game-20261010-codex-05/current.jpg)・[＋tap後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/85927424231fc86a34956d316ca9dd329a0c5d48/live-results/game-20261010-codex-05/current.jpg)・[初回の城](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/713795c5475faec45573b71b52b1ca21f02d889e/live-results/game-20261010-codex-05/current.jpg)。＋が機能ボタンか装飾か、閉じた原因が外側tapか、移動が先の門tapや時間経過に起因するかは不明。INTERACTIONの選択色、Diaryの固定ナビと写真ラベルの重なりも不明摩擦であり、壊れた機能とは確定しない。

小さく淡い案内文字は具体的な視認性の検証候補。審美眼の[WORLD](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/13fca9285a728014198e0c3a47b15b0877d1dbf1/live-results/aesthetic-20261010-01/current.jpg)・[INTERACTION](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/186e79140ecda2121da9941126a3e8de00c1ee48/live-results/aesthetic-20261010-01/current.jpg)では、明るい画像と半透明板上の小さい低コントラスト文字が確認できる。統括担当もこの2画像を目視した。ただし、この記録だけでは読めない人の割合やタップ失敗を証明できない。

### 画像の既視感・構図・質感・独自性

入口からGardenにかけての淡桃・水色・強い光沢、花・ヴェール・宝石・アーチは複数画面で確認できる。審美眼は反復と過剰に均一な綺麗さ、反AIは既知のAI幻想画像の印象、夢核は甘い幻想寄りで不穏な日常感が弱いと解釈した。これはそれぞれの批評・好みであり、画像の生成手段、盗用、構造破綻の証明ではない。白い街や浮上する庭のアーチ/樹木の反復も、魅力と既視感の双方に読まれている。

一方、Gardenの固有の欠片・日時・隠しメモ、5/5から門への変化、白いタイルの持ち帰り、夢核の寄り道と花弁は画像の一覧だけでは分からない固有の体験だった。画像への第一印象と、操作で生まれる独自性を別々に扱う。

ゲームでは二周目の庭で発見数が0に戻り、鍵・くまの短文は初回と同じだった一方、城の景色と5/5後のくまの椅子という異なる到達例を得た。断片の再読と、場面・持ち帰り物の差異を分ける。違いが何に起因するかは推測しない。

### 文章の読みにくさと詩的な余地

低コントラストや小文字は表示の問題であり、詩の意味の曖昧さとは分離する。文学は隠しメモと砂時計・香水・鍵の3断片を読み、個々の日本語は読める一方、全体の因果関係は説明されていないと区別した。時間の異変、不在、残存、記憶という語やイメージの反復は統一テーマとして読まれ、同時に大量に連続すると似て見える可能性が指摘された。ただし大量の文章は未読であり、冗長・陳腐・意味不明の客観的欠陥を証明していない。[砂時計](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/10241f6deaf0240d5ad3504ad0d1aabadc2f4ae6/live-results/literary-20261010-05/current.jpg)・[香水](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/f2252f8741e6058b09c88f3288265597e9f439d0/live-results/literary-20261010-05/current.jpg)・[鍵](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e36789420e6d0cfecfc35cd1c81924db92759f2d/live-results/literary-20261010-05/current.jpg)。文書全体のDOM textがあるだけでは、画面内で読んだことや理解したことを証明しない。

### AIへの個人的な嫌悪感

反AIパカの抵抗感は設定された批評レンズとして記録する。この訪問はGarden開始前に終わっているため、文章品質、操作の失敗、深部の独自性への評価へ転用しない。既視感とAI嫌悪をこの1個体だけで因果分離することもできない。AI使用を隠す・排除する提案には結びつけない。

### 作品固有の魅力

画面中の小物を触ると記録が生まれ、別の場所で得た物をDiaryへ持ち帰れる。審美眼は1つのループ完了、夢核は意図しなかった小さな分岐からの回収に価値を感じた。これらの到達例が、作者と訪問者の日記・夢のテーマパークという制作思想との接点になる。思想を根拠に可読性等を正当化するのではなく、体験の実証跡がある魅力として扱う。

ゲームは花弁に添えた一言と写真をDiaryから再表示し、二周目に青い糸を追加した。[二周目後のDiary画面](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/b35c11fbca423f74c05a5324f0fad963340053f3/live-results/game-20261010-codex-05/current.jpg)は統括担当も目視し、くまの記録と先の記録画像が縦に並ぶことを確認した。stateには糸と花弁の2名称が記録されている。「持ち帰る」ボタンを押しただけではなく、同一session内の見返し・追加後の保持まで実操作で確認した。長期保存の証明にはしない。

### 初回離脱と再訪意欲

開始前・2/5・3/5・1つの持ち帰り後・二周目完了後という停止地点の違いは記録できる。短い訪問は失敗、長い訪問は品質が高い、という尺度にはしない。ゲームは「毎回すこし違う」案内やNEXT PLACESから実際に二周目を選び、別の場面・記念品を得た。その満足と「別の選び方を後日に残したい」は再訪意向の記録だが、後日の再訪行動・継続率は今回測定していない。

## βでの改善優先度

以下は作品の修正指示ではなく、根拠の強さと期待効果から整理した候補。今回、作品の改修は行わない。P0/P1相当の再現された重大障害は現時点の到達範囲で確認していない。

| 優先 | 重大度・確度 | 根拠 | βでの候補と改善効果 |
| --- | --- | --- | --- |
| 1 | P2・画面上の懸念、実害未確定 | WORLD/INTERACTIONの小さく淡いUI文字、審美眼の具体的指摘、固定画像の目視 | 詩の内容を説明化せず、操作案内と次/戻る等の文字の可読性を実画面で比較検証する。美観を保ちながら案内の見落としを減らす期待 |
| 2 | P2・操作の意味/遷移の疑義、因果未確定 | ゲームの＋tap後カード閉、記録を期待したラベルのtap直後に場面移動。画面と操作系列あり、保存失敗や不正遷移の再現証明はない | ＋のhit判定と閉じる/保存の関係、門操作から移動までのfeedbackを検証する。結果に応じて操作の誤読を減らす。詩的ラベルの自動改名や隠し分岐の全説明は行わない |
| 3 | P3・探索継続の仮説 | 一般人2/5終了に対し、審美眼5/5→門→Diary、夢核の寄り道→Diaryで満足。ゲームはNEXT PLACES→二周目→別の記念品へ進んだ | 5/5や持ち帰りへの自然な好奇心がどこで生まれるか確認する。機能しているNEXT PLACES・見返し・持ち帰りを保ち、隠し要素を全公開せず導線の効果を比較する |
| 4 | P3・美術批評/好み | 入口～Gardenの具体的モチーフと質感の反復への異なる解釈 | ビジュアルをAIの有無ではなく構図・反復・画面固有の驚きで比較する。画像置換やGarden全面改修を前提にしない |
| 5 | P3・文学的な検証候補 | 文学が実際に読んだメモと3断片に時間・不在・記憶の反復。大量の文章は未読 | 断片の語彙・リズム・余韻が連続鑑賞でも変化するか任意校閲する。不可解さや反復の美学を残し、削除や説明化は作者判断に委ねる |
| 別枠 | QA運用・証拠精度 | 一般人の花/石の帰属不明、state.textが画面外も含む | 報告で「狙った箇所」「実際の反応」「viewportで読めた情報」を分ける。未観測の感想・不具合の混入を減らす。作品変更不要 |

## 未検証と実行上の限界

Hotel/Perfume等の未到達ルート、全マップの品質、音、連続アニメーション、実機の指スワイプ、長期保存、後日の再訪はこの比較の対象外。WebKit mobile emulationのwheel非対応はサイトのスクロールバグではない。見つけていない欠陥を不存在と断定しない。

既存Codex/Actions・費用・@codex設定・ローカルproxy障害と画像取得の代替経路は[環境実行記録](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-codex-environment.md)へ分離した。今回の運用変更はQA文書の誤った未採用記述の訂正だけであり、作品の確定済み美学・α Production・Previewのコードと公開設定は変更していない。
