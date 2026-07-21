/* 第12章 発展編 手法同義語（論文アナライザ用）
   キーは ch12:t1 〜 ch12:t50。値は論文本文で実際に書かれる表記ゆれ。
   title / en / aka の既存表記は自動で辞書に入るため、ここは補強のみ。
   ハイフン/空白/複数形sは自動吸収されるので1形だけ記載。 */
window.METHODS_SYN = Object.assign(window.METHODS_SYN || {}, {
  // ===== ゲノム編集と遺伝子操作の最前線 =====
  "ch12:t1": ["base editing", "base editor", "cytosine base editor", "adenine base editor", "abe", "cbe", "塩基編集", "ベースエディティング"],
  "ch12:t2": ["prime editing", "prime editor", "pegrna", "プライム編集", "プライムエディティング"],
  "ch12:t3": ["epigenome editing", "crispri", "crispra", "crisproff", "dcas9", "エピゲノム編集", "dcas9エフェクター"],
  "ch12:t4": ["perturb-seq", "crop-seq", "eccite-seq", "crispr screen", "1細胞crisprスクリーニング"],
  "ch12:t5": ["cas13", "cas13d", "casrx", "sherlock", "adar", "コラテラル切断"],
  "ch12:t6": ["bridge rna", "bridge recombinase", "is110", "ブリッジrna", "プログラマブルdna再編成"],
  "ch12:t7": ["gestalt", "darlin", "lineage recording", "lineage tracing", "系統追跡", "系譜再構成"],
  "ch12:t8": ["saturation genome editing", "sge", "saturation editing", "飽和ゲノム編集", "網羅的変異機能評価"],
  // ===== 1細胞オミクスの最前線 =====
  "ch12:t9": ["cite-seq", "totalseq", "feature barcoding", "abseq", "表面タンパク質同時計測"],
  "ch12:t10": ["scatac", "scatac-seq", "single-cell atac", "sci-atac-seq", "1細胞atac", "オープンクロマチン"],
  "ch12:t11": ["multiome", "multiomic", "single-nucleus multiome", "peak-to-gene link", "マルチオーム", "同一核マルチオミクス"],
  "ch12:t12": ["scnmt", "scnmt-seq", "single-cell methylome", "snmc-seq", "1細胞メチローム", "1細胞エピゲノム"],
  "ch12:t13": ["scope-ms", "scope2", "single-cell proteomics", "plexdia", "単一細胞プロテオミクス", "1細胞プロテオミクス"],
  "ch12:t14": ["live-seq", "fluidfm", "fluidic force microscopy", "非破壊的1細胞転写解析", "非破壊的scrna-seq"],
  "ch12:t15": ["single-cell long-read", "long-read isoform", "scisorseq", "flt-seq", "1細胞アイソフォーム解析"],
  "ch12:t16": ["slam-seq", "4su", "metabolic rna labeling", "新生rna標識", "新生転写産物", "代謝ラベル"],
  "ch12:t17": ["sc-eqtl", "single-cell eqtl", "response eqtl", "eqtl", "細胞種特異的eqtl", "発現量的形質遺伝子座"],
  // ===== 空間生物学の最前線 =====
  "ch12:t18": ["merfish", "multiplexed error-robust fish", "merscope", "vizgen", "誤り耐性多重fish"],
  "ch12:t19": ["seqfish", "seqfish+", "sequential fish", "逐次ハイブリダイゼーション空間解析"],
  "ch12:t20": ["slide-seq", "slide-seqv2", "slide-tags", "ビーズ空間バーコード"],
  "ch12:t21": ["stereo-seq", "dnb-based spatial", "stomics", "ナノスケール空間トランスクリプトーム"],
  "ch12:t22": ["codex", "phenocycler", "akoya", "多重免疫蛍光サイクリング", "サイクリック免疫蛍光"],
  "ch12:t23": ["imaging mass cytometry", "hyperion", "mibi", "金属標識抗体イメージング"],
  "ch12:t24": ["deep visual proteomics", "dvp", "顕微解離プロテオミクス", "ai細胞選別"],
  "ch12:t25": ["expansion sequencing", "exseq", "expansion microscopy", "拡張顕微鏡", "拡張in situシークエンシング"],
  // ===== 構造・相互作用・ケミカルバイオロジー =====
  "ch12:t26": ["cryo-et", "cryo-electron tomography", "subtomogram averaging", "cryo-fib", "サブトモグラム平均化", "クライオ電子線トモグラフィー"],
  "ch12:t27": ["microed", "microcrystal electron diffraction", "3ded", "微結晶電子回折"],
  "ch12:t28": ["hdx-ms", "hdx", "hydrogen-deuterium exchange", "水素重水素交換質量分析", "重水素取り込み"],
  "ch12:t29": ["xl-ms", "crosslinking mass spectrometry", "clms", "dsso", "dsbu", "架橋質量分析", "クロスリンクms"],
  "ch12:t30": ["cetsa", "thermal proteome profiling", "tpp", "2d-tpp", "熱プロテオーム解析", "標的エンゲージメント"],
  "ch12:t31": ["lip-ms", "limited proteolysis", "lip-quant", "限定分解プロテオミクス", "限定分解質量分析"],
  "ch12:t32": ["alphafold-multimer", "iptm", "pae", "plddt", "タンパク質複合体構造予測", "複合体予測"],
  "ch12:t33": ["rfdiffusion", "proteinmpnn", "de novo protein design", "binder design", "人工タンパク質設計"],
  "ch12:t34": ["nanopore protein sequencing", "single-molecule protein sequencing", "1分子ペプチド読み取り", "1分子タンパク質シークエンシング"],
  // ===== ゲノム・エピゲノム・RNAの先端計測 =====
  "ch12:t35": ["direct rna sequencing", "nanopore direct rna", "drs", "ダイレクトrnaシークエンシング", "rna修飾の直接検出"],
  "ch12:t36": ["eclip", "clip-seq", "iclip", "par-clip", "rna結合タンパク質マッピング", "架橋免疫沈降"],
  "ch12:t37": ["shape-map", "dms-mapseq", "icshape", "rna構造プロービング", "rna二次構造プロービング"],
  "ch12:t38": ["pro-seq", "net-seq", "gro-seq", "新生鎖転写", "nascent transcription", "プロモーター近傍ポーズ"],
  "ch12:t39": ["micro-c", "micro-capture-c", "超高解像度クロマチン接触", "ヌクレオソーム解像度接触マップ"],
  "ch12:t40": ["repli-seq", "replication timing", "複製タイミング解析", "早期複製ドメイン", "複製タイミング遷移領域"],
  "ch12:t41": ["methylation phasing", "allele-specific methylation", "haplotype-resolved methylation", "ハプロタイプ分解メチル化解析", "アレル特異的メチル化"],
  "ch12:t42": ["telomere-to-telomere", "t2t", "pangenome", "chm13", "パンゲノム", "パンゲノムグラフ"],
  // ===== 臨床・トランスレーショナルの最前線 =====
  "ch12:t43": ["ctdna", "circulating tumor dna", "minimal residual disease", "mrd", "liquid biopsy", "リキッドバイオプシー", "微小残存病変", "tumor-informed"],
  "ch12:t44": ["multi-cancer early detection", "mced", "galleri", "cancer signal origin", "マルチがん早期検出", "メチル化シグネチャ"],
  "ch12:t45": ["spectral flow cytometry", "full spectrum flow cytometry", "spectral cytometry", "spectral unmixing", "スペクトラルフロー", "フルスペクトラムフローサイトメトリー"],
  "ch12:t46": ["patient-derived organoid", "pdo", "tumor organoid", "organoid drug sensitivity", "患者由来オルガノイド", "腫瘍オルガノイド"],
  "ch12:t47": ["organ-on-a-chip", "organ-on-chip", "microphysiological system", "tissue chip", "臓器チップ", "微小生理システム"],
  "ch12:t48": ["mendelian randomization", "mendelian randomisation", "mr-egger", "メンデルランダム化", "遺伝的変異を用いた因果推論"],
  "ch12:t49": ["target trial emulation", "target trial", "emulated trial", "ターゲットトライアル", "観察研究による仮想rct", "不死時間バイアス"],
  "ch12:t50": ["polygenic risk score", "polygenic score", "prs", "ポリジェニックリスクスコア", "多遺伝子リスクスコア"],
});
