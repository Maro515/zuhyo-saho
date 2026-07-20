/* 第8章（t21〜t39） プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch08:t21": [
    { type: "tool", label: "circlize: Circular Visualization in R（公式書籍）", url: "https://jokergoo.github.io/circlize_book/book/", note: "Rでサーコス図を描く手順を章立てで解説した公式書です。作図の設計から始めるときに開きます。" },
    { type: "tool", label: "circlize: GitHub公式リポジトリ", url: "https://github.com/jokergoo/circlize", note: "インストール方法と最新版の変更点が載ります。実装で詰まったときに参照します。" },
    { type: "tool", label: "pyCirclize: Python版サーコス作図ライブラリ公式ドキュメント", url: "https://moshi4.github.io/pyCirclize/", note: "Python環境でサーコス図を描く例が豊富です。Rを使わない解析系で役立ちます。" }
  ],
  "ch08:t22": [
    { type: "db", label: "GWAS Catalog（EMBL-EBI）", url: "https://www.ebi.ac.uk/gwas/", note: "報告済みGWAS関連シグナルの公式カタログです。図中のSNPの既報を照合するときに使います。" },
    { type: "tool", label: "PLINK 2.0 公式ドキュメント", url: "https://www.cog-genomics.org/plink/2.0/", note: "関連解析とQCの標準ツールの公式解説です。マンハッタン図の元統計量を作る手順が分かります。" },
    { type: "tool", label: "qqman: マンハッタン図とQQ図を描くRパッケージ", url: "https://cran.r-project.org/web/packages/qqman/index.html", note: "GWAS結果からマンハッタン図を描く定番パッケージです。作図を自分で再現したいときに使います。" }
  ],
  "ch08:t23": [
    { type: "tool", label: "LocusZoom.js 公式プロット作成サービス", url: "https://my.locuszoom.org/", note: "サマリー統計をアップロードしてリージョナルプロットを作れます。領域の連鎖不平衡を見るときに開きます。" },
    { type: "tool", label: "LocusZoom: GitHub公式リポジトリ", url: "https://github.com/statgen/locuszoom", note: "描画ライブラリの仕様と使用例が置かれています。自前の環境に組み込むときに参照します。" },
    { type: "tool", label: "LocalZoom: 手元データでリージョナルプロットを描くツール", url: "https://statgen.github.io/localzoom/", note: "データを外部送信せず描画できます。未公開のサマリー統計を扱うときに便利です。" }
  ],
  "ch08:t24": [
    { type: "db", label: "1000 Genomes Project 公式サイト", url: "https://www.internationalgenome.org/", note: "集団別ハプロタイプ参照パネルの公式窓口です。位相推定の参照データを探すときに開きます。" },
    { type: "tool", label: "Beagle: ハプロタイプ位相推定とインピュテーションのソフト", url: "https://faculty.washington.edu/browning/beagle/beagle.html", note: "ジェノタイプからハプロタイプを推定する定番ツールです。実行手順と入力形式が分かります。" },
    { type: "db", label: "LDlink（NCI）: 連鎖不平衡とハプロタイプの探索ツール", url: "https://ldlink.nih.gov/", note: "SNP間のLDやハプロタイプ頻度を集団別に調べられます。図の解釈を確かめるときに使います。" }
  ],
  "ch08:t25": [
    { type: "tool", label: "vegan: 集積曲線やレアファクションを扱うRパッケージ", url: "https://cran.r-project.org/web/packages/vegan/index.html", note: "specaccum関数などで集積曲線を描けます。サンプル数と検出数の関係を評価するときに使います。" },
    { type: "tool", label: "iNEXT: 内挿と外挿による多様性推定のRパッケージ", url: "https://cran.r-project.org/web/packages/iNEXT/index.html", note: "曲線の外挿と信頼区間の付け方が説明されています。飽和したかを判断するときに開きます。" }
  ],
  "ch08:t26": [
    { type: "vendor", label: "Illumina: RNAシークエンシング技術解説ページ", url: "https://www.illumina.com/techniques/sequencing/rna-sequencing.html", note: "ライブラリ調製から必要リード数までの技術資料が集まっています。実験計画の入口に使います。" },
    { type: "tool", label: "DESeq2: 発現変動解析パッケージ（Bioconductor公式）", url: "https://bioconductor.org/packages/release/bioc/html/DESeq2.html", note: "カウントデータの正規化と検定の標準実装です。解析の再現手順を確認するときに開きます。" },
    { type: "tool", label: "edgeR ユーザーズガイド（公式PDF）", url: "https://www.bioconductor.org/packages/release/bioc/vignettes/edgeR/inst/doc/edgeRUsersGuide.pdf", note: "実験デザイン別のコード例が網羅されています。群構成が複雑なときに参照します。" }
  ],
  "ch08:t27": [
    { type: "tool", label: "DESeq2 公式ビネット（MAプロットとshrinkageの解説）", url: "https://www.bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html", note: "plotMAの使い方とlog2FC縮小の考え方が書かれています。MA図の解釈に直結します。" },
    { type: "tool", label: "edgeR: 発現変動解析パッケージ（Bioconductor公式）", url: "https://bioconductor.org/packages/release/bioc/html/edgeR.html", note: "plotSmearなどMA型作図の関数が含まれます。別実装で結果を見比べるときに使います。" }
  ],
  "ch08:t28": [
    { type: "tool", label: "Seurat: PBMC 3k 標準解析チュートリアル", url: "https://satijalab.org/seurat/articles/pbmc3k_tutorial.html", note: "QCから次元削減とクラスタリングまでを一通り追えます。UMAP作図の標準手順が分かります。" },
    { type: "tool", label: "Scanpy: クラスタリング公式チュートリアル", url: "https://scanpy.readthedocs.io/en/stable/tutorials/basics/clustering.html", note: "Python側の標準ワークフローです。近傍数や解像度の設定を確認するときに開きます。" },
    { type: "tool", label: "UMAP: パラメータの意味と挙動の公式解説", url: "https://umap-learn.readthedocs.io/en/latest/parameters.html", note: "n_neighborsやmin_distが図をどう変えるか図解されています。過剰解釈を避けるために読みます。" }
  ],
  "ch08:t29": [
    { type: "tool", label: "Monocle3: 軌跡解析と擬時間の公式ドキュメント", url: "https://cole-trapnell-lab.github.io/monocle3/docs/trajectories/", note: "軌跡の学習と根の指定手順が説明されています。擬時間を自分で計算するときに使います。" },
    { type: "tool", label: "Palantir: 分化運命と擬時間推定ツールのGitHub", url: "https://github.com/dpeerlab/Palantir", note: "分岐確率まで推定する手法の実装です。終末状態が複数ある系で参照します。" },
    { type: "tool", label: "Single-cell best practices（軌跡解析の章を含む解析指針書）", url: "https://www.sc-best-practices.org/", note: "手法選択の考え方と落とし穴が整理されています。解析方針を決めるときに読みます。" }
  ],
  "ch08:t30": [
    { type: "tool", label: "scVelo: RNA velocity解析の公式ドキュメント", url: "https://scvelo.readthedocs.io/en/stable/", note: "スプライス比からの速度推定と作図手順が載ります。velocity解析の標準実装です。" },
    { type: "tool", label: "velocyto: スプライス済みと未スプライスの計数ツール公式サイト", url: "https://velocyto.org/", note: "BAMから入力行列を作る前処理が説明されています。解析の最初の一歩で開きます。" },
    { type: "protocol", label: "Nature Protocols: CellRankによる細胞運命マッピング", url: "https://pubmed.ncbi.nlm.nih.gov/41611959/", note: "速度情報を運命推定へつなぐ手順書です。velocityの次の解析に進むときに読みます。" }
  ],
  "ch08:t31": [
    { type: "vendor", label: "10x Genomics: Universal 5' Gene Expression（免疫プロファイリング）サポート", url: "https://www.10xgenomics.com/support/universal-five-prime-gene-expression", note: "TCRとBCRを同時取得する試薬とワークフローの公式資料です。実験設計時に開きます。" },
    { type: "tool", label: "MiXCR: レパトア再構築ソフトの公式ドキュメント", url: "https://mixcr.com/", note: "生リードからクロノタイプを組み立てる手順が書かれています。解析パイプラインの中核です。" },
    { type: "guideline", label: "AIRR Community: MiAIRR 報告標準の公式解説", url: "https://docs.airr-community.org/en/stable/miairr/introduction_miairr.html", note: "レパトアデータで報告すべき最小項目の標準です。論文投稿や再利用の前に確認します。" }
  ],
  "ch08:t32": [
    { type: "protocol", label: "Nature Protocols: リボソームプロファイリングの実験手順（Ingolia ら）", url: "https://pubmed.ncbi.nlm.nih.gov/22836135/", note: "リボソーム保護断片の調製から解析までの原典プロトコルです。実験を始める前に読みます。" },
    { type: "tool", label: "riboviz: Ribo-seq解析ワークフローのGitHub公式リポジトリ", url: "https://github.com/riboviz/riboviz", note: "前処理から周期性評価までを自動化するパイプラインです。データ解析の土台に使います。" },
    { type: "tool", label: "riboWaltz: Pサイト同定とフレーム解析のRパッケージ", url: "https://github.com/LabTranslationalArchitectomics/riboWaltz", note: "リード長ごとのPサイト補正が実装されています。メタジーン図の品質確認に役立ちます。" }
  ],
  "ch08:t33": [
    { type: "vendor", label: "10x Genomics: Visium 空間トランスクリプトーム プラットフォーム", url: "https://www.10xgenomics.com/platforms/visium", note: "スポット径や対応組織などの仕様がまとまっています。手法の前提を確認するときに開きます。" },
    { type: "vendor", label: "10x Genomics: Space Ranger 入門ドキュメント", url: "https://www.10xgenomics.com/support/software/space-ranger/latest/getting-started", note: "画像とリードを対応づける解析パイプラインの公式手順書です。データ処理時に参照します。" },
    { type: "protocol", label: "STAR Protocols: VisiumでT細胞クロノタイプを空間局在化する手順", url: "https://pubmed.ncbi.nlm.nih.gov/35707680/", note: "実際の応用例を手順レベルで追えます。免疫系の空間解析を計画するときに読みます。" }
  ],
  "ch08:t34": [
    { type: "vendor", label: "10x Genomics: Xenium In Situ プラットフォーム", url: "https://www.10xgenomics.com/platforms/xenium", note: "イメージングベースで単一細胞解像度を得る装置の仕様資料です。Visiumとの使い分けに使います。" },
    { type: "vendor", label: "10x Genomics: In Situ Gene Expression サポート窓口", url: "https://www.10xgenomics.com/support/in-situ-gene-expression", note: "パネル設計や組織前処理の資料が集約されています。実験準備の入口として開きます。" },
    { type: "vendor", label: "10x Genomics: Xenium Onboard Analysis 出力ファイルの解説", url: "https://www.10xgenomics.com/support/software/xenium-onboard-analysis/latest/analysis/xoa-output-at-a-glance", note: "転写産物座標や細胞分割結果の中身が分かります。二次解析を書くときに必読です。" }
  ],
  "ch08:t35": [
    { type: "protocol", label: "Nature Protocols: 空間ATAC-RNA-seqと空間CUT＆Tag-RNA-seqの手順", url: "https://pubmed.ncbi.nlm.nih.gov/40119005/", note: "エピゲノムと転写産物を同一切片で同時取得する手順書です。設計の全体像を掴めます。" },
    { type: "protocol", label: "Nature Protocols: Tn5転移と決定論的DNAバーコーディングによる空間エピゲノム解析", url: "https://pubmed.ncbi.nlm.nih.gov/38943021/", note: "マイクロ流路でのバーコード付与の実際が書かれています。原理を確認するときに読みます。" }
  ],
  "ch08:t36": [
    { type: "guideline", label: "ENCODEとmodENCODEによるChIP-seq実施基準", url: "https://pubmed.ncbi.nlm.nih.gov/22955991/", note: "対照設定や再現性指標など品質基準の標準文献です。データの妥当性を判断する基準になります。" },
    { type: "tool", label: "MACS3: ピークコール標準ツールの公式ドキュメント", url: "https://macs3-project.github.io/MACS/", note: "ピーク検出のパラメータと出力形式が説明されています。解析条件を決めるときに開きます。" },
    { type: "tool", label: "deepTools: カバレッジ可視化と品質評価ツールの公式ドキュメント", url: "https://deeptools.readthedocs.io/en/develop/", note: "ヒートマップやプロファイル図の作成手順が載ります。図表の再現に直接使えます。" }
  ],
  "ch08:t37": [
    { type: "protocol", label: "Omni-ATAC: 背景を下げ凍結組織にも使えるATAC-seq改良法", url: "https://pubmed.ncbi.nlm.nih.gov/28846090/", note: "現在の事実上の標準手順です。ミトコンドリア混入を減らす工夫が書かれています。" },
    { type: "protocol", label: "Bio-protocol: 凍結保存細胞のATAC-seq実施手順", url: "https://pubmed.ncbi.nlm.nih.gov/35127984/", note: "凍結検体を扱う際の細かな注意点が段階ごとに示されます。臨床検体で役立ちます。" },
    { type: "tool", label: "MACS: ピークコールツールのGitHub公式リポジトリ", url: "https://github.com/macs3-project/MACS", note: "ATAC-seq向けのオプション例や既知の問題が確認できます。解析条件の調整に使います。" }
  ],
  "ch08:t38": [
    { type: "protocol", label: "Nature Protocols: 少数細胞でのCUT＆RUN実験手順（Skene ら）", url: "https://pubmed.ncbi.nlm.nih.gov/29651053/", note: "開発者による原典プロトコルです。試薬と反応条件を正確に押さえたいときに読みます。" },
    { type: "protocol", label: "protocols.io: Bench top CUT＆Tag（Henikoffラボ公式手順）", url: "https://www.protocols.io/view/bench-top-cut-amp-tag-kqdg34qdpl25/v3", note: "手技を工程ごとに記した公開プロトコルです。実験台で手順を追うときに開きます。" },
    { type: "tool", label: "SEACR: 低背景データ向けピークコールツールのGitHub", url: "https://github.com/FredHutch/SEACR", note: "CUT＆RUNやCUT＆Tagに適したピーク検出法です。MACSで検出が合わないときに使います。" }
  ],
  "ch08:t39": [
    { type: "vendor", label: "Arima Genomics: Hi-Cを含むエピジェネティクス応用の技術資料", url: "https://discovery.arimagenomics.com/applications/epigenetics/", note: "キットの適用範囲と必要インプット量が分かります。実験の外注や設計時に開きます。" },
    { type: "tool", label: "cooler: Hi-C接触行列の標準フォーマットとツールの公式ドキュメント", url: "https://cooler.readthedocs.io/en/latest/", note: "解像度変換や正規化の手順が説明されています。接触行列を扱う基礎になります。" },
    { type: "tool", label: "Juicer: Hi-C解析パイプラインのGitHub公式リポジトリ", url: "https://github.com/aidenlab/juicer", note: "マッピングからループ検出までを一括処理できます。TADやループを出すときに使います。" }
  ]
});
