/* 第12章 プロトコル・技術資料リンク（t1〜t25 / 全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch12:t1": [
    { type: "db", label: "Addgene: 塩基編集（Base Editing）プラスミド集", url: "https://www.addgene.org/crispr/base-edit/", note: "CBEとABEの主要コンストラクトと入手方法がまとまっており、実験計画の出発点になります。" },
    { type: "protocol", label: "Nature Protocols: ヒト多能性幹細胞での塩基編集と編集細胞の濃縮", url: "https://pubmed.ncbi.nlm.nih.gov/34172975/", note: "一過性レポーターで編集細胞を濃縮する手順書です。幹細胞で塩基編集を始めるときに開きます。" },
    { type: "tool", label: "CRISPResso2: 編集効率とインデル分布の解析ソフト", url: "https://github.com/pinellolab/CRISPResso2", note: "アンプリコン配列から編集効率や塩基置換率を定量する定番ツールの公式リポジトリです。" }
  ],
  "ch12:t2": [
    { type: "db", label: "Addgene: プライム編集（Prime Editing）プラスミド集", url: "https://www.addgene.org/crispr/prime-edit/", note: "PE2やPE3などのエディターとpegRNAベクターを一覧でき、入手の窓口として使えます。" },
    { type: "protocol", label: "Nature Protocols: 哺乳類細胞におけるプライム編集の設計と実施", url: "https://pubmed.ncbi.nlm.nih.gov/35941224/", note: "Liuラボによる実務手順書です。pegRNA設計から編集評価までを通しで確認できます。" },
    { type: "protocol", label: "Nature Protocols: PRIDICT2.0とePRIDICTによるpegRNA設計", url: "https://pubmed.ncbi.nlm.nih.gov/40813912/", note: "編集効率を予測してpegRNAを系統的に選ぶ手順です。設計で迷ったときに参照します。" }
  ],
  "ch12:t3": [
    { type: "db", label: "Addgene: エピゲノム編集用dCas9エフェクター集", url: "https://www.addgene.org/crispr/epigenetics/", note: "メチル化や脱アセチル化を狙うdCas9融合体が整理されており、目的に合う道具を選べます。" },
    { type: "db", label: "Addgene: CRISPRi（転写抑制）プラスミド集", url: "https://www.addgene.org/crispr/interfere/", note: "dCas9-KRABなど抑制系の代表的ベクターと使い分けの解説がまとまっています。" },
    { type: "protocol", label: "Nature Protocols: CRISPR干渉による配列特異的な遺伝子発現制御", url: "https://pubmed.ncbi.nlm.nih.gov/24136345/", note: "CRISPRiの原著プロトコルです。sgRNA配置と抑制効率の考え方を押さえられます。" }
  ],
  "ch12:t4": [
    { type: "protocol", label: "Nature Protocols: 大規模in vivo Perturb-seqスクリーニング", url: "https://pubmed.ncbi.nlm.nih.gov/39939709/", note: "生体内でCRISPR摂動と1細胞解析を組む手順です。規模設計の目安がつかめます。" },
    { type: "vendor", label: "10x Genomics: Cell RangerのFeature Reference CSV仕様", url: "https://www.10xgenomics.com/support/software/cell-ranger/latest/analysis/inputs/cr-feature-ref-csv", note: "ガイドRNA捕捉に必須の参照ファイル書式です。解析でガイドが読めないときに確認します。" },
    { type: "tool", label: "MAGeCKFlute: プールドCRISPRスクリーンの統合解析パイプライン", url: "https://github.com/liulab-dfci/MAGeCKFlute", note: "スクリーニングのヒット判定と下流解析を担うツールで、集計方法の理解にも役立ちます。" }
  ],
  "ch12:t5": [
    { type: "db", label: "Addgene: RNA標的化（Cas13など）プラスミド集", url: "https://www.addgene.org/crispr/rna-targeting/", note: "Cas13a/dやRNA編集用融合体を一覧できます。ノックダウン系を組むときの入口です。" },
    { type: "protocol", label: "Nature Protocols: RfxCas13d/BSJ-gRNAによる環状RNAスクリーニング", url: "https://pubmed.ncbi.nlm.nih.gov/35831613/", note: "Cas13dでRNAを狙う設計とオフターゲット対策が具体的に書かれています。" },
    { type: "protocol", label: "STAR Protocols: CRISPR-Cas13による生細胞内RNAの動的イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/33111085/", note: "dCas13でRNAを可視化する手順です。標的化の基礎操作を学ぶのに向きます。" }
  ],
  "ch12:t6": [
    { type: "tool", label: "Arc Institute: Bridge RNA Designer（ブリッジRNA設計ツール）", url: "https://bridge.hsulab.arcinstitute.org/", note: "標的配列とドナー配列を入力してブリッジRNAを設計できる公式ウェブツールです。" },
    { type: "tool", label: "GitHub: BridgeRNADesigner 公式リポジトリ", url: "https://github.com/hsulab-arc/BridgeRNADesigner", note: "設計ツールの実装と使い方が公開されており、ローカル実行や仕様確認に使えます。" }
  ],
  "ch12:t7": [
    { type: "protocol", label: "Nature Protocols: DARLINマウスによる高効率in vivo系統追跡", url: "https://pubmed.ncbi.nlm.nih.gov/40119004/", note: "バーコード誘導から回収までの手順書です。系譜記録実験を計画するときに読みます。" },
    { type: "tool", label: "Cassiopeia: Cas9系統追跡データの系統樹再構成パッケージ", url: "https://github.com/YosefLab/Cassiopeia", note: "編集バーコードから系統樹を推定する解析ツールで、再構成の前提条件も確認できます。" }
  ],
  "ch12:t8": [
    { type: "protocol", label: "STAR Protocols: 飽和ゲノム編集による遺伝子変異の機能評価", url: "https://pubmed.ncbi.nlm.nih.gov/40198219/", note: "変異ライブラリ作製から機能スコア算出までの流れが具体的に示されています。" },
    { type: "protocol", label: "STAR Protocols: CRISPR-Cas9による変異の飽和と多重化の手順", url: "https://pubmed.ncbi.nlm.nih.gov/37948185/", note: "多数の変異を一度に導入する実装が書かれており、設計上の注意点を確認できます。" }
  ],
  "ch12:t9": [
    { type: "vendor", label: "10x Genomics: Feature Barcoding用の抗体参照ファイル仕様", url: "https://www.10xgenomics.com/support/software/cell-ranger/latest/analysis/inputs/cr-feature-ref-csv", note: "CITE-seqの抗体タグを解析に読み込むための書式です。定量が合わないときに確認します。" },
    { type: "protocol", label: "Nature Protocols: マウス脳と境界組織の1細胞RNAとタンパク質同時解析", url: "https://pubmed.ncbi.nlm.nih.gov/35931780/", note: "抗体タグ付けから解析までを通した実例で、組織由来サンプルの扱いが参考になります。" },
    { type: "protocol", label: "STAR Protocols: 蛍光抗体と抗体オリゴ複合体の併用染色とソーティング", url: "https://pubmed.ncbi.nlm.nih.gov/34712996/", note: "ヒトPBMCでCITE-seq前にソートする手順です。染色条件の設計に使えます。" }
  ],
  "ch12:t10": [
    { type: "vendor", label: "10x Genomics: Single Cell ATAC 公式サポート", url: "https://www.10xgenomics.com/support/epi-atac", note: "核調製から試薬キット仕様、品質管理指標までの公式技術資料がまとまっています。" },
    { type: "tool", label: "10x Genomics: Cell Ranger ATAC 解析ソフト公式ドキュメント", url: "https://www.10xgenomics.com/support/software/cell-ranger-atac/latest", note: "ピーク検出やフラグメント出力の仕様が書かれており、指標の意味を確認できます。" },
    { type: "tool", label: "Signac: 1細胞クロマチンアクセシビリティ解析パッケージ", url: "https://stuartlab.org/signac/", note: "scATAC-seqの前処理からモチーフ解析までのチュートリアルが揃っています。" }
  ],
  "ch12:t11": [
    { type: "vendor", label: "10x Genomics: Single Cell Multiome ATAC + 遺伝子発現サポート", url: "https://www.10xgenomics.com/support/epi-multiome", note: "同一核からRNAとATACを取る実験の公式手順と品質基準が確認できます。" },
    { type: "tool", label: "10x Genomics: Cell Ranger ARC 公式ドキュメント", url: "https://www.10xgenomics.com/support/software/cell-ranger-arc/latest", note: "マルチオームデータの一括処理ソフトの仕様です。出力の読み方を確認できます。" },
    { type: "tool", label: "Signac: PBMCマルチオーム解析チュートリアル", url: "https://stuartlab.org/signac/articles/pbmc_multiomic", note: "RNAとATACを統合して細胞型注釈まで進める実践例で、手を動かして学べます。" }
  ],
  "ch12:t12": [
    { type: "protocol", label: "STAR Protocols: 高スループットscNMT法による1細胞マルチオミクス", url: "https://pubmed.ncbi.nlm.nih.gov/36072757/", note: "メチル化とクロマチンと転写を同時に取る手順で、試薬と工程が詳細に書かれています。" },
    { type: "protocol", label: "STAR Protocols: scNMTプロトコルの改訂版アップデート", url: "https://pubmed.ncbi.nlm.nih.gov/40711871/", note: "初版からの改良点がまとまっており、実施前の最新条件確認に向いています。" },
    { type: "protocol", label: "Nature Protocols: scBS-seqによる1細胞DNAメチル化の網羅的解析", url: "https://pubmed.ncbi.nlm.nih.gov/28182018/", note: "1細胞バイサルファイト法の基本手順です。カバレッジ設計の考え方が分かります。" }
  ],
  "ch12:t13": [
    { type: "protocol", label: "Nature Protocols: SCoPE2による多重化1細胞プロテオミクス", url: "https://pubmed.ncbi.nlm.nih.gov/34716448/", note: "キャリアチャネルを用いた測定の実務手順で、SCoPE系の標準的な入口になります。" },
    { type: "protocol", label: "Nature Protocols: nPOPによる大規模試料調製と多重化測定", url: "https://pubmed.ncbi.nlm.nih.gov/39117766/", note: "液滴を使った並列前処理の手順です。スループットを上げたいときに読みます。" },
    { type: "db", label: "Slavovラボ: 1細胞プロテオミクス（SCP）総合リソース", url: "https://scp.slavovlab.net/", note: "プロトコル、データ、解析コードへの入口が集約された分野の中心的なサイトです。" }
  ],
  "ch12:t14": [
    { type: "vendor", label: "Cytosurge: FluidFMバイオプシー（細胞質抽出）ソリューション", url: "https://www.cytosurge.com/solutions/biopsy-platform-cytoplasmic-extraction", note: "細胞を生かしたまま細胞質を吸い取る装置の技術資料で、Live-seqの実装基盤です。" },
    { type: "vendor", label: "Cytosurge: 経時的1細胞プロファイリングの技術解説", url: "https://www.cytosurge.com/applications/single-cell-profiling", note: "同じ細胞を繰り返しサンプリングする考え方と適用範囲がまとめられています。" }
  ],
  "ch12:t15": [
    { type: "vendor", label: "PacBio: Kinnex（全長アイソフォーム解析）技術ページ", url: "https://www.pacb.com/technology/kinnex/", note: "全長cDNAを連結して読むキットの仕様です。アイソフォーム解析の設計に使えます。" },
    { type: "tool", label: "sicelore: 1細胞ロングリードのアイソフォーム定量パイプライン", url: "https://github.com/ucagenomix/sicelore", note: "ナノポア読みに細胞バーコードを対応づける解析の公式リポジトリです。" },
    { type: "tool", label: "FLAMES: 1細胞ロングリード解析パイプライン", url: "https://github.com/mritchielab/FLAMES", note: "アイソフォーム同定と定量をまとめて行うツールで、実装の比較検討に役立ちます。" }
  ],
  "ch12:t16": [
    { type: "vendor", label: "Lexogen: SLAMseq RNA Kinetics キット技術資料", url: "https://www.lexogen.com/slamseq-metabolic-rna-labeling/", note: "4sU標識とアルキル化変換の試薬仕様です。標識時間の設計に必要な情報が載ります。" },
    { type: "tool", label: "SLAM-DUNK: SLAM-seq解析パイプライン", url: "https://github.com/t-neumann/slamdunk", note: "T-to-C変換を数え上げて新生RNA割合を出す標準ツールの公式リポジトリです。" },
    { type: "protocol", label: "Methods in Molecular Biology: 代謝標識と化学変換によるmRNA安定性測定", url: "https://pubmed.ncbi.nlm.nih.gov/31768977/", note: "標識から変換、解析までの実験手順が丁寧に書かれた入門的なプロトコルです。" }
  ],
  "ch12:t17": [
    { type: "protocol", label: "STAR Protocols: 単一細胞eQTLから疾患関連遺伝子を同定する手順", url: "https://pubmed.ncbi.nlm.nih.gov/42101938/", note: "細胞種特異的なeQTLとGWASを突き合わせる解析の流れが具体的に示されています。" },
    { type: "db", label: "EMBL-EBI: eQTL Catalogue（統一処理済みeQTLデータベース）", url: "https://www.ebi.ac.uk/eqtl/", note: "多数の研究のeQTLを統一処理して提供しており、自分の結果の照合に使えます。" },
    { type: "tool", label: "limix_qtl: 単一細胞を含むQTLマッピングのパイプライン", url: "https://github.com/single-cell-genetics/limix_qtl", note: "混合モデルでsc-eQTLを検出する実装で、共変量の扱い方も確認できます。" }
  ],
  "ch12:t18": [
    { type: "vendor", label: "Vizgen: MERSCOPEなど空間生物学製品ラインナップ", url: "https://vizgen.com/products/", note: "MERFISHを商用化した装置と試薬の仕様です。導入検討や条件確認に使います。" },
    { type: "tool", label: "Zhuangラボ: MERFISH解析とプローブ設計ソフト", url: "https://github.com/ZhuangLab/MERFISH_analysis", note: "誤り訂正コードブックの設計と画像解析の公式実装で、原理の理解にも役立ちます。" },
    { type: "protocol", label: "Methods in Enzymology: MERFISHによるRNAイメージングの実験手順", url: "https://pubmed.ncbi.nlm.nih.gov/27241748/", note: "プローブ設計から撮像、デコードまでの標準手順がまとめられた基本文献です。" }
  ],
  "ch12:t19": [
    { type: "db", label: "Cai Lab（Caltech）: seqFISH公式解説ページ", url: "https://spatial.caltech.edu/seqfish/", note: "開発ラボによるseqFISHとseqFISH+の原理と資料の入口で、最初に開く一次情報です。" },
    { type: "tool", label: "CaiGroup: seqFISH+ 解析コード公式リポジトリ", url: "https://github.com/CaiGroup/seqFISH-PLUS", note: "スポット検出とバーコード復号の実装が公開されており、処理手順を追えます。" },
    { type: "protocol", label: "Methods in Molecular Biology: seqFISHデータの画像解析プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/39283466/", note: "DNAやRNAと免疫染色を組み合わせた解析の手順で、画像処理の勘所が分かります。" }
  ],
  "ch12:t20": [
    { type: "tool", label: "Macoskoラボ: Slide-seqデータ解析ツール群", url: "https://github.com/MacoskoLab/slideseq-tools", note: "ビーズ座標と発現の対応づけを行う公式パイプラインで、出力形式も確認できます。" },
    { type: "tool", label: "Broad Institute: Slide-tags 解析コードリポジトリ", url: "https://github.com/broadchenf/Slide-tags", note: "核に空間タグを付けて1細胞解析につなぐ手法の実装で、処理の流れを追えます。" }
  ],
  "ch12:t21": [
    { type: "vendor", label: "STOmics: Stereo-seq 公式技術サイト", url: "https://en.stomics.tech/", note: "DNBチップを使う空間トランスクリプトームの製品仕様と解像度の情報が載ります。" },
    { type: "tool", label: "STOmics SAW: Stereo-seq一次解析パイプライン", url: "https://github.com/STOmics/SAW", note: "生データから空間発現行列を作る公式ワークフローで、入出力仕様を確認できます。" },
    { type: "tool", label: "Stereopy: Stereo-seqデータ解析パッケージ公式ドキュメント", url: "https://stereopy.readthedocs.io/en/latest/", note: "ビン化やクラスタリングなど下流解析のチュートリアルがまとまっています。" }
  ],
  "ch12:t22": [
    { type: "protocol", label: "Nature Protocols: DNA結合抗体を用いたCODEX多重組織イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/34215862/", note: "抗体標識からサイクリング撮像までの標準手順で、パネル設計の指針も得られます。" },
    { type: "protocol", label: "STAR Protocols: PhenoCycler-FusionによるFFPE全スライド高多重撮像", url: "https://pubmed.ncbi.nlm.nih.gov/39031553/", note: "現行装置でのFFPE運用手順です。臨床検体を扱う前に条件を確認できます。" }
  ],
  "ch12:t23": [
    { type: "tool", label: "steinbock: イメージングマスサイトメトリー解析ツールキット", url: "https://bodenmillergroup.github.io/steinbock/latest/", note: "生データ変換から細胞セグメンテーションまでを標準化する公式ドキュメントです。" },
    { type: "tool", label: "Bodenmillerラボ: IMCデータ解析ワークフロー教材", url: "https://bodenmillergroup.github.io/IMCDataAnalysis/", note: "単一細胞レベルの表現型分類や空間解析までを通しで学べる実践書です。" },
    { type: "protocol", label: "STAR Protocols: MATISSE（IMCと蛍光顕微鏡の統合解析手順）", url: "https://pubmed.ncbi.nlm.nih.gov/34977680/", note: "蛍光画像を併用して細胞境界の精度を上げる方法で、精度不足の解決に役立ちます。" }
  ],
  "ch12:t24": [
    { type: "protocol", label: "STAR Protocols: 多重イメージングを用いたDeep Visual Proteomics", url: "https://pubmed.ncbi.nlm.nih.gov/40536875/", note: "AIによる細胞選別からレーザー切り出し、質量分析までの一連の手順が分かります。" },
    { type: "tool", label: "Mannラボ: dvp-io（DVPデータの入出力ライブラリ）", url: "https://github.com/MannLabs/dvp-io", note: "顕微鏡由来の空間データとプロテオミクス結果をつなぐ公式実装です。" }
  ],
  "ch12:t25": [
    { type: "tool", label: "ExSeqProcessing: 拡張in situシークエンシングの解析パイプライン", url: "https://github.com/dgoodwin208/ExSeqProcessing", note: "膨潤試料の画像位置合わせと塩基読み取りを行う公式実装で、処理順序を追えます。" },
    { type: "protocol", label: "Nature Protocols: X10拡張顕微鏡の最適化ガイド", url: "https://pubmed.ncbi.nlm.nih.gov/30778205/", note: "ゲル作製と膨潤条件の詰め方が実践的にまとまっており、歪み対策に役立ちます。" },
    { type: "protocol", label: "Nature Protocols: 拡張顕微鏡と構造化照明顕微鏡の併用による複合体解析", url: "https://pubmed.ncbi.nlm.nih.gov/30072723/", note: "拡張法を高解像度撮像と組み合わせる手順で、分解能設計の参考になります。" }
  ]
});
