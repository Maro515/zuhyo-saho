/* 第5章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch05:t1": [
    { type: "vendor", label: "Thermo Fisher: タンパク質電気泳動の基礎ガイド", url: "https://www.thermofisher.com/jp/ja/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/overview-electrophoresis.html", note: "SDS-PAGEとネイティブPAGEの原理、ゲル濃度の選び方が一通りまとまっています。" },
    { type: "vendor", label: "Thermo Fisher: タンパク質ゲル染色法の比較", url: "https://www.thermofisher.com/jp/ja/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/protein-gel-stains.html", note: "CBB・銀染色・蛍光色素の感度と定量性を比べたいときに開きます。" }
  ],
  "ch05:t2": [
    { type: "vendor", label: "Thermo Fisher: ウエスタンブロッティング総論", url: "https://www.thermofisher.com/jp/ja/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/overview-western-blotting.html", note: "転写から検出までの全工程と、よくある失敗の原因が整理されています。" },
    { type: "vendor", label: "Thermo Fisher: ウエスタンブロット転写法の選択", url: "https://www.thermofisher.com/jp/ja/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/western-blot-transfer-methods.html", note: "ウェット・セミドライ・膜の種類を条件に応じて選ぶときの指針です。" },
    { type: "guideline", label: "Nature Methods: 抗体の妥当性確認に関する国際提言", url: "https://pubmed.ncbi.nlm.nih.gov/27595404/", note: "抗体の特異性を用途別にどう検証すべきかを示した国際的な提言です。" }
  ],
  "ch05:t3": [
    { type: "vendor", label: "Cytiva: 二次元電気泳動の原理と実際", url: "https://www.cytivalifesciences.com/ja/jp/insights/2-d-electrophoresis", note: "等電点電気泳動と二次元目のSDS-PAGEの流れを図付きで解説しています。" },
    { type: "protocol", label: "Nature Protocols: 二次元ゲル電気泳動の実践手順", url: "https://pubmed.ncbi.nlm.nih.gov/17406312/", note: "プロテオミクスの基幹技術としての2D-PAGEを手順ごとに説明しています。" }
  ],
  "ch05:t4": [
    { type: "protocol", label: "STAR Protocols: 生細胞FRETイメージングの手順", url: "https://pubmed.ncbi.nlm.nih.gov/33377041/", note: "生細胞でFRETを撮影し補正・定量するまでを具体的に示した手順書です。" },
    { type: "protocol", label: "STAR Protocols: 定量的FRETによる結合親和性と化学量論の算出", url: "https://pubmed.ncbi.nlm.nih.gov/37516972/", note: "画像から相互作用の親和性や結合比まで求めたいときに参照します。" }
  ],
  "ch05:t5": [
    { type: "protocol", label: "Bio-protocol: シクロヘキシミドチェイスによる半減期測定", url: "https://pubmed.ncbi.nlm.nih.gov/37323633/", note: "翻訳阻害後の残存量から半減期を求める定番手順を細かく解説します。" },
    { type: "protocol", label: "STAR Protocols: 重水標識による培養細胞のタンパク質半減期測定", url: "https://pubmed.ncbi.nlm.nih.gov/41818233/", note: "阻害剤を使わず代謝標識で半減期を測りたいときの手順書です。" }
  ],
  "ch05:t6": [
    { type: "protocol", label: "STAR Protocols: 内在性・外来性タンパク質のユビキチン化検出", url: "https://pubmed.ncbi.nlm.nih.gov/37858474/", note: "変性条件での免疫沈降を含む、実務的なユビキチン化検出手順です。" },
    { type: "protocol", label: "Bio-protocol: 試験管内ユビキチン化アッセイ", url: "https://pubmed.ncbi.nlm.nih.gov/35530525/", note: "E1・E2・E3を再構成して自己修飾と基質修飾を見る手順を示します。" },
    { type: "protocol", label: "Nature Protocols: 質量分析によるユビキチン化部位の大規模同定", url: "https://pubmed.ncbi.nlm.nih.gov/24051958/", note: "ジグリシン残基抗体で濃縮し修飾部位を網羅的に同定する方法です。" }
  ],
  "ch05:t7": [
    { type: "protocol", label: "Bio-protocol: 哺乳類細胞でのAIDタグ導入法", url: "https://pubmed.ncbi.nlm.nih.gov/38268977/", note: "標的にデグロンを付けオーキシンで分解を制御する構築手順です。" },
    { type: "protocol", label: "STAR Protocols: AIDノックイン細胞株の作製", url: "https://pubmed.ncbi.nlm.nih.gov/34849487/", note: "ゲノム編集で内在性遺伝子にAIDを入れる際の設計と選抜を扱います。" }
  ],
  "ch05:t8": [
    { type: "protocol", label: "STAR Protocols: TR-FRETによる分解誘導薬の生化学・細胞評価", url: "https://pubmed.ncbi.nlm.nih.gov/38857155/", note: "三者複合体形成や分解効率を定量する一連の評価系をまとめています。" },
    { type: "protocol", label: "STAR Protocols: 標的タンパク質分解のための細胞内抗体選抜", url: "https://pubmed.ncbi.nlm.nih.gov/33437969/", note: "分解誘導系を組むときの標的認識モジュール選抜の考え方が分かります。" }
  ],
  "ch05:t9": [
    { type: "vendor", label: "MBLライフサイエンス: Fluoppi 相互作用解析ツール", url: "https://ruo.mbl.co.jp/bio/product/flprotein/fluoppi.html", note: "相互作用を輝点として見る原理と、使うベクターの構成が分かります。" },
    { type: "vendor", label: "MBLライフサイエンス: Fluoppi 開発者インタビュー", url: "https://ruo.mbl.co.jp/bio/product/flprotein/special-talk/fluoppi.html", note: "輝点形成の仕組みと適用範囲を、開発の経緯から解説しています。" }
  ],
  "ch05:t10": [
    { type: "protocol", label: "Nature Protocols: BiFCアッセイの設計と実施", url: "https://pubmed.ncbi.nlm.nih.gov/17406412/", note: "断片の分割位置や対照実験の置き方など、BiFCの基本設計を示します。" },
    { type: "protocol", label: "Bio-protocol: 生体内でのBiFCによる相互作用可視化", url: "https://pubmed.ncbi.nlm.nih.gov/27390756/", note: "実際の細胞で輝度を評価するまでの操作を段階的に説明しています。" },
    { type: "protocol", label: "Nature Protocols: 分割GFPによるオルガネラ接触部位の定量", url: "https://pubmed.ncbi.nlm.nih.gov/34686857/", note: "SplitGFPを距離センサーとして使う応用例の詳しい手順書です。" }
  ],
  "ch05:t11": [
    { type: "protocol", label: "Nature Protocols: TurboID・split-TurboIDによる近位ビオチン化", url: "https://pubmed.ncbi.nlm.nih.gov/33139955/", note: "標識時間や対照設定など、近接標識の実験計画に必要な情報が揃います。" },
    { type: "protocol", label: "Nature Protocols: AP-MSとネットワーク解析", url: "https://pubmed.ncbi.nlm.nih.gov/25275790/", note: "免疫沈降と質量分析から相互作用ネットワークを描くまでを扱います。" },
    { type: "db", label: "Addgene: TurboIDプラスミド（Ting研寄託）", url: "https://www.addgene.org/107177/", note: "近接標識酵素の配列と入手先を確認したいときに開きます。" }
  ],
  "ch05:t12": [
    { type: "vendor", label: "Thermo Fisher: ELISAの原理と種類", url: "https://www.thermofisher.com/jp/ja/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/overview-elisa.html", note: "直接法・サンドイッチ法・競合法の違いと使い分けが整理されています。" },
    { type: "vendor", label: "Thermo Fisher: ELISA系の立ち上げと条件最適化", url: "https://www.thermofisher.com/jp/ja/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/elisa-development-optimization.html", note: "抗体濃度やブロッキングを詰めて検量線を安定させたいときに使います。" }
  ],
  "ch05:t13": [
    { type: "vendor", label: "Thermo Fisher: 免疫沈降の基礎ガイド", url: "https://www.thermofisher.com/jp/ja/home/life-science/protein-biology/protein-biology-learning-center/protein-biology-resource-library/pierce-protein-methods/immunoprecipitation-ip.html", note: "ビーズ選択、洗浄条件、非特異吸着対策の考え方がまとまっています。" },
    { type: "protocol", label: "STAR Protocols: RNA結合タンパク質のRIP手順", url: "https://pubmed.ncbi.nlm.nih.gov/35634357/", note: "核と細胞質を分けて結合RNAを回収する実践的なRIPの手順です。" },
    { type: "protocol", label: "Bio-protocol: RIPによる結合特異性の検証", url: "https://pubmed.ncbi.nlm.nih.gov/34532532/", note: "特定mRNAへの結合が本物かを対照込みで確かめる方法を示します。" }
  ],
  "ch05:t14": [
    { type: "vendor", label: "Takara Bio: Matchmaker Gold 酵母ツーハイブリッド系", url: "https://www.takarabio.com/products/protein-research/two-hybrid-and-one-hybrid-systems/yeast-two-hybrid-system/matchmaker-gold-yeast-two-hybrid-system", note: "ベイト・プレイベクターとレポーター株の構成が確認できます。" },
    { type: "vendor", label: "Takara Bio: Y2Hラーニングセンター", url: "https://www.takarabio.com/learning-centers/protein-research/matchmaker-gold-yeast-two-hybrid-systems", note: "自己活性化の確認など、Y2Hで必須の対照実験が解説されています。" },
    { type: "protocol", label: "Bio-protocol: 膜タンパク質複合体向け膜結合型Y2H", url: "https://pubmed.ncbi.nlm.nih.gov/40873472/", note: "核内で働かない膜タンパク質の相互作用を見たいときの改良法です。" }
  ],
  "ch05:t15": [
    { type: "vendor", label: "Cytiva: ゲル濾過クロマトグラフィーの解説", url: "https://www.cytivalifesciences.com/ja/jp/insights/size-exclusion-chromatography", note: "分子量分離の原理と担体・流速の選び方がまとまっています。" },
    { type: "vendor", label: "Cytiva: イオン交換クロマトグラフィーの解説", url: "https://www.cytivalifesciences.com/ja/jp/insights/ion-exchange-chromatography", note: "pHと塩濃度勾配の設計を考えるときの基本資料です。" },
    { type: "vendor", label: "Cytiva: 精製ハンドブック一覧", url: "https://www.cytivalifesciences.com/ja/jp/support/handbooks", note: "各精製モードの定番ハンドブックをまとめて入手できる入口です。" }
  ],
  "ch05:t16": [
    { type: "protocol", label: "Nature Protocols: MaxQuantによるショットガンプロテオミクス解析", url: "https://pubmed.ncbi.nlm.nih.gov/27809316/", note: "生データから同定・定量までの解析設定を具体的に説明しています。" },
    { type: "protocol", label: "Nature Protocols: SP3法によるサンプル前処理", url: "https://pubmed.ncbi.nlm.nih.gov/30464214/", note: "磁気ビーズで界面活性剤を除きペプチド化する汎用前処理法です。" },
    { type: "db", label: "PRIDE: プロテオミクスデータの公的リポジトリ", url: "https://www.ebi.ac.uk/pride/", note: "論文の生データを取り寄せたり自分のデータを登録するときに使います。" }
  ],
  "ch05:t17": [
    { type: "tool", label: "Skyline: ターゲット定量解析のチュートリアル集", url: "https://skyline.ms/wiki/home/software/Skyline/page.view?name=tutorials", note: "SRM/MRMのトランジション設計とピーク検証を実習形式で学べます。" },
    { type: "protocol", label: "Nature Protocols: DIAデータのSkyline解析", url: "https://pubmed.ncbi.nlm.nih.gov/25996789/", note: "データ非依存取得のペプチド定量をSkylineで進める手順です。" },
    { type: "protocol", label: "Nature Protocols: SWATH解析用アッセイライブラリの構築", url: "https://pubmed.ncbi.nlm.nih.gov/25675208/", note: "測定対象ペプチドのライブラリを高品質に作る要点がまとまっています。" }
  ],
  "ch05:t18": [
    { type: "protocol", label: "Bio-protocol: AlphaScreenによる結合アッセイ", url: "https://pubmed.ncbi.nlm.nih.gov/33654964/", note: "ドナー・アクセプタービーズの設計と発光読み取りの条件が分かります。" }
  ],
  "ch05:t19": [
    { type: "vendor", label: "Olink: 近接伸長アッセイ（PEA）の技術解説", url: "https://olink.com/technology/what-is-pea", note: "抗体対とDNAバーコードで多項目を同時定量する原理が分かります。" },
    { type: "protocol", label: "Molecular and Cellular Proteomics: 次世代シーケンサー併用PEAの検証", url: "https://pubmed.ncbi.nlm.nih.gov/34715355/", note: "数千項目規模のPEAで検出感度と再現性をどう担保するかを示します。" }
  ],
  "ch05:t20": [
    { type: "db", label: "RCSB PDB: タンパク質立体構造データバンク", url: "https://www.rcsb.org/", note: "論文中の構造をIDから引き、座標や実験条件を確認できます。" },
    { type: "db", label: "RCSB PDB: 構造の品質評価ガイド", url: "https://www.rcsb.org/docs/general-help/assessing-the-quality-of-3d-structures", note: "分解能やR値、検証レポートの読み方を確かめたいときに開きます。" },
    { type: "protocol", label: "STAR Protocols: 高分解能X線解析用の共結晶調製", url: "https://pubmed.ncbi.nlm.nih.gov/33718889/", note: "リガンド複合体の結晶化条件を詰める実際の流れが分かります。" }
  ],
  "ch05:t21": [
    { type: "protocol", label: "Nature Protocols: クライオEMのデータ収集と逐次処理", url: "https://pubmed.ncbi.nlm.nih.gov/30487656/", note: "高分解能単粒子解析に向けた撮影条件と現場での品質判断を扱います。" },
    { type: "tool", label: "RELION: 単粒子解析ソフトウェア公式ドキュメント", url: "https://relion.readthedocs.io/en/release-5.0/", note: "粒子選抜から三次元分類・精密化までの操作手順が載っています。" },
    { type: "db", label: "EMDB: 電子顕微鏡マップのデータバンク", url: "https://www.ebi.ac.uk/emdb/", note: "公開された密度マップと分解能・処理履歴を確認できます。" }
  ],
  "ch05:t22": [
    { type: "db", label: "BMRB: 生体高分子NMRデータバンク", url: "https://bmrb.io/", note: "化学シフトや緩和データなど、公開NMRデータを検索できます。" },
    { type: "protocol", label: "STAR Protocols: 溶液NMRによる薬剤結合部位の同定", url: "https://pubmed.ncbi.nlm.nih.gov/36595882/", note: "化学シフト摂動から結合面を絞り込む実験と解析の手順です。" },
    { type: "protocol", label: "Nature Protocols: 19F-NMRによるフラグメントスクリーニング", url: "https://pubmed.ncbi.nlm.nih.gov/27414758/", note: "低親和性リガンドの検出と親和性定量に使う方法をまとめています。" }
  ],
  "ch05:t23": [
    { type: "vendor", label: "Cytiva: SPR・ラベルフリー相互作用解析（Biacore）", url: "https://www.cytivalifesciences.com/en/us/products/category/protein-analysis/spr-label-free-analysis", note: "装置構成とセンサーチップの選び方、応用例が確認できます。" },
    { type: "protocol", label: "Bio-protocol: SPRによる結合特異性の評価", url: "https://pubmed.ncbi.nlm.nih.gov/33659346/", note: "固定化と再生条件の詰め方を含む、実践的なSPR測定の手順です。" },
    { type: "protocol", label: "Bio-protocol: OpenSPRを用いた結合親和性の測定", url: "https://pubmed.ncbi.nlm.nih.gov/37719081/", note: "結合速度定数と解離定数を求めるまでの解析手順が分かります。" }
  ],
  "ch05:t24": [
    { type: "vendor", label: "Malvern Panalytical: MicroCal 等温滴定型カロリメーター", url: "https://www.malvernpanalytical.com/en/products/product-range/microcal-range", note: "装置仕様と測定でわかる熱力学パラメータの概要が確認できます。" },
    { type: "protocol", label: "Nature Protocols: ITCデータの統合的な解析法", url: "https://pubmed.ncbi.nlm.nih.gov/27055097/", note: "複数実験をまとめて当てはめ、パラメータの信頼区間を出す方法です。" },
    { type: "protocol", label: "Nature Protocols: 高親和性リガンドのITC測定", url: "https://pubmed.ncbi.nlm.nih.gov/17406231/", note: "測定限界を超える強い結合を競合法で求めたいときに参照します。" }
  ],
  "ch05:t25": [
    { type: "vendor", label: "富士フイルム和光純薬: Phos-tag アクリルアミド", url: "https://labchem-wako.fujifilm.com/jp/category/00899.html", note: "ゲル作製時の添加量や金属イオンの選択など製品情報が確認できます。" },
    { type: "protocol", label: "Nature Protocols: Phos-tag SDS-PAGEによるリン酸化タンパク質の分離", url: "https://pubmed.ncbi.nlm.nih.gov/19798084/", note: "開発者による基本手順で、大きなタンパク質を分離する要点も扱います。" },
    { type: "protocol", label: "STAR Protocols: Phos-tagゲルでのリン酸化状態の解析", url: "https://pubmed.ncbi.nlm.nih.gov/38319785/", note: "泳動から転写・検出までの条件設定を具体的に示した手順書です。" }
  ],
  "ch05:t26": [
    { type: "protocol", label: "Bio-protocol: ヘリカーゼアッセイの基本手順", url: "https://pubmed.ncbi.nlm.nih.gov/27390763/", note: "二本鎖基質の調製から巻き戻し活性の検出までを解説しています。" },
    { type: "protocol", label: "Bio-protocol: RNA鎖置換法によるヘリカーゼ活性測定", url: "https://pubmed.ncbi.nlm.nih.gov/34541209/", note: "RNAヘリカーゼの活性を蛍光や電気泳動で追う具体的な条件が分かります。" }
  ],
  "ch05:t27": [
    { type: "protocol", label: "Bio-protocol: 少量ショ糖密度勾配によるポリソームプロファイリング", url: "https://pubmed.ncbi.nlm.nih.gov/36968436/", note: "勾配の作製から分画・吸光プロファイル取得までを扱っています。" },
    { type: "protocol", label: "Bio-protocol: 組織からのポリソームプロファイリング", url: "https://pubmed.ncbi.nlm.nih.gov/37323635/", note: "動物組織を使うときの溶解条件やRNase対策が具体的に分かります。" },
    { type: "protocol", label: "Bio-protocol: 蛍光標識を用いたポリソームプロファイリング", url: "https://pubmed.ncbi.nlm.nih.gov/33659402/", note: "特定mRNAの翻訳状態を分画ごとに追いたいときの応用手順です。" }
  ],
  "ch05:t28": [
    { type: "protocol", label: "Bio-protocol: 生きた細胞の高速AFM観察", url: "https://pubmed.ncbi.nlm.nih.gov/35592604/", note: "試料固定と走査条件を含め、動きを捉える実際の設定が分かります。" },
    { type: "protocol", label: "STAR Protocols: 高速AFM用の試料固定化法", url: "https://pubmed.ncbi.nlm.nih.gov/38043055/", note: "基板への向き付けが観察の成否を決める点と、その手順を扱います。" }
  ],
});
