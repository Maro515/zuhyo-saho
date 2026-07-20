/* 第11章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch11:t1": [
    { pmid: "10521349", title: "Molecular classification of cancer: class discovery and class prediction by gene expression monitoring.", authors: "Golub TR et al.", journal: "Science (New York, N.Y.)", year: "1999", doi: "10.1126/science.286.5439.531", note: "白血病の遺伝子発現データで教師なしクラス発見と教師ありクラス予測を行い、機械学習によるがん分類の原型を示した記念碑的研究です。" },
    { pmid: "34383858", title: "Radiomics machine learning study with a small sample size: Single random training-test set split may lead to unreliable results.", authors: "An C et al.", journal: "PloS one", year: "2021", doi: "10.1371/journal.pone.0256152", note: "小標本の機械学習では訓練・検証の単一分割が結果を不安定にすることを示し、反復検証と学習曲線の確認が欠かせないと教えます。" }
  ],
  "ch11:t2": [
    { pmid: "25738806", title: "The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets.", authors: "Saito T et al.", journal: "PloS one", year: "2015", doi: "10.1371/journal.pone.0118432", note: "不均衡データではROC曲線が楽観的になり、精度再現率曲線のほうが分類器の実力を正しく映すことを体系的に比較した論文です。" },
    { pmid: "31898477", title: "The advantages of the Matthews correlation coefficient (MCC) over F1 score and accuracy in binary classification evaluation.", authors: "Chicco D et al.", journal: "BMC genomics", year: "2020", doi: "10.1186/s12864-019-6413-7", note: "二値分類の評価指標としてMCCがF1やaccuracyより信頼できることを、混同行列の理論と実データの両面から示した論文です。" }
  ],
  "ch11:t3": [
    { pmid: "16398926", title: "Gene selection and classification of microarray data using random forest.", authors: "Díaz-Uriarte R et al.", journal: "BMC bioinformatics", year: "2006", doi: "10.1186/1471-2105-7-3", note: "マイクロアレイの高次元データにランダムフォレストを適用し、変数選択と分類性能を体系的に評価したアンサンブル学習の定番論文です。" },
    { pmid: "16344280", title: "Survival ensembles.", authors: "Hothorn T et al.", journal: "Biostatistics (Oxford, England)", year: "2006", doi: "10.1093/biostatistics/kxj011", note: "生存時間データに対するアンサンブル学習の枠組みを整理し、バギングとランダムフォレストの理論的基盤を与えた統計学の論文です。" }
  ],
  "ch11:t4": [
    { pmid: "31001455", title: "Explainable machine-learning predictions for the prevention of hypoxaemia during surgery.", authors: "Lundberg SM et al.", journal: "Nature biomedical engineering", year: "2018", doi: "10.1038/s41551-018-0304-0", note: "手術中の低酸素血症リスクをSHAPで説明しながら予測し、説明可能AIが臨床現場の意思決定を支援できることを示しました。" },
    { pmid: "32607472", title: "From Local Explanations to Global Understanding with Explainable AI for Trees.", authors: "Lundberg SM et al.", journal: "Nature machine intelligence", year: "2020", doi: "10.1038/s42256-019-0138-9", note: "決定木モデル向けのTreeSHAPを提案し、局所的な寄与度を積み上げてモデル全体の挙動を解釈する方法論を確立した論文です。" }
  ],
  "ch11:t5": [
    { pmid: "27898976", title: "Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs.", authors: "Gulshan V et al.", journal: "JAMA", year: "2016", doi: "10.1001/jama.2016.17216", note: "十万枚を超える眼底写真で畳み込みニューラルネットを学習させ、糖尿病網膜症の判定で専門医に匹敵する精度を達成した代表例です。" },
    { pmid: "28117445", title: "Dermatologist-level classification of skin cancer with deep neural networks.", authors: "Esteva A et al.", journal: "Nature", year: "2017", doi: "10.1038/nature21056", note: "約13万枚の皮膚病変画像でCNNを訓練し、皮膚科医と同等の精度で悪性黒色腫などを分類できることを示した論文です。" }
  ],
  "ch11:t6": [
    { pmid: "29474911", title: "Identifying Medical Diagnoses and Treatable Diseases by Image-Based Deep Learning.", authors: "Kermany DS et al.", journal: "Cell", year: "2018", doi: "10.1016/j.cell.2018.02.010", note: "一般画像で事前学習したモデルを網膜OCT画像に転移学習し、少数の医療画像でも高精度な診断が可能なことを示しました。" },
    { pmid: "31110349", title: "End-to-end lung cancer screening with three-dimensional deep learning on low-dose chest computed tomography.", authors: "Ardila D et al.", journal: "Nature medicine", year: "2019", doi: "10.1038/s41591-019-0447-x", note: "低線量胸部CTの三次元深層学習モデルを事前学習と微調整で構築し、肺がん検診で放射線科医を上回る性能を示した研究です。" }
  ],
  "ch11:t7": [
    { pmid: "34608324", title: "Effective gene expression prediction from sequence by integrating long-range interactions.", authors: "Avsec Ž et al.", journal: "Nature methods", year: "2021", doi: "10.1038/s41592-021-01252-x", note: "アテンション機構で数十万塩基の長距離相互作用を捉えるEnformerを構築し、配列から遺伝子発現を高精度に予測した論文です。" },
    { pmid: "33649564", title: "Data-efficient and weakly supervised computational pathology on whole-slide images.", authors: "Lu MY et al.", journal: "Nature biomedical engineering", year: "2021", doi: "10.1038/s41551-020-00682-w", note: "アテンションに基づく多重インスタンス学習で全スライド画像を弱教師あり解析し、注目領域を可視化しながら診断する手法です。" }
  ],
  "ch11:t8": [
    { pmid: "33288961", title: "nnU-Net: a self-configuring method for deep learning-based biomedical image segmentation.", authors: "Isensee F et al.", journal: "Nature methods", year: "2021", doi: "10.1038/s41592-020-01008-z", note: "データセットの性質から前処理とネットワーク構造を自動設定するnnU-Netを提案し、多数の医用画像分割課題で最高性能を示しました。" },
    { pmid: "33318659", title: "Cellpose: a generalist algorithm for cellular segmentation.", authors: "Stringer C et al.", journal: "Nature methods", year: "2021", doi: "10.1038/s41592-020-01018-x", note: "多様な細胞画像で学習した汎用セグメンテーションモデルを開発し、追加学習なしで細胞やその核の輪郭を抽出できるようにしました。" }
  ],
  "ch11:t9": [
    { pmid: "37045921", title: "Foundation models for generalist medical artificial intelligence.", authors: "Moor M et al.", journal: "Nature", year: "2023", doi: "10.1038/s41586-023-05881-4", note: "多様なタスクへ汎化する医療基盤モデルの概念と課題を整理し、汎用医療AIが目指すべき方向性を提示した展望論文です。" },
    { pmid: "38409223", title: "scGPT: toward building a foundation model for single-cell multi-omics using generative AI.", authors: "Cui H et al.", journal: "Nature methods", year: "2024", doi: "10.1038/s41592-024-02201-0", note: "膨大な単一細胞データで事前学習した基盤モデルscGPTを構築し、細胞型注釈や遺伝子ネットワーク推定へ応用した研究です。" }
  ],
  "ch11:t10": [
    { pmid: "36927031", title: "Evolutionary-scale prediction of atomic-level protein structure with a language model.", authors: "Lin Z et al.", journal: "Science (New York, N.Y.)", year: "2023", doi: "10.1126/science.ade2574", note: "タンパク質言語モデルESM-2で多重配列アラインメントなしに立体構造を予測し、億単位の配列を高速に構造化した研究です。" },
    { pmid: "39609566", title: "Nucleotide Transformer: building and evaluating robust foundation models for human genomics.", authors: "Dalla-Torre H et al.", journal: "Nature methods", year: "2025", doi: "10.1038/s41592-024-02523-z", note: "多種のゲノム配列で事前学習したDNA言語モデルを構築し、ヒトゲノムの多様な予測課題で高い汎化性能を示した論文です。" }
  ],
  "ch11:t11": [
    { pmid: "34265844", title: "Highly accurate protein structure prediction with AlphaFold.", authors: "Jumper J et al.", journal: "Nature", year: "2021", doi: "10.1038/s41586-021-03819-2", note: "深層学習で立体構造を原子レベルの精度で予測するAlphaFold2を発表し、タンパク質構造予測問題を実質的に解決した論文です。" },
    { pmid: "38718835", title: "Accurate structure prediction of biomolecular interactions with AlphaFold 3.", authors: "Abramson J et al.", journal: "Nature", year: "2024", doi: "10.1038/s41586-024-07487-w", note: "拡散モデルを採用したAlphaFold3により、タンパク質だけでなく核酸やリガンドを含む複合体構造まで高精度に予測します。" }
  ],
  "ch11:t12": [
    { pmid: "29949996", title: "Modeling polypharmacy side effects with graph convolutional networks.", authors: "Zitnik M et al.", journal: "Bioinformatics (Oxford, England)", year: "2018", doi: "10.1093/bioinformatics/bty294", note: "薬物と副作用の関係をグラフとして表現し、グラフ畳み込みネットワークで多剤併用時の副作用を予測できることを示しました。" },
    { pmid: "31819266", title: "Deciphering interaction fingerprints from protein molecular surfaces using geometric deep learning.", authors: "Gainza P et al.", journal: "Nature methods", year: "2020", doi: "10.1038/s41592-019-0666-6", note: "タンパク質分子表面をグラフとして幾何学的深層学習で表現し、相互作用の指紋から結合部位や結合相手を予測する手法です。" }
  ],
  "ch11:t13": [
    { pmid: "30504886", title: "Deep generative modeling for single-cell transcriptomics.", authors: "Lopez R et al.", journal: "Nature methods", year: "2018", doi: "10.1038/s41592-018-0229-2", note: "変分オートエンコーダで単一細胞発現データの生成モデルを構築し、正規化やバッチ補正、欠測補完を統一的に扱えるようにしました。" },
    { pmid: "31363220", title: "scGen predicts single-cell perturbation responses.", authors: "Lotfollahi M et al.", journal: "Nature methods", year: "2019", doi: "10.1038/s41592-019-0494-8", note: "生成モデルで未観測の摂動に対する単一細胞の応答を予測し、実験していない条件の発現変化を外挿できることを示した論文です。" }
  ],
  "ch11:t14": [
    { pmid: "31477924", title: "Deep learning enables rapid identification of potent DDR1 kinase inhibitors.", authors: "Zhavoronkov A et al.", journal: "Nature biotechnology", year: "2019", doi: "10.1038/s41587-019-0224-x", note: "生成モデルで新規DDR1阻害剤を設計し、着想から動物実験による検証までを短期間で完了させたAI創薬の代表的な実証例です。" },
    { pmid: "38123686", title: "Discovery of a structural class of antibiotics with explainable deep learning.", authors: "Wong F et al.", journal: "Nature", year: "2024", doi: "10.1038/s41586-023-06887-8", note: "説明可能な深層学習で1000万規模の化合物を探索し、耐性菌に有効な新規構造クラスの抗菌薬を発見した研究です。" }
  ],
  "ch11:t15": [
    { pmid: "38123806", title: "Autonomous chemical research with large language models.", authors: "Boiko DA et al.", journal: "Nature", year: "2023", doi: "10.1038/s41586-023-06792-0", note: "大規模言語モデルに文献検索と実験装置の操作を任せるCoscientistを構築し、自律的に化学実験を計画・実行させた研究です。" },
    { pmid: "40730228", title: "The Virtual Lab of AI agents designs new SARS-CoV-2 nanobodies.", authors: "Swanson K et al.", journal: "Nature", year: "2025", doi: "10.1038/s41586-025-09442-9", note: "複数のAIエージェントが議論しながら研究計画を立てるVirtual Labを構築し、新規ナノボディの設計と実験検証に成功しました。" }
  ]
});
