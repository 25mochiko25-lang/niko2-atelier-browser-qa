# Combined Preview 視覚スポット監査 / mofu-preview-20261021-visual-cc83

日付: 2026-10-21。Founder指定の軽い見た目調査。**製品サイト/Production/Previewは変更していない**。

## 実行条件
- 対象: `https://niko2-atelier-combined-preview.25mochiko25.workers.dev/`
- 既存 live-observer, WebKit / 430×932 / mobile / touch / ja-JP
- `readOnly:true`。新規一時ブラウザ。書き込みHTTPメソッド遮断。実測 `blockedWrites=0`。
- 25イベント（到着・停止を含む）。明示停止 `lastCommand=24`、`stopReason`確認済み。
- `pageErrors=0`, `httpErrors=0`（到達範囲のみ）。
- スクリーンショットは既存のJPEG品質84。原画の劣化やFPS・実機GPU動作の評価には不十分。

## 所見

### A. 導入ボタン白飛び: 今回のWebKitでは再現せず（実機調査必要）
- Gardenの `この空へ入る` を表示。8秒待機後も見た目・レイアウトは安定。押下から探索画面への遷移成功。
- 目視: [導入表示](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/728fc21155a7c8d4d02607735b56719311433835/live-results/mofu-preview-20261021-visual-cc83/current.jpg) / [8秒後](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1393f9ee69d08aff03b6243762fcaaf145a21210/live-results/mofu-preview-20261021-visual-cc83/current.jpg)
- Founderの実機では「一時的に真っ白になり、スクリーンショット操作時に消える」「画面録画に記録されない」との申告あり。**WebKitエミュレーションのPASSは実機症状の否定にならない**。
- 参考: 製品repo `main` の `deployable-site/styles.css` には共通Garden導入ボタンの `color:#fff`、半透明白背景、`backdrop-filter:blur(14px)` がある。ただし配信中PreviewのCSS完全一致は未確認。合成レイヤの異常は仮説であり確定原因ではない。
- 切り分けの第一候補: 実機で物理カメラ撮影して現象を記録し、Preview限定の小さなCSS A/Bで `#beginGarden` の `backdrop-filter` だけ一時無効化して違いをみる（今回は実装なし）。

### B. 同種の「発見した記憶」小窓の上端が内容で動く（比較検出）
- 同じGardenの同役割の発見ポップアップ4件。
- 各状態の可視「閉じる」ボタン `rect.y` は **742 / 741 / 761 / 742 CSS px**。幅・高さ24×23、x=364で一致。
- 特に3件目だけ閉じるボタンが約19px下に移動。説明文の折り返し量とともに小窓の上端が変化。下端近辺は揃う。
- [記憶1](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/44c63a3f1b27df5aab14b357d549f3f1956664f4/live-results/mofu-preview-20261021-visual-cc83/current.jpg) / [記憶2](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/165a1c0b360de75c9afc209aadb93e3bd90b226f/live-results/mofu-preview-20261021-visual-cc83/current.jpg) / [記憶3](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/e5c8ffc8ddc4e51c1f3d62b6c3a58c757ddbb9ba/live-results/mofu-preview-20261021-visual-cc83/current.jpg) / [記憶4](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/d51cecdd3ad88b1cd6329f6213a4118668bdf392/live-results/mofu-preview-20261021-visual-cc83/current.jpg)
- 判定: 仕様優先の**共通部品ジオメトリ不一致候補**。意図的コラージュの整理や削除を意味しない。修正承認前の疑義として記録。

### C. Diaryの保存済みDream Memory詳細: 1件到達
- Garden Ending→持ち帰る→Diary→RECENTのカードを開くまで操作。
- 430×932で詳細モーダルは画面中央付近、保存済み1件の外枠はおおむね x19〜411/y143〜791。写真の重なりは意図的な演出として維持すべき。
- [Ending直後のDream Memory](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/3cee156c1288a0419355877af94c09334304b8af/live-results/mofu-preview-20261021-visual-cc83/current.jpg) / [Diary RECENTから開いた同一記録](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/79eeb6505b757f3c1c7127db88919a1f0505d7e0/live-results/mofu-preview-20261021-visual-cc83/current.jpg)
- **他ワールドの保存済み記録は今回1件しか作っていない**。Diary詳細のワールド横断・文章量別の厳密な寸法比較は未完了。Founder提供の複数スクショには伸縮差があるが、非公開スクショそのものは本public repoへ転記しない。

### D. 画像形状・画質・遅延（抜き打ち）
- 今回到達のGarden入口・探索・ゲート・Ending・Diaryに限り、目立つ欠損、明確な表示破綻やHTTPエラーは観測しなかった。
- **低画質がないと保証するものではない**。JPEG出力と0.9〜1.8秒以上の事後撮影ではロード途中・主観的造形品質・フレームごとの遅延を検証できない。
- 制作上の非対称・意図的な写真の重なりは不具合扱いしない。

## 境界
- 検査対象外: 実機iPhone 15 Plus/PWA、別ワールドの2つの導入画面、既存の個人ログ、全マップ、動画/音声、実表示遅延の定量計測。
- 操作はライブQA repoの新規セッションのみに限った。製品コード変更・デプロイ・D1変更・サブエージェント起動なし。
- session state: [GitHub固定セッションの最新結果](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/live-results/mofu-preview-20261021-visual-cc83/state.json)
