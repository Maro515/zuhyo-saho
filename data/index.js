/* Master roster of all 11 chapters (mirrors the book's table of contents).
   Chapters without hand-built `topics` show as "coming soon" with a title
   preview so the whole book's roadmap is visible from day one. */
window.BOOK = {
  chapters: [
    { id: "ch01", number: 1, title: "色々な解析に使えるエッセンシャル", count: 9, topics: [] },
    {
      id: "ch02", number: 2, title: "核酸解析", count: 13, topics: [],
      previewTopics: ["バイオアナライザ・TapeStationとRIN値・DIN値", "アガロースゲル電気泳動", "サザンブロット／ノーザンブロット", "PCR／RT-PCR", "定量的PCR", "デジタルPCR", "バイサルファイトシークエンス", "G分染法", "DNA-FISH解析", "間期核FISH解析", "RNA-FISH", "Promoterアッセイ", "Gel Shiftアッセイ"],
    },
    {
      id: "ch03", number: 3, title: "イメージング", count: 13, topics: [],
      previewTopics: ["位相差顕微鏡／微分干渉顕微鏡", "共焦点レーザー走査型顕微鏡", "免疫組織化学", "蛍光染色", "超多色染色", "走査電子顕微鏡", "透過電子顕微鏡", "CLEM", "二光子顕微鏡", "ライトシート蛍光顕微鏡", "全反射照明蛍光顕微鏡", "超解像顕微鏡", "FRAP"],
    },
    {
      id: "ch04", number: 4, title: "細胞の形態や性質の解析", count: 15, topics: [],
      previewTopics: ["フローサイトメトリー", "マスサイトメトリー（CyTOF）", "イメージングフローサイトメトリー", "ゴーストサイトメトリー", "細胞周期", "Fucci", "細胞増殖アッセイ", "Annexin V assay／Sub-G1 assay", "TUNEL assay／Comet assay", "薬剤感受性試験", "細胞運動能アッセイ", "Oil Red O染色", "3D culture", "造腫瘍性（同種・異種移植実験）", "細胞老化"],
    },
    {
      id: "ch05", number: 5, title: "タンパク質解析", count: 28, topics: [],
      previewTopics: ["ポリアクリルアミド電気泳動", "Western blot", "二次元電気泳動", "FRET", "タンパク質半減期測定", "ユビキチン化アッセイ", "オーキシンデグロン法", "PROTAC", "Fluoppi", "BiFC／SplitGFP", "インターラクトーム解析", "ELISA法", "IP／RIP", "Yeast two-hybrid system", "カラムクロマトグラフィー", "ショットガンプロテオミクス", "ターゲットプロテオミクス", "AlphaScreen", "PEA（ハイマルチプレックスイムノアッセイ）", "結晶構造解析", "クライオ単粒子解析", "NMR解析", "表面プラズモン共鳴法", "等温滴定型カロリメトリー", "Phos-tag", "インビトロヘリカーゼアッセイ", "ショ糖密度勾配遠心法", "高速AFM"],
    },
    {
      id: "ch06", number: 6, title: "代謝解析", count: 8, topics: [],
      previewTopics: ["リピドミクス", "細胞外フラックス解析", "高血糖クランプ／高インスリン正常血糖クランプ", "ブドウ糖負荷試験／インスリン負荷試験", "メタボローム解析／代謝フラックス解析", "イメージング質量分析", "代謝ケージによるマウス代謝測定", "寒冷刺激試験"],
    },
    {
      id: "ch07", number: 7, title: "実験動物・遺伝子改変動物解析", count: 17, topics: [],
      previewTopics: ["CT", "MRI", "PET／SPECT", "光イメージング", "（心）エコー", "Cre/loxPシステム", "遺伝学的系統追跡", "組織透明化技術", "電気生理学的手法", "覚醒下脳イメージング", "光遺伝学", "化学遺伝学", "オープンフィールド試験", "モリス水迷路試験", "Three-Chamberテスト", "ロータロッドテスト", "プレパルス・インヒビションテスト"],
    },
    {
      id: "ch08", number: 8, title: "シークエンサーなどを用いた網羅的配列解析とその応用", count: 39, topics: [],
      previewTopics: ["マイクロアレイ", "シークエンスデータ総論①（ショートリード：illumina）", "シークエンスデータ総論②（ロングリード：Oxford Nanopore）", "シークエンスデータ総論③（ロングリード：PacBio）", "Volcano plot", "Pairwise scatter plot", "Gene ontology解析", "Gene set enrichment解析", "階層的クラスタリング", "k-meansクラスター解析", "PCA", "メタゲノム解析", "モチーフ図", "STRING（ネットワーク解析）", "KEGG pathway", "ネットワーク解析", "iModulon解析", "Riverplot", "Multi-group dotplot/Clustered dotplot", "変異シグネチャー", "Circos plot", "Manhattan plot", "Regional plot", "ハプロタイプ", "Accumulation curve", "バルクRNA-seq", "MA plot（RNA-seq）", "t-SNE／UMAP（シングルセルRNA-seq）", "Trajectory解析／Pseudotime解析", "RNA velocity解析", "TCR/BCRレパトア解析", "Ribo-seq", "空間トランスクリプトーム解析①（Visiumなど）", "空間トランスクリプトーム解析②（Xeniumなど）", "空間エピゲノム解析", "ChIP-seq", "ATAC-seq", "CUT&RUN/CUT&Tag", "Hi-C"],
    },
    {
      id: "ch09", number: 9, title: "マイクロバイオーム・メタゲノム解析", count: 6, topics: [],
      previewTopics: ["16Sリボソーム RNA配列解析", "ショットガン・メタゲノム解析", "細菌ゲノムアセンブリ", "注釈付き系統樹", "α多様性解析", "β多様性解析"],
    },
    { id: "ch10", number: 10, title: "臨床情報解析", count: 10, topics: [] },
    {
      id: "ch11", number: 11, title: "機械学習", count: 15, topics: [],
      previewTopics: ["機械学習（分類・学習曲線）", "機械学習（目的関数・評価指標）", "アンサンブル学習", "説明可能AI", "畳み込みニューラルネットワーク", "転移学習", "トランスフォーマー／アテンション機構", "セグメンテーション", "基盤モデル", "DNA，RNA，タンパク質の言語モデル", "AlphaFold", "GNN", "生成モデル", "AI創薬", "AIエージェントによる生命科学研究"],
    },
    /* 発展編：書籍には収録されていない、より新しい／マニアックな手法50項目 */
    { id: "ch12", number: 12, title: "発展編：最新・マニアックな実験法", count: 50, topics: [] },
  ],
};
