/* 第8章（前半 t1-t20） 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch08:t1": [
    { pmid: "7569999", title: "Quantitative monitoring of gene expression patterns with a complementary DNA microarray.", authors: "Schena M et al.", journal: "Science (New York, N.Y.)", year: "1995", doi: "10.1126/science.270.5235.467", note: "cDNAマイクロアレイを初めて報告した原著で、45遺伝子の発現を同時定量できることを示しました。" },
    { pmid: "10521349", title: "Molecular classification of cancer: class discovery and class prediction by gene expression monitoring.", authors: "Golub TR et al.", journal: "Science (New York, N.Y.)", year: "1999", doi: "10.1126/science.286.5439.531", note: "白血病の発現プロファイルからAMLとALLを判別し、アレイによる分子分類の道を開いた代表例です。" }
  ],
  "ch08:t2": [
    { pmid: "18987734", title: "Accurate whole human genome sequencing using reversible terminator chemistry.", authors: "Bentley DR et al.", journal: "Nature", year: "2008", doi: "10.1038/nature07517", note: "可逆的ターミネーター化学によるIlluminaショートリード方式を確立した原著論文です。" },
    { pmid: "26432245", title: "A global reference for human genetic variation.", authors: "1000 Genomes Project Consortium et al.", journal: "Nature", year: "2015", doi: "10.1038/nature15393", note: "2504人をショートリードで解読し、ヒト遺伝的多様性の標準参照データを構築した大規模応用研究です。" }
  ],
  "ch08:t3": [
    { pmid: "29431738", title: "Nanopore sequencing and assembly of a human genome with ultra-long reads.", authors: "Jain M et al.", journal: "Nature biotechnology", year: "2018", doi: "10.1038/nbt.4060", note: "ナノポアの超長鎖リードだけでヒトゲノムを構築し、反復領域まで読めることを示した代表論文です。" },
    { pmid: "26840485", title: "Real-time, portable genome sequencing for Ebola surveillance.", authors: "Quick J et al.", journal: "Nature", year: "2016", doi: "10.1038/nature16996", note: "小型ナノポア機器を西アフリカに持ち込み、エボラ流行のリアルタイム監視を実現した応用例です。" }
  ],
  "ch08:t4": [
    { pmid: "31406327", title: "Accurate circular consensus long-read sequencing improves variant detection and assembly of a human genome.", authors: "Wenger AM et al.", journal: "Nature biotechnology", year: "2019", doi: "10.1038/s41587-019-0217-9", note: "環状コンセンサス読取りで高精度長鎖リードHiFiを確立し、変異検出を大きく改善した原著です。" },
    { pmid: "35357919", title: "The complete sequence of a human genome.", authors: "Nurk S et al.", journal: "Science (New York, N.Y.)", year: "2022", doi: "10.1126/science.abj6987", note: "HiFiとナノポアを併用し、空白のないヒト全ゲノム配列T2T-CHM13を完成させた記念碑的研究です。" }
  ],
  "ch08:t5": [
    { pmid: "23075208", title: "Volcano plots in analyzing differential expressions with mRNA microarrays.", authors: "Li W", journal: "Journal of bioinformatics and computational biology", year: "2012", doi: "10.1142/S0219720012310038", note: "変化量とp値を同時に描くvolcano plotの統計的意味と使い方を整理した解説的研究です。" },
    { pmid: "38360828", title: "Fudging the volcano-plot without dredging the data.", authors: "Burger T", journal: "Nature communications", year: "2024", doi: "10.1038/s41467-024-45834-7", note: "fold change閾値とp値を併用する際の偽陽性制御の問題を検証し、正しい運用を提案しています。" }
  ],
  "ch08:t6": [
    { pmid: "18550803", title: "RNA-seq: an assessment of technical reproducibility and comparison with gene expression arrays.", authors: "Marioni JC et al.", journal: "Genome research", year: "2008", doi: "10.1101/gr.079558.108", note: "試料間の散布図を並べて技術的再現性を評価し、RNA-seqとアレイを比較した基礎的研究です。" },
    { pmid: "25150838", title: "A comprehensive assessment of RNA-seq accuracy, reproducibility and information content by the Sequencing Quality Control Consortium.", authors: "SEQC/MAQC-III Consortium", journal: "Nature biotechnology", year: "2014", doi: "10.1038/nbt.2957", note: "施設間・プラットフォーム間の対散布図で再現性を検証した、大規模品質管理プロジェクトです。" }
  ],
  "ch08:t7": [
    { pmid: "10802651", title: "Gene ontology: tool for the unification of biology. The Gene Ontology Consortium.", authors: "Ashburner M et al.", journal: "Nature genetics", year: "2000", doi: "10.1038/75556", note: "遺伝子機能を共通語彙で記述するGene Ontologyを提唱し、GO解析の基盤を築いた原著です。" },
    { pmid: "19131956", title: "Systematic and integrative analysis of large gene lists using DAVID bioinformatics resources.", authors: "Huang da W et al.", journal: "Nature protocols", year: "2009", doi: "10.1038/nprot.2008.211", note: "DAVIDによる遺伝子リストの機能富化解析手順を示し、GO解析を広く普及させた実践論文です。" }
  ],
  "ch08:t8": [
    { pmid: "16199517", title: "Gene set enrichment analysis: a knowledge-based approach for interpreting genome-wide expression profiles.", authors: "Subramanian A et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2005", doi: "10.1073/pnas.0506580102", note: "個々の遺伝子ではなく遺伝子セット単位で発現変動の偏りを評価するGSEAを確立した原著論文です。" },
    { pmid: "12808457", title: "PGC-1alpha-responsive genes involved in oxidative phosphorylation are coordinately downregulated in human diabetes.", authors: "Mootha VK et al.", journal: "Nature genetics", year: "2003", doi: "10.1038/ng1180", note: "GSEAの原型を糖尿病筋に適用し、酸化的リン酸化遺伝子群の協調的低下を見出した応用例です。" }
  ],
  "ch08:t9": [
    { pmid: "9843981", title: "Cluster analysis and display of genome-wide expression patterns.", authors: "Eisen MB et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1998", doi: "10.1073/pnas.95.25.14863", note: "階層的クラスタリングとヒートマップ表示を発現解析に導入した、可視化の出発点となる原著です。" },
    { pmid: "10963602", title: "Molecular portraits of human breast tumours.", authors: "Perou CM et al.", journal: "Nature", year: "2000", doi: "10.1038/35021093", note: "階層的クラスタリングで乳癌をルミナル型などの内因性サブタイプに分類した代表的応用研究です。" }
  ],
  "ch08:t10": [
    { pmid: "10391217", title: "Systematic determination of genetic network architecture.", authors: "Tavazoie S et al.", journal: "Nature genetics", year: "1999", doi: "10.1038/10343", note: "酵母の発現データをk-means法で分割し、各クラスターの共通モチーフを見出した先駆的研究です。" },
    { pmid: "34867140", title: "A Practical Guide to Sparse k-Means Clustering for Studying Molecular Development of the Human Brain.", authors: "Balsor JL et al.", journal: "Frontiers in neuroscience", year: "2021", doi: "10.3389/fnins.2021.668293", note: "ヒト脳発達データにスパースk-meansを適用し、クラスター数の決め方まで具体的に示しています。" }
  ],
  "ch08:t11": [
    { pmid: "17194218", title: "Population structure and eigenanalysis.", authors: "Patterson N et al.", journal: "PLoS genetics", year: "2006", doi: "10.1371/journal.pgen.0020190", note: "主成分分析で集団構造を捉える統計的枠組みと有意性判定を整理した、PCA応用の基礎論文です。" },
    { pmid: "18758442", title: "Genes mirror geography within Europe.", authors: "Novembre J et al.", journal: "Nature", year: "2008", doi: "10.1038/nature07331", note: "SNPのPCA第1・2主成分がヨーロッパ地図とほぼ一致することを示した、PCAの象徴的応用例です。" }
  ],
  "ch08:t12": [
    { pmid: "19213877", title: "Genome-wide analysis in vivo of translation with nucleotide resolution using ribosome profiling.", authors: "Ingolia NT et al.", journal: "Science (New York, N.Y.)", year: "2009", doi: "10.1126/science.1168978", note: "多数の遺伝子を開始・終止コドン基準で重ね合わせるメタジーン表示を確立した代表研究です。" },
    { pmid: "22575960", title: "Topology of the human and mouse m6A RNA methylomes revealed by m6A-seq.", authors: "Dominissini D et al.", journal: "Nature", year: "2012", doi: "10.1038/nature11112", note: "メタジーンプロットでm6A修飾が終止コドン近傍に集中することを示した、可視化の好例です。" }
  ],
  "ch08:t13": [
    { pmid: "2172928", title: "Sequence logos: a new way to display consensus sequences.", authors: "Schneider TD et al.", journal: "Nucleic acids research", year: "1990", doi: "10.1093/nar/18.20.6097", note: "情報量を文字の高さで表すシークエンスロゴを考案した原著で、モチーフ図の標準となりました。" },
    { pmid: "15173120", title: "WebLogo: a sequence logo generator.", authors: "Crooks GE et al.", journal: "Genome research", year: "2004", doi: "10.1101/gr.849004", note: "誰でもロゴ図を作成できるWebLogoを公開し、モチーフ可視化を一般化させたツール論文です。" }
  ],
  "ch08:t14": [
    { pmid: "15608232", title: "STRING: known and predicted protein-protein associations, integrated and transferred across organisms.", authors: "von Mering C et al.", journal: "Nucleic acids research", year: "2005", doi: "10.1093/nar/gki005", note: "既知と予測のタンパク質間関連を統合するSTRINGの設計思想を示した基盤論文です。" },
    { pmid: "36370105", title: "The STRING database in 2023: protein-protein association networks and functional enrichment analyses for any sequenced genome of interest.", authors: "Szklarczyk D et al.", journal: "Nucleic acids research", year: "2023", doi: "10.1093/nar/gkac1000", note: "現行版STRINGの機能を解説しており、実際にPPI網や富化解析を行う際の引用先になります。" }
  ],
  "ch08:t15": [
    { pmid: "10592173", title: "KEGG: kyoto encyclopedia of genes and genomes.", authors: "Kanehisa M et al.", journal: "Nucleic acids research", year: "2000", doi: "10.1093/nar/28.1.27", note: "遺伝子と代謝・シグナル経路を結ぶKEGGパスウェイマップを提示した基盤論文です。" },
    { pmid: "27899662", title: "KEGG: new perspectives on genomes, pathways, diseases and drugs.", authors: "Kanehisa M et al.", journal: "Nucleic acids research", year: "2017", doi: "10.1093/nar/gkw1092", note: "疾患・医薬品情報まで拡張された現行KEGGを解説し、パスウェイ解析でよく引用されます。" }
  ],
  "ch08:t16": [
    { pmid: "14597658", title: "Cytoscape: a software environment for integrated models of biomolecular interaction networks.", authors: "Shannon P et al.", journal: "Genome research", year: "2003", doi: "10.1101/gr.1239303", note: "分子ネットワークの描画と解析を統合したCytoscapeを公開し、事実上の標準となった論文です。" },
    { pmid: "19114008", title: "WGCNA: an R package for weighted correlation network analysis.", authors: "Langfelder P et al.", journal: "BMC bioinformatics", year: "2008", doi: "10.1186/1471-2105-9-559", note: "共発現の重み付きネットワークからモジュールを抽出するWGCNAを提供した代表的手法論文です。" }
  ],
  "ch08:t17": [
    { pmid: "31797920", title: "The Escherichia coli transcriptome mostly consists of independently regulated modules.", authors: "Sastry AV et al.", journal: "Nature communications", year: "2019", doi: "10.1038/s41467-019-13483-w", note: "独立成分分析で大腸菌の発現データを分解し、iModulonという制御単位を定義した原著です。" },
    { pmid: "33045728", title: "iModulonDB: a knowledgebase of microbial transcriptional regulation derived from machine learning.", authors: "Rychel K et al.", journal: "Nucleic acids research", year: "2021", doi: "10.1093/nar/gkaa810", note: "複数菌種のiModulonを閲覧・比較できる公開データベースを構築した実用的な応用研究です。" }
  ],
  "ch08:t18": [
    { pmid: "35000890", title: "Overview of Sankey flow diagrams: Focusing on symptom trajectories in older adults with advanced cancer.", authors: "Otto E et al.", journal: "Journal of geriatric oncology", year: "2022", doi: "10.1016/j.jgo.2021.12.017", note: "進行がん高齢者の症状推移をサンキー図で描き、作図の考え方も丁寧に解説した論文です。" },
    { pmid: "32570378", title: "Exploring Patient Path Through Sankey Diagram: A Proof of Concept.", authors: "Lamer A et al.", journal: "Studies in health technology and informatics", year: "2020", doi: "10.3233/SHTI200154", note: "病院内の患者動線をサンキー図で可視化し、流量の移り変わりを読み解いた実証研究です。" }
  ],
  "ch08:t19": [
    { pmid: "29409532", title: "SCANPY: large-scale single-cell gene expression data analysis.", authors: "Wolf FA et al.", journal: "Genome biology", year: "2018", doi: "10.1186/s13059-017-1382-0", note: "クラスター別マーカーを点の大きさと色で示すdotplotを標準搭載した解析基盤の論文です。" },
    { pmid: "34062119", title: "Integrated analysis of multimodal single-cell data.", authors: "Hao Y et al.", journal: "Cell", year: "2021", doi: "10.1016/j.cell.2021.04.048", note: "Seurat v4を用い、多群のマーカー発現をドットプロットで比較提示した代表的な応用研究です。" }
  ],
  "ch08:t20": [
    { pmid: "23945592", title: "Signatures of mutational processes in human cancer.", authors: "Alexandrov LB et al.", journal: "Nature", year: "2013", doi: "10.1038/nature12477", note: "7042検体の体細胞変異から20を超える変異シグネチャーを抽出した、この分野の出発点です。" },
    { pmid: "32025018", title: "The repertoire of mutational signatures in human cancer.", authors: "Alexandrov LB et al.", journal: "Nature", year: "2020", doi: "10.1038/s41586-020-1943-3", note: "全ゲノム2658検体を再解析し、COSMICに載る変異シグネチャー一覧を整備した決定版です。" }
  ]
});
