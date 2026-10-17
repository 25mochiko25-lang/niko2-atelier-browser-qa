# ジロジロ隊G / 久しぶりの訪問・ざっくり視覚監査

- 日付: 2026-10-18 JST
- 対象: https://niko2atelier.com/
- session: `mofu-vis-g-20261018-t7c6n4`
- Founder viewport: 430×932 / mobile WebKit / touch emulation / readOnly: true
- 姿勢: 完全網羅QAではなく、久しぶりに来た訪問者として、チュートリアルや気になる場所を寄り道。
- 実画面のWebKitスクリーンショットで判断。DOM PASSだけでは美術PASSにしない。

## ざっくり感想

入場画面のピンク、夢の見覚えの庭、Research Labの白い施設、WORLDの群青、ROOM NULLの柔らかな寝室、CHANNEL 00の古いWeb、Hotel Somniaの夜景、FROM THE ATELIERの記事一覧。施設ごとに造形・彩度・世界観が切り替わる一方、NIKO² ATELIERとしての統一感がある。スクリーンショットで見た範囲に明確な主役画像の縮小事故・横方向の見切れはなかった。

## 確定した画面上の不具合

今回の**観測範囲ではなし**。全館PASSではない。

## 目立つ違和感

1. **P3 / 導入案内の長さ（主観）**: Enter the dream → WORLD / INTERACTION / WELCOME の3画面。その後、夢の見覚えを経てアトリエに戻ると AFTER THE GARDEN → WHAT REMAINED → NIKO² ATELIER → NEXT PLACES の4画面。戻ってきた客目線では、素敵な絵を楽しむ一方で案内が続く感覚がある。バグとは認定しない。証拠: [初回案内](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/123c3932affb9c8f48e9e487e42814dc4048fc79/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg) / [その後の案内](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/57626f9de6ae96af243ccc56ac71bcb1cb36a4c4/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg)
2. **P3 / Research Lab・観測台の縦の間延び**: Labの観測台をタップした記録一覧は4件が画面上寄りに並び、その下からパネル底部に大きな白い余白が続く。読みやすさは維持、ただし施設のほかの密度感と比べるとやや寂しい。これは視覚的違和感であり、コンテンツ不足・CSS原因は推定しない。証拠: [記録一覧](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/04c22331a70132dfef1de11deb470297f2581c4c/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg)

## 良かった寄り道

- 「夢の見覚え」: くまと糸結びをタップし、記憶の画面まで進めた。景色と体験の繋がりが自然。[庭](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/1f97a30a90d080e151ceb4e6e7522e1d0064a64f/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg) / [記憶](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/466995ca3a481c40770795e82dade39109f0ea75/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg)
- WORLD → ROOM NULL → Cabinet: 画像が大きく、施設ごとの視覚的な区別が明快。[WORLD](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/13773d9fba37e6b7dade177e6e15040ce2005178/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg) / [ROOM NULL](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/d756c369057dcb0c9a7468792cd75654e68e8704/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg)
- Research Labの付け髭記録は、研究資料の体裁とユーモアが両立。[資料画面](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/55870be5ec004df48f3c5d8e244f2806d18563cd/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg)
- CHANNEL 00は古いインターネット風への切替が明瞭。[リンク一覧](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/f8b391cd06ef26d2d3e741178912237ee451f68e/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg)
- Hotel Somniaの客室画面、FROM THE ATELIERの新聞カードも、今回のスクリーンショット内では極端な縮尺事故が見当たらない。[Hotel](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/3d46e8f6e2edda4ccdbe477a2c2db349ec0c5b2f/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg) / [新聞カード](https://raw.githubusercontent.com/25mochiko25-lang/niko2-atelier-browser-qa/01c150fa7491086cb59536e96a0f00d768d9cac6/live-results/mofu-vis-g-20261018-t7c6n4/current.jpg)

## 比較対象が足りないもの・未到達

- Gardenの通常ルート5発見、Perfume、Diaryの本文入力、曜日ROOM各種は**未監査**。
- モバイルWebKitで observer の `scroll` が `mouse.wheel is not supported` を返した。これは**検査環境の制限**でありサイトの指スワイプ不具合ではない。WORLD入口は見えているカードをタップして到達。
- 音質、連続アニメーションの滑らかさ、実機iPhone Safari/PWAは未判定。
- readOnly環境で保存/送信を伴う機能の実完了確認はしていない。私的文章は入力していない。

**結論:** 軽い再訪問の範囲では景色と施設間の切替の魅力が勝ち、重大な画面崩れは見えなかった。修正確定案件ではなく、導入の長さとLab一覧の余白だけ軽く確認候補。
