/* 第3章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch03:t1": [
    { type: "vendor", label: "Nikon MicroscopyU: 位相差顕微鏡の原理と実際", url: "https://www.microscopyu.com/techniques/phase-contrast", note: "位相板とハローの成り立ちを図解した教育資料です。無染色像の見え方を理解できます。" },
    { type: "vendor", label: "Nikon MicroscopyU: 微分干渉（DIC）顕微鏡", url: "https://www.microscopyu.com/techniques/dic", note: "偏光とプリズムによる擬似立体像の仕組みを解説します。位相差との使い分けが分かります。" },
    { type: "guideline", label: "Journal of Cell Biology: 顕微鏡画像の加工に関する指針", url: "https://pubmed.ncbi.nlm.nih.gov/15240566/", note: "許される画像処理と不正になる操作の線引きを示します。図の作成前に必ず確認したい資料です。" }
  ],
  "ch03:t2": [
    { type: "vendor", label: "Nikon MicroscopyU: 共焦点顕微鏡の技術解説", url: "https://www.microscopyu.com/techniques/confocal", note: "ピンホールと光学切片の関係を体系的に扱います。設定値の意味を確かめるときに開きます。" },
    { type: "vendor", label: "Nikon MicroscopyU: 共焦点の基本概念（入門）", url: "https://www.microscopyu.com/techniques/confocal/introductory-confocal-concepts", note: "走査方式や検出器の基礎をやさしくまとめています。初めて共焦点を使う前に読みます。" },
    { type: "tool", label: "Fiji（ImageJ）公式ドキュメント", url: "https://imagej.net/software/fiji/", note: "取得した共焦点画像の投影や定量に使う標準ソフトの公式解説です。解析手順の確認に使います。" }
  ],
  "ch03:t3": [
    { type: "protocol", label: "Methods in Molecular Biology: 発色基質を用いた組織切片の免疫染色", url: "https://pubmed.ncbi.nlm.nih.gov/34766261/", note: "抗原賦活化から発色までの標準手順です。DAB染色の条件を組み立てるときに参照します。" },
    { type: "protocol", label: "Nature Protocols: 画像ベース免疫プロファイリング向け抗体の適格性評価", url: "https://pubmed.ncbi.nlm.nih.gov/31534232/", note: "抗体の特異性検証の具体的手順を示します。染色結果の信頼性を担保したいときに有用です。" },
    { type: "vendor", label: "Cell Signaling Technology: 免疫染色などのプロトコル集", url: "https://www.cellsignal.com/learn-and-support/protocols", note: "抗体メーカーが公開する実験手順の入口です。抗体ごとの推奨条件を探すときに使います。" }
  ],
  "ch03:t4": [
    { type: "protocol", label: "Methods in Molecular Biology: 組織切片の間接蛍光抗体法", url: "https://pubmed.ncbi.nlm.nih.gov/34766262/", note: "固定・ブロッキング・二次抗体の選択までを扱います。自家蛍光対策の記載も参考になります。" },
    { type: "vendor", label: "Thermo Fisher: 蛍光イメージングの基礎（Molecular Probes School of Fluorescence）", url: "https://www.thermofisher.com/jp/ja/home/life-science/cell-analysis/cell-analysis-learning-center/molecular-probes-school-of-fluorescence/imaging-basics.html", note: "励起蛍光波長やフィルタ選択の基礎を学べます。多色染色の組み合わせを決めるときに読みます。" },
    { type: "tool", label: "ImageJ: 共局在解析（colocalization）の公式解説", url: "https://imagej.net/imaging/colocalization-analysis", note: "共局在の指標と落とし穴を整理しています。重ね合わせ画像を定量する前に確認します。" }
  ],
  "ch03:t5": [
    { type: "protocol", label: "Nature Protocols: 多重染色画像の処理・解析ワークフロー", url: "https://pubmed.ncbi.nlm.nih.gov/37816904/", note: "撮像から単一細胞データ化までの一連の解析手順です。多重画像の定量設計に役立ちます。" },
    { type: "protocol", label: "Science: 反復免疫蛍光染色（4i）による多重タンパク質マップ", url: "https://pubmed.ncbi.nlm.nih.gov/30072512/", note: "抗体を繰り返し剥離して数十種を染め分ける手法の原著です。原理の把握に適します。" },
    { type: "protocol", label: "Methods in Molecular Biology: イメージングマスサイトメトリーによる in situ 免疫プロファイリング", url: "https://pubmed.ncbi.nlm.nih.gov/38526797/", note: "金属標識抗体を用いる多重解析の手順です。蛍光では難しい多色数が必要なときに読みます。" }
  ],
  "ch03:t6": [
    { type: "protocol", label: "Nature Protocols: FIB-SEMによる組織立体構造のイメージング", url: "https://pubmed.ncbi.nlm.nih.gov/21637203/", note: "集束イオンビームで削りながら連続撮像する手法です。三次元微細構造を見たいときに使います。" },
    { type: "protocol", label: "Nature Protocols: 電界放出型SEM向け神経組織の高コントラスト包埋染色", url: "https://pubmed.ncbi.nlm.nih.gov/22240582/", note: "重金属染色による導電性とコントラストの確保法です。試料作製の質を上げたいときに読みます。" },
    { type: "vendor", label: "JEOL: 走査電子顕微鏡（SEM）製品と技術情報", url: "https://www.jeol.com/products/scientific/sem/", note: "装置ごとの分解能や検出器構成を確認できます。仕様と観察目的の対応づけに使います。" }
  ],
  "ch03:t7": [
    { type: "protocol", label: "Nature Protocols: 包埋前免疫金標識による微細局在の解析", url: "https://pubmed.ncbi.nlm.nih.gov/25211515/", note: "膜微小領域までタンパク質局在を追う手順です。TEMで抗原局在を示したいときに参照します。" },
    { type: "protocol", label: "Cold Spring Harbor Protocols: 電子顕微鏡用試料の作製（分裂酵母）", url: "https://pubmed.ncbi.nlm.nih.gov/28049777/", note: "固定・脱水・樹脂包埋・超薄切片の流れを具体的に示します。基本工程の確認に向きます。" },
    { type: "vendor", label: "JEOL: 透過電子顕微鏡（TEM）製品と技術情報", url: "https://www.jeol.com/products/scientific/tem/", note: "加速電圧や分解能などの装置仕様をまとめています。論文の装置記載を読む際にも役立ちます。" }
  ],
  "ch03:t8": [
    { type: "protocol", label: "Nature Protocols: ヒト脳などの生体試料に対するCLEM", url: "https://pubmed.ncbi.nlm.nih.gov/40164750/", note: "蛍光像と電顕像を同一視野で対応づける最新手順です。位置合わせの実務が分かります。" },
    { type: "protocol", label: "Nature Protocols: 超解像蛍光イメージングと電子顕微鏡の相関観察", url: "https://pubmed.ncbi.nlm.nih.gov/28384138/", note: "化学固定試料での複数のCLEM手順を比較しています。手法選択の指針になります。" },
    { type: "protocol", label: "Nature Protocols: 蛍光顕微鏡とクライオ電子線トモグラフィーの相関観察", url: "https://pubmed.ncbi.nlm.nih.gov/27977021/", note: "凍結試料でのCLEMの手順です。天然に近い状態での構造解析を狙うときに読みます。" }
  ],
  "ch03:t9": [
    { type: "vendor", label: "Nikon MicroscopyU: 多光子励起顕微鏡の技術解説", url: "https://www.microscopyu.com/techniques/multi-photon", note: "非線形励起と深部到達性の原理を図解します。共焦点との違いを整理したいときに開きます。" },
    { type: "protocol", label: "Nature Protocols: 生体内二光子イメージングによる樹状突起カルシウム計測", url: "https://pubmed.ncbi.nlm.nih.gov/21212780/", note: "麻酔・頭部固定・色素導入までを含む in vivo 計測の手順です。実験設計の参考になります。" },
    { type: "protocol", label: "Nature Protocols: 二光子ターゲットパッチ法（TPTP）", url: "https://pubmed.ncbi.nlm.nih.gov/17406293/", note: "二光子像を見ながら細胞を狙って記録する手法です。イメージングと電気生理の併用時に使います。" }
  ],
  "ch03:t10": [
    { type: "protocol", label: "Nature Protocols: 適応型ライトシート顕微鏡の実践ガイド", url: "https://pubmed.ncbi.nlm.nih.gov/30367170/", note: "シートの位置合わせと収差補正を実務的に解説します。像質が出ないときの確認に使えます。" },
    { type: "protocol", label: "Nature Protocols: 組織透明化とイメージングの実践的注意点", url: "https://pubmed.ncbi.nlm.nih.gov/34021294/", note: "透明化試薬と屈折率整合の選び方を整理しています。標本作製の段階で読む価値があります。" },
    { type: "vendor", label: "Nikon MicroscopyU: ライトシート顕微鏡の技術解説", url: "https://www.microscopyu.com/techniques/light-sheet", note: "面照明による低侵襲・高速撮像の原理をまとめています。手法の適用範囲が分かります。" }
  ],
  "ch03:t11": [
    { type: "vendor", label: "Nikon MicroscopyU: 全反射照明蛍光（TIRF）顕微鏡", url: "https://www.microscopyu.com/techniques/fluorescence/total-internal-reflection-fluorescence-tirf-microscopy", note: "エバネッセント場の厚みと臨界角の関係を解説します。設定の意味を確かめるときに開きます。" },
    { type: "protocol", label: "Cold Spring Harbor Protocols: TIRF顕微鏡法", url: "https://pubmed.ncbi.nlm.nih.gov/26330632/", note: "光学系の構成と試料調製の実務をまとめた手順です。導入時の確認事項が把握できます。" },
    { type: "protocol", label: "Cold Spring Harbor Protocols: TIRF画像のデータ解析", url: "https://pubmed.ncbi.nlm.nih.gov/27140913/", note: "スポット検出や輝度補正など解析側の注意点を扱います。定量結果の妥当性確認に役立ちます。" }
  ],
  "ch03:t12": [
    { type: "vendor", label: "Nikon MicroscopyU: 超解像顕微鏡の技術解説", url: "https://www.microscopyu.com/techniques/super-resolution", note: "STED・SIM・単分子局在化法の原理を比較整理しています。手法の違いを押さえられます。" },
    { type: "protocol", label: "Nature Protocols: DNA-PAINTによる超解像イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/28518172/", note: "DNA鎖の一過性結合を使う局在化手法の手順です。多重超解像を狙うときに参照します。" },
    { type: "vendor", label: "ZEISS: 超解像顕微鏡システムの製品情報", url: "https://www.zeiss.com/microscopy/en/products/light-microscopes/super-resolution-microscopes.html", note: "各方式の到達分解能と撮像速度を確認できます。装置選択や論文の仕様確認に使います。" }
  ],
  "ch03:t13": [
    { type: "protocol", label: "Methods in Molecular Biology: FRAPによる転写因子動態の定量", url: "https://pubmed.ncbi.nlm.nih.gov/32979202/", note: "細胞培養から退色・回復曲線の解析までを一続きで解説します。定量手順の型として使えます。" },
    { type: "protocol", label: "Methods in Molecular Biology: FRAPによる細胞間接着関連分子の動態測定", url: "https://pubmed.ncbi.nlm.nih.gov/35147932/", note: "生体内での回復曲線取得と解釈を扱います。可動分率と半回復時間の読み方が分かります。" },
    { type: "protocol", label: "Nature Protocols: CLEMを併用したFRAPの超微形態的検証", url: "https://pubmed.ncbi.nlm.nih.gov/17406335/", note: "FRAPの結果を電顕像で裏づける手法です。動態の解釈に構造的根拠が欲しいときに読みます。" }
  ]
});
