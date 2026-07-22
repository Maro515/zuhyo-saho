/* 第12章 プロトコル・技術資料（その他：先端装置 t51〜t73 / 到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
"ch12:t51": [
  { type: "vendor", label: "Abberior: MINFLUX ナレッジベース（原理・分解能・トラッキング）", url: "https://abberior.rocks/knowledge-base/minflux/", note: "MINFLUXの動作原理と到達分解能、超高速トラッキング性能を解説する公式ページです。装置像を掴む出発点になります。" },
  { type: "vendor", label: "Abberior: MINFLUX 顕微鏡システム 製品ページ", url: "https://abberior.rocks/superresolution-confocal-systems/minflux/", note: "商用MINFLUXシステムの構成と仕様がまとまっており、実機で何がどこまでできるかを確認できます。" }
],
"ch12:t52": [
  { type: "protocol", label: "Current Protocols: GUI対応A-PoDによる超解像SRS顕微鏡", url: "https://pubmed.ncbi.nlm.nih.gov/38270527/", note: "空間・時間アラインメントから超解像処理までのSRS実務手順が具体的に書かれた手順書です。立ち上げ時に読みます。" },
  { type: "vendor", label: "A.P.E.: SRS/CARS用同期パルスレーザー光源（picoEmeraldほか）", url: "https://www.ape-berlin.de/", note: "SRS顕微鏡の心臓部であるpump/Stokes同期パルス光源の技術情報を提供する公式メーカーページです。" }
],
"ch12:t53": [
  { type: "tool", label: "GitHub: FLUTE（FLIMのフェーザ解析GUI）", url: "https://github.com/LaboratoryOpticsBiosciences/FLUTE", note: "時間領域FLIMデータの較正とフェーザ解析を対話的に行える公式ツールです。寿命の読み方を試すのにも向きます。" },
  { type: "vendor", label: "PicoQuant: 蛍光寿命イメージング（FLIM）技術資料", url: "https://www.picoquant.com/", note: "TCSPCベースのFLIM計測系を提供するメーカーの技術資料で、時間分解計測の基礎と実装を確認できます。" }
],
"ch12:t54": [
  { type: "vendor", label: "Imagine Optic: 波面センサーと可変形鏡（適応光学ハードウェア）", url: "https://www.imagine-optic.com/", note: "収差の計測に使う波面センサーと、補正を担う可変形鏡を扱う代表的メーカーの公式サイトです。" },
  { type: "tool", label: "GitHub: microscope-aotools（顕微鏡向け適応光学制御ライブラリ）", url: "https://github.com/MicronOxford/microscope-aotools", note: "センサレス補正などの適応光学を制御するオープンソース実装で、補正の考え方と実装を確認できます。" }
],
"ch12:t55": [
  { type: "tool", label: "k-Wave: 光音響波の伝播・再構成MATLABツールボックス（公式サイト）", url: "http://www.k-wave.org/", note: "光吸収から超音波発生・再構成までをシミュレートできる定番ツールで、深さと分解能の関係を体感できます。" },
  { type: "vendor", label: "iThera Medical: マルチスペクトル光音響トモグラフィ（MSOT）", url: "https://ithera-medical.com/", note: "深部の多波長光音響イメージングを実現する商用MSOTシステムのメーカー公式サイトです。" }
],

"ch12:t56": [
  { type: "protocol", label: "Frontiers in Neuroanatomy: 大型試料の高速・均一エンブロック染色（fBROPA）", url: "https://pubmed.ncbi.nlm.nih.gov/30323746/", note: "ボリュームEMの成否を左右する重金属染色を、ミリメートル級のブロックで均一に行う手順です。染色ムラを避けたいときに読みます。" },
  { type: "db", label: "EMPIAR: 電子顕微鏡公開画像アーカイブ（EMBL-EBI）", url: "https://www.ebi.ac.uk/empiar/", note: "cryo-EMやボリュームEMの生画像・トモグラム・3次元データを公開する公式リポジトリで、実データの粒度や規模を確認できます。" },
],
"ch12:t57": [
  { type: "tool", label: "CrystFEL: 連続フェムト秒結晶回折データの解析ソフト（DESY）", url: "https://www.desy.de/~twhite/crystfel/", note: "スナップショットの指数付け・積分・統合を担うSFXの定番ソフトで、完全性や多重度の算出手順も確認できます。" },
  { type: "db", label: "CXIDB: Coherent X-ray Imaging Data Bank", url: "https://www.cxidb.org/", note: "XFEL実験の生回折データを公開する公式データバンクで、実際のスナップショット群の規模と質を確かめられます。" },
],
"ch12:t58": [
  { type: "protocol", label: "Nature Protocols: 放射光を用いたタンパク質溶液の小角X線散乱", url: "https://pubmed.ncbi.nlm.nih.gov/24967622/", note: "データ収集と、凝集・濃度効果・放射線損傷・バッファ不一致を見抜くチェックの手順が具体的に書かれています。" },
  { type: "tool", label: "ATSAS: 生体小角散乱データ解析ソフト（EMBL Hamburg）", url: "https://www.embl-hamburg.de/biosaxs/software.html", note: "Guinier解析からp(r)、ab initio形状復元までを担う定番スイートの公式ページです。" },
  { type: "db", label: "SASBDB: 小角散乱の生物学データバンク", url: "https://www.sasbdb.org/", note: "実験データ・測定条件・復元モデルを収録した公開リポジトリで、Rgやフィットの実例を確認できます。" },
],
"ch12:t59": [
  { type: "protocol", label: "European Biophysics Journal: 質量光度測定の標準プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/33651123/", note: "試料調製・測定・解析と、較正やアーティファクトの回避まで含む標準手順で、初学者のチェックリストにもなります。" },
  { type: "vendor", label: "Refeyn: 質量光度測定のアプリケーションノート集", url: "https://refeyn.com/mass-photometry-application-notes/", note: "抗体・膜タンパク質・核酸など対象別の測定条件と解析例をまとめたメーカーの技術資料です。" },
],
"ch12:t60": [
  { type: "guide", label: "Nature Reviews Methods Primers: 1分子生物物理学における光ピンセット", url: "https://pubmed.ncbi.nlm.nih.gov/34849486/", note: "原理・力とトルクの較正・実験配置・データ解析までを俯瞰した権威ある入門総説で、読み方の基準が得られます。" },
  { type: "vendor", label: "LUMICKS: 光ピンセット（C-Trap）の技術ドキュメント", url: "https://www.lumicks.com/documentation/optical-tweezers", note: "光トラップの原理とDNA伸長・力計測の実務をまとめたメーカー技術資料で、力–伸長測定の勘所を確認できます。" },
],

"ch12:t61": [
    { type: "protocol", label: "Nature Protocols: 超安定磁気ピンセットによる1分子ナノメカニクス", url: "https://pubmed.ncbi.nlm.nih.gov/38467905/", note: "磁気ピンセットの原理・試料調製・力校正・軌跡解析までを段階的に示す2024年の実務手順書です。" },
    { type: "guide", label: "Micromachines: 水平型磁気ピンセットによる1本鎖DNAの操作", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6187538/", note: "DNAテザーの作製と力の与え方を具体的に解説した公開論文で、装置の仕組みを理解する入口になります。" }
  ],
  "ch12:t62": [
    { type: "vendor", label: "Sartorius: Octet BLIによる無標識相互作用解析", url: "https://www.sartorius.com/en/products/protein-analysis/octet-bli-detection", note: "Octet／BLIの原理・センサー・用途をまとめた公式技術資料です。装置の全体像と測定の流れを押さえられます。" },
    { type: "protocol", label: "PLoS ONE: BLIによるDNA–タンパク質相互作用解析", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8809612/", note: "ストレプトアビジンセンサーを使った会合・解離測定の具体手順を示す公開論文で、KD算出の実際が分かります。" }
  ],
  "ch12:t63": [
    { type: "vendor", label: "NanoTemper: MicroScale Thermophoresis（MST）技術解説", url: "https://nanotempertech.com/microscale-thermophoresis/", note: "MSTの原理・用途・用量反応からのKD算出を説明した公式資料です。測定設計の考え方の基礎になります。" },
    { type: "protocol", label: "JoVE: 精製不要なMSTによる結合親和性の決定", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3846881/", note: "標的を精製せずにMSTで KD を求める手順を動画付きで示した公開プロトコルです。滴定系列の組み方が学べます。" }
  ],
  "ch12:t64": [
    { type: "vendor", label: "NanoTemper: nanoDSF（自家蛍光による熱安定性測定）", url: "https://nanotempertech.com/nanodsf/", note: "色素を使わずTrp/Tyr自家蛍光で Tm・凝集開始温度を測るnanoDSFの原理と用途をまとめた公式資料です。" },
    { type: "guide", label: "NanoTemper: 熱安定性パラメータ（Tm・Tonset）の解説", url: "https://resources.nanotempertech.com/blog/guide-prometheus-panta-parameters-explained", note: "融解曲線から読む Tm や Tonset の意味を整理した技術ガイドで、図の読み方の勘所が分かります。" }
  ],
  "ch12:t65": [
    { type: "tool", label: "DichroWeb: CDスペクトルから二次構造を計算するサーバ（解説論文）", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8740839/", note: "複数の逆解析アルゴリズムと参照データセットを備えるDichroWebの使い方と注意点を示した公開論文です。" },
    { type: "tool", label: "BeStSel: CDによる二次構造推定・折りたたみ分類サーバ", url: "https://pubmed.ncbi.nlm.nih.gov/29893907/", note: "βシートの多様性に対応したBeStSel法とサーバ（bestsel.elte.hu）を解説した公式論文です。解析の入口になります。" }
  ],

"ch12:t66": [
    { type: "tool", label: "SEDFIT / SEDPHAT（c(s) 解析ソフト）", url: "https://sedfitsedphat.github.io/", note: "c(s) 法を実装した無償の沈降解析ソフトの公式配布・解説サイト。AUCデータ解析の事実上の標準です。" },
    { type: "tool", label: "UltraScan（AUC解析プラットフォーム）", url: "https://ultrascan.aucsolutions.com/", note: "沈降速度・平衡データを高性能計算で解析する公式ソフトウェア。SEDFITと並ぶ代表的な解析基盤です。" },
    { type: "vendor", label: "Beckman Coulter Optima AUC 分析用超遠心", url: "https://www.beckman.com/centrifuges/analytical-ultracentrifuges/optima-auc", note: "分析用超遠心機の主要メーカー公式ページ。吸光・干渉の光学系や測定原理の技術資料が参照できます。" }
  ],
  "ch12:t67": [
    { type: "protocol", label: "Determining the stoichiometry and interactions of macromolecular assemblies (Nature Protocols)", url: "https://pubmed.ncbi.nlm.nih.gov/17406634/", note: "ネイティブMSで複合体の化学量論と相互作用を決める手順を示したNature Protocolsの定番プロトコルです。" },
    { type: "tool", label: "UniDec（ネイティブMSデコンボリューションソフト）", url: "https://github.com/michaelmarty/UniDec", note: "ネイティブMSスペクトルから電荷を外して質量を求めるベイズ的デコンボリューションソフトの公式リポジトリです。" }
  ],
  "ch12:t68": [
    { type: "vendor", label: "Bruker timsTOF（トラップ型イオン移動度）", url: "https://www.bruker.com/en/products-and-solutions/mass-spectrometry/timstof.html", note: "トラップ型イオン移動度と高速TOFを結合したtimsTOFシリーズのメーカー公式ページ。原理と仕様が確認できます。" },
    { type: "db", label: "CCSbase（衝突断面積データベース）", url: "https://ccsbase.net/", note: "測定された衝突断面積（CCS）を集約・予測する公開データベース。IM-MSの値の照合に使われます。" }
  ],
  "ch12:t69": [
    { type: "vendor", label: "Quanterix: Simoa テクノロジー（公式解説）", url: "https://www.quanterix.com/simoa-technology/", note: "デジタルELISA(Simoa)の原理と装置を解説する開発元の公式ページ。フェムトリットル反応槽と単一分子計数の仕組みが分かります。" },
    { type: "protocol", label: "Simoaのデジタル/アナログ接続とダイナミックレンジ（Anal. Chem. / PubMed）", url: "https://pubmed.ncbi.nlm.nih.gov/21344864/", note: "単一分子計数(デジタル)と平均強度(アナログ)をAEBで接続し6桁のレンジを得る方法を示した技術論文です。" }
  ],

/* PROTOCOLS["ch12:tNN"] の配列（実在URLを確認） */

  "ch12:t70": [
    { type: "protocol", label: "Single-cell analysis and sorting using droplet-based microfluidics（Nature Protocols, 2013）", url: "https://pubmed.ncbi.nlm.nih.gov/23558786/", note: "液滴内で1細胞を区画化し、解析・ソーティングまで行う代表的な手順書。デバイス作製から実験までを網羅した定番プロトコルです。" },
    { type: "protocol", label: "Single-cell barcoding and sequencing using droplet microfluidics（inDrops, Nature Protocols, 2017）", url: "https://pubmed.ncbi.nlm.nih.gov/27929523/", note: "ハイドロゲルビーズと細胞を液滴に共封入して1細胞をバーコード化するinDropsの詳細手順。液滴1細胞RNA-seqの実装例です。" },
    { type: "guide", label: "Drop-seq protocol（McCarroll Lab, 継続更新される公式プロトコル）", url: "https://mccarrolllab.org/dropseq/", note: "Drop-seqの最新プロトコルPDF、デバイスのCADファイル、解析ツールを配布する公式ページ。自作で立ち上げる際の一次資料です。" },
  ],

  "ch12:t71": [
    { type: "protocol", label: "Cancer imaging using surface-enhanced resonance Raman scattering nanoparticles（Nature Protocols, 2017）", url: "https://pubmed.ncbi.nlm.nih.gov/28686581/", note: "フェムトモル検出のSERRSナノ粒子を再現性よく作り、動物での術中ラマンイメージングに用いる最適化手順を段階的に示した資料です。" },
    { type: "guide", label: "Surface-enhanced Raman spectroscopy（Nature Reviews Methods Primers, 2021）", url: "https://www.nature.com/articles/s43586-021-00088-1", note: "SERS基板の設計・測定・データ解釈を体系的に解説した入門プライマー。ホットスポットや定量の勘所を押さえるのに適します。" },
  ],

  "ch12:t72": [
    { type: "tool", label: "qudi — ODMR/量子計測のオープンソース測定フレームワーク（GitHub, Ulm-IQO）", url: "https://github.com/Ulm-IQO/qudi-core", note: "NV中心のODMR測定に広く使われるPython製の計測フレームワーク本体。装置制御と測定ロジックを組むための基盤ソフトです。" },
    { type: "vendor", label: "Qnami Technical Note 01: Magnetic Field Measurement with NV Centers in Diamond", url: "https://qnami.ch/technical-note-01-magnetic-field-measurement-with-nv-centers-in-diamond/", note: "NV中心の基本特性から、いかにして磁場を高感度に測るかを解説したメーカー技術ノート。原理を実装に結びつける入門資料です。" },
  ],

"ch12:t73": [
  { type: "vendor", label: "Revvity Operetta CLS 高コンテント解析システム（公式製品ページ）", url: "https://www.revvity.com/product/operetta-cls-system-hh16000020", note: "代表的なハイコンテント撮像装置Operetta CLSの公式ページ。スピニングディスク共焦点・LED励起・Harmony解析ソフトの構成が分かる。" },
  { type: "protocol", label: "Cell Painting プロトコル（Nature Protocols / PubMed）", url: "https://pubmed.ncbi.nlm.nih.gov/27560178/", note: "多重蛍光染色による形態プロファイリングの標準手順書。装置を問わず使える代表的アッセイの原典。" },
  { type: "tool", label: "CellProfiler（画像解析ソフト・公式GitHub）", url: "https://github.com/CellProfiler/CellProfiler", note: "撮像した細胞画像から1細胞ごとの特徴量を抽出するオープンソース。HCSの後段解析で広く併用される。" },
],
});
