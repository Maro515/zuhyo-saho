/* 第1章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch01:t1": [
    { type: "guideline", label: "米国統計学会: p値に関する声明（ASA Statement on p-Values）", url: "https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf", note: "p値の定義と誤用を6原則にまとめた公式声明です。解釈に迷ったら最初に開きます。" },
    { type: "guideline", label: "EQUATOR Network: SAMPL統計報告ガイドライン", url: "https://resources.equator-network.org/reporting-guidelines/sampl/", note: "検定手法や有意水準を論文にどう書くかを定めた報告基準です。執筆時の確認に使います。" },
    { type: "tool", label: "SciPy: statistical functions（scipy.stats）公式リファレンス", url: "https://docs.scipy.org/doc/scipy/reference/stats.html", note: "Pythonで使える検定関数の一覧です。どの検定が実装済みかを俯瞰したいときに開きます。" }
  ],
  "ch01:t2": [
    { type: "tool", label: "R stats: p.adjust（多重比較のp値補正）公式ドキュメント", url: "https://stat.ethz.ch/R-manual/R-devel/library/stats/html/p.adjust.html", note: "BonferroniやBH法など補正方式の指定方法を示します。Rで補正する際の基本文書です。" },
    { type: "tool", label: "statsmodels: multipletests（多重検定補正）公式ドキュメント", url: "https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html", note: "Pythonで補正済みp値とFDRを計算する関数の説明です。補正法の選択肢が一覧できます。" },
    { type: "tool", label: "CRAN: multcomp（多重比較の同時推測）パッケージ", url: "https://cran.r-project.org/web/packages/multcomp/index.html", note: "TukeyやDunnettなど多群比較を実行するRパッケージです。事後検定の実装に使います。" }
  ],
  "ch01:t3": [
    { type: "tool", label: "SciPy: scipy.stats.bootstrap（ブートストラップ信頼区間）", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html", note: "分布を仮定せずに信頼区間を求める関数の説明です。非正規データの区間推定に使います。" },
    { type: "tool", label: "Estimation Stats: 推定統計とエラーバーのWebツール", url: "https://www.estimationstats.com/", note: "群間差と信頼区間をブラウザ上で図示できます。p値に頼らない提示を試すときに便利です。" },
    { type: "tool", label: "GitHub: dabestr（推定統計プロット用Rパッケージ）", url: "https://github.com/ACCLAB/dabestr", note: "効果量と信頼区間を並べたGardner-Altman図を描くRパッケージの公式リポジトリです。" }
  ],
  "ch01:t4": [
    { type: "tool", label: "R stats: t.test（t検定）公式ドキュメント", url: "https://stat.ethz.ch/R-manual/R-devel/library/stats/html/t.test.html", note: "対応の有無や等分散仮定の切り替え方を説明します。Rでt検定を書くときの基本文書です。" },
    { type: "tool", label: "SciPy: scipy.stats.ttest_ind（独立2標本t検定）", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html", note: "Welch補正の指定方法まで書かれた関数説明です。Pythonでの2群比較の実装に使います。" },
    { type: "tool", label: "G*Power: 検出力分析とサンプルサイズ設計ソフト（公式配布ページ）", url: "https://www.psychologie.hhu.de/arbeitsgruppen/allgemeine-psychologie-und-arbeitspsychologie/gpower", note: "必要症例数を効果量から逆算できる無料ソフトです。実験計画の段階で開きます。" }
  ],
  "ch01:t5": [
    { type: "tool", label: "R stats: aov（分散分析）公式ドキュメント", url: "https://stat.ethz.ch/R-manual/R-devel/library/stats/html/aov.html", note: "一元配置から反復測定までのモデル式の書き方を示します。RでANOVAを組む基本文書です。" },
    { type: "tool", label: "statsmodels: ANOVA（分散分析）公式ガイド", url: "https://www.statsmodels.org/stable/anova.html", note: "Type I/II/IIIの平方和の違いと指定方法を説明します。要因計画の解析時に開きます。" },
    { type: "tool", label: "SciPy: scipy.stats.f_oneway（一元配置分散分析）", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.f_oneway.html", note: "多群の平均差を一度に検定する関数の説明です。前提条件の注意点も書かれています。" }
  ],
  "ch01:t6": [
    { type: "tool", label: "SuperPlotsOfData: 生物学的反復を重ねて描くWebツール", url: "https://huygens.science.uva.nl/SuperPlotsOfData/", note: "実験日ごとの反復を色分けした棒グラフ代替図を作れます。疑似反復の誤表示を防げます。" },
    { type: "tool", label: "PlotsOfData: 個々のデータ点と信頼区間を描くWebツール", url: "https://huygens.science.uva.nl/PlotsOfData/", note: "平均とエラーバーだけの棒グラフをやめ、生データを重ねた図に置き換えるときに使います。" },
    { type: "tool", label: "Estimation Stats: 効果量つきプロット作成ツール", url: "https://www.estimationstats.com/", note: "群間差の推定値をエラーバーつきで併記した図が作れます。棒グラフの改良案として有用です。" }
  ],
  "ch01:t7": [
    { type: "tool", label: "R stats: cor.test（相関係数の検定）公式ドキュメント", url: "https://stat.ethz.ch/R-manual/R-devel/library/stats/html/cor.test.html", note: "Pearson・Spearman・Kendallの切り替え方を説明します。Rで相関を検定する基本文書です。" },
    { type: "tool", label: "SciPy: scipy.stats.pearsonr（Pearson相関係数）", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html", note: "相関係数とp値、信頼区間の求め方を示します。線形な関連の強さを測るときに使います。" },
    { type: "tool", label: "SciPy: scipy.stats.spearmanr（順位相関係数）", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html", note: "外れ値や非線形関係に強い順位相関の関数説明です。分布が歪むデータで開きます。" }
  ],
  "ch01:t8": [
    { type: "tool", label: "R stats: lm（線形モデル）公式ドキュメント", url: "https://stat.ethz.ch/R-manual/R-devel/library/stats/html/lm.html", note: "回帰式の書き方と出力の読み方を説明します。Rで回帰分析を始めるときの基本文書です。" },
    { type: "tool", label: "statsmodels: Linear Regression（線形回帰）公式ガイド", url: "https://www.statsmodels.org/stable/regression.html", note: "回帰係数の標準誤差や頑健標準誤差の指定方法が載ります。Pythonでの回帰実装に使います。" },
    { type: "tool", label: "scikit-learn: LinearRegression 公式ドキュメント", url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html", note: "予測を目的とした回帰の実装例です。機械学習の枠組みで回帰を扱うときに開きます。" }
  ],
  "ch01:t9": [
    { type: "tool", label: "SciPy: scipy.optimize.curve_fit（非線形最小二乗フィッティング）", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.curve_fit.html", note: "任意の関数形に当てはめる手順とパラメータ誤差の求め方を示します。実装の要になります。" },
    { type: "tool", label: "CRAN: drc（用量反応曲線解析）パッケージ", url: "https://cran.r-project.org/web/packages/drc/index.html", note: "シグモイド曲線の当てはめとEC50推定に使うRパッケージです。用量反応解析で開きます。" },
    { type: "vendor", label: "GraphPad Prism: カーブフィッティングガイド", url: "https://www.graphpad.com/guides/prism/latest/curve-fitting/index.htm", note: "モデル選択や重み付けの考え方を平易に解説した公式ガイドです。判断に迷うとき有用です。" }
  ]
});
