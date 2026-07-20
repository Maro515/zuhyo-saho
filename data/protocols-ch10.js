/* 第10章 プロトコル・技術資料リンク（全URL到達確認済み） */
window.PROTOCOLS = Object.assign(window.PROTOCOLS || {}, {
  "ch10:t1": [
    { type: "tool", label: "CRAN: survival パッケージ（生存時間解析の標準実装）", url: "https://cran.r-project.org/package=survival", note: "Kaplan-Meier推定やlog-rank検定、Cox回帰をRで実行するときの本家パッケージです。" },
    { type: "tool", label: "CRAN: survminer パッケージ（生存曲線の作図）", url: "https://cran.r-project.org/package=survminer", note: "リスクテーブル付きの生存曲線を整った体裁で描きたいときに開きます。" },
    { type: "tool", label: "CRAN: survival パッケージ公式ビネット（PDF）", url: "https://cran.r-project.org/web/packages/survival/vignettes/survival.pdf", note: "打ち切りの扱いや推定量の定義まで踏み込んだ、著者本人による解説書です。" }
  ],
  "ch10:t2": [
    { type: "tool", label: "CRAN: pROC パッケージ（ROC曲線とAUCの検定）", url: "https://cran.r-project.org/package=pROC", note: "AUCの信頼区間や2曲線の比較検定まで行える、ROC解析の定番パッケージです。" },
    { type: "tool", label: "scikit-learn: ROC曲線の描画サンプルコード", url: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_roc.html", note: "PythonでROC曲線とAUCを計算・作図する手順が、実行可能なコードで示されます。" },
    { type: "guideline", label: "EQUATOR Network: STARD（診断精度研究の報告基準）", url: "https://resources.equator-network.org/reporting-guidelines/stard/", note: "感度・特異度やROCを報告する診断精度研究で、記載漏れを点検する際に使います。" }
  ],
  "ch10:t3": [
    { type: "guideline", label: "EQUATOR Network: 報告ガイドライン横断検索", url: "https://resources.equator-network.org/reporting-guidelines/", note: "研究デザイン別の報告ガイドラインを網羅的に探せる、事実上の総本山です。" },
    { type: "guideline", label: "STROBE声明（観察研究の報告基準）", url: "https://www.strobe-statement.org/", note: "交絡調整の方法や多変量モデルの記載事項を確認したいときに開きます。" },
    { type: "guideline", label: "TRIPOD声明（予測モデル研究の報告基準）", url: "https://www.tripod-statement.org/", note: "多変量回帰で予測モデルを作った研究を、読む側・書く側で点検できます。" }
  ],
  "ch10:t4": [
    { type: "guideline", label: "PRISMA 2020声明（系統的レビューの報告基準）", url: "https://www.prisma-statement.org/prisma-2020", note: "文献選択のフロー図やチェックリストの原本を入手できる公式ページです。" },
    { type: "guideline", label: "Cochrane Handbook（介入研究レビューの標準手順書）", url: "https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current", note: "効果指標の選択や異質性の評価など、統合解析の実務を章立てで解説します。" },
    { type: "tool", label: "CRAN: metafor パッケージ（メタアナリシス実装）", url: "https://cran.r-project.org/package=metafor", note: "ランダム効果モデルの当てはめとフォレストプロット作成をRで行えます。" }
  ],
  "ch10:t5": [
    { type: "guideline", label: "PRISMA-NMA拡張（ネットワークメタアナリシスの報告基準）", url: "https://pubmed.ncbi.nlm.nih.gov/26030634/", note: "ネットワーク図や一貫性評価の報告項目を定めた、拡張版チェックリストの原著です。" },
    { type: "guideline", label: "PRISMA公式: 各種拡張版の一覧", url: "https://www.prisma-statement.org/extensions", note: "NMAや個別患者データなど、目的に合う拡張版を選ぶときの入口になります。" },
    { type: "tool", label: "CRAN: netmeta パッケージ（頻度論的NMA実装）", url: "https://cran.r-project.org/package=netmeta", note: "ネットワークメタアナリシスの推定と一貫性検定をRで実行できます。" }
  ],
  "ch10:t6": [
    { type: "tool", label: "CRAN: swimplot パッケージ（スイマープロット作図）", url: "https://cran.r-project.org/package=swimplot", note: "患者ごとの治療期間や奏効イベントを帯で並べた図をRで描けます。" },
    { type: "guideline", label: "RECIST公式サイト（EORTC）", url: "https://recist.eortc.org/", note: "図に載せる奏効・増悪イベントの定義を、判定基準の原典で確認できます。" }
  ],
  "ch10:t7": [
    { type: "guideline", label: "RECIST 1.1（固形がんの効果判定基準・原著）", url: "https://pubmed.ncbi.nlm.nih.gov/19097774/", note: "ウォーターフォールの縦軸である腫瘍径変化率の測り方と閾値が定義されています。" },
    { type: "guideline", label: "RECIST公式サイト（EORTC）", url: "https://recist.eortc.org/", note: "標的病変の選び方や版ごとの改訂点を、公式の解説から確認できます。" },
    { type: "tool", label: "CRAN: waterfalls パッケージ（ウォーターフォール作図）", url: "https://cran.r-project.org/package=waterfalls", note: "並べ替えた棒グラフを整った体裁で描きたいときのR実装です。" }
  ],
  "ch10:t8": [
    { type: "guideline", label: "iRECIST（免疫療法向けの効果判定基準）", url: "https://pubmed.ncbi.nlm.nih.gov/28271869/", note: "偽増悪を含む経時変化の解釈方法が示され、スパイダープロットの読解に役立ちます。" },
    { type: "guideline", label: "RECIST公式サイト（EORTC）", url: "https://recist.eortc.org/", note: "経時的な腫瘍径測定のタイミングと評価規則を原典で確認できます。" }
  ],
  "ch10:t9": [
    { type: "guideline", label: "標準化された家系図記載法（NSGC推奨・改訂版）", url: "https://pubmed.ncbi.nlm.nih.gov/18792771/", note: "記号や続柄の線の書き方を定めた、家系図表記の標準として参照される文献です。" },
    { type: "tool", label: "CRAN: kinship2 パッケージ（家系図の作図と血縁行列）", url: "https://cran.r-project.org/package=kinship2", note: "家系データから家系図を描き、血縁係数行列を計算するR実装です。" }
  ],
  "ch10:t10": [
    { type: "guideline", label: "HGVS Nomenclature 公式（バリアント表記の標準）", url: "https://hgvs-nomenclature.org/stable/", note: "c.やp.などの記載規則を定める本家で、表記に迷ったら最初に開きます。" },
    { type: "guideline", label: "ACMG/AMP バリアント解釈ガイドライン", url: "https://pubmed.ncbi.nlm.nih.gov/25741868/", note: "病的意義を5段階に分類する証拠コードの体系が定義されています。" },
    { type: "db", label: "NCBI ClinVar（バリアントと臨床的意義のデータベース）", url: "https://www.ncbi.nlm.nih.gov/clinvar/", note: "個々のバリアントの標準表記と報告済みの解釈を照合できる公的データベースです。" }
  ],
});
