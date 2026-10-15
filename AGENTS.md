# NIKO² ATELIER Browser QA — AI rules

このrepoはブラウザQA用。QAそのものを常時・全面実行するための入口ではない。Founderまたは親タスクが指定した対象だけ検証する。

<!-- CODEX-LIGHT-POLICY:START -->
## Codex利用量: LIGHTが通常運転

週間のCodex / Work枠は希少資源として扱う。通常タスクは **LIGHT**。依頼にない調査・レビュー・QAを「念のため」で増やさない。

- 通常は現在の1エージェントだけで完了する。サブエージェント、並列エージェント、agent-created follow-up task、背景調査は起動しない。
- サブエージェント等へ拡張するのは、Founderが明示したFull QA / milestone / 全体監査、必須のrelease/security gate、または対象検証で広範囲障害が実証された場合だけ。
- 通常PRでCodex Code Review / Security Reviewを自分から依頼・再依頼・待機しない。現在エージェントの対象diff確認で足りる。外部自動レビューは通常の完了条件にしない。
- 読むのは依頼に必要なファイル・文書・履歴だけ。全repo map、無関係なIssue/PR、変更のない状態資料を毎回読み直さない。
- 軽微修正は「対象確認 → 修正 → 影響範囲の最小テスト/ビルド → diff確認 → 終了」。対象外の発見は勝手に別タスク化しない。
- テストは影響範囲を原則1回。失敗または関連変更があった時だけ再実行する。全suite、全browser、全viewport、長時間soakは通常タスクでは行わない。
- 同じ状態に対するsearch/fetch/build/deploy/Preview確認を重複実行しない。依存関係とlockfileが変わっていないのに、環境が既に使える場合はinstallをやり直さない。
- 依頼文に仕様・判断が十分含まれる場合、Codex内で広い商品分析や設計会議を再開しない。repo事実が必要な判断だけ調べ、実装へ進む。
- FULLへ拡張する時は、なぜLIGHTでは不足するかを1行で明示してから実行する。規模が大きそうという推測だけでは昇格しない。
<!-- CODEX-LIGHT-POLICY:END -->

## QA固有ルール

- 通常は指定された画面・導線・端末幅・症状だけを確認する。persona総動員、全館巡回、全browser matrix、長時間runは明示Full QA時だけ。
- 1つの症状を複数agentへ重複調査させない。まず1ケースで再現・原因切り分けし、必要性が証明されてから範囲を広げる。
- `AGENT_HANDOFF.md` / `LIVE_OBSERVER.md` / 過去reportsは、その作業に必要な時だけ読む。開始時の全読込は禁止。
- live-control / live-results等を変化がないのにpollし続けない。必要な状態確認を1回行い、待機が必要なら理由を報告する。
- QA結果から勝手に修理・別Issue作成・追加レビューを連鎖起動しない。依頼されたQA結果を返して止まる。
