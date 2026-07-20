/* 第11章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch11:t1": [
    { type: "tool", label: "scikit-learn: 学習曲線と検証曲線", url: "https://scikit-learn.org/stable/modules/learning_curve.html", note: "過学習と学習不足を学習曲線で見分ける方法が、実行できるコード付きで説明されます。" },
    { type: "tool", label: "scikit-learn: 教師あり学習の手法一覧", url: "https://scikit-learn.org/stable/supervised_learning.html", note: "分類・回帰の代表的アルゴリズムを横断して比較したいときの入口です。" },
    { type: "tool", label: "scikit-learn: 教師なし学習の手法一覧", url: "https://scikit-learn.org/stable/unsupervised_learning.html", note: "クラスタリングや次元削減など、教師なし手法の使い分けを確認できます。" }
  ],
  "ch11:t2": [
    { type: "tool", label: "scikit-learn: 評価指標とスコアリング", url: "https://scikit-learn.org/stable/modules/model_evaluation.html", note: "適合率・再現率・AUCなど各指標の定義と計算方法が一覧できる公式解説です。" },
    { type: "tool", label: "scikit-learn: 交差検証によるモデル評価", url: "https://scikit-learn.org/stable/modules/cross_validation.html", note: "データ分割の設計を誤ると性能が過大評価される点を、具体例で確認できます。" },
    { type: "guideline", label: "TRIPOD+AI声明（機械学習予測モデルの報告基準）", url: "https://pubmed.ncbi.nlm.nih.gov/38626948/", note: "医療分野で性能指標を報告するときに、記載すべき項目を点検できます。" }
  ],
  "ch11:t3": [
    { type: "tool", label: "scikit-learn: アンサンブル手法の公式解説", url: "https://scikit-learn.org/stable/modules/ensemble.html", note: "ランダムフォレストと勾配ブースティングの違いと調整点がまとまっています。" },
    { type: "tool", label: "LightGBM 公式ドキュメント", url: "https://lightgbm.readthedocs.io/en/stable/", note: "表形式データで多用される勾配ブースティング実装のパラメータ解説です。" },
    { type: "tool", label: "XGBoost 公式ドキュメント", url: "https://xgboost.readthedocs.io/en/stable/", note: "同じく定番の勾配ブースティング実装で、過学習抑制の設定を確認できます。" }
  ],
  "ch11:t4": [
    { type: "tool", label: "SHAP 公式ドキュメント", url: "https://shap.readthedocs.io/en/latest/", note: "特徴量の寄与を可視化するSHAP値の計算と作図手順が図解されています。" },
    { type: "tool", label: "LIME 公式リポジトリ", url: "https://github.com/marcotcr/lime", note: "個々の予測を局所的な線形近似で説明する手法の実装と使用例があります。" },
    { type: "tool", label: "pytorch-grad-cam 公式リポジトリ", url: "https://github.com/jacobgil/pytorch-grad-cam", note: "画像のどこを見て判断したかを熱地図で示すGrad-CAM系手法の実装です。" }
  ],
  "ch11:t5": [
    { type: "tool", label: "PyTorch: 画像分類器を作る入門チュートリアル", url: "https://docs.pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", note: "畳み込み層から学習ループまでを一通り書き下す、公式の最短入門です。" },
    { type: "tool", label: "TensorFlow: 畳み込みニューラルネットワーク入門", url: "https://www.tensorflow.org/tutorials/images/cnn", note: "Kerasで層を積んでCNNを構築する流れを、実行できる形で確認できます。" },
    { type: "guideline", label: "CLAIM 2024（医用画像AI研究の報告基準）", url: "https://pubmed.ncbi.nlm.nih.gov/38809149/", note: "医用画像で深層学習を使った研究の記載項目を点検するチェックリストです。" }
  ],
  "ch11:t6": [
    { type: "tool", label: "PyTorch: 転移学習チュートリアル", url: "https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html", note: "学習済みモデルの層を凍結する方法と、微調整との違いを実装で学べます。" },
    { type: "tool", label: "Hugging Face PEFT（LoRAなど省パラメータ微調整）", url: "https://huggingface.co/docs/peft/index", note: "少ない計算資源で大規模モデルを微調整するLoRA等の使い方を解説します。" }
  ],
  "ch11:t7": [
    { type: "tool", label: "Hugging Face Transformers 公式ドキュメント", url: "https://huggingface.co/docs/transformers/index", note: "アテンション機構を使うモデル群を実際に動かすときの標準ライブラリです。" },
    { type: "tool", label: "Hugging Face: LLM入門コース", url: "https://huggingface.co/learn/llm-course/chapter1/1", note: "トランスフォーマーの仕組みを、演習を交えて順を追って学べる公式教材です。" }
  ],
  "ch11:t8": [
    { type: "tool", label: "nnU-Net 公式リポジトリ", url: "https://github.com/MIC-DKFZ/nnUNet", note: "医用画像セグメンテーションで前処理から評価までを自動設計する実装です。" },
    { type: "tool", label: "Cellpose 公式ドキュメント", url: "https://cellpose.readthedocs.io/en/latest/", note: "顕微鏡画像の細胞・核を汎用モデルで分割する手順と学習方法が読めます。" },
    { type: "tool", label: "MONAI 公式リポジトリ（医用画像深層学習の枠組み）", url: "https://github.com/Project-MONAI/MONAI", note: "Dice係数などの評価指標や医用画像向け変換が揃った開発基盤です。" }
  ],
  "ch11:t9": [
    { type: "tool", label: "Hugging Face Hub: 公開モデル一覧", url: "https://huggingface.co/models", note: "基盤モデルの重みと利用条件を探して、そのまま試すときの入口になります。" },
    { type: "tool", label: "Hugging Face 公式ドキュメント一覧", url: "https://huggingface.co/docs", note: "学習・推論・配布まで、基盤モデルを扱う各ライブラリの解説が集約されています。" }
  ],
  "ch11:t10": [
    { type: "tool", label: "ESM 公式リポジトリ（タンパク質言語モデル）", url: "https://github.com/facebookresearch/esm", note: "アミノ酸配列から埋め込みや構造を予測する言語モデルの実装と重みです。" },
    { type: "tool", label: "Hugging Face: ESMモデルの使い方", url: "https://huggingface.co/docs/transformers/model_doc/esm", note: "配列を入力して埋め込みを取り出す最小コードが載っており、すぐ試せます。" },
    { type: "tool", label: "Nucleotide Transformer 公式リポジトリ", url: "https://github.com/instadeepai/nucleotide-transformer", note: "ゲノム配列を対象にしたDNA言語モデルの学習済み重みと利用例があります。" }
  ],
  "ch11:t11": [
    { type: "tool", label: "AlphaFold 公式リポジトリ（DeepMind）", url: "https://github.com/google-deepmind/alphafold", note: "構造予測を自分の環境で走らせる際の手順と必要データが記載されています。" },
    { type: "db", label: "AlphaFold Protein Structure Database（EMBL-EBI）", url: "https://alphafold.ebi.ac.uk/", note: "予測済み立体構造とpLDDTによる信頼度を、遺伝子名から検索できます。" },
    { type: "tool", label: "AlphaFold 3 公式リポジトリ（DeepMind）", url: "https://github.com/google-deepmind/alphafold3", note: "複合体やリガンドを含む予測に対応した最新版の実装と利用条件です。" }
  ],
  "ch11:t12": [
    { type: "tool", label: "PyTorch Geometric 公式ドキュメント", url: "https://pytorch-geometric.readthedocs.io/en/latest/", note: "グラフデータの表現方法とGNN層の組み方が、例題付きで解説されています。" },
    { type: "tool", label: "Deep Graph Library 公式サイト", url: "https://www.dgl.ai/", note: "大規模グラフ向けのもう一つの主要な枠組みで、比較検討の際に開きます。" }
  ],
  "ch11:t13": [
    { type: "tool", label: "Hugging Face Diffusers 公式ドキュメント", url: "https://huggingface.co/docs/diffusers/index", note: "拡散モデルによる生成と学習を扱う、標準的なライブラリの解説です。" },
    { type: "tool", label: "Hugging Face: 拡散モデルの学習チュートリアル", url: "https://huggingface.co/docs/diffusers/tutorials/basic_training", note: "自前データで拡散モデルを学習させる流れを、順を追って追体験できます。" },
    { type: "tool", label: "PyTorch: DCGANチュートリアル（敵対的生成モデル）", url: "https://docs.pytorch.org/tutorials/beginner/dcgan_faces_tutorial.html", note: "生成器と識別器を競わせるGANの学習手順を実装で理解できます。" }
  ],
  "ch11:t14": [
    { type: "tool", label: "RDKit 公式ドキュメント（化学情報処理）", url: "https://www.rdkit.org/docs/", note: "SMILESの取り扱いや記述子計算など、化合物データ前処理の基本が揃います。" },
    { type: "tool", label: "DeepChem 公式ドキュメント", url: "https://deepchem.readthedocs.io/en/latest/", note: "創薬向けの標準データセットとモデルを一括で扱える枠組みの解説です。" },
    { type: "tool", label: "DiffDock 公式リポジトリ（深層学習ドッキング）", url: "https://github.com/gcorso/DiffDock", note: "拡散モデルでタンパク質とリガンドの結合姿勢を予測する実装です。" }
  ],
  "ch11:t15": [
    { type: "tool", label: "Biomni 公式リポジトリ（生命科学向けAIエージェント）", url: "https://github.com/snap-stanford/Biomni", note: "解析ツール群を自律的に呼び出して研究課題を解くエージェントの実装です。" },
    { type: "tool", label: "LangChain 公式リポジトリ", url: "https://github.com/langchain-ai/langchain", note: "自分でエージェントを組む際に広く使われる、道具連携の枠組みです。" },
    { type: "tool", label: "Model Context Protocol 公式ドキュメント", url: "https://modelcontextprotocol.io/docs/getting-started/intro", note: "外部データや解析ツールをAIに接続する標準規格の入門解説です。" }
  ],
});
