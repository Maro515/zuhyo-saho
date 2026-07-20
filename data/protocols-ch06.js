/* 第6章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch06:t1": [
    { type: "protocol", label: "Nature Protocols: Skylineを用いたLC-IM-MSリピドミクスデータ解析", url: "https://pubmed.ncbi.nlm.nih.gov/35831612/", note: "液体クロマトとイオンモビリティを含む脂質データの解析手順です。同定作業の参考になります。" },
    { type: "protocol", label: "Nature Protocols: イオンモビリティ質量分析によるメタボロミクスとリピドミクス", url: "https://pubmed.ncbi.nlm.nih.gov/28301461/", note: "試料調製から測定条件までを通した手順書です。脂質分子種の分離を設計するとき開きます。" },
    { type: "db", label: "LIPID MAPS: 脂質構造データベース（LMSD）検索ページ", url: "https://www.lipidmaps.org/databases/lmsd/browse", note: "脂質の命名法と構造情報を検索できます。同定した分子種の確認や表記統一に使います。" }
  ],
  "ch06:t2": [
    { type: "protocol", label: "Bio-protocol: 培養細胞のOCRとECAR測定によるエネルギー代謝評価", url: "https://pubmed.ncbi.nlm.nih.gov/34285967/", note: "播種密度から阻害剤の添加順序までを具体的に記した手順です。初回の立ち上げに向きます。" },
    { type: "protocol", label: "STAR Protocols: マウス褐色脂肪組織と白色脂肪組織のex vivo細胞外フラックス解析", url: "https://pubmed.ncbi.nlm.nih.gov/38850537/", note: "組織片をそのまま測る際の切り出しと固定の手順です。細胞株以外を測るとき参照します。" },
    { type: "protocol", label: "Bio-protocol: スフェロイドなど足場非依存性腫瘍細胞の呼吸測定の最適化", url: "https://pubmed.ncbi.nlm.nih.gov/35340292/", note: "浮遊細胞や三次元培養での測定条件の調整点を示します。接着しない試料で開きます。" }
  ],
  "ch06:t3": [
    { type: "protocol", label: "JoVE: 無麻酔・非拘束マウスの高インスリン正常血糖クランプ", url: "https://pubmed.ncbi.nlm.nih.gov/22126863/", note: "カテーテル留置から採血間隔までを動画つきで解説します。クランプ導入時の標準手順です。" },
    { type: "protocol", label: "JoVE: 意識下マウスにおける高血糖クランプと低血糖クランプ", url: "https://pubmed.ncbi.nlm.nih.gov/38345259/", note: "高血糖側と低血糖側の設定条件を対比して示します。インスリン分泌能の評価に使います。" },
    { type: "db", label: "NIH Mouse Metabolic Phenotyping Centers（MMPC）公式サイト", url: "https://www.mmpc.org/", note: "マウス代謝表現型解析の標準手順と受託サービスの窓口です。条件をそろえたいとき開きます。" }
  ],
  "ch06:t4": [
    { type: "protocol", label: "STAR Protocols: マウスの糖恒常性と膵島機能を評価するプロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/35243368/", note: "絶食条件や投与量を含むGTTとITTの実施手順です。負荷試験を組む際の土台になります。" },
    { type: "protocol", label: "Bio-protocol: 麻酔下インスリン負荷試験による組織特異的糖取り込みの測定", url: "https://pubmed.ncbi.nlm.nih.gov/33654891/", note: "組織ごとの糖取り込みまで踏み込んだITTの手順です。インスリン感受性の局在を見るとき有用です。" },
    { type: "protocol", label: "STAR Protocols: マウスモデルにおける生体内糖代謝評価プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/41205179/", note: "負荷試験の実施と曲線下面積の解析までを一続きに記した新しい手順書です。" }
  ],
  "ch06:t5": [
    { type: "protocol", label: "Nature Protocols: 血清・血漿の大規模代謝プロファイリング（GC-MS／LC-MS）", url: "https://pubmed.ncbi.nlm.nih.gov/21720319/", note: "抽出から品質管理試料の運用までを定めた定番手順です。メタボローム解析の設計に使います。" },
    { type: "protocol", label: "Nature Protocols: 高分解能13C代謝フラックス解析", url: "https://pubmed.ncbi.nlm.nih.gov/31471597/", note: "安定同位体標識から流束推定までの流れを解説します。代謝流束を定量したいとき開きます。" },
    { type: "tool", label: "MetaboAnalyst: メタボロームデータ統計解析Webプラットフォーム", url: "https://www.metaboanalyst.ca/", note: "正規化・多変量解析・パスウェイ濃縮解析をブラウザ上で実行できる公式サイトです。" }
  ],
  "ch06:t6": [
    { type: "protocol", label: "Nature Protocols: FFPE組織からの高質量分解能MALDIイメージング質量分析", url: "https://pubmed.ncbi.nlm.nih.gov/27414759/", note: "薄切からマトリクス塗布までの条件を示します。ホルマリン固定検体を測るとき参照します。" },
    { type: "protocol", label: "Nature Protocols: nano-DESIによる生体組織の高空間分解能質量分析イメージング", url: "https://pubmed.ncbi.nlm.nih.gov/31723300/", note: "前処理の少ない大気圧イオン化での撮像手順です。代謝物の分布を高分解能で見るとき有用です。" },
    { type: "db", label: "METASPACE: 空間メタボロミクスのアノテーション・共有プラットフォーム", url: "https://metaspace2020.org/", note: "イメージング質量分析データの代謝物同定と公開データ閲覧ができるサイトです。" }
  ],
  "ch06:t7": [
    { type: "guideline", label: "Nature Metabolism: 前臨床間接熱量測定に関するコンセンサスガイド", url: "https://pubmed.ncbi.nlm.nih.gov/40993210/", note: "体重補正や共分散分析の扱いなど解析上の合意事項をまとめます。解釈の落とし穴を防げます。" },
    { type: "tool", label: "CalR: 間接熱量測定データ解析用Webアプリケーション", url: "https://calrapp.org/", note: "代謝ケージの出力を読み込み、共分散分析つきの図を自動生成します。解析の標準化に使えます。" },
    { type: "vendor", label: "Sable Systems International: 代謝測定システム公式サイト", url: "https://www.sablesys.com/", note: "呼気ガス分析装置の測定原理と仕様を確認できます。装置構成を検討するとき開きます。" }
  ],
  "ch06:t8": [
    { type: "protocol", label: "Nature Protocols: マウスにおける寒冷誘導性の褐色脂肪活性化と脂肪組織血管新生", url: "https://pubmed.ncbi.nlm.nih.gov/22383039/", note: "寒冷曝露の温度と期間の設定を具体的に示します。寒冷刺激試験の条件設定に使います。" },
    { type: "protocol", label: "STAR Protocols: 寒冷曝露とCL316,243投与によるベージュ脂肪細胞誘導プロトコル", url: "https://pubmed.ncbi.nlm.nih.gov/39817914/", note: "寒冷刺激と薬理刺激を対比した誘導手順です。体温測定と組織回収の段取りが分かります。" }
  ]
});
