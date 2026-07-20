/* 第10章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch10:t1": [
    { pmid: "20723767", title: "A practical guide to understanding Kaplan-Meier curves.", authors: "Rich JT et al.", journal: "Otolaryngology--head and neck surgery : official journal of American Academy of Otolaryngology-Head and Neck Surgery", year: "2010", doi: "10.1016/j.otohns.2010.05.007", note: "カプランマイヤー曲線の読み方と打ち切りの扱いを、臨床家向けに平易に解説した実用的総説です。" },
    { pmid: "11248153", title: "Use of chemotherapy plus a monoclonal antibody against HER2 for metastatic breast cancer that overexpresses HER2.", authors: "Slamon DJ et al.", journal: "The New England journal of medicine", year: "2001", doi: "10.1056/NEJM200103153441101", note: "トラスツズマブの生存延長をカプランマイヤー曲線で示した、HER2陽性乳がん治療の転換点です。" }
  ],
  "ch10:t2": [
    { pmid: "7063747", title: "The meaning and use of the area under a receiver operating characteristic (ROC) curve.", authors: "Hanley JA et al.", journal: "Radiology", year: "1982", doi: "10.1148/radiology.143.1.7063747", note: "ROC曲線下面積の意味と算出法を明示し、診断能評価の標準的な枠組みを与えた必読の原著です。" },
    { pmid: "29348365", title: "Detection and localization of surgically resectable cancers with a multi-analyte blood test.", authors: "Cohen JD et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aar3247", note: "血液検査による多がん早期検出の性能を、ROC曲線と感度・特異度で提示した代表的臨床研究です。" }
  ],
  "ch10:t3": [
    { pmid: "8141877", title: "A predictive model for aggressive non-Hodgkin's lymphoma.", authors: "International Non-Hodgkin's Lymphoma Prognostic Factors Project", journal: "The New England journal of medicine", year: "1993", doi: "10.1056/NEJM199309303291402", note: "多変量解析で5つの予後因子を抽出し、国際予後指標IPIを構築したリンパ腫診療の基礎論文です。" },
    { pmid: "19826129", title: "Prognostic factors for overall survival in patients with metastatic renal cell carcinoma treated with vascular endothelial growth factor-targeted agents: results from a large, multicenter study.", authors: "Heng DY et al.", journal: "Journal of clinical oncology : official journal of the American Society of Clinical Oncology", year: "2009", doi: "10.1200/JCO.2008.21.4809", note: "多変量Cox回帰で腎細胞がんの予後因子を同定し、IMDCリスク分類を確立した大規模研究です。" }
  ],
  "ch10:t4": [
    { pmid: "3802833", title: "Meta-analysis in clinical trials.", authors: "DerSimonian R et al.", journal: "Controlled clinical trials", year: "1986", doi: "10.1016/0197-2456(86)90046-2", note: "変量効果モデルによるメタアナリシスの手法を提示し、現在の統合解析の標準となった原著です。" },
    { pmid: "22019144", title: "Effect of radiotherapy after breast-conserving surgery on 10-year recurrence and 15-year breast cancer death: meta-analysis of individual patient data for 10,801 women in 17 randomised trials.", authors: "Early Breast Cancer Trialists' Collaborative Group (EBCTCG) et al.", journal: "Lancet (London, England)", year: "2011", doi: "10.1016/S0140-6736(11)61629-2", note: "1万人超の個別患者データを統合し、乳房温存術後照射の効果をフォレストプロットで示しました。" }
  ],
  "ch10:t5": [
    { pmid: "12210616", title: "Network meta-analysis for indirect treatment comparisons.", authors: "Lumley T", journal: "Statistics in medicine", year: "2002", doi: "10.1002/sim.1201", note: "間接比較を統合するネットワークメタアナリシスの枠組みを定式化した、方法論の原著論文です。" },
    { pmid: "34545685", title: "Immune checkpoint inhibitors for first-line treatment of advanced non-small-cell lung cancer: A systematic review and network meta-analysis.", authors: "Peng TR et al.", journal: "Thoracic cancer", year: "2021", doi: "10.1111/1759-7714.14148", note: "進行非小細胞肺がんの一次免疫療法をネットワークメタアナリシスで比較・順位付けした解析です。" }
  ],
  "ch10:t6": [
    { pmid: "29466156", title: "Efficacy of Larotrectinib in TRK Fusion-Positive Cancers in Adults and Children.", authors: "Drilon A et al.", journal: "The New England journal of medicine", year: "2018", doi: "10.1056/NEJMoa1714448", note: "TRK融合がんに対するラロトレクチニブの奏効持続を、スイマープロットで可視化した代表例です。" },
    { pmid: "26287849", title: "Vemurafenib in Multiple Nonmelanoma Cancers with BRAF V600 Mutations.", authors: "Hyman DM et al.", journal: "The New England journal of medicine", year: "2015", doi: "10.1056/NEJMoa1502309", note: "BRAF V600変異バスケット試験で、症例ごとの治療期間と反応をスイマープロットで示しています。" }
  ],
  "ch10:t7": [
    { pmid: "20818844", title: "Inhibition of mutated, activated BRAF in metastatic melanoma.", authors: "Flaherty KT et al.", journal: "The New England journal of medicine", year: "2010", doi: "10.1056/NEJMoa1002011", note: "BRAF阻害薬による腫瘍縮小率を症例ごとにウォーターフォールプロットで示した第1相試験です。" },
    { pmid: "20979469", title: "Anaplastic lymphoma kinase inhibition in non-small-cell lung cancer.", authors: "Kwak EL et al.", journal: "The New England journal of medicine", year: "2010", doi: "10.1056/NEJMoa1006448", note: "ALK陽性肺がんへのクリゾチニブの著明な縮小効果を、ウォーターフォールプロットで提示しました。" }
  ],
  "ch10:t8": [
    { pmid: "19934295", title: "Guidelines for the evaluation of immune therapy activity in solid tumors: immune-related response criteria.", authors: "Wolchok JD et al.", journal: "Clinical cancer research : an official journal of the American Association for Cancer Research", year: "2009", doi: "10.1158/1078-0432.CCR-09-1624", note: "免疫療法特有の反応様式を評価するirRCを提唱し、腫瘍径の経時変化を図示する流れを広めました。" },
    { pmid: "22658127", title: "Safety, activity, and immune correlates of anti-PD-1 antibody in cancer.", authors: "Topalian SL et al.", journal: "The New England journal of medicine", year: "2012", doi: "10.1056/NEJMoa1200690", note: "抗PD-1抗体の腫瘍縮小と効果持続を、症例ごとの経時変化プロットで示した免疫療法の里程標です。" }
  ],
  "ch10:t9": [
    { pmid: "1978757", title: "Germ line p53 mutations in a familial syndrome of breast cancer, sarcomas, and other neoplasms.", authors: "Malkin D et al.", journal: "Science (New York, N.Y.)", year: "1990", doi: "10.1126/science.1978757", note: "家系図解析と塩基配列決定から、Li-Fraumeni症候群の生殖細胞系列TP53変異を同定しました。" },
    { pmid: "2270482", title: "Linkage of early-onset familial breast cancer to chromosome 17q21.", authors: "Hall JM et al.", journal: "Science (New York, N.Y.)", year: "1990", doi: "10.1126/science.2270482", note: "乳がん多発家系の連鎖解析で17q21に責任遺伝子座を同定し、BRCA1発見へと導いた論文です。" }
  ],
  "ch10:t10": [
    { pmid: "26931183", title: "HGVS Recommendations for the Description of Sequence Variants: 2016 Update.", authors: "den Dunnen JT et al.", journal: "Human mutation", year: "2016", doi: "10.1002/humu.22981", note: "変異記載の国際標準であるHGVS表記法を体系的に改訂した、現行ルールの一次資料です。" },
    { pmid: "25741868", title: "Standards and guidelines for the interpretation of sequence variants: a joint consensus recommendation of the American College of Medical Genetics and Genomics and the Association for Molecular Pathology.", authors: "Richards S et al.", journal: "Genetics in medicine : official journal of the American College of Medical Genetics", year: "2015", doi: "10.1038/gim.2015.30", note: "ACMG/AMPの変異解釈指針として、病的意義分類とHGVS準拠の記載を臨床に定着させました。" }
  ]
});
