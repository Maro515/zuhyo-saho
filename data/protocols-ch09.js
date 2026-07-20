/* 第9章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch09:t1": [
    { type: "tool", label: "QIIME 2: アンプリコン解析 公式ドキュメント", url: "https://amplicon-docs.qiime2.org/en/stable/", note: "16S解析の前処理から多様性解析までを網羅した公式マニュアルです。実作業の基準になります。" },
    { type: "protocol", label: "Earth Microbiome Project: 16S Illuminaアンプリコン標準プロトコル", url: "https://earthmicrobiome.org/protocols-and-standards/16s/", note: "プライマー配列とPCR条件を定めた国際標準手順です。他研究と比較可能にしたいとき使います。" },
    { type: "tool", label: "mothur: MiSeq標準操作手順（MiSeq SOP）", url: "https://mothur.org/wiki/miseq_sop/", note: "コマンドを順に追える16S解析チュートリアルです。QIIMEとは別系統の解析を学べます。" }
  ],
  "ch09:t2": [
    { type: "tool", label: "MetaPhlAn: メタゲノムからの菌種組成推定ツール公式リポジトリ", url: "https://github.com/biobakery/MetaPhlAn", note: "マーカー遺伝子から菌種レベルの相対存在量を求めます。ショットガン解析の定番ツールです。" },
    { type: "tool", label: "HUMAnN: メタゲノムの機能・経路プロファイリングツール公式リポジトリ", url: "https://github.com/biobakery/humann", note: "遺伝子ファミリーと代謝経路の存在量を推定します。菌叢の機能を見たいとき使います。" },
    { type: "protocol", label: "Nature Protocols: 宿主由来ショートリードメタゲノムからの原核生物ゲノム再構築", url: "https://pubmed.ncbi.nlm.nih.gov/33864056/", note: "アセンブリからビニング、品質評価までの流れを示します。MAG構築の手順書として有用です。" }
  ],
  "ch09:t3": [
    { type: "tool", label: "SPAdes: ゲノムアセンブラ公式リポジトリ", url: "https://github.com/ablab/spades", note: "細菌ゲノムアセンブリの標準ツールです。オプションの意味と実行例を確認できます。" },
    { type: "tool", label: "Unicycler: 細菌ゲノム向けハイブリッドアセンブリパイプライン", url: "https://github.com/rrwick/Unicycler", note: "ショートリードとロングリードを併用して環状ゲノムを組みます。完全長を狙うとき使います。" },
    { type: "tool", label: "Prokka: 細菌ゲノム高速アノテーションツール", url: "https://github.com/tseemann/prokka", note: "アセンブリ後の遺伝子予測と機能注釈を一括で行います。配列を提出用に整えるとき使います。" }
  ],
  "ch09:t4": [
    { type: "tool", label: "GraPhlAn: 円環状の注釈付き系統樹描画ツール公式リポジトリ", url: "https://github.com/biobakery/graphlan", note: "系統樹に存在量や群情報を重ねた図を作れます。菌叢論文でよく見る円形図の作成に使います。" },
    { type: "tool", label: "Huttenhower Lab: GraPhlAn 公式紹介ページ", url: "https://huttenhower.sph.harvard.edu/graphlan/", note: "作図例と入力ファイル形式がまとまっています。仕上がりのイメージを掴むとき開きます。" },
    { type: "tool", label: "iTOL: 系統樹の可視化と注釈付けWebツール", url: "https://itol.embl.de/", note: "系統樹にヒートマップや棒グラフを重ねられます。ブラウザだけで整形したいとき便利です。" }
  ],
  "ch09:t5": [
    { type: "tool", label: "QIIME 2: diversityプラグイン公式リファレンス", url: "https://amplicon-docs.qiime2.org/en/stable/references/plugins/diversity/", note: "Shannon指数やChao1などα多様性指標の算出コマンドが一覧できます。指標選びに使います。" },
    { type: "tool", label: "CRAN: vegan（群集生態学解析）パッケージ", url: "https://cran.r-project.org/web/packages/vegan/index.html", note: "多様性指数とレアファクション曲線を計算するRの定番パッケージです。再解析に使います。" },
    { type: "tool", label: "Bioconductor: phyloseq（菌叢データ統合解析）パッケージ", url: "https://bioconductor.org/packages/release/bioc/html/phyloseq.html", note: "組成表・系統樹・メタデータをまとめて扱い、多様性の図を描けるRパッケージです。" }
  ],
  "ch09:t6": [
    { type: "tool", label: "QIIME 2: Moving Pictures チュートリアル", url: "https://amplicon-docs.qiime2.org/en/stable/tutorials/moving-pictures/", note: "UniFrac距離とPCoA図の作成までを実データで追えます。β多様性解析の練習に最適です。" },
    { type: "tool", label: "UniFrac: 系統情報を用いたβ多様性距離の高速実装", url: "https://github.com/biocore/unifrac", note: "重み付き・非重み付きUniFracの計算実装です。距離の定義を確認したいときに開きます。" },
    { type: "tool", label: "CRAN: vegan（PERMANOVAと順序化）パッケージ", url: "https://cran.r-project.org/web/packages/vegan/index.html", note: "Bray-Curtis距離やadonisによる群間差検定を実行できます。β多様性の統計評価に使います。" }
  ]
});
