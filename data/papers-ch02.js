/* 第2章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch02:t1": [
    { pmid: "16448564", title: "The RIN: an RNA integrity number for assigning integrity values to RNA measurements.", authors: "Schroeder A et al.", journal: "BMC molecular biology", year: "2006", doi: "10.1186/1471-2199-7-3", note: "RIN値そのものを定義した原著です。電気泳動の波形から自動でRNA品質を1〜10の数値に変換する仕組みを示しました。" },
    { pmid: "37167067", title: "Diagnostic utility of DNA integrity number as an indicator of sufficient DNA quality in next-generation sequencing-based genomic profiling.", authors: "Hiramatsu K et al.", journal: "American journal of clinical pathology", year: "2023", doi: "10.1093/ajcp/aqad046", note: "がん遺伝子パネル検査においてDIN値がDNA品質の指標として実用に足るかを検証した、臨床側の代表的な応用研究です。" }
  ],
  "ch02:t2": [
    { pmid: "4354250", title: "Detection of two restriction endonuclease activities in Haemophilus parainfluenzae using analytical agarose--ethidium bromide electrophoresis.", authors: "Sharp PA et al.", journal: "Biochemistry", year: "1973", doi: "10.1021/bi00740a018", note: "アガロースにエチジウムを加えてDNA断片を分離検出する方式を示した初期の代表例で、制限酵素の同定に用いられました。" },
    { pmid: "22546956", title: "Agarose gel electrophoresis for the separation of DNA fragments.", authors: "Lee PY et al.", journal: "Journal of visualized experiments : JoVE", year: "2012", doi: "10.3791/3923", note: "DNA断片分離の標準手順を動画付きで解説した論文で、現在のゲル電気泳動の教科書的な参照先になっています。" }
  ],
  "ch02:t3": [
    { pmid: "1195397", title: "Detection of specific sequences among DNA fragments separated by gel electrophoresis.", authors: "Southern EM", journal: "Journal of molecular biology", year: "1975", doi: "10.1016/s0022-2836(75)80083-0", note: "サザンブロットの原著です。ゲル中のDNAを膜に転写し、ハイブリダイゼーションで特定の配列だけを検出しました。" },
    { pmid: "414220", title: "Method for detection of specific RNAs in agarose gels by transfer to diazobenzyloxymethyl-paper and hybridization with DNA probes.", authors: "Alwine JC et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1977", doi: "10.1073/pnas.74.12.5350", note: "ノーザンブロットの原著で、RNAを膜へ転写しDNAプローブで特定の転写産物を検出する方法を確立しました。" }
  ],
  "ch02:t4": [
    { pmid: "2999980", title: "Enzymatic amplification of beta-globin genomic sequences and restriction site analysis for diagnosis of sickle cell anemia.", authors: "Saiki RK et al.", journal: "Science (New York, N.Y.)", year: "1985", doi: "10.1126/science.2999980", note: "PCRを初めて報告した論文です。β-グロビン遺伝子を増幅し、鎌状赤血球症の遺伝子診断に応用してみせました。" },
    { pmid: "2448875", title: "Primer-directed enzymatic amplification of DNA with a thermostable DNA polymerase.", authors: "Saiki RK et al.", journal: "Science (New York, N.Y.)", year: "1988", doi: "10.1126/science.2448875", note: "耐熱性Taqポリメラーゼを導入してPCRを自動化・高特異度化した論文で、現在の標準的なPCRの基礎です。" }
  ],
  "ch02:t5": [
    { pmid: "7764001", title: "Kinetic PCR analysis: real-time monitoring of DNA amplification reactions.", authors: "Higuchi R et al.", journal: "Bio/technology (Nature Publishing Company)", year: "1993", doi: "10.1038/nbt0993-1026", note: "増幅産物の蛍光を反応中に連続測定するリアルタイムPCRの原理を示した論文で、qPCRの出発点となりました。" },
    { pmid: "11846609", title: "Analysis of relative gene expression data using real-time quantitative PCR and the 2(-Delta Delta C(T)) Method.", authors: "Livak KJ et al.", journal: "Methods (San Diego, Calif.)", year: "2001", doi: "10.1006/meth.2001.1262", note: "ΔΔCt法による相対定量の計算手順を示した論文で、qPCRの結果を棒グラフで示すときの標準になっています。" }
  ],
  "ch02:t6": [
    { pmid: "10430926", title: "Digital PCR.", authors: "Vogelstein B et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1999", doi: "10.1073/pnas.96.16.9236", note: "デジタルPCRを提唱した原著です。鋳型を微小区画に分けて陽性区画を数え、絶対数として求める発想を示しました。" },
    { pmid: "24553385", title: "Detection of circulating tumor DNA in early- and late-stage human malignancies.", authors: "Bettegowda C et al.", journal: "Science translational medicine", year: "2014", doi: "10.1126/scitranslmed.3007094", note: "デジタルPCRで血中循環腫瘍DNAを検出し、多様ながん種と病期で検出率を体系的に評価した代表的な応用研究です。" }
  ],
  "ch02:t7": [
    { pmid: "1542678", title: "A genomic sequencing protocol that yields a positive display of 5-methylcytosine residues in individual DNA strands.", authors: "Frommer M et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1992", doi: "10.1073/pnas.89.5.1827", note: "バイサルファイト処理でメチル化シトシンを配列情報として読み分ける手法を確立した原著です。" },
    { pmid: "19829295", title: "Human DNA methylomes at base resolution show widespread epigenomic differences.", authors: "Lister R et al.", journal: "Nature", year: "2009", doi: "10.1038/nature08514", note: "全ゲノムバイサルファイトシークエンスでヒト細胞のメチロームを一塩基解像度で描いた代表的な応用研究です。" }
  ],
  "ch02:t8": [
    { pmid: "4107917", title: "A rapid banding technique for human chromosomes.", authors: "Seabright M", journal: "Lancet (London, England)", year: "1971", doi: "10.1016/s0140-6736(71)90287-x", note: "トリプシン処理とギムザ染色による簡便なG分染法を報告した原著で、以後の核型解析の標準になりました。" },
    { pmid: "4126434", title: "Letter: A new consistent chromosomal abnormality in chronic myelogenous leukaemia identified by quinacrine fluorescence and Giemsa staining.", authors: "Rowley JD", journal: "Nature", year: "1973", doi: "10.1038/243290a0", note: "分染法により慢性骨髄性白血病の9番と22番染色体の相互転座を同定した、核型解析の歴史的な応用研究です。" }
  ],
  "ch02:t9": [
    { pmid: "3458254", title: "Cytogenetic analysis using quantitative, high-sensitivity, fluorescence hybridization.", authors: "Pinkel D et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1986", doi: "10.1073/pnas.83.9.2934", note: "蛍光標識プローブで染色体を高感度かつ定量的に検出する手法を示した、DNA-FISHの基盤となる原著です。" },
    { pmid: "8662537", title: "Multicolor spectral karyotyping of human chromosomes.", authors: "Schröck E et al.", journal: "Science (New York, N.Y.)", year: "1996", doi: "10.1126/science.273.5274.494", note: "スペクトル分離により24本の染色体を色分けして同時に識別する多色FISHを実現した代表的な応用研究です。" }
  ],
  "ch02:t10": [
    { pmid: "3793097", title: "Detection of chromosome aberrations in the human interphase nucleus by visualization of specific target DNAs with radioactive and non-radioactive in situ hybridization techniques: diagnosis of trisomy 18 with probe L1.84.", authors: "Cremer T et al.", journal: "Human genetics", year: "1986", doi: "10.1007/BF00280484", note: "分裂期を待たず間期核のまま染色体数の異常を検出できることを示し、間期核FISHの道を開いた原著です。" },
    { pmid: "11830525", title: "Biological and prognostic significance of interphase fluorescence in situ hybridization detection of chromosome 13 abnormalities (delta13) in multiple myeloma: an eastern cooperative oncology group study.", authors: "Fonseca R et al.", journal: "Cancer research", year: "2002", doi: "", note: "多発性骨髄腫で間期核FISHにより13番染色体異常を検出し、予後との関連を示した大規模な臨床応用研究です。" }
  ],
  "ch02:t11": [
    { pmid: "9554849", title: "Visualization of single RNA transcripts in situ.", authors: "Femino AM et al.", journal: "Science (New York, N.Y.)", year: "1998", doi: "10.1126/science.280.5363.585", note: "蛍光プローブで単一のmRNA分子を細胞内の位置ごと可視化した原著で、1分子RNA-FISHの起点となりました。" },
    { pmid: "18806792", title: "Imaging individual mRNA molecules using multiple singly labeled probes.", authors: "Raj A et al.", journal: "Nature methods", year: "2008", doi: "10.1038/nmeth.1253", note: "短い一標識プローブを多数併用してmRNAを1分子ずつ簡便に検出する方式を示し、smFISHを広く普及させました。" }
  ],
  "ch02:t12": [
    { pmid: "3821727", title: "Firefly luciferase gene: structure and expression in mammalian cells.", authors: "de Wet JR et al.", journal: "Molecular and cellular biology", year: "1987", doi: "10.1128/mcb.7.2.725-737.1987", note: "ホタルルシフェラーゼ遺伝子を哺乳類細胞で発現させ、レポーター遺伝子として使える基盤を築いた原著です。" },
    { pmid: "23348503", title: "TERT promoter mutations in familial and sporadic melanoma.", authors: "Horn S et al.", journal: "Science (New York, N.Y.)", year: "2013", doi: "10.1126/science.1230062", note: "ルシフェラーゼレポーターでTERTプロモーター変異が転写活性を高めることを示した、代表的な応用研究です。" }
  ],
  "ch02:t13": [
    { pmid: "6275366", title: "Equilibria and kinetics of lac repressor-operator interactions by polyacrylamide gel electrophoresis.", authors: "Fried M et al.", journal: "Nucleic acids research", year: "1981", doi: "10.1093/nar/9.23.6505", note: "タンパク質とDNAの結合を泳動度の変化として捉えるゲルシフト法を確立した、EMSAの原著の一つです。" },
    { pmid: "6269071", title: "A gel electrophoresis method for quantifying the binding of proteins to specific DNA regions: application to components of the Escherichia coli lactose operon regulatory system.", authors: "Garner MM et al.", journal: "Nucleic acids research", year: "1981", doi: "10.1093/nar/9.13.3047", note: "同年に独立して報告されたEMSAの原著で、ラクトースオペロンの制御因子の結合を定量的に解析しました。" }
  ]
});
