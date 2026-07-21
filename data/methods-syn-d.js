/* 第9〜11章 手法同義語（論文アナライザ用） */
/* 第9章 マイクロバイオーム・6項目 / 第10章 臨床情報解析・10項目 / 第11章 機械学習・15項目 */
window.METHODS_SYN = Object.assign(window.METHODS_SYN || {}, {
  // ===== 第9章 マイクロバイオーム・メタゲノム解析 =====
  "ch09:t1": ["16s rrna", "16s ribosomal rna", "16s", "amplicon sequencing", "アンプリコンシークエンス", "アンプリコン", "16s解析"],
  "ch09:t2": ["shotgun metagenomics", "shotgun metagenomic sequencing", "metagenome", "metagenomic", "メタゲノム", "ショットガンメタゲノム", "メタトランスクリプトーム"],
  "ch09:t3": ["bacterial genome assembly", "genome assembly", "ゲノムアセンブリ", "de novo assembly", "デノボアセンブリ", "draft genome", "ドラフトゲノム", "contig", "コンティグ", "de bruijn"],
  "ch09:t4": ["phylogenetic tree", "系統樹", "graphlan", "phylogenetic analysis", "系統解析", "系統分類", "cladogram"],
  "ch09:t5": ["alpha diversity", "α多様性", "shannon index", "shannon", "chao1", "chao index", "simpson index", "species richness", "observed species", "均等性"],
  "ch09:t6": ["beta diversity", "β多様性", "unifrac", "bray-curtis", "pcoa", "principal coordinate analysis", "主座標分析", "permanova", "adonis", "jaccard"],

  // ===== 第10章 臨床情報解析 =====
  "ch10:t1": ["kaplan-meier", "kaplan meier", "log-rank", "logrank", "生存曲線", "生存解析", "overall survival", "progression-free survival", "全生存期間", "無増悪生存期間", "median survival", "number at risk"],
  "ch10:t2": ["roc curve", "auroc", "auc", "受信者操作特性", "感度 特異度", "陽性的中率", "陰性的中率"],
  "ch10:t3": ["cox regression", "cox proportional hazards", "cox回帰", "比例ハザード", "logistic regression", "ロジスティック回帰", "hazard ratio", "ハザード比", "odds ratio", "オッズ比", "交絡", "confounding"],
  "ch10:t4": ["forest plot", "フォレストプロット", "meta-analysis", "メタ解析", "固定効果モデル", "変量効果モデル", "random-effects model", "heterogeneity", "異質性", "publication bias", "出版バイアス", "funnel plot"],
  "ch10:t5": ["network meta-analysis", "nma", "間接比較", "indirect comparison", "mixed treatment comparison", "transitivity", "ネットワークメタ解析"],
  "ch10:t6": ["swimmer plot", "スイマープロット", "スイマーズプロット"],
  "ch10:t7": ["waterfall plot", "ウォーターフォールプロット", "recist", "objective response rate", "客観的奏効率", "best overall response", "最良奏効"],
  "ch10:t8": ["spider plot", "スパイダープロット", "spaghetti plot", "スパゲティプロット", "pseudoprogression", "偽増悪"],
  "ch10:t9": ["pedigree", "家系図", "遺伝形式", "遺伝様式", "常染色体優性", "常染色体劣性", "autosomal dominant", "autosomal recessive", "x連鎖", "発端者"],
  "ch10:t10": ["hgvs", "hgvs nomenclature", "variant nomenclature", "バリアント表記", "dbsnp", "rsid", "snpeff", "wannovar", "variant annotation"],

  // ===== 第11章 機械学習 =====
  "ch11:t1": ["machine learning", "deep learning", "機械学習", "深層学習", "learning curve", "学習曲線", "supervised learning", "教師あり学習", "教師なし学習", "強化学習", "overfitting", "過学習", "汎化性能"],
  "ch11:t2": ["auroc", "auprc", "f1 score", "confusion matrix", "混同行列", "cross-validation", "交差検証", "適合率", "再現率", "loss function", "損失関数", "正則化"],
  "ch11:t3": ["random forest", "ランダムフォレスト", "gradient boosting", "勾配ブースティング", "xgboost", "lightgbm", "catboost", "gbdt", "decision tree", "決定木", "特徴量重要度", "feature importance"],
  "ch11:t4": ["shap", "grad-cam", "lime", "explainable ai", "xai", "説明可能", "attention map", "shapley", "saliency map", "解釈性"],
  "ch11:t5": ["convolutional neural network", "cnn", "畳み込み", "畳み込みニューラルネットワーク", "convolution", "pooling", "プーリング", "resnet", "vgg", "畳み込み層"],
  "ch11:t6": ["transfer learning", "転移学習", "fine-tuning", "ファインチューニング", "lora", "low-rank adaptation", "peft", "事前学習", "pretrained", "domain adaptation", "ドメイン適応"],
  "ch11:t7": ["transformer", "トランスフォーマー", "self-attention", "attention mechanism", "アテンション", "注意機構", "positional encoding", "位置エンコーディング", "bert", "gpt"],
  "ch11:t8": ["segmentation", "領域分割", "u-net", "dice coefficient", "dice係数", "iou", "intersection over union", "semantic segmentation", "instance segmentation", "セマンティックセグメンテーション"],
  "ch11:t9": ["foundation model", "基盤モデル", "self-supervised learning", "自己教師あり学習", "few-shot", "zero-shot", "hallucination", "ハルシネーション", "汎用モデル"],
  "ch11:t10": ["protein language model", "タンパク質言語モデル", "dna language model", "esm2", "esm3", "evo2", "言語モデル", "埋め込みベクトル", "masked language model", "マスク言語モデル"],
  "ch11:t11": ["alphafold", "alphafold2", "alphafold3", "アルファフォールド", "構造予測", "立体構造予測", "protein structure prediction", "plddt", "multiple sequence alignment", "rosettafold"],
  "ch11:t12": ["graph neural network", "gnn", "グラフニューラルネットワーク", "message passing", "メッセージパッシング", "gcn", "graph convolution", "knowledge graph", "ナレッジグラフ"],
  "ch11:t13": ["generative model", "生成モデル", "generative adversarial network", "gan", "variational autoencoder", "vae", "diffusion model", "拡散モデル", "生成敵対ネットワーク", "変分オートエンコーダ"],
  "ch11:t14": ["drug discovery", "創薬", "virtual screening", "バーチャルスクリーニング", "de novo design", "molecular docking", "ドッキングシミュレーション", "sbdd", "lbdd", "リード化合物"],
  "ch11:t15": ["ai agent", "aiエージェント", "multi-agent", "マルチエージェント", "large language model", "大規模言語モデル", "llm", "autonomous research", "仮説生成", "hypothesis generation"],
});
