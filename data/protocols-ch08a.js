/* 第8章（t1〜t20） プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch08:t1": [
    { type: "vendor", label: "Thermo Fisher: マイクロアレイ解析（GeneChipアレイ）技術情報", url: "https://www.thermofisher.com/jp/ja/home/life-science/microarray-analysis.html", note: "アレイの原理と製品ラインが分かる入口で、実験系を選ぶときに開きます。" },
    { type: "guideline", label: "FGED: MIAME（マイクロアレイ実験の最小記載情報）", url: "https://www.fged.org/projects/miame/", note: "アレイ論文で報告すべき最小項目を定めた標準で、投稿前の確認に使います。" },
    { type: "db", label: "NCBI GEO: 遺伝子発現データの公的リポジトリ", url: "https://www.ncbi.nlm.nih.gov/geo/", note: "アレイやRNA-seqの生データを登録・再解析するときの入口になります。" }
  ],
  "ch08:t2": [
    { type: "vendor", label: "Illumina: SBS（合成時解読）シークエンス技術の解説", url: "https://www.illumina.com/science/technology/next-generation-sequencing/sequencing-technology.html", note: "ブリッジ増幅から蛍光検出までの原理を図で確認できます。" },
    { type: "vendor", label: "Illumina: NGS入門ガイド（初学者向け）", url: "https://www.illumina.com/science/technology/next-generation-sequencing/beginners.html", note: "リード長やカバレッジなど基本用語を最初に押さえるときに便利です。" },
    { type: "guideline", label: "FGED: MINSEQE（配列解析実験の最小記載情報）", url: "https://www.fged.org/projects/minseqe/", note: "シークエンス実験の報告に必要な最小項目を示した標準文書です。" }
  ],
  "ch08:t3": [
    { type: "vendor", label: "Oxford Nanopore: ナノポアシークエンス技術の原理", url: "https://nanoporetech.com/platform/technology", note: "電流変化で塩基を読む仕組みと長鎖リードの特徴を解説しています。" },
    { type: "vendor", label: "Oxford Nanopore: フローセルとシークエンス装置の一覧", url: "https://nanoporetech.com/products/sequence", note: "MinIONからPromethIONまでスループットを比較して機種選定に使います。" }
  ],
  "ch08:t4": [
    { type: "vendor", label: "PacBio: HiFiシークエンス（CCS）の技術解説", url: "https://www.pacb.com/technology/hifi-sequencing/", note: "環状鋳型の反復読みで高精度ロングリードを得る原理が分かります。" },
    { type: "vendor", label: "PacBio: SMRTシークエンス技術の総覧", url: "https://www.pacb.com/technology/", note: "装置と応用（ゲノム構築、構造変異、全長転写産物）の全体像を確認できます。" }
  ],
  "ch08:t5": [
    { type: "tool", label: "Bioconductor: EnhancedVolcano（Volcano plot作図パッケージ）", url: "https://bioconductor.org/packages/release/bioc/html/EnhancedVolcano.html", note: "閾値線やラベル付きのVolcano plotをRで描くときの標準的な選択肢です。" },
    { type: "tool", label: "Bioconductor: DESeq2（発現変動解析パッケージ）", url: "https://bioconductor.org/packages/release/bioc/html/DESeq2.html", note: "Volcano plotの元になるlog2倍率変化と補正P値を算出する定番ツールです。" },
    { type: "protocol", label: "Nature Protocols: RとBioconductorによるカウントベース発現変動解析", url: "https://pubmed.ncbi.nlm.nih.gov/23975260/", note: "カウントデータの正規化から検定までを順に追える手順書です。" }
  ],
  "ch08:t6": [
    { type: "tool", label: "CRAN: GGally（ggplot2拡張の対相関図パッケージ）", url: "https://cran.r-project.org/web/packages/GGally/index.html", note: "ggpairsで多変数の散布図行列と相関係数を一度に描けます。" },
    { type: "tool", label: "seaborn: pairplot 公式リファレンス", url: "https://seaborn.pydata.org/generated/seaborn.pairplot.html", note: "Pythonで対散布図を描く際の引数と作例がまとまっています。" }
  ],
  "ch08:t7": [
    { type: "db", label: "Gene Ontology Resource 公式サイト", url: "https://geneontology.org/", note: "GO用語の階層と最新アノテーションを直接検索できる一次資料です。" },
    { type: "tool", label: "Bioconductor: clusterProfiler（濃縮解析パッケージ）", url: "https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html", note: "ORAによるGO濃縮解析と結果の可視化をRで一括して行えます。" },
    { type: "protocol", label: "Nature Protocols: clusterProfilerによるマルチオミクス解析の手順", url: "https://pubmed.ncbi.nlm.nih.gov/39019974/", note: "入力の作り方から結果解釈までを著者自身が解説した手順書です。" }
  ],
  "ch08:t8": [
    { type: "tool", label: "GSEA 公式サイト（Broad Institute）", url: "https://www.gsea-msigdb.org/gsea/index.jsp", note: "GSEA本体のダウンロードと実行手順、パラメータ設定の説明があります。" },
    { type: "db", label: "MSigDB: 遺伝子セットデータベース", url: "https://www.gsea-msigdb.org/gsea/msigdb/index.jsp", note: "HallmarkやKEGGなど解析に使う遺伝子セットを選ぶときに開きます。" },
    { type: "protocol", label: "Nature Protocols: g:Profiler・GSEA・Cytoscapeによるパスウェイ濃縮解析", url: "https://pubmed.ncbi.nlm.nih.gov/30664679/", note: "濃縮解析からEnrichmentMap可視化までを通しで示した定番手順です。" }
  ],
  "ch08:t9": [
    { type: "tool", label: "Bioconductor: ComplexHeatmap 公式ビネット", url: "https://bioconductor.org/packages/release/bioc/vignettes/ComplexHeatmap/inst/doc/complex_heatmap.html", note: "デンドログラム付きヒートマップの距離指標や結合法の指定方法が分かります。" },
    { type: "tool", label: "CRAN: pheatmap（簡便なヒートマップ作図パッケージ）", url: "https://cran.r-project.org/web/packages/pheatmap/index.html", note: "少ないコードで階層的クラスタリング付きの図を描きたいときに使います。" },
    { type: "tool", label: "SciPy: cluster.hierarchy 公式リファレンス", url: "https://docs.scipy.org/doc/scipy/reference/cluster.hierarchy.html", note: "linkage法やデンドログラム切断をPythonで扱う際の関数一覧です。" }
  ],
  "ch08:t10": [
    { type: "tool", label: "scikit-learn: クラスタリング手法の解説ページ", url: "https://scikit-learn.org/stable/modules/clustering.html", note: "k-meansと他手法の前提や長所短所を比較して選ぶときに読みます。" },
    { type: "tool", label: "scikit-learn: KMeans 公式APIリファレンス", url: "https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html", note: "初期化法や反復回数など、クラスタ数決定に関わる引数を確認できます。" }
  ],
  "ch08:t11": [
    { type: "tool", label: "scikit-learn: PCA 公式APIリファレンス", url: "https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html", note: "寄与率や主成分負荷量の取り出し方をPythonで確認するときに使います。" },
    { type: "tool", label: "Bioconductor: PCAtools（オミクス向けPCAパッケージ）", url: "https://bioconductor.org/packages/release/bioc/html/PCAtools.html", note: "スクリープロットやバイプロットを発現データ向けに描けるRパッケージです。" },
    { type: "tool", label: "scikit-learn: 次元削減（行列分解）手法の解説", url: "https://scikit-learn.org/stable/modules/decomposition.html", note: "PCAとICAやNMFの違いを整理したいときに参照します。" }
  ],
  "ch08:t12": [
    { type: "tool", label: "deepTools: computeMatrix（メタジーン行列の作成）", url: "https://deeptools.readthedocs.io/en/develop/content/tools/computeMatrix.html", note: "遺伝子本体や転写開始点周辺のシグナルを揃える前処理の手順書です。" },
    { type: "tool", label: "deepTools: plotProfile（メタジーンプロットの作図）", url: "https://deeptools.readthedocs.io/en/develop/content/tools/plotProfile.html", note: "平均プロファイル曲線を描く際のオプションと作例がまとまっています。" },
    { type: "tool", label: "Bioconductor: metagene2（メタジーン解析パッケージ）", url: "https://bioconductor.org/packages/release/bioc/html/metagene2.html", note: "Rでメタジーン解析を行い群間比較まで進めたいときに使います。" }
  ],
  "ch08:t13": [
    { type: "tool", label: "MEME Suite 公式サイト（モチーフ解析ツール群）", url: "https://meme-suite.org/meme/", note: "配列モチーフの発見と検索をウェブ上で実行できる標準ツール群です。" },
    { type: "tool", label: "MEME Suite: 収録ツールの概要と使い分け", url: "https://meme-suite.org/meme/doc/overview.html", note: "MEMEやSTREME、FIMOなどの役割の違いを確認するときに読みます。" },
    { type: "tool", label: "CRAN: ggseqlogo（シークエンスロゴ作図パッケージ）", url: "https://cran.r-project.org/web/packages/ggseqlogo/index.html", note: "情報量を高さで示すロゴ図をRで自作するときに使います。" }
  ],
  "ch08:t14": [
    { type: "db", label: "STRING: タンパク質相互作用ネットワークデータベース", url: "https://string-db.org/", note: "遺伝子リストからPPIネットワークと機能濃縮を得る一次リソースです。" },
    { type: "db", label: "STRING: 公式ヘルプ（スコアと設定の解説）", url: "https://string-db.org/cgi/help", note: "エッジの信頼度スコアや証拠種別の意味を確認するときに開きます。" }
  ],
  "ch08:t15": [
    { type: "db", label: "KEGG PATHWAY データベース", url: "https://www.genome.jp/kegg/pathway.html", note: "代謝やシグナル伝達のパスウェイマップを一覧して参照できます。" },
    { type: "db", label: "KEGG Mapper: 遺伝子リストのパスウェイ写像ツール", url: "https://www.genome.jp/kegg/mapper/", note: "自分の遺伝子群をマップ上に着色して示したいときに使います。" }
  ],
  "ch08:t16": [
    { type: "tool", label: "Cytoscape 公式サイト（ネットワーク可視化ソフト）", url: "https://cytoscape.org/", note: "ネットワーク図の作成とアプリ導入の入口になる公式ページです。" },
    { type: "tool", label: "Cytoscape: ユーザーマニュアル", url: "https://manual.cytoscape.org/en/stable/", note: "レイアウトやスタイル、ネットワーク統計の操作手順が網羅されています。" },
    { type: "tool", label: "igraph 公式サイト（グラフ解析ライブラリ）", url: "https://igraph.org/", note: "次数や中心性などネットワーク指標をRやPythonで計算するときに使います。" }
  ],
  "ch08:t17": [
    { type: "db", label: "iModulonDB: iModulonの公開データベース", url: "https://imodulondb.org/", note: "菌種ごとの独立成分由来モジュールと活性を閲覧できる一次リソースです。" },
    { type: "tool", label: "GitHub: pymodulon（iModulon解析用Pythonパッケージ）", url: "https://github.com/SBRG/pymodulon", note: "独立成分分析からiModulonを自分のデータで抽出する実装です。" },
    { type: "tool", label: "pymodulon 公式ドキュメント（チュートリアル付き）", url: "https://pymodulon.readthedocs.io/en/latest/", note: "解析の流れとプロット関数を順に追える公式解説です。" }
  ],
  "ch08:t18": [
    { type: "tool", label: "CRAN: ggalluvial（沖積図・サンキー図パッケージ）", url: "https://cran.r-project.org/web/packages/ggalluvial/index.html", note: "群の移り変わりをggplot2の流儀で帯として描くときに使います。" },
    { type: "tool", label: "CRAN: networkD3（対話的サンキー図パッケージ）", url: "https://cran.r-project.org/web/packages/networkD3/index.html", note: "マウス操作で辿れるサンキー図をHTMLとして出力できます。" },
    { type: "tool", label: "Plotly: Python版サンキー図の作図ガイド", url: "https://plotly.com/python/sankey-diagram/", note: "ノードとリンクの指定方法をコード例つきで確認できます。" }
  ],
  "ch08:t19": [
    { type: "tool", label: "Bioconductor: enrichplot（濃縮解析の可視化パッケージ）", url: "https://bioconductor.org/packages/release/bioc/html/enrichplot.html", note: "群別ドットプロットで経路の有意性と遺伝子数を同時に示せます。" },
    { type: "tool", label: "Seurat: DotPlot 公式リファレンス", url: "https://satijalab.org/seurat/reference/dotplot", note: "細胞集団ごとの発現割合と平均発現を点で表す関数の使い方です。" }
  ],
  "ch08:t20": [
    { type: "tool", label: "GitHub: SigProfilerExtractor（変異シグネチャー抽出ツール）", url: "https://github.com/SigProfilerSuite/SigProfilerExtractor", note: "変異カタログからde novoにシグネチャーを抽出する標準実装です。" },
    { type: "tool", label: "Bioconductor: MutationalPatterns（変異パターン解析パッケージ）", url: "https://bioconductor.org/packages/release/bioc/html/MutationalPatterns.html", note: "96種類の変異プロファイル作成と既知シグネチャーへの当てはめができます。" },
    { type: "protocol", label: "STAR Protocols: SparseSignaturesによる変異シグネチャー同定", url: "https://pubmed.ncbi.nlm.nih.gov/35779264/", note: "腫瘍検体からシグネチャーを求める解析手順を段階的に示しています。" }
  ],
});
