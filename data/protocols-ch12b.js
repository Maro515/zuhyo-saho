/* 第12章 発展編（t26〜t50）プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch12:t26": [
    { type: "protocol", label: "Nature Protocols: emClarityによる高分解能その場構造決定", url: "https://pubmed.ncbi.nlm.nih.gov/35022621/", note: "cryo-ETのサブトモグラム平均化を高分解能で回す全手順がまとまっています。" },
    { type: "tool", label: "RELION 公式ドキュメント", url: "https://relion.readthedocs.io/en/release-5.0/", note: "トモグラム処理と平均化の実際のコマンドと設定を確認するときに開きます。" },
    { type: "db", label: "EMDB（電子顕微鏡データバンク）", url: "https://www.ebi.ac.uk/emdb/", note: "論文の密度マップを実際に取り寄せて分解能や条件を確かめられます。" }
  ],
  "ch12:t27": [
    { type: "protocol", label: "Nature Protocols: MicroEDによる高分子回折データ収集", url: "https://pubmed.ncbi.nlm.nih.gov/27077331/", note: "微結晶からの電子回折データをどう集めるかの基本手順が読めます。" },
    { type: "protocol", label: "Nature Protocols: MicroEDのための試料調製の総合手順", url: "https://pubmed.ncbi.nlm.nih.gov/39706914/", note: "結晶化からグリッド作製までの調製工程を網羅した新しい手順書です。" },
    { type: "protocol", label: "STAR Protocols: 集束イオンビームによる結晶薄片作製", url: "https://pubmed.ncbi.nlm.nih.gov/34382014/", note: "厚い結晶をFIBで薄片化してMicroEDに供する具体的な操作が分かります。" }
  ],
  "ch12:t28": [
    { type: "guideline", label: "Nature Methods: HDX-MSの実施・解釈・報告に関する推奨事項", url: "https://pubmed.ncbi.nlm.nih.gov/31249422/", note: "HDX-MS論文に何を書くべきかを定めた国際的な推奨で、査読時の物差しになります。" },
    { type: "tool", label: "PyHDX（HDX-MSデータ解析ソフトウェア）", url: "https://github.com/Jhsmit/PyHDX", note: "重水素取り込み率からΔG地図を作る解析の実装と使い方を確認できます。" }
  ],
  "ch12:t29": [
    { type: "protocol", label: "Nature Protocols: 定量的架橋質量分析による構造変化の解析", url: "https://pubmed.ncbi.nlm.nih.gov/30559374/", note: "架橋剤処理からLC-MS測定、定量比較までの一連の流れが載っています。" },
    { type: "tool", label: "xiSEARCH（Rappsilber研の架橋MS検索エンジン）", url: "https://github.com/Rappsilber-Laboratory/xiSEARCH", note: "架橋ペプチドの同定とFDR設定を実際に走らせるときの公式リポジトリです。" },
    { type: "tool", label: "pLink 3（架橋ペプチド同定ソフトウェア）", url: "https://github.com/pFindStudio/pLink3", note: "XL-MSの代表的な同定ソフトで、対応する架橋剤や設定を確認できます。" }
  ],
  "ch12:t30": [
    { type: "protocol", label: "Nature Protocols: 細胞内標的結合を測るCETSAの手順", url: "https://pubmed.ncbi.nlm.nih.gov/25101824/", note: "加熱条件や可溶性画分の回収などCETSAの基本操作が丁寧に書かれています。" },
    { type: "protocol", label: "Nature Protocols: 熱プロテオーム解析による標的同定", url: "https://pubmed.ncbi.nlm.nih.gov/26379230/", note: "TMT多重化で全プロテオームの融解曲線を取る実験計画が分かります。" },
    { type: "tool", label: "Bioconductor: TPPパッケージ", url: "https://bioconductor.org/packages/TPP/", note: "融解曲線のあてはめと標的判定を再現するR解析の公式ドキュメントです。" }
  ],
  "ch12:t31": [
    { type: "protocol", label: "Nature Protocols: 高スループット対応のLiP-MS改良手順", url: "https://pubmed.ncbi.nlm.nih.gov/36526727/", note: "プロテアーゼ処理条件や自動化を含む最新版のLiP-MS実験手順です。" },
    { type: "protocol", label: "Nature Protocols: 限定分解MSによるプロテオーム構造変化の計測", url: "https://pubmed.ncbi.nlm.nih.gov/29072706/", note: "LiP-MSの原理と対照実験の置き方を理解したいときに最初に読む一報です。" }
  ],
  "ch12:t32": [
    { type: "tool", label: "AlphaFold 公式リポジトリ（Google DeepMind）", url: "https://github.com/google-deepmind/alphafold", note: "Multimerの実行方法や出力指標の定義を一次情報として確認できます。" },
    { type: "db", label: "AlphaFold Protein Structure Database", url: "https://alphafold.ebi.ac.uk/", note: "予測構造とpLDDTを配列やUniProt IDから直接引ける公式データベースです。" },
    { type: "tool", label: "ColabFold（ブラウザで動く構造予測）", url: "https://github.com/sokrypton/ColabFold", note: "自前GPUがなくても複合体予測を試せる実装で、使い方も詳しく載ります。" }
  ],
  "ch12:t33": [
    { type: "tool", label: "RFdiffusion（Baker研のde novo構造生成）", url: "https://github.com/RosettaCommons/RFdiffusion", note: "結合体やスキャフォールドを生成する拡散モデルの公式コードと実行例です。" },
    { type: "tool", label: "ProteinMPNN（配列設計ネットワーク）", url: "https://github.com/dauparas/ProteinMPNN", note: "生成した骨格に載せるアミノ酸配列を設計する定番ツールの本家です。" }
  ],
  "ch12:t34": [
    { type: "vendor", label: "Oxford Nanopore: ナノポアセンシングの原理解説", url: "https://nanoporetech.com/platform/technology", note: "電流変化から分子を読む仕組みを、装置メーカーの一次資料で確認できます。" },
    { type: "vendor", label: "Quantum-Si: 1分子タンパク質シークエンサー（※ナノポアではなく蛍光式）", url: "https://www.quantum-si.com/", note: "1分子ペプチド読取の別方式です。ナノポア式と原理が違う点に注意して比較できます。" }
  ],
  "ch12:t35": [
    { type: "vendor", label: "Oxford Nanopore: ダイレクトRNAシークエンシング SQK-RNA004", url: "https://nanoporetech.com/document/direct-rna-sequencing-sqk-rna004", note: "現行キットのライブラリ調製手順と必要量が公式手順書で確認できます。" },
    { type: "tool", label: "Dorado（ナノポア用ベースコーラー）", url: "https://github.com/nanoporetech/dorado", note: "修飾塩基モデルの選び方や出力形式を調べるときに開く公式リポジトリです。" },
    { type: "tool", label: "m6Anet（ダイレクトRNAからのm6A検出）", url: "https://github.com/GoekeLab/m6anet", note: "電流シグナルからm6A部位を確率で推定する解析ツールの本家です。" }
  ],
  "ch12:t36": [
    { type: "protocol", label: "Nature Methods: eCLIPによるRBP結合部位の頑健な同定", url: "https://pubmed.ncbi.nlm.nih.gov/27018577/", note: "サイズマッチ入力対照など、eCLIPの設計思想と実験手順の原典です。" },
    { type: "protocol", label: "Methods in Molecular Biology: seCLIPの実験手順", url: "https://pubmed.ncbi.nlm.nih.gov/28766298/", note: "少量サンプル向けに簡略化した手順が段階ごとに書かれています。" },
    { type: "tool", label: "Yeo研 eCLIP 解析パイプライン", url: "https://github.com/YeoLab/eCLIP", note: "ピーク検出と入力対照補正を再現するための公式コード一式です。" }
  ],
  "ch12:t37": [
    { type: "protocol", label: "Nature Protocols: SHAPE-MaPによるRNA構造解析の手順", url: "https://pubmed.ncbi.nlm.nih.gov/26426499/", note: "試薬選択から変異プロファイル取得までSHAPE-MaPの全工程が読めます。" },
    { type: "protocol", label: "Nature Protocols: 細胞内SHAPE-MaPの実験手順", url: "https://pubmed.ncbi.nlm.nih.gov/29725122/", note: "生細胞のまま構造をプローブする条件設定と注意点がまとまっています。" },
    { type: "tool", label: "ShapeMapper 2（Weeks研の解析ソフト）", url: "https://github.com/Weeks-UNC/shapemapper2", note: "リードから反応性プロファイルを算出する標準解析ツールの本家です。" }
  ],
  "ch12:t38": [
    { type: "protocol", label: "Nature Protocols: PRO-seqによる活性RNAポリメラーゼの塩基分解能マッピング", url: "https://pubmed.ncbi.nlm.nih.gov/27442863/", note: "核単離からラン・オン反応までPRO-seqの実験条件が具体的に分かります。" },
    { type: "protocol", label: "Nature Protocols: 哺乳類mNET-seqの解析手順", url: "https://pubmed.ncbi.nlm.nih.gov/26844429/", note: "ポリメラーゼCTD修飾別に新生RNAを取る免疫沈降条件が読めます。" },
    { type: "protocol", label: "Nature Protocols: ヒト細胞のNET-seqによる転写プロファイリング", url: "https://pubmed.ncbi.nlm.nih.gov/27010758/", note: "1塩基分解能で伸長中の転写を捉える別系統の手順書として比較できます。" }
  ],
  "ch12:t39": [
    { type: "protocol", label: "Nature Protocols: Micro-Cおよび領域捕捉Micro-Cの手順", url: "https://pubmed.ncbi.nlm.nih.gov/42443443/", note: "MNase消化条件やライブラリ設計などヌクレオソーム分解能の実務が読めます。" },
    { type: "tool", label: "cooler（接触行列のフォーマットとツール）", url: "https://github.com/open2c/cooler", note: "Micro-Cの接触行列を保存・操作する標準形式の公式実装です。" },
    { type: "tool", label: "cooltools（接触行列の解析ライブラリ）", url: "https://github.com/open2c/cooltools", note: "ループやコンパートメントの定量を再現するときに参照する解析ツールです。" }
  ],
  "ch12:t40": [
    { type: "protocol", label: "Nature Protocols: E/L Repli-seqによる複製タイミング解析", url: "https://pubmed.ncbi.nlm.nih.gov/29599440/", note: "早期と後期の画分ソートから解析までの標準手順がまとまっています。" },
    { type: "db", label: "4D Nucleome データポータル", url: "https://data.4dnucleome.org/", note: "複製タイミングや接触データの標準化された公開データを取得できます。" }
  ],
  "ch12:t41": [
    { type: "tool", label: "modkit（ナノポア修飾塩基の集計ツール）", url: "https://github.com/nanoporetech/modkit", note: "ハプロタイプ別のメチル化率を出力する手順とオプションが分かります。" },
    { type: "tool", label: "WhatsHap（リードベースのハプロタイプ決定）", url: "https://whatshap.readthedocs.io/en/latest/", note: "ロングリードから位相を決める標準ツールの使い方と前提条件が読めます。" },
    { type: "tool", label: "pb-CpG-tools（PacBio HiFiのCpG解析）", url: "https://github.com/PacificBiosciences/pb-CpG-tools", note: "HiFiリードからCpGメチル化を推定する公式ツールの仕様を確認できます。" }
  ],
  "ch12:t42": [
    { type: "db", label: "T2T-CHM13 完全ヒトゲノム公式リポジトリ", url: "https://github.com/marbl/CHM13", note: "完全ゲノム配列と注釈の入手先や版の違いを一次情報で確認できます。" },
    { type: "db", label: "Human Pangenome Reference Consortium", url: "https://humanpangenome.org/", note: "パンゲノム参照の設計方針と公開リソースの入口になるサイトです。" },
    { type: "tool", label: "hifiasm（HiFiリードのアセンブラ）", url: "https://github.com/chhylp123/hifiasm", note: "ハプロタイプ分解アセンブリを実行するときの標準ツールの本家です。" }
  ],
  "ch12:t43": [
    { type: "vendor", label: "Natera: Signatera（腫瘍情報型ctDNA検査）", url: "https://www.natera.com/oncology/signatera-advanced-cancer-detection/", note: "患者ごとに設計したパネルによるMRD検出の仕様と適応が確認できます。" },
    { type: "vendor", label: "Foundation Medicine: FoundationOne Tracker", url: "https://www.foundationmedicine.com/test/foundationone-tracker", note: "組織プロファイルと連動したctDNAモニタリング検査の概要が分かります。" },
    { type: "guideline", label: "日本臨床腫瘍学会: MRD検査の適正使用に関する提言", url: "https://pubmed.ncbi.nlm.nih.gov/39920551/", note: "国内でのMRD検査の位置づけと使いどころが整理されています。" }
  ],
  "ch12:t44": [
    { type: "vendor", label: "GRAIL Galleri: 医療者向け情報ページ", url: "https://www.galleri.com/hcp", note: "マルチがん早期検出検査の性能指標と結果の読み方が示されています。" },
    { type: "vendor", label: "GRAIL: 臨床試験プログラム一覧", url: "https://grail.com/clinical-studies/", note: "MCEDの検証試験の設計と進捗をまとめて確認できる公式ページです。" }
  ],
  "ch12:t45": [
    { type: "vendor", label: "Cytek: Auroraフルスペクトラムフローサイトメーター", url: "https://cytekbio.com/pages/aurora", note: "検出器構成やレーザー構成など装置仕様を確認するときに開きます。" },
    { type: "tool", label: "Cytek Full Spectrum Viewer（蛍光スペクトルビューア）", url: "https://spectrum.cytekbio.com/", note: "色素の類似度を見ながらパネル設計を検討できる無料のツールです。" },
    { type: "protocol", label: "Cytometry A: OMIP-069 40色フルスペクトラムパネル", url: "https://pubmed.ncbi.nlm.nih.gov/32830910/", note: "実証済みの40色パネル構成と染色手順をそのまま参考にできます。" }
  ],
  "ch12:t46": [
    { type: "protocol", label: "Nature Protocols: 薬剤スクリーニング用がんオルガノイドの樹立", url: "https://pubmed.ncbi.nlm.nih.gov/32929210/", note: "検体処理から培地組成、薬剤感受性試験までの標準手順が読めます。" },
    { type: "protocol", label: "STAR Protocols: オルガノイドリングによる高スループット試験", url: "https://pubmed.ncbi.nlm.nih.gov/33043307/", note: "少量検体で薬剤応答を測るプレート設計の実務的な工夫が分かります。" },
    { type: "vendor", label: "HUB Organoids（患者由来オルガノイド受託）", url: "https://www.huborganoids.nl/", note: "オルガノイド作製や薬剤試験を外部委託する際の選択肢を確認できます。" }
  ],
  "ch12:t47": [
    { type: "vendor", label: "Emulate: Organ-Chip 製品情報", url: "https://www.emulatebio.com/organ-chips", note: "臓器別チップの構造と代表的な評価項目が製品資料で分かります。" },
    { type: "vendor", label: "CN Bio: PhysioMimix 微小生理システム", url: "https://cn-bio.com/technology/", note: "灌流型チップの原理と肝毒性評価などの応用例が示されています。" },
    { type: "db", label: "NIH NCATS: Tissue Chip プログラム", url: "https://ncats.nih.gov/research/research-activities/tissue-chip", note: "公的機関から見た微小生理システムの位置づけと資源が集まっています。" }
  ],
  "ch12:t48": [
    { type: "tool", label: "TwoSampleMR（MR-Base のRパッケージ）", url: "https://mrcieu.github.io/TwoSampleMR/", note: "2標本MRの解析と感度分析を実行する標準パッケージの公式解説です。" },
    { type: "db", label: "OpenGWAS（MR-Base のGWAS要約統計データベース）", url: "https://gwas.mrcieu.ac.uk/", note: "曝露と結果のGWAS要約統計を検索し、そのまま解析に取り込めます。" },
    { type: "guideline", label: "STROBE-MR: メンデルランダム化研究の報告ガイドライン", url: "https://pubmed.ncbi.nlm.nih.gov/34702754/", note: "操作変数の妥当性など報告すべき項目が逐条で解説されています。" }
  ],
  "ch12:t49": [
    { type: "guideline", label: "JAMA: ターゲットトライアル・エミュレーションの枠組み", url: "https://pubmed.ncbi.nlm.nih.gov/36508210/", note: "仮想試験のプロトコル項目を1枚で整理した入門として最適です。" },
    { type: "guideline", label: "Am J Epidemiol: 大規模データで標的試験を模倣する方法", url: "https://pubmed.ncbi.nlm.nih.gov/26994063/", note: "適格基準や追跡開始時点の合わせ方など実装上の要点が読めます。" },
    { type: "guideline", label: "STROBE声明（観察研究の報告ガイドライン）", url: "https://www.strobe-statement.org/", note: "エミュレーション研究を書くときの土台になる報告項目一覧です。" }
  ],
  "ch12:t50": [
    { type: "db", label: "PGS Catalog（ポリジェニックスコアの公開カタログ）", url: "https://www.pgscatalog.org/", note: "公開済みスコアの重み係数と開発集団を検索して再利用できます。" },
    { type: "tool", label: "PRS-CS（ベイズ縮小によるPRS構築）", url: "https://github.com/getian107/PRScs", note: "GWAS要約統計から重みを推定する代表的な手法の公式実装です。" },
    { type: "guideline", label: "Nature: ポリジェニックスコアの報告基準", url: "https://pubmed.ncbi.nlm.nih.gov/33692554/", note: "集団適用性や検証方法など論文に記載すべき項目が定義されています。" }
  ],
});
