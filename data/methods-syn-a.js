/* 第1〜3章 手法同義語（論文アナライザ用） */
window.METHODS_SYN = Object.assign(window.METHODS_SYN || {}, {
  /* 第1章 統計 */
  "ch01:t1": ["p-value", "p value", "p値", "有意水準", "帰無仮説", "統計的有意", "significance level", "null hypothesis", "statistical significance"],
  "ch01:t2": ["multiple comparison", "multiple testing correction", "bonferroni", "benjamini-hochberg", "fdr", "false discovery rate", "多重比較", "多重検定", "事後検定", "tukey"],
  "ch01:t3": ["confidence interval", "95% ci", "信頼区間", "95%信頼区間"],
  "ch01:t4": ["t-test", "t検定", "student t", "student's t-test", "paired t", "対応のあるt検定", "対応のないt検定", "welch t-test", "ウェルチのt検定"],
  "ch01:t5": ["anova", "分散分析", "一元配置", "二元配置", "one-way anova", "two-way anova", "一元配置分散分析", "二元配置分散分析"],
  "ch01:t6": ["error bar", "エラーバー", "棒グラフ", "bar chart", "bar graph", "箱ひげ図", "box plot", "violin plot", "バイオリンプロット", "swarm plot", "スウォームプロット"],
  "ch01:t7": ["correlation", "correlation analysis", "pearson", "spearman", "相関係数", "相関解析", "ピアソン相関", "スピアマン相関", "順位相関", "積率相関"],
  "ch01:t8": ["linear regression", "線形回帰", "回帰直線", "最小二乗法", "least squares", "regression line", "単回帰", "予測区間"],
  "ch01:t9": ["curve fitting", "カーブフィッティング", "曲線あてはめ", "曲線近似", "nonlinear regression", "非線形回帰", "spline", "スプライン", "michaelis-menten", "ミカエリスメンテン"],

  /* 第2章 核酸 */
  "ch02:t1": ["bioanalyzer", "バイオアナライザ", "tapestation", "テープステーション", "rin値", "din値", "rna integrity number", "electropherogram", "エレクトロフェログラム", "screentape"],
  "ch02:t2": ["agarose gel electrophoresis", "アガロースゲル電気泳動", "アガロースゲル", "agarose gel", "ゲル電気泳動"],
  "ch02:t3": ["southern blot", "northern blot", "サザンブロット", "ノーザンブロット", "サザン法", "ノーザン法", "サザンハイブリダイゼーション"],
  "ch02:t4": ["pcr", "rt-pcr", "ポリメラーゼ連鎖反応", "逆転写pcr", "polymerase chain reaction", "reverse transcription pcr"],
  "ch02:t5": ["qpcr", "rt-qpcr", "real-time pcr", "リアルタイムpcr", "定量pcr", "定量的pcr", "quantitative pcr", "ct値", "taqman", "sybr green"],
  "ch02:t6": ["digital pcr", "ddpcr", "デジタルpcr", "droplet digital pcr", "ドロップレットデジタルpcr", "dpcr"],
  "ch02:t7": ["bisulfite", "バイサルファイト", "メチル化解析", "dnaメチル化解析", "bisulfite sequencing", "バイサルファイトシークエンス", "亜硫酸水素ナトリウム"],
  "ch02:t8": ["g-banding", "gバンド分染法", "ギムザ分染法", "ギムザ染色", "核型解析", "karyotyping", "karyotype", "核型分析"],
  "ch02:t9": ["dna-fish", "fluorescence in situ hybridization", "蛍光in situハイブリダイゼーション", "蛍光インサイチュハイブリダイゼーション", "fishプローブ"],
  "ch02:t10": ["interphase fish", "間期核fish", "間期核ハイブリダイゼーション", "間期fish"],
  "ch02:t11": ["rna-fish", "smfish", "single molecule rna-fish", "1分子rna-fish", "seqfish", "merfish"],
  "ch02:t12": ["luciferase", "ルシフェラーゼ", "レポーターアッセイ", "luciferase assay", "ルシフェラーゼアッセイ", "プロモーターアッセイ", "dual luciferase", "デュアルルシフェラーゼ", "レポーター遺伝子アッセイ"],
  "ch02:t13": ["emsa", "gel shift", "ゲルシフト", "ゲルシフトアッセイ", "electrophoretic mobility shift assay", "supershift", "スーパーシフト", "バンドシフト"],

  /* 第3章 イメージング */
  "ch03:t1": ["phase contrast", "位相差顕微鏡", "phase contrast microscopy", "位相差観察", "微分干渉顕微鏡", "differential interference contrast", "微分干渉観察", "ノマルスキー", "nomarski"],
  "ch03:t2": ["confocal", "共焦点", "共焦点顕微鏡", "confocal microscopy", "clsm", "laser scanning confocal", "共焦点レーザー走査顕微鏡", "レーザー走査型顕微鏡"],
  "ch03:t3": ["immunohistochemistry", "ihc", "免疫組織化学", "免疫染色", "免疫組織化学染色", "酵素抗体法", "dab染色", "ihc染色"],
  "ch03:t4": ["immunofluorescence", "免疫蛍光", "免疫蛍光染色", "蛍光免疫染色", "蛍光抗体法", "immunofluorescence staining", "間接蛍光抗体法"],
  "ch03:t5": ["multiplex staining", "マルチプレックス染色", "超多色染色", "multiplex immunofluorescence", "cycif", "t-cycif", "phenocycler", "マルチラウンド染色", "multiround staining"],
  "ch03:t6": ["scanning electron microscopy", "走査電子顕微鏡", "走査型電子顕微鏡", "fe-sem", "電界放出形走査電子顕微鏡", "sem像"],
  "ch03:t7": ["transmission electron microscopy", "tem", "透過電子顕微鏡", "透過型電子顕微鏡", "immuno-em", "免疫電顕", "tem像"],
  "ch03:t8": ["clem", "correlative light and electron microscopy", "光電子相関顕微鏡法", "光-電子相関顕微鏡", "correlative microscopy", "in-resin clem"],
  "ch03:t9": ["two-photon", "2光子", "多光子", "二光子励起顕微鏡", "two-photon microscopy", "multiphoton microscopy", "多光子顕微鏡", "二光子励起"],
  "ch03:t10": ["light-sheet", "ライトシート", "ライトシート顕微鏡", "lsfm", "light-sheet fluorescence microscopy", "spim", "selective plane illumination microscopy", "光シート顕微鏡"],
  "ch03:t11": ["tirf", "tirfm", "total internal reflection fluorescence", "全反射照明蛍光顕微鏡", "全反射蛍光顕微鏡", "エバネッセント照明"],
  "ch03:t12": ["super-resolution", "超解像", "超解像顕微鏡", "sted", "palm", "storm", "dna-paint", "smlm", "single molecule localization microscopy", "構造化照明顕微鏡", "structured illumination microscopy"],
  "ch03:t13": ["frap", "fluorescence recovery after photobleaching", "光褪色後蛍光回復法", "光退色後蛍光回復法", "蛍光褪色回復法"],
});
