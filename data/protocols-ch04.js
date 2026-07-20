/* 第4章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch04:t1": [
    { type: "guideline", label: "Eur J Immunol: 免疫学研究におけるフローサイトメトリーと細胞ソーティングのガイドライン（第3版）", url: "https://pubmed.ncbi.nlm.nih.gov/34910301/", note: "抗体パネル設計からゲーティングまで実務上の推奨が網羅された定番ガイドラインです。" },
    { type: "guideline", label: "MIFlowCyt: フローサイトメトリー実験の最小報告項目", url: "https://pubmed.ncbi.nlm.nih.gov/18752282/", note: "論文にどの装置情報や試薬情報を書くべきかを定めた国際的な報告基準です。" },
    { type: "vendor", label: "Thermo Fisher: フローサイトメトリー ラーニングセンター", url: "https://www.thermofisher.com/jp/ja/home/life-science/cell-analysis/flow-cytometry/flow-cytometry-learning-center.html", note: "原理・蛍光色素選択・補正の基礎を日本語でまとめた入門用の技術資料集です。" }
  ],
  "ch04:t2": [
    { type: "vendor", label: "Standard BioTools: CyTOF XT マスサイトメーター", url: "https://www.standardbio.com/products/instruments/cytof-xt", note: "金属標識抗体を使う装置の仕様と適用範囲を確認したいときに開きます。" },
    { type: "protocol", label: "Nature Protocols: 血液と組織のヒト樹状細胞をマスサイトメトリーで解析する手順", url: "https://pubmed.ncbi.nlm.nih.gov/34480131/", note: "検体調製からバーコーディング、データ解析までの一連の実務手順が読めます。" },
    { type: "protocol", label: "STAR Protocols: マウス固形腫瘍の免疫モニタリング用CyTOFプロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/36538397/", note: "腫瘍組織からの細胞回収と抗体パネル構成を具体的に確認できます。" }
  ],
  "ch04:t3": [
    { type: "vendor", label: "Cytek Biosciences: Amnis イメージングフローサイトメーター", url: "https://cytekbio.com/pages/amnis", note: "1細胞ごとの画像を取得する装置の仕様と代表的な解析例が載っています。" },
    { type: "protocol", label: "Nature Protocols: 光時間伸長顕微鏡による高速イメージングフローサイトメトリー", url: "https://pubmed.ncbi.nlm.nih.gov/29976951/", note: "高スループットで細胞画像を取得する光学系の構築手順が詳述されています。" },
    { type: "protocol", label: "JoVE: イメージングフローサイトメトリーとAIによる小核試験の自動化", url: "https://pubmed.ncbi.nlm.nih.gov/36779604/", note: "画像取得から分類器による判定までの実装例を動画付きで確認できます。" }
  ],
  "ch04:t4": [
    { type: "vendor", label: "ThinkCyte: ゴーストサイトメトリー技術と装置", url: "https://thinkcyte.com/", note: "画像を再構成せずに機械学習で細胞を判別する方式の概要を確認できます。" }
  ],
  "ch04:t5": [
    { type: "protocol", label: "JoVE: 哺乳類細胞の細胞周期ポジション解析", url: "https://pubmed.ncbi.nlm.nih.gov/22297617/", note: "固定・DNA染色・フロー測定までの標準的な細胞周期解析手順が学べます。" },
    { type: "tool", label: "FlowJo: 公式ドキュメント（細胞周期解析ほか）", url: "https://docs.flowjo.com/flowjo/", note: "ヒストグラムのフィッティングやゲーティング操作を調べるときに開きます。" }
  ],
  "ch04:t6": [
    { type: "vendor", label: "MBL: Fucci 細胞周期プローブ製品情報", url: "https://ruo.mbl.co.jp/bio/e/product/flprotein/fucci.html", note: "Fucciの原理と各バリアントの使い分け、入手可能な試薬が確認できます。" },
    { type: "protocol", label: "STAR Protocols: FucciとMADMレポーターを用いた心筋細胞増殖の化合物スクリーニング", url: "https://pubmed.ncbi.nlm.nih.gov/36595956/", note: "Fucci細胞株の作製から蛍光の定量までを具体的な手順で追えます。" }
  ],
  "ch04:t7": [
    { type: "vendor", label: "Promega: CellTiter-Glo 発光細胞生存アッセイ", url: "https://www.promega.com/products/cell-health-assays/cell-viability-and-cytotoxicity-assays/celltiter_glo-luminescent-cell-viability-assay/", note: "ATP量から生細胞数を測る定番アッセイの原理とプロトコルが手に入ります。" },
    { type: "vendor", label: "Thermo Fisher: 細胞増殖アッセイ技術資料", url: "https://www.thermofisher.com/jp/ja/home/life-science/cell-analysis/cell-viability-and-regulation/cell-proliferation.html", note: "MTT・EdU・CFSEなど増殖測定法の選び方を比較したいときに開きます。" }
  ],
  "ch04:t8": [
    { type: "protocol", label: "JoVE: 改良型 Annexin V／ヨウ化プロピジウム アポトーシスアッセイ", url: "https://pubmed.ncbi.nlm.nih.gov/21540825/", note: "生細胞・アポトーシス・壊死を正しく分けるための染色と解析の手順です。" },
    { type: "vendor", label: "Thermo Fisher: Annexin V 染色の技術資料", url: "https://www.thermofisher.com/jp/ja/home/life-science/cell-analysis/cell-viability-and-regulation/apoptosis/annexin-v-staining.html", note: "試薬の選択とバッファー条件、よくある失敗の対処法がまとまっています。" }
  ],
  "ch04:t9": [
    { type: "protocol", label: "Nature Protocols: コメットアッセイでDNA損傷を測る手順集", url: "https://pubmed.ncbi.nlm.nih.gov/36707722/", note: "アルカリ法・中性法や酵素処理版まで、条件別の手順を網羅した決定版です。" },
    { type: "guideline", label: "Nature Protocols: MIRCA コメットアッセイ報告の最小情報", url: "https://pubmed.ncbi.nlm.nih.gov/33106678/", note: "論文でスライド作製条件や解析指標をどう書くべきかの推奨が読めます。" },
    { type: "protocol", label: "STAR Protocols: TUNEL法による細胞死検出プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/35128481/", note: "組織標本でDNA断片化を検出する際の固定と反応条件が具体的に分かります。" }
  ],
  "ch04:t10": [
    { type: "db", label: "DepMap Portal: がん細胞株の薬剤感受性とゲノムデータ", url: "https://depmap.org/portal/", note: "自分の細胞株の既知IC50や依存性遺伝子を照合したいときに使います。" },
    { type: "protocol", label: "Nature Protocols: 蛍光微量培養細胞毒性アッセイ", url: "https://pubmed.ncbi.nlm.nih.gov/18714304/", note: "用量反応曲線を取るための96穴プレート系アッセイの標準手順です。" },
    { type: "protocol", label: "Nature Protocols: スフェロイドを用いた薬剤スクリーニングの実践", url: "https://pubmed.ncbi.nlm.nih.gov/19214182/", note: "三次元培養での薬剤評価で注意すべき点と測定法が整理されています。" }
  ],
  "ch04:t11": [
    { type: "protocol", label: "Nature Protocols: in vitro スクラッチアッセイによる細胞遊走解析", url: "https://pubmed.ncbi.nlm.nih.gov/17406593/", note: "最も簡便な遊走能測定法の手順と、定量時の注意点が確認できます。" },
    { type: "protocol", label: "JoVE: in vitro 細胞遊走・浸潤アッセイ", url: "https://pubmed.ncbi.nlm.nih.gov/24962652/", note: "ボイデンチャンバーやマトリゲル浸潤系の実際の操作を動画で学べます。" }
  ],
  "ch04:t12": [
    { type: "protocol", label: "Nature Protocols: Oil Red O による中性脂質のイメージングと定量", url: "https://pubmed.ncbi.nlm.nih.gov/23702831/", note: "組織と培養細胞の両方に使える染色手順と定量化の方法が読めます。" },
    { type: "protocol", label: "STAR Protocols: 3T3-L1脂肪細胞の脂肪滴をOil Red Oで定量する手順", url: "https://pubmed.ncbi.nlm.nih.gov/38875117/", note: "染色後の色素抽出による吸光度定量まで、再現性重視で書かれています。" }
  ],
  "ch04:t13": [
    { type: "protocol", label: "Nature Protocols: ヒト多能性幹細胞からの大脳オルガノイド作製", url: "https://pubmed.ncbi.nlm.nih.gov/25188634/", note: "三次元培養の代表例として、培地組成と培養日程が詳細に示されています。" },
    { type: "protocol", label: "Nature Protocols: 薬剤スクリーニング用の患者由来がんオルガノイド樹立", url: "https://pubmed.ncbi.nlm.nih.gov/32929210/", note: "検体処理からパッセージ、薬剤評価までを一貫して追える実務プロトコルです。" },
    { type: "db", label: "ICLAC: 誤同定細胞株レジスター", url: "https://iclac.org/databases/cross-contaminations/", note: "使う予定の細胞株が交差汚染由来でないかを培養開始前に確認できます。" }
  ],
  "ch04:t14": [
    { type: "protocol", label: "Bio-protocol: マウスにおける患者由来異種移植モデルの樹立", url: "https://pubmed.ncbi.nlm.nih.gov/28184379/", note: "腫瘍片の調製、移植部位、継代の判断基準までが具体的に書かれています。" },
    { type: "vendor", label: "Jackson Laboratory: PDX腫瘍モデルリソース", url: "https://www.jax.org/jax-mice-and-services/in-vivo-pharmacology/oncology-services/pdx-tumors", note: "既存PDX系統の由来情報や使用可能な免疫不全マウスを調べられます。" },
    { type: "vendor", label: "ATCC: 細胞株認証（STR解析）の推奨事項", url: "https://www.atcc.org/resources/technical-documents/cell-line-authentication-test-recommendations", note: "移植実験に使う細胞の由来をSTRで担保する手順と頻度の指針です。" }
  ],
  "ch04:t15": [
    { type: "protocol", label: "Nature Protocols: SA-β-gal 活性の検出プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/20010931/", note: "培養細胞と生体組織それぞれでの老化マーカー染色の条件が分かります。" },
    { type: "protocol", label: "JoVE: 細胞老化の誘導と定量の手法", url: "https://pubmed.ncbi.nlm.nih.gov/28518126/", note: "老化を誘導する処理と複数マーカーでの確認方法をまとめて学べます。" }
  ]
});
