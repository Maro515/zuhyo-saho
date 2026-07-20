/* 第7章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch07:t1": [
    { type: "vendor", label: "Bruker: 前臨床用マイクロCT 製品と技術情報", url: "https://www.bruker.com/en/products-and-solutions/preclinical-imaging/micro-ct.html", note: "小動物用CTの分解能や撮像条件など装置仕様を確認したいときに開きます。" },
    { type: "protocol", label: "JoVE: 新生仔マウス脳のマイクロCT撮像と形態計測", url: "https://pubmed.ncbi.nlm.nih.gov/37318260/", note: "造影・固定から三次元形態計測までの一連の手順を動画で確認できます。" },
    { type: "protocol", label: "Bio-protocol: マイクロCTでマウスの体組成と骨・肺を評価する簡便法", url: "https://pubmed.ncbi.nlm.nih.gov/40028031/", note: "撮像条件と閾値設定を含め、定量指標の出し方が具体的に書かれています。" }
  ],
  "ch07:t2": [
    { type: "vendor", label: "Bruker: 前臨床用MRI 製品と技術情報", url: "https://www.bruker.com/en/products-and-solutions/preclinical-imaging/mri.html", note: "高磁場小動物MRIの磁場強度やコイル構成を確認するときに使います。" },
    { type: "protocol", label: "Bio-protocol: 拡散MRIによるマウス脳の構造・コネクトームマッピング", url: "https://pubmed.ncbi.nlm.nih.gov/34909442/", note: "撮像パラメータから解析パイプラインまでを通しで追える手順書です。" }
  ],
  "ch07:t3": [
    { type: "protocol", label: "JoVE: 18F-FDG マイクロPET/CTによるマウス褐色脂肪の機能イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/23207798/", note: "トレーサー投与量、麻酔、集積の定量までの実務条件が確認できます。" },
    { type: "protocol", label: "JoVE: 小動物用高分解能 心臓PET/CT の撮像手順", url: "https://pubmed.ncbi.nlm.nih.gov/36591981/", note: "心電同期を含む撮像設定と再構成条件を具体的に学べます。" }
  ],
  "ch07:t4": [
    { type: "protocol", label: "Bio-protocol: in vivo 生物発光イメージングの基本手順", url: "https://pubmed.ncbi.nlm.nih.gov/34395808/", note: "ルシフェリン投与のタイミングや撮像設定など基本を押さえられます。" },
    { type: "protocol", label: "JoVE: 2種類の基質を使う in vivo 生物発光イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/22006228/", note: "複数のレポーターを同一個体で分けて観察したいときに参照します。" }
  ],
  "ch07:t5": [
    { type: "protocol", label: "JoVE: マウスの経胸壁心エコー検査", url: "https://pubmed.ncbi.nlm.nih.gov/20517201/", note: "麻酔深度や体位、断面の取り方など心機能計測の基本手技が学べます。" },
    { type: "protocol", label: "JoVE: マウスの心エコーと超音波イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/20736912/", note: "Mモードやドプラを含む計測項目と、再現性を保つコツが分かります。" }
  ],
  "ch07:t6": [
    { type: "db", label: "Jackson Laboratory: Cre ポータル（Cre系統リポジトリ）", url: "https://www.jax.org/research-and-faculty/resources/cre-repository", note: "目的組織で発現するCre系統を、発現特異性の報告付きで検索できます。" },
    { type: "db", label: "Addgene: Cre-lox 関連プラスミドコレクション", url: "https://www.addgene.org/collections/cre-lox/", note: "Cre、CreERT2、レポーターなどの入手可能なベクターを探せます。" }
  ],
  "ch07:t7": [
    { type: "protocol", label: "Nature Protocols: DeaLT法による組織幹細胞の遺伝学的系統追跡", url: "https://pubmed.ncbi.nlm.nih.gov/30250288/", note: "二重組換え系で標識の特異性を高める系統追跡の設計が学べます。" },
    { type: "protocol", label: "JoVE: Confetti マウスを用いたクローン系統追跡", url: "https://pubmed.ncbi.nlm.nih.gov/31710038/", note: "多色標識でクローン単位の運命を追う際の投与量設計と観察法です。" },
    { type: "protocol", label: "Nature Protocols: DARLIN マウスによる高効率・高多様性の系統追跡", url: "https://pubmed.ncbi.nlm.nih.gov/40119004/", note: "CRISPRバーコードで系譜を記録する最新手法の実装手順が読めます。" }
  ],
  "ch07:t8": [
    { type: "protocol", label: "Nature Protocols: Advanced CUBIC による全臓器の透明化と細胞プロファイリング", url: "https://pubmed.ncbi.nlm.nih.gov/31748753/", note: "試薬組成と浸漬日程、撮像後の解析までを一貫して確認できます。" },
    { type: "protocol", label: "iDISCO: 全載免疫染色と体積イメージングの公式リソース", url: "https://idisco.info/", note: "有機溶媒系透明化の手順書と抗体の適合リストが公開されています。" },
    { type: "protocol", label: "JoVE: CLARITY法による神経樹状突起のイメージングと定量", url: "https://pubmed.ncbi.nlm.nih.gov/33970138/", note: "ハイドロゲル包埋型の透明化を試すときの装置構成と条件が分かります。" }
  ],
  "ch07:t9": [
    { type: "protocol", label: "Nature Protocols: 樹状突起パッチクランプ記録", url: "https://pubmed.ncbi.nlm.nih.gov/17406407/", note: "微細部位からの記録に必要な電極作製と溶液条件が詳述されています。" },
    { type: "protocol", label: "JoVE: 脳スライスにおけるホールセルパッチクランプ記録", url: "https://pubmed.ncbi.nlm.nih.gov/27341060/", note: "スライス作製からギガシール形成までの基本手技を動画で学べます。" },
    { type: "vendor", label: "Molecular Devices: Axon Guide（電気生理学・生物物理実験の手引き）", url: "https://www.moleculardevices.com/en/assets/ebook/dd/cns/axon-guide-to-electrophysiology-and-biophysics-laboratory-techniques", note: "アンプ設定やノイズ対策など装置側の理論と実務が網羅された定番書です。" }
  ],
  "ch07:t10": [
    { type: "protocol", label: "Nature Protocols: 行動中マウスでの全光学的神経回路操作と記録", url: "https://pubmed.ncbi.nlm.nih.gov/35478249/", note: "覚醒下での二光子イメージングと光刺激を組み合わせる設計が読めます。" },
    { type: "protocol", label: "JoVE: 覚醒マウスにおけるミクログリア動態と神経活動の同時イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/36094267/", note: "頭部固定と窓作製、体動対策など覚醒下観察の実務が確認できます。" },
    { type: "tool", label: "GitHub: UCLA Miniscope v4（小型頭部装着顕微鏡）", url: "https://github.com/Aharoni-Lab/Miniscope-v4", note: "自由行動下カルシウムイメージング用装置の設計図と組立手順が入手できます。" }
  ],
  "ch07:t11": [
    { type: "protocol", label: "Nature Protocols: 光遺伝学による神経回路の操作技術", url: "https://pubmed.ncbi.nlm.nih.gov/20203662/", note: "オプシン選択、ウイルス注入、光ファイバー埋込の基本設計が学べます。" },
    { type: "tool", label: "Deisseroth Lab: 光遺伝学リソースページ", url: "https://web.stanford.edu/group/dlab/optogenetics/", note: "開発元による各種オプシンの特性表と実装上の注意がまとまっています。" },
    { type: "db", label: "Addgene: 光遺伝学プラスミドコレクション", url: "https://www.addgene.org/collections/optogenetics/", note: "ChR2やハロロドプシンなど目的に合うベクターを検索して入手できます。" }
  ],
  "ch07:t12": [
    { type: "db", label: "Addgene: 化学遺伝学（DREADD）プラスミドコレクション", url: "https://www.addgene.org/collections/chemogenetics/", note: "hM3Dq、hM4Diなど代表的なDREADDベクターを一覧で確認できます。" },
    { type: "protocol", label: "STAR Protocols: 化学遺伝学的に操作したマウスの行動試験プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/33899009/", note: "作動薬の投与量とタイミング、対照群の置き方が具体的に分かります。" },
    { type: "protocol", label: "JoVE: DREADD制御された神経活動を非侵襲的に慢性操作する方法", url: "https://pubmed.ncbi.nlm.nih.gov/31498301/", note: "長期投与での実装法と、副作用を避けるための工夫が読めます。" }
  ],
  "ch07:t13": [
    { type: "protocol", label: "JoVE: オープンフィールドによるマウスの活動量と不安様行動の測定", url: "https://pubmed.ncbi.nlm.nih.gov/25742564/", note: "装置寸法、照度、解析ゾーンの取り方など基本条件が確認できます。" },
    { type: "guideline", label: "ARRIVE guidelines: 動物実験の報告ガイドライン", url: "https://arriveguidelines.org/", note: "動物数、無作為化、盲検化など論文に必須の記載項目を確認できます。" }
  ],
  "ch07:t14": [
    { type: "protocol", label: "Nature Protocols: モリス水迷路による空間学習・記憶の評価手順", url: "https://pubmed.ncbi.nlm.nih.gov/17406317/", note: "試行設計、プローブ試験、指標の選び方まで扱う標準的な手順書です。" },
    { type: "protocol", label: "JoVE: アルツハイマー病モデルマウスでのモリス水迷路試験", url: "https://pubmed.ncbi.nlm.nih.gov/21808223/", note: "水温や手がかりの配置など実際の運用条件を動画で確認できます。" }
  ],
  "ch07:t15": [
    { type: "protocol", label: "JoVE: 社会性行動の評価法（3チャンバー試験を含む）", url: "https://pubmed.ncbi.nlm.nih.gov/21403628/", note: "社会性選好と社会的新奇性の2段階をどう組むかが具体的に分かります。" },
    { type: "protocol", label: "Bio-protocol: 光遺伝学的刺激を併用した3チャンバー社会性接近課題", url: "https://pubmed.ncbi.nlm.nih.gov/34532561/", note: "神経操作と行動測定を同時に行う際の手順と対照設定が読めます。" }
  ],
  "ch07:t16": [
    { type: "protocol", label: "JoVE: マウスの運動協調性の測定（ロータロッドほか）", url: "https://pubmed.ncbi.nlm.nih.gov/23748408/", note: "加速プロトコルや訓練日数など、装置の使い方の基本が確認できます。" },
    { type: "protocol", label: "JoVE: バランスビームによる運動バランスと協調性の評価", url: "https://pubmed.ncbi.nlm.nih.gov/21445033/", note: "ロータロッドと組み合わせて運動機能を多面的に見たいときに使います。" }
  ],
  "ch07:t17": [
    { type: "protocol", label: "Bio-protocol: マウスにおける驚愕反応のプレパルス抑制の測定", url: "https://pubmed.ncbi.nlm.nih.gov/34286012/", note: "音圧設定と試行順序、PPI値の算出方法が具体的に書かれています。" },
    { type: "protocol", label: "JoVE: げっ歯類における音驚愕反応の馴化とプレパルス抑制", url: "https://pubmed.ncbi.nlm.nih.gov/21912367/", note: "馴化とPPIを分けて解析する設計と装置校正の要点が学べます。" }
  ]
});
