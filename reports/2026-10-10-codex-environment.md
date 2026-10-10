# Codex実行環境・既存QAの確認（2026-10-10）

## 判定と実際の稼働

今回の審査は、接続済みの既存クラウド環境を画像表示に使い、既存GitHub接続と既存の `live-observer.yml` を再利用して実施できた。新しいCodex環境、workflow、APIキー、有料サービス、runner、スケジュールは作成していない。作品リポジトリ、Combined Preview、α Productionへのコード変更・設定変更・デプロイは行っていない。

既存環境は起動待ちからrunning/connectedに移行し、HTTP network policyはenforced、unrestrictedと確認した。ただしローカルshellからは継承proxyの8080番ポートがconnection refusedとなり、QA repoのgit cloneは失敗した。この通信障害を作品の不具合や鑑賞者の離脱として扱っていない。GitHub接続によるファイル読取・QA repo書込は成功し、`github_fetch_file(encoding=base64, ref=スクリーンショットのcommit)` → ローカル復号 → `view_image` によって実際の画面を閲覧できた。別のネットワーク経路や追加環境は作らず、観察を継続した。

## 既存の自動実行

- [live-observer.yml](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/.github/workflows/live-observer.yml)：mainの `live-requests/*.json` のpushで起動。Playwright 1.55.0 / WebKit / 標準Ubuntu runner。各requestはfresh context。観察者が次の操作を選ぶ仕組みであり、完全無人の鑑賞者ではない。20分の無操作と90分のjob上限はインフラ停止として扱う。
- [guarded-preview-qa.yml](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/blob/main/.github/workflows/guarded-preview-qa.yml)：mainで毎日14:43 UTC（23:43 JST）に稼働済み。公開PreviewのHTML/JS/CSSのfingerprintを確認し、前回PASSと同じbytesならブラウザを起動しない。新たな日次workflowの追加は不要。
- [10/8の日次run 37796481553](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/37796481553)：5ブラウザprofileのsmokeがPASS。
- [10/9の日次run 37947946614](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/37947946614)：`UNCHANGED_SKIP`、probe実行約8秒、browser/finalize skipped。10 resources / 1,878,685 bytesの読取。

日次smokeのPASSはGardenまでの限定診断であり、今回の自律的な鑑賞反応、全マップ、音、実機、長期保存、Production公開の承認を証明しない。

## 重複と費用

開始時に審美眼だけでなく反AI・一般人の完了記録と、進行中の夢核を検出した。固有sessionの証拠を収集し、それらを再起動・上書きしなかった。夢核終了後、事前情報を渡さない新規担当がゲームを開始した。その前後に別観察者による文学も開始されたため、こちらから文学を追加起動せず、完了後の記録を収集する方針とした。既存sessionのcontrolは変更していない。

既存4体の主observer jobは、審美眼10分13秒、反AI2分26秒、一般人4分58秒、夢核5分03秒、合計22分40秒だった。これにcontrolごとの画像export jobsが加わるため、主job時間を総runner消費や請求額とは呼ばない。public repo・標準Ubuntu・既存GITHUB_TOKENの利用は設定で確認したが、account billingやstorage利用量は今回の接続で確認できないため金額は断定しない。新規課金設定は行っていない。

画像export artifactは1日保持だが、観察stateの各eventにcommit固定のスクリーンショットURLがあり、Git履歴から再取得できる。保持期間とGit履歴容量を同一視しない。

## GitHubの @codex 呼出しについて

[bot返信](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/issues/4#issuecomment-6092827152)は、このQA repoへのCodex環境関連付けが必要と述べている。これは既存Actions runnerが使えないという意味ではなく、今回の実画面審査の完遂も妨げていない。

接続ツールにはCodex Cloudの環境一覧・repo関連付けを管理するAPIがないため、その設定だけは操作できない。将来このrepoのGitHub `@codex` 自動受諾を有効にする必要がある場合の最短操作は、Founderが [Codex Settings → Environments](https://chatgpt.com/codex/cloud/settings/environments) で既存環境の対象repoと重複を確認し、既存設定を再利用できるならQA repoを関連付けること。UI上で新規環境が必須なら、QA repoのみ・既存runner再利用・追加Secrets/有料サービスなしの最小設定を選ぶ。アカウント固有の利用枠や料金はその画面で確認する。今回は新環境を作成していない。

## 記録の整合性

`docs/GUARDED_PREVIEW_QA.md` に残っていた「proposal / NOT enabled on main」は、採用済みmain workflowと10/8・10/9のschedule実行に一致しなかった。QA運用文書だけを実態に合わせて[commit 070f199](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/070f199748003be588691b8d07b67ae70b4123c2)で訂正した。作品やworkflowの挙動は変更していない。
