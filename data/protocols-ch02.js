/* 第2章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch02:t1": [
    { type: "protocol", label: "BMC Molecular Biology: RIN（RNA integrity number）の原著論文", url: "https://pubmed.ncbi.nlm.nih.gov/16448564/", note: "電気泳動波形からRIN値を算出する仕組みを解説した原著です。数値の意味を確かめたいときに開きます。" },
    { type: "vendor", label: "Thermo Fisher: 核酸の定量と品質評価の技術情報", url: "https://www.thermofisher.com/jp/ja/home/life-science/dna-rna-purification-analysis/nucleic-acid-quantitation.html", note: "吸光度や蛍光法による核酸の定量と純度評価をまとめた入口ページです。品質判定の前に確認します。" }
  ],
  "ch02:t2": [
    { type: "protocol", label: "Cold Spring Harbor Protocols: アガロースゲル電気泳動", url: "https://pubmed.ncbi.nlm.nih.gov/30602560/", note: "ゲル濃度や泳動バッファの選び方を含む標準手順です。条件を決めるときの基準になります。" },
    { type: "protocol", label: "Cold Spring Harbor Protocols: アガロースゲル電気泳動によるDNA解析", url: "https://pubmed.ncbi.nlm.nih.gov/30602561/", note: "分子量マーカーとの比較やバンド判定の考え方を扱います。結果の読み方に迷ったときに有用です。" },
    { type: "vendor", label: "Thermo Fisher: 核酸のゲル電気泳動 技術情報", url: "https://www.thermofisher.com/jp/ja/home/life-science/dna-rna-purification-analysis/nucleic-acid-gel-electrophoresis.html", note: "試薬・染色色素・マーカーの選択肢を一覧できます。実験を組み立てる段階で参照します。" }
  ],
  "ch02:t3": [
    { type: "protocol", label: "Nature Protocols: サザンブロッティング", url: "https://pubmed.ncbi.nlm.nih.gov/17406277/", note: "制限酵素処理から転写・ハイブリダイゼーションまでの全工程を記載した定番手順です。" },
    { type: "protocol", label: "Cold Spring Harbor Protocols: サザンブロッティング（2021年版）", url: "https://pubmed.ncbi.nlm.nih.gov/34210769/", note: "非放射性検出を含む現行の手順です。プローブ標識法を選び直すときに参考になります。" },
    { type: "protocol", label: "Nature Protocols: ノーザンブロットによるRNAの検出と定量", url: "https://pubmed.ncbi.nlm.nih.gov/19131955/", note: "変性ゲルでのRNA分離から定量までを解説します。ノーザンの定量性を確認したいときに開きます。" }
  ],
  "ch02:t4": [
    { type: "vendor", label: "QIAGEN: PCRガイド（Guide to PCR）", url: "https://www.qiagen.com/us/knowledge-and-support/knowledge-hub/bench-guide/pcr", note: "プライマー設計・アニーリング温度・酵素選択の基礎をまとめた実務ガイドです。" },
    { type: "vendor", label: "Thermo Fisher: 逆転写反応の技術情報", url: "https://www.thermofisher.com/jp/ja/home/life-science/pcr/reverse-transcription.html", note: "逆転写酵素とプライミング法の違いを整理しています。RT-PCRの条件を決めるときに使います。" },
    { type: "vendor", label: "Thermo Fisher: PCR技術の総合ページ", url: "https://www.thermofisher.com/jp/ja/home/life-science/pcr.html", note: "通常PCRから各種応用までの技術資料の入口です。手法全体を俯瞰したいときに便利です。" }
  ],
  "ch02:t5": [
    { type: "guideline", label: "MIQEガイドライン: qPCR実験の報告最低要件（Clinical Chemistry 2009）", url: "https://pubmed.ncbi.nlm.nih.gov/19246619/", note: "qPCRの論文に何を書くべきかを定めた国際基準です。論文の妥当性を判断する物差しになります。" },
    { type: "vendor", label: "Thermo Fisher: リアルタイムPCRラーニングセンター", url: "https://www.thermofisher.com/jp/ja/home/life-science/pcr/real-time-pcr/real-time-pcr-learning-center.html", note: "増幅曲線・Cq値・検量線の基礎から解析まで段階的に学べる教材群です。" },
    { type: "vendor", label: "Takara Bio: リアルタイムPCRの原理と概要", url: "https://www.takarabio.com/learning-centers/real-time-pcr/overview", note: "インターカレーター法とプローブ法の違いを簡潔に整理しています。手法選択の際に読みます。" }
  ],
  "ch02:t6": [
    { type: "guideline", label: "dMIQEガイドライン2020: デジタルPCR実験の報告基準", url: "https://pubmed.ncbi.nlm.nih.gov/32746458/", note: "デジタルPCRの報告に必須の項目を定めた改訂版です。絶対定量値の信頼性評価に使えます。" },
    { type: "vendor", label: "Thermo Fisher: デジタルPCRの技術情報", url: "https://www.thermofisher.com/jp/ja/home/life-science/pcr/digital-pcr.html", note: "区画化による絶対定量の原理と装置の考え方をまとめています。導入検討時に参照します。" },
    { type: "protocol", label: "Methods: ddPCRおよびRT-ddPCRの実践プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/32721466/", note: "液滴生成から解析までの再現性の高い手順です。実際に条件を組む段階で役立ちます。" }
  ],
  "ch02:t7": [
    { type: "protocol", label: "Nature Protocols: 酸化バイサルファイトシークエンス（oxBS-seq）", url: "https://pubmed.ncbi.nlm.nih.gov/24008380/", note: "5mCと5hmCを区別して定量する手順です。メチル化の解釈を厳密にしたいときに開きます。" },
    { type: "protocol", label: "Methods in Molecular Biology: バイサルファイトパイロシークエンス法", url: "https://pubmed.ncbi.nlm.nih.gov/36173562/", note: "特定領域のメチル化率を定量する実務手順です。標的領域を絞った解析に向きます。" },
    { type: "vendor", label: "Zymo Research: DNAのバイサルファイト変換の技術解説", url: "https://www.zymoresearch.com/pages/bisulfite-conversion", note: "変換効率とDNA分解のトレードオフを解説しています。前処理条件を決めるときに使います。" }
  ],
  "ch02:t8": [
    { type: "protocol", label: "Methods in Molecular Biology: 核型解析（カリオタイピング）の手法", url: "https://pubmed.ncbi.nlm.nih.gov/25287340/", note: "分裂中期像の作製からG分染・判定までの流れを解説します。細胞株の品質確認にも使えます。" },
    { type: "protocol", label: "Methods in Molecular Biology: がん細胞株の細胞遺伝学的解析", url: "https://pubmed.ncbi.nlm.nih.gov/21516398/", note: "複雑核型の読み方と記載のコツを扱います。異常が多い検体を判定するときに参考になります。" },
    { type: "guideline", label: "Methods in Molecular Biology: 細胞遺伝学の命名法と report の書き方", url: "https://pubmed.ncbi.nlm.nih.gov/27910032/", note: "ISCNに基づく核型表記のルールを解説します。論文の核型記載を読み解く際に有用です。" }
  ],
  "ch02:t9": [
    { type: "protocol", label: "Nature Protocols: RASER-FISH（非変性条件でのDNA-FISH）", url: "https://pubmed.ncbi.nlm.nih.gov/35379945/", note: "熱変性を避けて三次元クロマチン構造を保つ手法です。核内配置を見たいときに選びます。" },
    { type: "protocol", label: "Nature Protocols: 染色体ペインティング（cross-species chromosome painting）", url: "https://pubmed.ncbi.nlm.nih.gov/17406308/", note: "染色体全体を色分けするプローブの作製と適用法です。転座の全体像把握に向きます。" },
    { type: "protocol", label: "Nature Protocols: ORCAによるDNA経路とRNAプロファイルの追跡", url: "https://pubmed.ncbi.nlm.nih.gov/33619390/", note: "オリゴプローブでゲノム領域を高解像度に可視化します。染色体の折りたたみ解析に使います。" }
  ],
  "ch02:t10": [
    { type: "protocol", label: "Methods in Molecular Biology: 間期核の多色3D-FISH", url: "https://pubmed.ncbi.nlm.nih.gov/18951171/", note: "核構造を保ったまま複数領域を同時に描出する手順です。核内配置の定量に適します。" },
    { type: "protocol", label: "Methods in Molecular Biology: 定量的FISH（Q-FISH）", url: "https://pubmed.ncbi.nlm.nih.gov/27910021/", note: "蛍光強度からコピー数やテロメア長を定量する方法です。数値化したいときに開きます。" },
    { type: "protocol", label: "Methods in Molecular Biology: 多発性骨髄腫におけるFISH検査", url: "https://pubmed.ncbi.nlm.nih.gov/29797252/", note: "臨床検体での間期核FISHの実際とカットオフ設定を扱います。診断的な読み方の参考になります。" }
  ],
  "ch02:t11": [
    { type: "protocol", label: "Nature Methods: 複数の単標識プローブによる単一mRNA分子の可視化（smFISH原著）", url: "https://pubmed.ncbi.nlm.nih.gov/18806792/", note: "smFISHの原理を確立した論文です。1分子スポットの定量的な解釈の出発点になります。" },
    { type: "protocol", label: "Nature Protocols: HT-smFISH（高スループットな1分子RNAイメージング）", url: "https://pubmed.ncbi.nlm.nih.gov/36280749/", note: "低コストで多数の遺伝子を扱えるワークフローです。スクリーニング規模の実験に向きます。" },
    { type: "protocol", label: "Nature Protocols: ショウジョウバエ胚におけるsmFISHによるmRNA定量", url: "https://pubmed.ncbi.nlm.nih.gov/28594816/", note: "組織標本でのプローブ設計と画像定量の手順を詳述します。定量条件の設計に役立ちます。" }
  ],
  "ch02:t12": [
    { type: "vendor", label: "Promega: レポーターアッセイ製品と原理の解説", url: "https://www.promega.jp/products/luciferase-assays/reporter-assays/", note: "ホタルとウミシイタケの二重測定など基本設計を整理しています。系を組むときに参照します。" },
    { type: "vendor", label: "Promega: 生物発光レポーターの技術ガイド", url: "https://www.promega.com/resources/guides/cell-biology/bioluminescent-reporters/", note: "各種ルシフェラーゼの特性と内部標準の考え方を詳述したガイドです。" },
    { type: "protocol", label: "Cold Spring Harbor Protocols: ルシフェラーゼアッセイ", url: "https://pubmed.ncbi.nlm.nih.gov/20439408/", note: "細胞溶解から発光測定までの標準手順です。データの規格化の考え方も確認できます。" }
  ],
  "ch02:t13": [
    { type: "protocol", label: "Nature Protocols: EMSAによるタンパク質と核酸の相互作用検出", url: "https://pubmed.ncbi.nlm.nih.gov/17703195/", note: "プローブ標識・結合反応・非変性ゲル泳動の全工程を扱う定番手順です。" },
    { type: "protocol", label: "Methods in Molecular Biology: ゲルシフトアッセイの実践", url: "https://pubmed.ncbi.nlm.nih.gov/26194709/", note: "競合実験やスーパーシフトによる特異性確認の組み方を解説します。対照の設計に役立ちます。" }
  ]
});
