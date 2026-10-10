# 既存5体の証拠監査（2026-10-10）

既存の審美眼・反AI・一般人・夢核・文学の記録を再利用するための読み取り監査。新規ゲームの第一印象形成にこの資料は渡していない。画面の原本は各行のcommit固定URLを参照する。


# 既存 observer 4体の証拠監査（2026-10-10）

## 範囲と結論

対象は `25mochiko25-lang/niko2-atelier-browser-qa` の既存報告・request・control・state・GitHub Actions実行情報。作品に対する新しい審査は行っていない。GitHub connectorをGET用途だけに使用し、remote書込・workflow起動・製品への操作は行っていない。代表画像4点をローカル保存して実閲覧した。

4体の経路・到達点・自発停止は各報告、`state.events`、最終 `state.action` と `live-control` で一致する。全体で到達範囲のイベントエラーは null、pageErrors/httpErrorsは空配列、Actionsはsuccess。ただし、fresh browserの証拠と、観察agentの会話contextの隔離は別であり、後者は記録だけでは証明できない。

## 審美眼2文書の関係

- Issue #4の実行進捗が参照する [aesthetic-20261010-01.md](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/aesthetic-20261010-01.md) を正式参照先として扱う。
- [2026-10-10-aesthetic-01.md](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-aesthetic-01.md) は同じ `aesthetic-20261010-01` セッションの先行詳細報告。
- 詳細版の追加は [7398046](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/7398046bd87b004fa731145429e85ea012080155)、2026-10-10 02:28:18 UTC。
- Issue参照版の追加は [27720fa](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/27720facfa124605a56e50d9a0561ea3d980305b)、2026-10-10 02:34:45 UTC。
- いずれも同一の23イベント・22コマンド（arrivalを除く）・同じ持帰り経路を報告する。別個体・別訪問として数えない。文面は同一ではなく、後発版は要約、先行版は8件の固定画像URL付き詳細記録。
- [Issue #4](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/issues/4) は参照先を指定しているが、「唯一正典」と明示する規約は見つけていない。

## 各セッションの照合

時刻はUTC。`startedAt` はobserver本体の開始、`updatedAt` は最終state発行時刻。Actionsのrun開始時刻と同一とは限らない。

| 個体 | session | startedAt → updatedAt | イベント / arrivalを除くコマンド | run |
|---|---|---|---|---|
| 審美眼 | aesthetic-20261010-01 | 02:17:47.519 → 02:27:23.333 | 23 / 22 | [38016402706](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38016402706), success |
| 反AI | anti-ai-20261010-02 | 02:29:41.308 → 02:31:32.752 | 6 / 5 | [38017126729](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38017126729), success |
| 一般人 | ordinary-20261010-03 | 02:33:35.488 → 02:37:53.851 | 12 / 11 | [38017370387](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38017370387), success |
| 夢核 | dreamcore-20261010-04 | 02:39:12.470 → 02:43:37.997 | 11 / 10 | [38017708893](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38017708893), success |

4体はすべてobserver-driven、WebKit、mobile=true、touch=true、390×844。`error=null`、全 `events[*].error=null`、`pageErrors=[]`、`httpErrors=[]`。各イベントは別のcommit固定screenshotUrlを持つ（23/6/12/11 URL）。最終controlのJSON内容は各 `state.action` に一致し、op=stop、reasonは `visitor_finished:` で始まる。無操作timeoutやworkflow打切りを離脱理由にした記録ではない。

### 審美眼

原文：
- [Issue参照要約](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/aesthetic-20261010-01.md)
- [先行詳細報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-aesthetic-01.md)
- [request](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-requests/aesthetic-20261010-01.json)
- [control](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-control/aesthetic-20261010-01.json)
- [state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/aesthetic-20261010-01/state.json)

イベント照合：入口→WORLD/INTERACTION/WELCOME→Garden開始（e6）→香水瓶1/5（e7）→机のメモ（e9）→カップ2/5（e10）→くま3/5（e12）→鍵4/5（e14）→砂時計5/5＋門案内（e16）→門（e17）→白い街（e18）→タイル（e19）→持帰りカード（e20）→Diary（e21）→待機（e22）→終了（e23）。

停止原文の要点：`I have seen a complete keepsake loop and am not pulled into another room now. I stop voluntarily; deeper maps, audio, animations remain unassessed.` 1回の持帰りループに満足し、次室へ進む即時動機がないという報告に一致。

留保：要約版の「Gardenの5個の断片には固有名/ID/時刻/短文」は、香水瓶・カップ・くま・鍵の4カードではstate本文から直接確認。砂時計後e16は5/5と門案内となり、5件目の名称/ID/時刻/短文自体はこのstate本文に収録されていない。「5/5達成」と「4カードの名称/ID/時刻/短文」を分けるのが厳密。

未評価：Hotel、Perfume本編、Lab、Cabinet等の奥のマップ、音、連続アニメーション、実機iPhone/Android、他人の趣味、人間の継続率。待機前後の静止画はあるが、動画による連続アニメーション品質評価ではない。

### 反AI

原文：
- [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-ai-skeptic-02.md)
- [request](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-requests/anti-ai-20261010-02.json)
- [control](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-control/anti-ai-20261010-02.json)
- [state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/anti-ai-20261010-02/state.json)

イベント照合：arrival→入口→WORLD→INTERACTION→WELCOME→Garden招待（e5）→stop（e6）。Gardenの「この空へ入る」を押すcommandはない。stop前後も招待文・この空へ入る・0/5のstate本文が残る。

停止原文の要点：`I voluntarily left without pressing 'この空へ入る'. This is a bias-sensitive gut reaction, not evidence that the later content, text, or overall artwork is bad.` 光沢・花・アーチ等の既視感で体験前に興味が尽きたという報告に一致。報告追加は [cfad48c](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/cfad48c2f0df8eb0df92c666c796237e3ea3c9fe)、02:31:51 UTC。

未評価：Garden収集操作、隠しメモ/分岐、門、Diary、他map、後半文章。「サイト全体がチープ」「文章が悪い」「操作に失敗した」は報告自身が未検証とする。音・連続アニメーション・実機品質も静止画から未評価。

### 一般人

原文：
- [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-ordinary-03.md)
- [request](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-requests/ordinary-20261010-03.json)
- [control](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-control/ordinary-20261010-03.json)
- [state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/ordinary-20261010-03/state.json)

イベント照合：入口→Tutorial3枚→Garden開始（e6）→くま1/5（e7）→閉じる（e8）→カップ2/5（e9）→閉じる（e10）→花を狙ったtap（e11）→stop（e12）。stop時state本文も2/5。

停止原文の要点：`the repeated fragment-card format and unclear reason to collect all five did not pull me onward today. I left at 2/5 naturally, without testing the door, Diary or deeper maps.` 残り3個を集める動機がまだ見えず今日は止める、という報告に一致。報告追加は [418ce17](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/418ce1762c52ac6abbb189c351e0a6dacb571360)、02:38:16 UTC。

操作・可視証拠の留保：
- e11 `o10-flower` はtap(x=61,y=353)。noteは左の花束を狙う。
- 最終controlsの「花に触れる」rect=(-17,293,140,122)と「石の柱を軽く叩く」rect=(51,192,104,210)は、この座標で重なる。
- 応答としてstate.textに「石の奥から、誰も使っていない食器の音が返った。」が追加され、カウンターは2/5のまま。
- 代表画像e11では2/5は目視できるが、その一行はviewportに見えない。runnerのtext取得は `document.body.innerText` でありviewport可視フィルタをかけていない。
- 確認済み範囲は「花を狙ってタップ、DOM textに一行追加、加算なし」。花ハンドラ実行や詩句の画面内可読表示までは未証明。これだけで新規UIバグを断定しない。

未評価：2/5以降の変化、残り3個、隠しメモの意味、門、Diary、その他map。音・連続アニメーション・実機操作も未評価。

### 夢核

原文：
- [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-dreamcore-04.md)
- [request](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-requests/dreamcore-20261010-04.json)
- [control](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-control/dreamcore-20261010-04.json)
- [state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/dreamcore-20261010-04/state.json)

イベント照合：入口→Tutorial3枚→Garden招待（e5）→右上の夢の見覚えtap(x=348,y=70,e6)→「庭が、空よりも高く昇りはじめた。」→待機して浮上庭園（e7）→花弁（e8）→持帰りカード（e9）→Diary（e10）→stop（e11）。通常の「この空へ入る」は押していない。

停止原文の要点：`this hidden detour and the solitary petal felt specific, quiet and appealing. I carried the petal into Diary and now stop satisfied after one surprising loop.` 意外な隠し経路と持帰りに満足して終了という報告に一致。報告追加は [8516904](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/8516904798da8dce914cb81768f834ff38f95881)、02:44:03 UTC。

未評価：通常5/5 Gardenルート、Hotel、Perfume、残りmap、音、実機。静止画に依存するため連続アニメーション品質も未評価。

## 初見・事前情報分離の証拠と限界

以下の開始commitで `qa/live-observer.mjs` を読み、いずれも同じblob SHA `4cf6739260d29e306fd24a1d899e3ea15ba78b67` を確認した。

| session | 実行開始commit |
|---|---|
| aesthetic-20261010-01 | [d90f84d](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/d90f84d810272265135877a0cab3b25f9116f5cd) |
| anti-ai-20261010-02 | [3b25b82](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/3b25b8241c1e219ce4811ae2fcab109e36c0cdff) |
| ordinary-20261010-03 | [b441e5e](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/b441e5e1b1ab05f153177514781ba3917479dfe8) |
| dreamcore-20261010-04 | [bbc9145](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/bbc9145f49cf20ace94a9214932e9cdd77e2b621) |

runnerは `browser=await webkit.launch({headless:true})`、`context=await browser.newContext({...profile,locale:'ja-JP',timezoneId:'Asia/Tokyo'})`、`page=await context.newPage()` を各実行で行う。保存storageStateの再利用はない。各request/control/resultsのsessionも固有。ブラウザ状態がfreshである証拠はある。

指示上の分離：
- [Issue #4](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/issues/4) に、製品ソース/Founder私的構想/他の訪問者の状態・理由・感想を読まず自己session画面だけで第一印象を作る、と明記。
- [AGENT_HANDOFF.md](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/AGENT_HANDOFF.md) と [LIVE_OBSERVER.md](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/LIVE_OBSERVER.md) に同趣旨の未読・screen-led・固有session指示。
- 審美眼requestは `Do not read founder specs or other visitor results; choose actions from what appears onscreen.` と明示。
- 反AIrequestは `Fresh simulated viewer`、`Choose from actual current screen; leave naturally.`。
- 夢核requestは `Browser interactions from what is visibly there; natural voluntary stop.`。
- 一般人requestはpersona=first-time、mode=observer-driven、device=mobile等のみで、未読/会話context隔離の独自文言はない。

限界：requestのpersona/observationはブラウザrunner内で認知的隔離を強制する仕組みではない。別sessionは別ブラウザ状態を意味するが、別agent会話contextや先行reportの未読を技術的に証明しない。4体の初見独立性を完全に実証したとは表現しない。詳細審美眼reportのβ節にはFounder確定の世界観に関する記載があるが、それが初見前の知識か後の集約条件かはこの記録だけでは判別できない。

## 代表画像の実閲覧

以下のcommit固定画像をGitHub connectorからbase64で取得し、view_imageで目視確認した。局所的な到達点の裏付けであり、全イベント画像を新規審査したものではない。

| session / event / time | commit固定screenshotUrl | ローカルファイル | 目視した範囲 |
|---|---|---|---|
| 審美眼 e22 / 02:26:58.892 | [53ef51a画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/53ef51a718734e0c031911d6edf0a9d47846ada8/live-results/aesthetic-20261010-01/current.jpg) | `aesthetic-e22-diary.jpg`（監査者のローカル写し） | Diary上部、時刻、持ち帰った夢の小画像付き案内帯、戻る、今日を残す入力群 |
| 反AI e5 / 02:31:03.462 | [c3a9383画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/c3a938311786adf3171999dc7910cb954e677bd8/live-results/anti-ai-20261010-02/current.jpg) | `anti-ai-e05-garden-invitation.jpg`（監査者のローカル写し） | Garden絵、招待詩句、「この空へ入る」ボタン。収集開始前 |
| 一般人 e11 / 02:37:20.945 | [617603f画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/617603febb4368eb37ea79932b8da30435240670/live-results/ordinary-20261010-03/current.jpg) | `ordinary-e11-flower-target-response.jpg`（監査者のローカル写し） | Garden、左下2/5、カード閉状態。DOM textの一行はviewportで目視できず |
| 夢核 e7 / 02:41:49.715 | [34ee433画像](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/34ee433105f66ca28dee659b5c73bd735bafe943/live-results/dreamcore-20261010-04/current.jpg) | `dreamcore-e07-secret-detour.jpg`（監査者のローカル写し） | 通常Gardenと異なる浮上庭園、水面の花弁、夢を離れる、夢の見覚え |

全報告のraw画像URLをstate.eventsに照合：先行詳細審美眼8件、反AI2件、一般人3件、夢核3件すべて一致。Issue参照審美眼要約にはraw画像URLはなく、runとstateへのリンクがある。

## 横断比較の基礎（既存報告の整理）

| 分類 | 記録から使える根拠 | 解釈・限界 |
|---|---|---|
| UI操作・迷い | 4体すべて入口とIntroを通過。イベントerrorなし。一般人は2枚の異なるカードで1/5→2/5。審美眼は5/5→門→Diary、夢核は小表示→別庭→Diary | 小文字/淡色の読みやすさは審美眼の具体批評候補。測定値や読むことの失敗、操作阻害という再現実害は未証明。一般人の花/石柱のhit先も未確定 |
| 画像/美術の独自性 | 同じ導入/Gardenで光沢・桃水色・花・アーチを反復と評する記録。審美眼に4カードの固有名/時刻/ID/短文と白タイル→Diary、夢核に隠し分岐と花弁→Diaryの実行証拠 | 既視感は審美眼/反AI/夢核の具体説明付き主観。作品全体の欠陥とは扱わない。深部体験が印象を変える例もある |
| 詩と案内の文章 | WORLD、INTERACTIONラベル、Garden招待、名前付きカード、隠しメモ/応答句が記録に存在 | 存在・到達証拠はあるが文章品質を客観的に欠陥とする材料はない。一般人の応答句はDOM textと画像可視性を分離 |
| 趣味/AI拒否感 | 反AIは意図的な拒否レンズ、一般人は残り3つへの動機が今日は生じず、夢核はliminal的な不穏さを期待、審美眼は形式/反復を批評 | 4体の好みは区別し、実在ユーザーの代表や多数決と扱わない。反AI離脱はAI嫌悪と画像既視感を分離できない |

根拠の段階：再現できた実害はこの4体の訪問記録では確定していない。操作で確認した到達/カウント/持帰りを事実として使い、文字/反復に対する具体批評は検証候補、離脱動機や印象は個人レンズ、未訪問部分は未評価として保持する。



# 文学 observer 完成証拠監査（2026-10-10）

## 範囲と結論

`literary-20261010-05` のrequest・開始commitのrunner・最終state・control・個体別reportを読み取り、代表画像1枚を実閲覧した。報告の経路・3/5での自発停止・4件の固定画像リンクは記録に一致する。文学の制御・workflow起動・remote書込は行っていない。作品に新しい文学評価を加えたものではない。

## 元資料

- [報告](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/reports/2026-10-10-literary-05.md)（取得blob SHA `ceed2c3a7a6d2ffd6a404266ef04571768a95fcd`）
- `ローカル報告原文`（監査者のローカル写し）（統括担当が保存）
- [最終state](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/literary-20261010-05/state.json)
- [最終control](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-control/literary-20261010-05.json)
- [開始時request](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/c6cd9fa8f1b4c57622e8eb14d98d5e6bce48ea0f/live-requests/literary-20261010-05.json)
- [Actions run 38018061081](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/38018061081)

## 完了state/control/reportの照合

時刻はUTC。

| 項目 | 取得・照合した値 |
|---|---|
| session | literary-20261010-05 |
| startedAt | 2026-10-10T02:45:03.217Z |
| updatedAt | 2026-10-10T02:49:01.725Z |
| lastCommand | l12-end |
| イベント | 13件、arrival以外のcommand 12件 |
| 最終action | op=stop、wait=0 |
| stopReason | visitor_finishedで始まり、最終action.reasonに一致 |
| control | 最終JSON内容がstate.actionに一致 |
| エラー | state.error=null、全events[*].error=null、pageErrors=[]、httpErrors=[] |
| 画像 | 13件の異なるcommit固定screenshotUrl |
| 報告中の画像リンク | 庭導入詩・砂時計・香水・鍵の4件すべてstate.eventsに一致 |

経路はarrival（e1）→入口（e2）→WORLD/INTERACTION/WELCOME（e2–e4）→Garden招待（e5）→Garden開始（e6）→机の隠しメモ（e7）→砂時計1/5（e8）→閉じる（e9）→香水瓶2/5（e10）→閉じる（e11）→鍵3/5（e12）→stop（e13）。報告の「入口→Tutorial3枚→導入二行詩→入庭→メモ→砂時計→香水瓶→鍵→自然離脱」に一致。

停止原文の抜粋：

> I have sampled the prose I came to read and leave at 3/5; I have not tested the ending, Diary or any deeper text, nor proved human readers' comprehension.

読むために来た断片を試読し、文学鑑賞として十分と感じ3/5で止めたという個体別reportに一致する。技術的timeoutを離脱理由にしたものではない。

Actions完了・時間は統括担当の取得結果：completed/success。observe job `114112679616` は02:44:30→02:49:05（275秒、4分35秒）、観察stepは02:45:02→02:49:02（240秒）。本監査は開始時run情報を直接取得し、終了status/時間は統括担当の証拠を再利用した。

## 開始・fresh browserの証拠

- [開始commit c6cd9fa](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/c6cd9fa8f1b4c57622e8eb14d98d5e6bce48ea0f)：`qa: start literary critic visitor`、2026-10-10 02:44:25 UTC、変更fileは `live-requests/literary-20261010-05.json`。
- Actions run作成時刻は02:44:27 UTC。observer本体のstartedAt=02:45:03.217とは区別する。
- [開始commitのrunner](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/c6cd9fa8f1b4c57622e8eb14d98d5e6bce48ea0f/qa/live-observer.mjs)：blob SHA `4cf6739260d29e306fd24a1d899e3ea15ba78b67`。既存4体と同じrunner。
- 実行時に `browser=await webkit.launch({headless:true})`、`context=await browser.newContext({...profile,locale:'ja-JP',timezoneId:'Asia/Tokyo'})`、`page=await context.newPage()`。保存storageStateの再利用はない。
- 固有session/request/control/results、Combined Preview、persona=literary、observer-driven、mobile WebKit 390×844・mobile/touchを確認。

## 初見・事前情報分離の限界

requestのobservation原文：

> Simulated reader sensitive to poetry, clichés, metaphor, accessibility. Distinguish game instructions from poetic fragments; decide route from visible UI, stop naturally.

可視UIから経路を決め、詩と操作案内を区別し、自然に止めるという指示はある。request単体には製品ソース、Founder私的仕様、他人の結果の未読やagent会話contextの隔離を明記していない。Issue #4/AGENT_HANDOFF/LIVE_OBSERVERの共通未読指示と、その履行を独立に証明したことは区別する。

requestのpersona/observationはrunnerで独立した認知contextを作る機能ではない。fresh browserの証拠はあるが、観察agentの会話contextの隔離・先行report未読はこのファイル群からは証明できない。

## 代表画像の実閲覧

- event 8、2026-10-10T02:47:25.686Z、action `l07-hourglass`、tap(x=35,y=411)後。
- commit固定screenshotUrl：[10241f6・砂時計カード](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/10241f6deaf0240d5ad3504ad0d1aabadc2f4ae6/live-results/literary-20261010-05/current.jpg)
- ローカル：`literary-e08-hourglass.jpg`（監査者のローカル写し）
- GitHub connectorのbase64取得後、view_imageで実閲覧。Gardenの背景、左下1/5、下部のFRAGMENT/01カード、ID `CG-01-A_01.DRM`、11:47:23、名称「止まりかけの砂時計」、短文「砂は落ちていく。逆さまに。巻き戻るように。」の表示を確認。
- この画像の文字表示と1/5はstate本文・報告と一致。隠しメモ全文のviewport可視表示はこの代表画像では確認していない。全13画像の新規評価ではない。

## 文字についての観察事実・解釈・好み

| 段階 | 既存報告と操作記録から整理できる内容 |
|---|---|
| 観察事実 | WORLDに「夢の入り口は、毎回すこし違う。」、INTERACTIONにSound/触れる/持ち帰る/仕舞うのlabel、Gardenに導入二行が記録される。机tap後にメモ文、砂時計/香水瓶/鍵tap後に異なるカード文がstate本文に入り、1/5→2/5→3/5と進む。砂時計カードは代表画像で文字の実表示も確認 |
| 読解・解釈 | 導入を「場所が記憶を持つ」と読むこと、メモと砂時計を時間の異変で結ぶこと、香りと鍵を不在・残存・記憶で結ぶことは文学レンズの読解。文脈の説明量と単文の読解可能性を分けるという批評は存在するが、人間の理解率は未測定 |
| 好み・批評候補 | 「逆さまに／巻き戻るように」を近いイメージの重ね書きと読むこと、カード形式や夢/記憶/不在のテーマが多量では単調になり得ると感じることは個体の好み・仮説。3断片の試読で作品全体の語彙不足や単調さは確定できない |
| 操作案内 | INTERACTIONをゲーム操作labelとして扱い、詩の謎として批判しないという区別がrequest・action note・reportに一致。ただし全labelの案内効果を検証したわけではない |

state本文に記録された主要文言：
- Garden導入：「席を立ったあとの庭にも、持ち主より長く夢を見るものがいる。」
- 机のメモ：「紙の裏に、消したはずの時刻がひとつ残っている。」
- 砂時計：「砂は落ちていく。 逆さまに。巻き戻るように。」
- 香水：「キャップは常に閉じているのに、帰らない部屋の香りがした。」
- 鍵：「どの扉にも合わない。ただ、ひとつの記憶だけが開いた。」

観察事実としては、上記の試読範囲で各事象の因果関係を説明する文章は見えない。「意図的な余白だと読む」は鑑賞解釈に分ける。

## 未評価・留保

- 残る2つのGarden収集物、5/5後、門以後、Diary、Hotel/Perfume本編、他の深部文章は未確認。
- 音・連続アニメーション・実機挙動は静止画から評価できない。
- 人間の読者理解率、作品全体の語彙密度、大量連続読書時の単調さは未検証。
- runnerのtextは `document.body.innerText` でありviewport可視フィルタなし。stateに記録された文言すべてを同じスクショ画面内で読めたとは主張しない。代表画像で直接確認したのは砂時計カード。
- stopReasonの `their larger causal relationship is intentionally unexplained` の「意図的」は模擬読者の解釈。作者の制作意図をソースや私的仕様から確定した証拠ではない。
- 「夢/記憶/不在の反復」は語とイメージに関する読解であり、各短文に同じ単語が逐語的に反復されるという頻度測定ではない。
- 操作エラー/HTTP失敗は観測範囲で0だが、文学としての良否を証明しない。
- βへの示唆は断片の語彙密度/バリエーションの任意校閲候補まで。意味不明、AI作文、全詩の説明文化、作品全体の文章欠陥という結論は記録で支持されない。

## 最終横断比較への要約

文学はメモ＋3断片の試読で時間・不在・記憶の連想を記録し、3/5で自発的に終了した。UI案内と詩を分け、単文を理解できるとする模擬読者の判断と、説明されない因果関係を分けている。反復/近い比喩/カード形式への批評は具体的な局所批評候補だが、大量読書での単調さや全体品質は未評価。新たに再現できた文章・操作上の実害は確定していない。


