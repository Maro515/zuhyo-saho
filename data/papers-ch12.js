/* 第12章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch12:t1": [
    { pmid: "27096365", title: "Programmable editing of a target base in genomic DNA without double-stranded DNA cleavage.", authors: "Komor AC et al.", journal: "Nature", year: "2016", doi: "10.1038/nature17946", note: "二本鎖切断を伴わずにシチジンをチミジンへ書き換えるシチジン塩基編集を初めて実現し、塩基編集という分野を切り拓いた論文です。" },
    { pmid: "29160308", title: "Programmable base editing of A•T to G•C in genomic DNA without DNA cleavage.", authors: "Gaudelli NM et al.", journal: "Nature", year: "2017", doi: "10.1038/nature24644", note: "人工進化させたデアミナーゼでA・TをG・Cへ変換するアデニン塩基編集を確立し、点変異修復の適用範囲を大きく広げました。" }
  ],
  "ch12:t2": [
    { pmid: "31634902", title: "Search-and-replace genome editing without double-strand breaks or donor DNA.", authors: "Anzalone AV et al.", journal: "Nature", year: "2019", doi: "10.1038/s41586-019-1711-4", note: "逆転写酵素融合Cas9とpegRNAにより、二本鎖切断もドナーDNAも使わずに任意の置換や小さな挿入欠失を書き込む手法です。" },
    { pmid: "34653350", title: "Enhanced prime editing systems by manipulating cellular determinants of editing outcomes.", authors: "Chen PJ et al.", journal: "Cell", year: "2021", doi: "10.1016/j.cell.2021.09.018", note: "ミスマッチ修復の阻害とニッキングの工夫でプライム編集効率を大幅に高め、PE4・PE5系を確立した改良研究です。" }
  ],
  "ch12:t3": [
    { pmid: "23849981", title: "CRISPR-mediated modular RNA-guided regulation of transcription in eukaryotes.", authors: "Gilbert LA et al.", journal: "Cell", year: "2013", doi: "10.1016/j.cell.2013.06.044", note: "触媒不活性化Cas9に転写抑制・活性化ドメインを連結し、配列を切らずに遺伝子発現を自在に上下させる基盤を作りました。" },
    { pmid: "33838111", title: "Genome-wide programmable transcriptional memory by CRISPR-based epigenome editing.", authors: "Nuñez JK et al.", journal: "Cell", year: "2021", doi: "10.1016/j.cell.2021.03.025", note: "DNAメチル化とヒストン修飾を同時に書き込むCRISPRoffで、配列を変えずに遺伝的に受け継がれる発現抑制を実現しました。" }
  ],
  "ch12:t4": [
    { pmid: "27984732", title: "Perturb-Seq: Dissecting Molecular Circuits with Scalable Single-Cell RNA Profiling of Pooled Genetic Screens.", authors: "Dixit A et al.", journal: "Cell", year: "2016", doi: "10.1016/j.cell.2016.11.038", note: "プールしたCRISPRスクリーニングと1細胞RNA-seqを結合し、どの遺伝子破壊がどの転写変化を生むかを一挙に読み出します。" },
    { pmid: "35688146", title: "Mapping information-rich genotype-phenotype landscapes with genome-scale Perturb-seq.", authors: "Replogle JM et al.", journal: "Cell", year: "2022", doi: "10.1016/j.cell.2022.05.013", note: "発現遺伝子ほぼ全てを対象にゲノム規模のPerturb-seqを実施し、遺伝子機能の網羅的な地図を描き出した大規模研究です。" }
  ],
  "ch12:t5": [
    { pmid: "28976959", title: "RNA targeting with CRISPR-Cas13.", authors: "Abudayyeh OO et al.", journal: "Nature", year: "2017", doi: "10.1038/nature24049", note: "RNAだけを切るCas13を哺乳類細胞に応用し、ゲノムを傷つけずに高効率かつ高特異的なノックダウンを可能にしました。" },
    { pmid: "29070703", title: "RNA editing with CRISPR-Cas13.", authors: "Cox DBT et al.", journal: "Science (New York, N.Y.)", year: "2017", doi: "10.1126/science.aaq0180", note: "触媒不活性Cas13にADARを融合したREPAIRにより、DNAを改変せずAからIへの可逆的なRNA編集を実現した研究です。" }
  ],
  "ch12:t6": [
    { pmid: "38926615", title: "Bridge RNAs direct programmable recombination of target and donor DNA.", authors: "Durrant MG et al.", journal: "Nature", year: "2024", doi: "10.1038/s41586-024-07552-4", note: "標的側とドナー側の両方をRNAで指定できるブリッジ組換え酵素を発見し、大きなDNA配列の挿入や反転を可能にしました。" },
    { pmid: "38926616", title: "Structural mechanism of bridge RNA-guided recombination.", authors: "Hiraizumi M et al.", journal: "Nature", year: "2024", doi: "10.1038/s41586-024-07570-2", note: "ブリッジRNAと組換え酵素の複合体構造をクライオ電顕で解き、二つの配列を同時に認識する仕組みを明らかにしました。" }
  ],
  "ch12:t7": [
    { pmid: "27229144", title: "Whole-organism lineage tracing by combinatorial and cumulative genome editing.", authors: "McKenna A et al.", journal: "Science (New York, N.Y.)", year: "2016", doi: "10.1126/science.aaf7907", note: "Cas9で蓄積させた編集痕をバーコードとして読み、ゼブラフィッシュ個体全体の細胞系譜を再構成したGESTALT法の原著です。" },
    { pmid: "37852258", title: "A mouse model with high clonal barcode diversity for joint lineage, transcriptomic, and epigenomic profiling in single cells.", authors: "Li L et al.", journal: "Cell", year: "2023", doi: "10.1016/j.cell.2023.09.019", note: "極めて多様なバーコードを刻むマウスを作り、系譜情報と転写・エピゲノム情報を同一細胞で同時に取得できるようにしました。" }
  ],
  "ch12:t8": [
    { pmid: "30209399", title: "Accurate classification of BRCA1 variants with saturation genome editing.", authors: "Findlay GM et al.", journal: "Nature", year: "2018", doi: "10.1038/s41586-018-0461-z", note: "BRCA1の重要領域にほぼ全ての一塩基変異を導入して機能を測り、意義不明変異の臨床的な分類を可能にした研究です。" },
    { pmid: "39779848", title: "Saturation genome editing-based clinical classification of BRCA2 variants.", authors: "Sahu S et al.", journal: "Nature", year: "2025", doi: "10.1038/s41586-024-08349-1", note: "BRCA2に対して飽和ゲノム編集を適用し、数千個の変異の機能スコアから臨床解釈につながる分類を与えた研究です。" }
  ],
  "ch12:t9": [
    { pmid: "28759029", title: "Simultaneous epitope and transcriptome measurement in single cells.", authors: "Stoeckius M et al.", journal: "Nature methods", year: "2017", doi: "10.1038/nmeth.4380", note: "DNAバーコード付き抗体を用いて細胞表面タンパク質と転写産物を同一細胞で同時計測するCITE-seqの原著論文です。" },
    { pmid: "28854175", title: "Multiplexed quantification of proteins and transcripts in single cells.", authors: "Peterson VM et al.", journal: "Nature biotechnology", year: "2017", doi: "10.1038/nbt.3973", note: "抗体バーコードを利用して数十種のタンパク質と全転写産物を1細胞で定量するREAP-seqを報告した論文です。" }
  ],
  "ch12:t10": [
    { pmid: "26083756", title: "Single-cell chromatin accessibility reveals principles of regulatory variation.", authors: "Buenrostro JD et al.", journal: "Nature", year: "2015", doi: "10.1038/nature14590", note: "マイクロ流体デバイスで1細胞ごとにATAC-seqを行い、オープンクロマチンの細胞間ばらつきの原理を示しました。" },
    { pmid: "25953818", title: "Multiplex single cell profiling of chromatin accessibility by combinatorial cellular indexing.", authors: "Cusanovich DA et al.", journal: "Science (New York, N.Y.)", year: "2015", doi: "10.1126/science.aab1601", note: "組合せインデックスにより細胞を1個ずつ分離せず大量の1細胞クロマチン解析を行う手法を確立した論文です。" }
  ],
  "ch12:t11": [
    { pmid: "30166440", title: "Joint profiling of chromatin accessibility and gene expression in thousands of single cells.", authors: "Cao J et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aau0730", note: "同一細胞から転写産物とオープンクロマチンを同時に読むsci-CARを開発し、マルチオーム解析の道を開きました。" },
    { pmid: "33098772", title: "Chromatin Potential Identified by Shared Single-Cell Profiling of RNA and Chromatin.", authors: "Ma S et al.", journal: "Cell", year: "2020", doi: "10.1016/j.cell.2020.09.056", note: "SHARE-seqでRNAとATACを同一細胞から取得し、クロマチンが発現に先行して運命を決める様子を示した研究です。" }
  ],
  "ch12:t12": [
    { pmid: "29472610", title: "scNMT-seq enables joint profiling of chromatin accessibility DNA methylation and transcription in single cells.", authors: "Clark SJ et al.", journal: "Nature communications", year: "2018", doi: "10.1038/s41467-018-03149-4", note: "GpCメチル化でクロマチン開閉を標識し、DNAメチル化と転写を同一細胞で同時に測る三重オミクス手法です。" },
    { pmid: "25042786", title: "Single-cell genome-wide bisulfite sequencing for assessing epigenetic heterogeneity.", authors: "Smallwood SA et al.", journal: "Nature methods", year: "2014", doi: "10.1038/nmeth.3035", note: "1細胞レベルの全ゲノムバイサルファイト解析を実現し、メチル化の細胞間不均一性を評価できるようにした先駆的研究です。" }
  ],
  "ch12:t13": [
    { pmid: "30343672", title: "SCoPE-MS: mass spectrometry of single mammalian cells quantifies proteome heterogeneity during cell differentiation.", authors: "Budnik B et al.", journal: "Genome biology", year: "2018", doi: "10.1186/s13059-018-1547-5", note: "キャリアプロテオームと同重体標識を組み合わせ、1細胞のタンパク質を質量分析で定量した単一細胞プロテオミクスの原型です。" },
    { pmid: "35226415", title: "Ultra-high sensitivity mass spectrometry quantifies single-cell proteome changes upon perturbation.", authors: "Brunner AD et al.", journal: "Molecular systems biology", year: "2022", doi: "10.15252/msb.202110798", note: "標識を使わない高感度質量分析で1細胞あたり数千タンパク質を定量し、細胞周期に伴う変化を捉えた研究です。" }
  ],
  "ch12:t14": [
    { pmid: "35978187", title: "Live-seq enables temporal transcriptomic recording of single cells.", authors: "Chen W et al.", journal: "Nature", year: "2022", doi: "10.1038/s41586-022-05046-9", note: "細胞質のごく一部だけを吸い取って転写産物を読み、細胞を生かしたまま同じ細胞の時間変化を追える手法です。" },
    { pmid: "27419874", title: "Tunable Single-Cell Extraction for Molecular Analyses.", authors: "Guillaume-Gentil O et al.", journal: "Cell", year: "2016", doi: "10.1016/j.cell.2016.06.025", note: "流体力顕微鏡で生細胞から細胞質や核内容物を必要量だけ採取する技術を確立し、非破壊的1細胞解析の基礎を築きました。" }
  ],
  "ch12:t15": [
    { pmid: "30320766", title: "Single-cell isoform RNA sequencing characterizes isoforms in thousands of cerebellar cells.", authors: "Gupta I et al.", journal: "Nature biotechnology", year: "2018", doi: "10.1038/nbt.4259", note: "ロングリードと1細胞バーコードを組み合わせ、小脳の多数の細胞でアイソフォームの使い分けを解析した研究です。" },
    { pmid: "37291427", title: "High-throughput RNA isoform sequencing using programmed cDNA concatenation.", authors: "Al'Khafaji AM et al.", journal: "Nature biotechnology", year: "2024", doi: "10.1038/s41587-023-01815-7", note: "cDNAを連結してロングリードの情報量を桁違いに高めるMAS-seqにより、1細胞アイソフォーム解析を実用化しました。" }
  ],
  "ch12:t16": [
    { pmid: "28945705", title: "Thiol-linked alkylation of RNA to assess expression dynamics.", authors: "Herzog VA et al.", journal: "Nature methods", year: "2017", doi: "10.1038/nmeth.4435", note: "4sUで標識した新生RNAを化学変換により塩基置換として読み出し、転写と分解の速度を分離して測る手法です。" },
    { pmid: "29622725", title: "SLAM-seq defines direct gene-regulatory functions of the BRD4-MYC axis.", authors: "Muhar M et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aao2793", note: "新生RNA標識と急速な標的分解を組み合わせ、BRD4とMYCの直接標的と二次的な変化を切り分けた研究です。" }
  ],
  "ch12:t17": [
    { pmid: "29610479", title: "Single-cell RNA sequencing identifies celltype-specific cis-eQTLs and co-expression QTLs.", authors: "van der Wijst MGP et al.", journal: "Nature genetics", year: "2018", doi: "10.1038/s41588-018-0089-9", note: "1細胞RNA-seqと遺伝型情報を統合し、細胞種ごとに異なる発現制御変異を検出できることを示した先駆的研究です。" },
    { pmid: "35389779", title: "Single-cell eQTL mapping identifies cell type-specific genetic control of autoimmune disease.", authors: "Yazar S et al.", journal: "Science (New York, N.Y.)", year: "2022", doi: "10.1126/science.abf3041", note: "約1000人分の末梢血1細胞データからeQTLを網羅的に同定し、自己免疫疾患リスク変異の作用細胞を特定しました。" }
  ],
  "ch12:t18": [
    { pmid: "25858977", title: "RNA imaging. Spatially resolved, highly multiplexed RNA profiling in single cells.", authors: "Chen KH et al.", journal: "Science (New York, N.Y.)", year: "2015", doi: "10.1126/science.aaa6090", note: "誤り訂正符号を使った多重FISHにより、細胞内の位置情報を保ったまま千種類規模のRNAを同時に定量します。" },
    { pmid: "30385464", title: "Molecular, spatial, and functional single-cell profiling of the hypothalamic preoptic region.", authors: "Moffitt JR et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aau5324", note: "MERFISHを組織切片に適用し、視床下部視索前野の細胞型分布と行動関連神経の空間配置を明らかにしました。" }
  ],
  "ch12:t19": [
    { pmid: "30911168", title: "Transcriptome-scale super-resolved imaging in tissues by RNA seqFISH.", authors: "Eng CL et al.", journal: "Nature", year: "2019", doi: "10.1038/s41586-019-1049-y", note: "疑似カラーを用いた逐次ハイブリダイゼーションで1万種類規模の遺伝子を組織中で超解像的に可視化しました。" },
    { pmid: "34489600", title: "Integration of spatial and single-cell transcriptomic data elucidates mouse organogenesis.", authors: "Lohoff T et al.", journal: "Nature biotechnology", year: "2022", doi: "10.1038/s41587-021-01006-2", note: "seqFISHでマウス胚の空間発現を計測し、1細胞データと統合して器官形成期の細胞配置と相互作用を描きました。" }
  ],
  "ch12:t20": [
    { pmid: "30923225", title: "Slide-seq: A scalable technology for measuring genome-wide expression at high spatial resolution.", authors: "Rodriques SG et al.", journal: "Science (New York, N.Y.)", year: "2019", doi: "10.1126/science.aaw1219", note: "位置バーコード付きビーズを敷き詰めたスライドに組織を載せ、10マイクロメートル規模で網羅的発現を測る手法です。" },
    { pmid: "33288904", title: "Highly sensitive spatial transcriptomics at near-cellular resolution with Slide-seqV2.", authors: "Stickels RR et al.", journal: "Nature biotechnology", year: "2021", doi: "10.1038/s41587-020-0739-1", note: "検出感度を約一桁高めた改良版により、ほぼ単一細胞の解像度で空間トランスクリプトームを取得できるようになりました。" }
  ],
  "ch12:t21": [
    { pmid: "35512705", title: "Spatiotemporal transcriptomic atlas of mouse organogenesis using DNA nanoball-patterned arrays.", authors: "Chen A et al.", journal: "Cell", year: "2022", doi: "10.1016/j.cell.2022.04.003", note: "DNAナノボールを高密度に配置してナノメートル級の空間分解能を実現し、マウス器官形成の時空間地図を作りました。" },
    { pmid: "36048929", title: "Single-cell Stereo-seq reveals induced progenitor cells involved in axolotl brain regeneration.", authors: "Wei X et al.", journal: "Science (New York, N.Y.)", year: "2022", doi: "10.1126/science.abp9444", note: "Stereo-seqをウーパールーパーの脳再生に応用し、損傷後に現れる前駆細胞の出現と分布を空間的に追跡しました。" }
  ],
  "ch12:t22": [
    { pmid: "30078711", title: "Deep Profiling of Mouse Splenic Architecture with CODEX Multiplexed Imaging.", authors: "Goltsev Y et al.", journal: "Cell", year: "2018", doi: "10.1016/j.cell.2018.07.010", note: "DNAバーコード抗体を段階的に蛍光標識して読み取り、数十種類のタンパク質を同一切片で可視化する手法です。" },
    { pmid: "32763154", title: "Coordinated Cellular Neighborhoods Orchestrate Antitumoral Immunity at the Colorectal Cancer Invasive Front.", authors: "Schürch CM et al.", journal: "Cell", year: "2020", doi: "10.1016/j.cell.2020.07.005", note: "CODEXで大腸癌浸潤先進部を多重染色し、細胞の近傍構造の組合せが予後と関連することを示した研究です。" }
  ],
  "ch12:t23": [
    { pmid: "24584193", title: "Highly multiplexed imaging of tumor tissues with subcellular resolution by mass cytometry.", authors: "Giesen C et al.", journal: "Nature methods", year: "2014", doi: "10.1038/nmeth.2869", note: "金属標識抗体をレーザーで削り取って質量分析し、蛍光の重なりを気にせず多数の分子を組織上で可視化します。" },
    { pmid: "31959985", title: "The single-cell pathology landscape of breast cancer.", authors: "Jackson HW et al.", journal: "Nature", year: "2020", doi: "10.1038/s41586-019-1876-x", note: "イメージングマスサイトメトリーで多数の乳癌検体を解析し、単一細胞レベルの病理像から新たな亜型を定義しました。" }
  ],
  "ch12:t24": [
    { pmid: "35590073", title: "Deep Visual Proteomics defines single-cell identity and heterogeneity.", authors: "Mund A et al.", journal: "Nature biotechnology", year: "2022", doi: "10.1038/s41587-022-01302-5", note: "AIで顕微鏡画像から目的細胞を選び、レーザーで切り出して質量分析にかける空間プロテオミクスの新戦略です。" },
    { pmid: "37783884", title: "Spatial single-cell mass spectrometry defines zonation of the hepatocyte proteome.", authors: "Rosenberger FA et al.", journal: "Nature methods", year: "2023", doi: "10.1038/s41592-023-02007-6", note: "Deep Visual Proteomicsを肝臓に適用し、小葉内の位置に応じた肝細胞タンパク質の勾配を明らかにしました。" }
  ],
  "ch12:t25": [
    { pmid: "33509999", title: "Expansion sequencing: Spatially precise in situ transcriptomics in intact biological systems.", authors: "Alon S et al.", journal: "Science (New York, N.Y.)", year: "2021", doi: "10.1126/science.aax2656", note: "組織を物理的に膨潤させてからその場で配列を読み、混み合った分子を分離して空間的に転写産物を決定します。" },
    { pmid: "24578530", title: "Highly multiplexed subcellular RNA sequencing in situ.", authors: "Lee JH et al.", journal: "Science (New York, N.Y.)", year: "2014", doi: "10.1126/science.1250212", note: "細胞内でcDNAを増幅し顕微鏡下で塩基配列を読むFISSEQを確立し、in situシークエンシングの基礎を作りました。" }
  ],
  "ch12:t26": [
    { pmid: "26917770", title: "Visualizing the molecular sociology at the HeLa cell nuclear periphery.", authors: "Mahamid J et al.", journal: "Science (New York, N.Y.)", year: "2016", doi: "10.1126/science.aad8857", note: "凍結薄切とクライオ電子線トモグラフィーで細胞内をそのまま撮影し、核周辺の分子配置を分子レベルで描き出しました。" },
    { pmid: "32817270", title: "In situ structural analysis of SARS-CoV-2 spike reveals flexibility mediated by three hinges.", authors: "Turoňová B et al.", journal: "Science (New York, N.Y.)", year: "2020", doi: "10.1126/science.abd5223", note: "ウイルス粒子上のスパイクをサブトモグラム平均化で解析し、三つのヒンジによる柔軟な動きを明らかにしました。" }
  ],
  "ch12:t27": [
    { pmid: "24252878", title: "Three-dimensional electron crystallography of protein microcrystals.", authors: "Shi D et al.", journal: "eLife", year: "2013", doi: "10.7554/eLife.01345", note: "X線では小さすぎる微結晶に電子線回折を用い、タンパク質の立体構造を決定できることを示したMicroEDの原著です。" },
    { pmid: "25086503", title: "High-resolution structure determination by continuous-rotation data collection in MicroED.", authors: "Nannenga BL et al.", journal: "Nature methods", year: "2014", doi: "10.1038/nmeth.3043", note: "結晶を連続回転させながらデータを取得する方式を導入し、MicroEDの分解能とデータ品質を大きく向上させました。" }
  ],
  "ch12:t28": [
    { pmid: "31249422", title: "Recommendations for performing, interpreting and reporting hydrogen deuterium exchange mass spectrometry (HDX-MS) experiments.", authors: "Masson GR et al.", journal: "Nature methods", year: "2019", doi: "10.1038/s41592-019-0459-y", note: "HDX-MSの実験計画から解釈、報告様式までを国際的にとりまとめ、データの読み方の標準を示した指針論文です。" },
    { pmid: "34812124", title: "Hydrogen-deuterium exchange mass spectrometry reveals three unique binding responses of mAbs directed to the catalytic domain of hCAIX.", authors: "Sheff JG et al.", journal: "mAbs", year: "2021", doi: "10.1080/19420862.2021.1997072", note: "抗体が抗原のどの領域に結合し、どの部位の柔軟性が変わるかをHDX-MSで解析した典型的な応用例です。" }
  ],
  "ch12:t29": [
    { pmid: "26414014", title: "Proteome-wide profiling of protein assemblies by cross-linking mass spectrometry.", authors: "Liu F et al.", journal: "Nature methods", year: "2015", doi: "10.1038/nmeth.3603", note: "架橋剤で近接残基を固定してから質量分析にかけ、細胞抽出液中の複合体の接触面を網羅的に地図化しました。" },
    { pmid: "41315310", title: "In-situ cross-linking mass spectrometry reveals compartment-specific proteasomal interactions and structural heterogeneity.", authors: "Zhao L et al.", journal: "Nature communications", year: "2025", doi: "10.1038/s41467-025-65752-6", note: "生細胞内で架橋を行う手法により、プロテアソームの区画ごとの相互作用と構造的多様性を明らかにしました。" }
  ],
  "ch12:t30": [
    { pmid: "23828940", title: "Monitoring drug target engagement in cells and tissues using the cellular thermal shift assay.", authors: "Martinez Molina D et al.", journal: "Science (New York, N.Y.)", year: "2013", doi: "10.1126/science.1233606", note: "薬剤が結合したタンパク質は熱に強くなる性質を利用し、細胞や組織内での標的結合を直接確かめる手法です。" },
    { pmid: "25278616", title: "Tracking cancer drugs in living cells by thermal profiling of the proteome.", authors: "Savitski MM et al.", journal: "Science (New York, N.Y.)", year: "2014", doi: "10.1126/science.1255784", note: "熱安定性の変化をプロテオーム全体で測る熱プロテオーム解析を確立し、標的とオフターゲットを網羅的に探せます。" }
  ],
  "ch12:t31": [
    { pmid: "25218519", title: "Global analysis of protein structural changes in complex proteomes.", authors: "Feng Y et al.", journal: "Nature biotechnology", year: "2014", doi: "10.1038/nbt.2999", note: "限定分解で生じる切断パターンの違いから、複雑な試料中のタンパク質の構造変化を網羅的に検出する手法です。" },
    { pmid: "29307493", title: "A Map of Protein-Metabolite Interactions Reveals Principles of Chemical Communication.", authors: "Piazza I et al.", journal: "Cell", year: "2018", doi: "10.1016/j.cell.2017.12.006", note: "LiP-MSを用いて代謝物と結合するタンパク質を大規模に同定し、代謝物によるタンパク質制御の全体像を示しました。" }
  ],
  "ch12:t32": [
    { pmid: "35273146", title: "Improved prediction of protein-protein interactions using AlphaFold2.", authors: "Bryant P et al.", journal: "Nature communications", year: "2022", doi: "10.1038/s41467-022-28865-w", note: "多重配列アラインメントの作り方と評価指標を工夫し、AlphaFold2による複合体予測の精度を高めた研究です。" },
    { pmid: "34762488", title: "Computed structures of core eukaryotic protein complexes.", authors: "Humphreys IR et al.", journal: "Science (New York, N.Y.)", year: "2021", doi: "10.1126/science.abm4805", note: "深層学習による複合体予測を酵母のプロテオーム規模で実施し、未知だった多数の複合体の構造を提示しました。" }
  ],
  "ch12:t33": [
    { pmid: "37433327", title: "De novo design of protein structure and function with RFdiffusion.", authors: "Watson JL et al.", journal: "Nature", year: "2023", doi: "10.1038/s41586-023-06415-8", note: "拡散モデルで骨格構造を生成し、結合タンパク質や金属酵素などを一から設計できることを実証した論文です。" },
    { pmid: "36108050", title: "Robust deep learning-based protein sequence design using ProteinMPNN.", authors: "Dauparas J et al.", journal: "Science (New York, N.Y.)", year: "2022", doi: "10.1126/science.add2187", note: "与えられた立体構造に対して実際に折りたたむアミノ酸配列を高精度に設計するグラフ深層学習の手法です。" }
  ],
  "ch12:t34": [
    { pmid: "34735217", title: "Multiple rereads of single proteins at single-amino acid resolution using nanopores.", authors: "Brinkerhoff H et al.", journal: "Science (New York, N.Y.)", year: "2021", doi: "10.1126/science.abl4381", note: "ヘリカーゼでペプチドを何度も往復させて読み直し、1アミノ酸の違いを識別できることを示した画期的研究です。" },
    { pmid: "31844293", title: "Electrical recognition of the twenty proteinogenic amino acids using an aerolysin nanopore.", authors: "Ouldali H et al.", journal: "Nature biotechnology", year: "2020", doi: "10.1038/s41587-019-0345-2", note: "アエロリジンナノポアの電流変化から20種類のアミノ酸すべてを識別し、タンパク質配列決定の基礎を築きました。" }
  ],
  "ch12:t35": [
    { pmid: "29334379", title: "Highly parallel direct RNA sequencing on an array of nanopores.", authors: "Garalde DR et al.", journal: "Nature methods", year: "2018", doi: "10.1038/nmeth.4577", note: "逆転写も増幅も行わずRNA分子そのものをナノポアに通して読む方式を実現し、修飾やポリA長の直接解析を可能にしました。" },
    { pmid: "31740818", title: "Nanopore native RNA sequencing of a human poly(A) transcriptome.", authors: "Workman RE et al.", journal: "Nature methods", year: "2019", doi: "10.1038/s41592-019-0617-2", note: "ヒト細胞のRNAをそのまま読み、アイソフォームやポリA長、塩基修飾を含む転写産物の全体像を示した研究です。" }
  ],
  "ch12:t36": [
    { pmid: "27018577", title: "Robust transcriptome-wide discovery of RNA-binding protein binding sites with enhanced CLIP (eCLIP).", authors: "Van Nostrand EL et al.", journal: "Nature methods", year: "2016", doi: "10.1038/nmeth.3810", note: "従来のCLIPを改良して増幅バイアスと背景を抑え、RNA結合タンパク質の結合部位を再現性高く決定する手法です。" },
    { pmid: "32252787", title: "Principles of RNA processing from analysis of enhanced CLIP maps for 150 RNA binding proteins.", authors: "Van Nostrand EL et al.", journal: "Genome biology", year: "2020", doi: "10.1186/s13059-020-01982-9", note: "150種類のRNA結合タンパク質のeCLIP地図を統合し、RNAプロセシングを支配する一般原理を導き出しました。" }
  ],
  "ch12:t37": [
    { pmid: "25028896", title: "RNA motif discovery by SHAPE and mutational profiling (SHAPE-MaP).", authors: "Siegfried NA et al.", journal: "Nature methods", year: "2014", doi: "10.1038/nmeth.3029", note: "化学修飾の痕跡を変異として読み出すことで、RNAの二次構造を1塩基ごとに定量的に推定できる手法です。" },
    { pmid: "27819661", title: "DMS-MaPseq for genome-wide or targeted RNA structure probing in vivo.", authors: "Zubradt M et al.", journal: "Nature methods", year: "2017", doi: "10.1038/nmeth.4057", note: "生きた細胞内でジメチル硫酸によりRNAを修飾し、ゲノム規模あるいは標的特異的に構造を調べられる手法です。" }
  ],
  "ch12:t38": [
    { pmid: "23430654", title: "Precise maps of RNA polymerase reveal how promoters direct initiation and pausing.", authors: "Kwak H et al.", journal: "Science (New York, N.Y.)", year: "2013", doi: "10.1126/science.1229386", note: "伸長中のRNAポリメラーゼの位置を1塩基精度で決め、プロモーター近傍の一時停止の実態を描き出したPRO-seqです。" },
    { pmid: "21248844", title: "Nascent transcript sequencing visualizes transcription at nucleotide resolution.", authors: "Churchman LS et al.", journal: "Nature", year: "2011", doi: "10.1038/nature09652", note: "ポリメラーゼが保持する新生鎖を直接回収して配列を読み、転写の進行を塩基分解能で可視化したNET-seqです。" }
  ],
  "ch12:t39": [
    { pmid: "26119342", title: "Mapping Nucleosome Resolution Chromosome Folding in Yeast by Micro-C.", authors: "Hsieh TH et al.", journal: "Cell", year: "2015", doi: "10.1016/j.cell.2015.05.048", note: "制限酵素の代わりにヌクレアーゼを用いてヌクレオソーム単位の解像度でクロマチン接触を捉える手法です。" },
    { pmid: "32213324", title: "Ultrastructural Details of Mammalian Chromosome Architecture.", authors: "Krietenstein N et al.", journal: "Molecular cell", year: "2020", doi: "10.1016/j.molcel.2020.03.003", note: "哺乳類細胞にMicro-Cを適用し、Hi-Cでは見えなかった微細なループやエンハンサー接触を明らかにしました。" }
  ],
  "ch12:t40": [
    { pmid: "19966280", title: "Sequencing newly replicated DNA reveals widespread plasticity in human replication timing.", authors: "Hansen RS et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2010", doi: "10.1073/pnas.0912402107", note: "新規複製DNAを回収して配列決定し、細胞種によって複製タイミングが大きく変わることを示した先駆的研究です。" },
    { pmid: "31406346", title: "Single-cell DNA replication profiling identifies spatiotemporal developmental dynamics of chromosome organization.", authors: "Miura H et al.", journal: "Nature genetics", year: "2019", doi: "10.1038/s41588-019-0474-z", note: "1細胞レベルで複製タイミングを測定し、分化に伴う染色体構造の時空間的な変化を捉えた研究です。" }
  ],
  "ch12:t41": [
    { pmid: "30793194", title: "Using long-read sequencing to detect imprinted DNA methylation.", authors: "Gigante S et al.", journal: "Nucleic acids research", year: "2019", doi: "10.1093/nar/gkz107", note: "ロングリードで一分子ごとにメチル化と多型を同時に読み、対立遺伝子ごとのメチル化状態を判別する手法です。" },
    { pmid: "35787786", title: "Genome-wide detection of imprinted differentially methylated regions using nanopore sequencing.", authors: "Akbari V et al.", journal: "eLife", year: "2022", doi: "10.7554/eLife.77898", note: "ナノポアのハプロタイプ分解メチル化解析により、既知および新規のインプリント領域をゲノム全体で同定しました。" }
  ],
  "ch12:t42": [
    { pmid: "35357919", title: "The complete sequence of a human genome.", authors: "Nurk S et al.", journal: "Science (New York, N.Y.)", year: "2022", doi: "10.1126/science.abj6987", note: "ロングリードを駆使して反復配列やセントロメアまで埋め、隙間のないヒトゲノム配列を初めて完成させました。" },
    { pmid: "37165242", title: "A draft human pangenome reference.", authors: "Liao WW et al.", journal: "Nature", year: "2023", doi: "10.1038/s41586-023-05896-x", note: "多様な集団の高品質アセンブリをグラフとして統合し、単一参照配列では捉えられない多様性を表現しました。" }
  ],
  "ch12:t43": [
    { pmid: "27384348", title: "Circulating tumor DNA analysis detects minimal residual disease and predicts recurrence in patients with stage II colon cancer.", authors: "Tie J et al.", journal: "Science translational medicine", year: "2016", doi: "10.1126/scitranslmed.aaf6219", note: "術後血中の腫瘍由来DNAが陽性の患者で再発が著明に多いことを示し、MRD検出の臨床的意義を確立した研究です。" },
    { pmid: "31070691", title: "Analysis of Plasma Cell-Free DNA by Ultradeep Sequencing in Patients With Stages I to III Colorectal Cancer.", authors: "Reinert T et al.", journal: "JAMA oncology", year: "2019", doi: "10.1001/jamaoncol.2019.0528", note: "腫瘍情報に基づく超高深度シークエンスで術後再発を画像より早期に検出できることを前向きに示した研究です。" }
  ],
  "ch12:t44": [
    { pmid: "34176681", title: "Clinical validation of a targeted methylation-based multi-cancer early detection test using an independent validation set.", authors: "Klein EA et al.", journal: "Annals of oncology : official journal of the European Society for Medical Oncology", year: "2021", doi: "10.1016/j.annonc.2021.05.806", note: "血中DNAのメチル化パターンから50種以上のがんを検出し、組織由来まで推定する検査の性能を検証しました。" },
    { pmid: "32345712", title: "Feasibility of blood testing combined with PET-CT to screen for cancer and guide intervention.", authors: "Lennon AM et al.", journal: "Science (New York, N.Y.)", year: "2020", doi: "10.1126/science.abb9601", note: "血液検査とPET-CTを組み合わせた前向き試験で、無症状女性からのがん発見と治療介入の実行可能性を示しました。" }
  ],
  "ch12:t45": [
    { pmid: "32830910", title: "OMIP-069: Forty-Color Full Spectrum Flow Cytometry Panel for Deep Immunophenotyping of Major Cell Subsets in Human Peripheral Blood.", authors: "Park LM et al.", journal: "Cytometry. Part A : the journal of the International Society for Analytical Cytology", year: "2020", doi: "10.1002/cyto.a.24213", note: "40色を同時に用いるフルスペクトラム解析で、末梢血の主要な免疫細胞集団を一度に詳細に分類したパネルです。" },
    { pmid: "34492732", title: "Panel Optimization for High-Dimensional Immunophenotyping Assays Using Full-Spectrum Flow Cytometry.", authors: "Ferrer-Font L et al.", journal: "Current protocols", year: "2021", doi: "10.1002/cpz1.222", note: "スペクトラルフローで多色パネルを設計する際の蛍光色素選択やスプレッド評価の手順を体系的にまとめた実践指針です。" }
  ],
  "ch12:t46": [
    { pmid: "29472484", title: "Patient-derived organoids model treatment response of metastatic gastrointestinal cancers.", authors: "Vlachogiannis G et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aao2774", note: "患者由来オルガノイドの薬剤反応が実際の治療効果とよく一致することを示し、応答予測の実現可能性を示しました。" },
    { pmid: "31597751", title: "Patient-derived organoids can predict response to chemotherapy in metastatic colorectal cancer patients.", authors: "Ooft SN et al.", journal: "Science translational medicine", year: "2019", doi: "10.1126/scitranslmed.aay2574", note: "転移大腸癌でオルガノイドの薬剤感受性と臨床効果を前向きに比較し、無効例を高い精度で予測できました。" }
  ],
  "ch12:t47": [
    { pmid: "20576885", title: "Reconstituting organ-level lung functions on a chip.", authors: "Huh D et al.", journal: "Science (New York, N.Y.)", year: "2010", doi: "10.1126/science.1188302", note: "微小流路に肺胞上皮と血管内皮を配置し呼吸様の伸展を加えることで、臓器レベルの機能をチップ上に再現しました。" },
    { pmid: "31694927", title: "Reproducing human and cross-species drug toxicities using a Liver-Chip.", authors: "Jang KJ et al.", journal: "Science translational medicine", year: "2019", doi: "10.1126/scitranslmed.aax5516", note: "ヒトとラット、イヌの肝チップで薬剤性肝障害を再現し、動物実験を補う毒性評価系としての有用性を示しました。" }
  ],
  "ch12:t48": [
    { pmid: "12689998", title: "'Mendelian randomization': can genetic epidemiology contribute to understanding environmental determinants of disease?", authors: "Smith GD et al.", journal: "International journal of epidemiology", year: "2003", doi: "10.1093/ije/dyg070", note: "遺伝的変異を自然の無作為割付とみなして因果を推定するメンデルランダム化の考え方を定式化した基礎論文です。" },
    { pmid: "29846171", title: "The MR-Base platform supports systematic causal inference across the human phenome.", authors: "Hemani G et al.", journal: "eLife", year: "2018", doi: "10.7554/eLife.34408", note: "公開GWAS要約統計量を統合し、多数の曝露と疾患の組合せでメンデルランダム化を実行できる基盤を作りました。" }
  ],
  "ch12:t49": [
    { pmid: "27237061", title: "Specifying a target trial prevents immortal time bias and other self-inflicted injuries in observational analyses.", authors: "Hernán MA et al.", journal: "Journal of clinical epidemiology", year: "2016", doi: "10.1016/j.jclinepi.2016.04.014", note: "観察研究でも仮想的なランダム化試験を先に設計することで、不死時間バイアスなどを避けられると示した指針です。" },
    { pmid: "22016461", title: "Observational data for comparative effectiveness research: an emulation of randomised trials of statins and primary prevention of coronary heart disease.", authors: "Danaei G et al.", journal: "Statistical methods in medical research", year: "2013", doi: "10.1177/0962280211403603", note: "スタチンの一次予防効果について観察データで試験を模倣し、無作為化試験と近い推定値が得られることを示しました。" }
  ],
  "ch12:t50": [
    { pmid: "30104762", title: "Genome-wide polygenic scores for common diseases identify individuals with risk equivalent to monogenic mutations.", authors: "Khera AV et al.", journal: "Nature genetics", year: "2018", doi: "10.1038/s41588-018-0183-z", note: "数百万個の多型を統合したスコアで、単一遺伝子疾患に匹敵する高リスク者を一般集団から同定できると示しました。" },
    { pmid: "30554720", title: "Polygenic Risk Scores for Prediction of Breast Cancer and Breast Cancer Subtypes.", authors: "Mavaddat N et al.", journal: "American journal of human genetics", year: "2019", doi: "10.1016/j.ajhg.2018.11.002", note: "313多型からなる乳癌のリスクスコアを開発し、サブタイプ別の識別能を大規模コホートで検証した研究です。" }
  ]
});
