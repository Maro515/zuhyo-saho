/* 第7章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch07:t1": [
    { pmid: "2718776", title: "The direct examination of three-dimensional bone architecture in vitro by computed tomography.", authors: "Feldkamp LA et al.", journal: "Journal of bone and mineral research : the official journal of the American Society for Bone and Mineral Research", year: "1989", doi: "10.1002/jbmr.5650040103", note: "マイクロCTを確立し、骨梁の三次元構造を非破壊で直接観察できることを示した原典です。" },
    { pmid: "20964199", title: "Longitudinal assessment of lung cancer progression in the mouse using in vivo micro-CT imaging.", authors: "Namati E et al.", journal: "Medical physics", year: "2010", doi: "10.1118/1.3476454", note: "マウス肺がんの進行をin vivoマイクロCTで経時的に追跡し、腫瘍体積の定量評価を可能にした応用例です。" }
  ],
  "ch07:t2": [
    { pmid: "2124706", title: "Brain magnetic resonance imaging with contrast dependent on blood oxygenation.", authors: "Ogawa S et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1990", doi: "10.1073/pnas.87.24.9868", note: "血中酸素化状態に依存するBOLDコントラストを見いだし、機能的MRIの基盤を築いた記念碑的論文です。" },
    { pmid: "20656039", title: "Magnetic resonance virtual histology for embryos: 3D atlases for automated high-throughput phenotyping.", authors: "Cleary JO et al.", journal: "NeuroImage", year: "2011", doi: "10.1016/j.neuroimage.2010.07.039", note: "マウス胚のMRIアトラスを構築し、遺伝子改変動物の表現型解析を自動化・大規模化した応用研究です。" }
  ],
  "ch07:t3": [
    { pmid: "1113170", title: "Application of annihilation coincidence detection to transaxial reconstruction tomography.", authors: "Phelps ME et al.", journal: "Journal of nuclear medicine : official publication, Society of Nuclear Medicine", year: "1975", doi: "", note: "消滅放射線の同時計数を断層再構成に応用し、PET装置の原理を確立した先駆的な報告です。" },
    { pmid: "17268028", title: "Multimodality imaging of tumor xenografts and metastases in mice with combined small-animal PET, small-animal CT, and bioluminescence imaging.", authors: "Deroose CM et al.", journal: "Journal of nuclear medicine : official publication, Society of Nuclear Medicine", year: "2007", doi: "", note: "小動物PET・CT・生物発光を組み合わせ、マウス腫瘍と転移を多角的に可視化した応用例です。" }
  ],
  "ch07:t4": [
    { pmid: "8817482", title: "Photonic detection of bacterial pathogens in living hosts.", authors: "Contag CH et al.", journal: "Molecular microbiology", year: "1995", doi: "10.1111/j.1365-2958.1995.mmi_18040593.x", note: "ルシフェラーゼ標識菌を生きた動物で光検出し、in vivo生物発光イメージングを切り開いた原著です。" },
    { pmid: "11228541", title: "Rapid and quantitative assessment of cancer treatment response using in vivo bioluminescence imaging.", authors: "Rehemtulla A et al.", journal: "Neoplasia (New York, N.Y.)", year: "2000", doi: "10.1038/sj.neo.7900121", note: "生物発光により腫瘍の治療反応を短期間で定量評価できることを示した、がん研究の代表的応用です。" }
  ],
  "ch07:t5": [
    { pmid: "10564153", title: "Echocardiographic assessment of cardiac function in conscious and anesthetized mice.", authors: "Yang XP et al.", journal: "The American journal of physiology", year: "1999", doi: "10.1152/ajpheart.1999.277.5.H1967", note: "覚醒下と麻酔下のマウス心機能を心エコーで比較し、測定条件の重要性を示した基盤的研究です。" },
    { pmid: "11959634", title: "Echocardiographic assessment of LV hypertrophy and function in aortic-banded mice: necropsy validation.", authors: "Liao Y et al.", journal: "American journal of physiology. Heart and circulatory physiology", year: "2002", doi: "10.1152/ajpheart.00238.2001", note: "大動脈縮窄マウスの左室肥大と機能を心エコーで測り、剖検所見と対応づけて妥当性を検証しています。" }
  ],
  "ch07:t6": [
    { pmid: "8016642", title: "Deletion of a DNA polymerase beta gene segment in T cells using cell type-specific gene targeting.", authors: "Gu H et al.", journal: "Science (New York, N.Y.)", year: "1994", doi: "10.1126/science.8016642", note: "Cre/loxPでT細胞特異的に遺伝子を欠失させ、条件的ノックアウトの実現を初めて示した原著です。" },
    { pmid: "8980237", title: "Subregion- and cell type-restricted gene knockout in mouse brain.", authors: "Tsien JZ et al.", journal: "Cell", year: "1996", doi: "10.1016/s0092-8674(00)81826-7", note: "海馬CA1に限定してNMDA受容体を欠失させ、脳部位・細胞種特異的な操作を実現した応用例です。" }
  ],
  "ch07:t7": [
    { pmid: "17934449", title: "Identification of stem cells in small intestine and colon by marker gene Lgr5.", authors: "Barker N et al.", journal: "Nature", year: "2007", doi: "10.1038/nature06196", note: "Lgr5-CreERを用いた遺伝学的系統追跡により、腸陰窩の幹細胞を生体内で同定した画期的研究です。" },
    { pmid: "20887898", title: "Intestinal crypt homeostasis results from neutral competition between symmetrically dividing Lgr5 stem cells.", authors: "Snippert HJ et al.", journal: "Cell", year: "2010", doi: "10.1016/j.cell.2010.09.016", note: "多色標識による系統追跡で、腸幹細胞が中立競合により置き換わっていく様子を描き出しました。" }
  ],
  "ch07:t8": [
    { pmid: "23575631", title: "Structural and molecular interrogation of intact biological systems.", authors: "Chung K et al.", journal: "Nature", year: "2013", doi: "10.1038/nature12107", note: "ハイドロゲル包埋で脳を透明化するCLARITYを開発し、全脳の分子解析を可能にした論文です。" },
    { pmid: "24746791", title: "Whole-brain imaging with single-cell resolution using chemical cocktails and computational analysis.", authors: "Susaki EA et al.", journal: "Cell", year: "2014", doi: "10.1016/j.cell.2014.03.042", note: "化学カクテルCUBICで全脳を透明化し、単一細胞解像度の全脳イメージングを実現しました。" }
  ],
  "ch07:t9": [
    { pmid: "6270629", title: "Improved patch-clamp techniques for high-resolution current recording from cells and cell-free membrane patches.", authors: "Hamill OP et al.", journal: "Pflugers Archiv : European journal of physiology", year: "1981", doi: "10.1007/BF00656997", note: "ギガシール法を確立し、単一チャネル電流の高分解能記録を可能にしたパッチクランプの原著です。" },
    { pmid: "4727084", title: "Long-lasting potentiation of synaptic transmission in the dentate area of the anaesthetized rabbit following stimulation of the perforant path.", authors: "Bliss TV et al.", journal: "The Journal of physiology", year: "1973", doi: "10.1113/jphysiol.1973.sp010273", note: "貫通線維の刺激で長期増強を発見し、細胞外記録による神経可塑性研究の礎となった古典です。" }
  ],
  "ch07:t10": [
    { pmid: "17920014", title: "Imaging large-scale neural activity with cellular resolution in awake, mobile mice.", authors: "Dombeck DA et al.", journal: "Neuron", year: "2007", doi: "10.1016/j.neuron.2007.08.003", note: "覚醒行動下のマウスで二光子カルシウムイメージングを実現し、細胞解像度の脳活動観察を開きました。" },
    { pmid: "21909102", title: "Miniaturized integration of a fluorescence microscope.", authors: "Ghosh KK et al.", journal: "Nature methods", year: "2011", doi: "10.1038/nmeth.1694", note: "頭部装着型の小型蛍光顕微鏡を開発し、自由行動するマウスの神経活動記録を可能にしました。" }
  ],
  "ch07:t11": [
    { pmid: "16116447", title: "Millisecond-timescale, genetically targeted optical control of neural activity.", authors: "Boyden ES et al.", journal: "Nature neuroscience", year: "2005", doi: "10.1038/nn1525", note: "神経細胞にChR2を発現させ、光でミリ秒精度の活動制御を初めて示した光遺伝学の原点です。" },
    { pmid: "21389985", title: "Amygdala circuitry mediating reversible and bidirectional control of anxiety.", authors: "Tye KM et al.", journal: "Nature", year: "2011", doi: "10.1038/nature09820", note: "扁桃体の特定回路を光で双方向に操作し、不安行動が可逆的に変化することを示した応用研究です。" }
  ],
  "ch07:t12": [
    { pmid: "17360345", title: "Evolving the lock to fit the key to create a family of G protein-coupled receptors potently activated by an inert ligand.", authors: "Armbruster BN et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2007", doi: "10.1073/pnas.0700293104", note: "不活性リガンドにのみ応答する改変GPCRを作出し、DREADDの基盤を築いた原著論文です。" },
    { pmid: "21364278", title: "Rapid, reversible activation of AgRP neurons drives feeding behavior in mice.", authors: "Krashes MJ et al.", journal: "The Journal of clinical investigation", year: "2011", doi: "10.1172/JCI46229", note: "DREADDでAgRPニューロンを活性化し、摂食行動が急速かつ可逆的に誘導されることを示しました。" }
  ],
  "ch07:t13": [
    { pmid: "12600700", title: "The open field as a paradigm to measure the effects of drugs on anxiety-like behaviors: a review.", authors: "Prut L et al.", journal: "European journal of pharmacology", year: "2003", doi: "10.1016/s0014-2999(03)01272-x", note: "オープンフィールド試験の薬理学的妥当性と解釈上の注意を体系的に整理した標準的総説です。" },
    { pmid: "25742564", title: "Use of the Open Field Maze to measure locomotor and anxiety-like behavior in mice.", authors: "Seibenhener ML et al.", journal: "Journal of visualized experiments : JoVE", year: "2015", doi: "10.3791/52434", note: "マウスの移動量と不安様行動を測る手順を映像付きで示した、実務に直結する実践的解説です。" }
  ],
  "ch07:t14": [
    { pmid: "6471907", title: "Developments of a water-maze procedure for studying spatial learning in the rat.", authors: "Morris R", journal: "Journal of neuroscience methods", year: "1984", doi: "10.1016/0165-0270(84)90007-4", note: "水迷路課題の手順と解析指標を体系化し、空間学習の評価法として確立した方法論の原著です。" },
    { pmid: "7088155", title: "Place navigation impaired in rats with hippocampal lesions.", authors: "Morris RG et al.", journal: "Nature", year: "1982", doi: "10.1038/297681a0", note: "海馬損傷ラットで場所探索が障害されることを示し、水迷路の有用性を実証した古典的研究です。" }
  ],
  "ch07:t15": [
    { pmid: "15344922", title: "Sociability and preference for social novelty in five inbred strains: an approach to assess autistic-like behavior in mice.", authors: "Moy SS et al.", journal: "Genes, brain, and behavior", year: "2004", doi: "10.1111/j.1601-1848.2004.00076.x", note: "3チャンバー装置で社会性と社会的新奇性選好を定量し、自閉症様行動の評価法を確立しました。" },
    { pmid: "15344923", title: "Automated apparatus for quantitation of social approach behaviors in mice.", authors: "Nadler JJ et al.", journal: "Genes, brain, and behavior", year: "2004", doi: "10.1111/j.1601-183X.2004.00071.x", note: "社会的接近行動を自動計測する装置を開発し、3チャンバー試験の客観的定量化を進めた論文です。" }
  ],
  "ch07:t16": [
    { pmid: "18428540", title: "Motor coordination and balance in rodents.", authors: "Carter RJ et al.", journal: "Current protocols in neuroscience", year: "2001", doi: "10.1002/0471142301.ns0812s15", note: "ロータロッドを含む運動協調・平衡機能の評価法を標準プロトコルとして詳細に記述した文献です。" },
    { pmid: "10191337", title: "Characterization of progressive motor deficits in mice transgenic for the human Huntington's disease mutation.", authors: "Carter RJ et al.", journal: "The Journal of neuroscience : the official journal of the Society for Neuroscience", year: "1999", doi: "10.1523/JNEUROSCI.19-08-03248.1999", note: "ハンチントン病モデルの運動障害の進行をロータロッド等で経時的に捉えた代表的な応用例です。" }
  ],
  "ch07:t17": [
    { pmid: "11549216", title: "Pharmacological studies of prepulse inhibition models of sensorimotor gating deficits in schizophrenia: a decade in review.", authors: "Geyer MA et al.", journal: "Psychopharmacology", year: "2001", doi: "10.1007/s002130100811", note: "プレパルス抑制を用いた感覚運動ゲーティング障害モデルの薬理研究を10年分総括した総説です。" },
    { pmid: "8297213", title: "Assessing the validity of an animal model of deficient sensorimotor gating in schizophrenic patients.", authors: "Swerdlow NR et al.", journal: "Archives of general psychiatry", year: "1994", doi: "10.1001/archpsyc.1994.03950020063007", note: "統合失調症患者と動物モデルのPPI障害を対比し、モデルの妥当性を検証した基盤的研究です。" }
  ]
});
