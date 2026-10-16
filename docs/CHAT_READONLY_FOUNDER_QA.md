# Chat専用・本番読み取りQA（Founder基準端末）

目的：Codex / Work / NIKO2-AUTOを使わず、ChatGPTのGitHub接続から既存GitHub ActionsのWebKitを操作して、本番の画面を観察する。プロダクトコードやProduction配信の変更はしない。

## 起動
既存の `live-observer.yml` を再利用。新規ユニーク名の `live-requests/<session>.json` を作る。

```json
{
  "session": "mofumofu-example-unique",
  "target": "https://niko2atelier.com/?mofumofu_qa=mofumofu-example-unique",
  "mode": "observer-driven",
  "device": "founder",
  "readOnly": true
}
```

- `founder` は430×932、モバイル／タッチWebKit。iPhone 15 Plusの参考viewportで、物理iPhone Safari/PWAの代替ではない。
- `readOnly:true` は初回navigation前にservice workerを止め、POST/PUT/PATCH/DELETEなどGET/HEAD以外のHTTPリクエストをブラウザ側で遮断。 `state.json` に `readOnly` と `blockedWrites` を保存。これにより一般訪問者としてのPOST登録・行動送信を防ぐ。
- **正式Identity署名バッジではない。** `mofumofu_qa` はURLと監査結果の識別名に過ぎず、D1の `actorClass: QA` は発行しない。通常の本番に書き込みながら監査する用途には使わない。
- リポジトリはpublic。画像と結果もpublicなので、Founder本人の私的内容や秘密情報をこのセッションに持ち込まない。

## Chatからの操作
`live-results/<session>/state.json` の `lastCommand`、`controls`、`screenshotUrl` を読み、実画面の操作位置を選ぶ。`live-control/<session>.json` を更新し、`lastCommand` が更新したIDになるまで次を送らない。操作は `tap` / `wait` / `back` / `reload` / `scroll` / `stop` 等、詳しくは `LIVE_OBSERVER.md`。

必ず `stop` を送ってセッションを終了する。モバイルWebKitの `scroll` はホイール疑似入力であり、指のスクロール／bounceの実証にならない。

## 判定契約
- Founder端末が美術基準。巨大余白、上下帯、画像のミニ化、過度なcrop、横切れ、二重スクロール、不要なスクロール、可読性、反応待ちを、**見た目と操作体験**で判断。
- 技術的overflowなし／click成功だけでVisual PASSとしない。GardenならGarden内の画面同士でサイズ感・ステージルールを比較。
- 実操作で未到達のルートは未確認と書く。音声、継続アニメーション品質、実機PWAはスクリーンショット単体でPASSにしない。
- 公開リポジトリの標準GitHub-hostedランナーはGithub Actions公式料金規則上無料。ただし、別サービスのAPI呼出しや将来の料金改定は別途確認。

2026-10-17 実動作確認セッション：`mofumofu-founder-readonly-prod-20261017`。Garden 5/5→World Memory→Diary→World→Research Lab→ROOM NULLまで操作、外部書き込みリクエスト遮断を確認。全館の完全検査ではない。
