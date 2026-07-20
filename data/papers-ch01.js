/* 第1章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch01:t1": [
    { pmid: "16060722", title: "Why most published research findings are false.", authors: "Ioannidis JP", journal: "PLoS medicine", year: "2005", doi: "10.1371/journal.pmed.0020124", note: "p<0.05という基準だけでは偽陽性が多発することを理論的に示し、仮説検定の限界を広く知らしめた論文です。" },
    { pmid: "30980045", title: "Redefine statistical significance.", authors: "Benjamin DJ et al.", journal: "Nature human behaviour", year: "2018", doi: "10.1038/s41562-017-0189-z", note: "有意水準をp<0.005へ引き下げる提案を通じて、p値の解釈と再現性の問題を正面から論じた論文です。" }
  ],
  "ch01:t2": [
    { pmid: "12883005", title: "Statistical significance for genomewide studies.", authors: "Storey JD et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2003", doi: "10.1073/pnas.1530509100", note: "ゲノム網羅解析の多重検定にq値（偽発見率）を導入し、FDR補正を標準的な手法として普及させた論文です。" },
    { pmid: "11906227", title: "Thresholding of statistical maps in functional neuroimaging using the false discovery rate.", authors: "Genovese CR et al.", journal: "NeuroImage", year: "2002", doi: "10.1006/nimg.2001.1037", note: "脳機能画像の膨大なボクセル検定にFDR補正を適用し、多重比較の実践的な閾値設定を示した論文です。" }
  ],
  "ch01:t3": [
    { pmid: "3082422", title: "Confidence intervals rather than P values: estimation rather than hypothesis testing.", authors: "Gardner MJ et al.", journal: "British medical journal (Clinical research ed.)", year: "1986", doi: "10.1136/bmj.292.6522.746", note: "p値のみの報告をやめ効果量を信頼区間で示すべきと提唱し、医学論文の記載様式を変えた論文です。" },
    { pmid: "31217592", title: "Moving beyond P values: data analysis with estimation graphics.", authors: "Ho J et al.", journal: "Nature methods", year: "2019", doi: "10.1038/s41592-019-0470-3", note: "推定統計のグラフを提案し、群間差を信頼区間つきで可視化する表現を生命科学に広めた論文です。" }
  ],
  "ch01:t4": [
    { pmid: "12761364", title: "A low-carbohydrate as compared with a low-fat diet in severe obesity.", authors: "Samaha FF et al.", journal: "The New England journal of medicine", year: "2003", doi: "10.1056/NEJMoa022637", note: "低炭水化物食と低脂肪食の2群で体重変化の平均値を比較し、群間差の検定を主解析に据えた試験です。" },
    { pmid: "12761365", title: "A randomized trial of a low-carbohydrate diet for obesity.", authors: "Foster GD et al.", journal: "The New England journal of medicine", year: "2003", doi: "10.1056/NEJMoa022207", note: "2群並行の無作為化試験で体重減少率の平均を比較し、連続量アウトカムの平均値の差を検定した研究です。" }
  ],
  "ch01:t5": [
    { pmid: "9099655", title: "A clinical trial of the effects of dietary patterns on blood pressure. DASH Collaborative Research Group.", authors: "Appel LJ et al.", journal: "The New England journal of medicine", year: "1997", doi: "10.1056/NEJM199704173361601", note: "3種類の食事群の血圧変化を比較するために分散分析を用い、DASH食の降圧効果を示した有名な試験です。" },
    { pmid: "17341711", title: "Comparison of the Atkins, Zone, Ornish, and LEARN diets for change in weight and related risk factors among overweight premenopausal women: the A TO Z Weight Loss Study: a randomized trial.", authors: "Gardner CD et al.", journal: "JAMA", year: "2007", doi: "10.1001/jama.297.9.969", note: "4種類のダイエット法の体重変化を分散分析で比較し、多群間の差の検定を主解析とした無作為化試験です。" }
  ],
  "ch01:t6": [
    { pmid: "17420288", title: "Error bars in experimental biology.", authors: "Cumming G et al.", journal: "The Journal of cell biology", year: "2007", doi: "10.1083/jcb.200611141", note: "棒グラフのエラーバーがSD・SE・信頼区間のどれかで意味が変わることを整理した定番の解説論文です。" },
    { pmid: "25901488", title: "Beyond bar and line graphs: time for a new data presentation paradigm.", authors: "Weissgerber TL et al.", journal: "PLoS biology", year: "2015", doi: "10.1371/journal.pbio.1002128", note: "棒グラフが個々のデータ分布を隠してしまう危険を実例で示し、散布図での提示を推奨した論文です。" }
  ],
  "ch01:t7": [
    { pmid: "2868172", title: "Statistical methods for assessing agreement between two methods of clinical measurement.", authors: "Bland JM et al.", journal: "Lancet (London, England)", year: "1986", doi: "", note: "2つの測定法の一致度評価に相関係数を使う誤りを指摘し、差のプロットによる評価法を確立した論文です。" },
    { pmid: "10022859", title: "Correlation between protein and mRNA abundance in yeast.", authors: "Gygi SP et al.", journal: "Molecular and cellular biology", year: "1999", doi: "10.1128/MCB.19.3.1720", note: "酵母のmRNA量とタンパク質量の相関を散布図と相関係数で解析し、両者の乖離を示した代表例です。" }
  ],
  "ch01:t8": [
    { pmid: "1244564", title: "Prediction of creatinine clearance from serum creatinine.", authors: "Cockcroft DW et al.", journal: "Nephron", year: "1976", doi: "10.1159/000180580", note: "年齢・体重・血清クレアチニンからクレアチニン・クリアランスを予測する回帰式を導いた古典です。" },
    { pmid: "10075613", title: "A more accurate method to estimate glomerular filtration rate from serum creatinine: a new prediction equation. Modification of Diet in Renal Disease Study Group.", authors: "Levey AS et al.", journal: "Annals of internal medicine", year: "1999", doi: "10.7326/0003-4819-130-6-199903160-00002", note: "多変量の線形回帰でGFR推定式を構築し、回帰による予測式づくりの代表例となった論文です。" }
  ],
  "ch01:t9": [
    { pmid: "3315805", title: "Fitting curves to data using nonlinear regression: a practical and nonmathematical review.", authors: "Motulsky HJ et al.", journal: "FASEB journal : official publication of the Federation of American Societies for Experimental Biology", year: "1987", doi: "", note: "非線形回帰による曲線あてはめの考え方と注意点を数式に頼らず解説した、生命科学の定番総説です。" },
    { pmid: "22460902", title: "Systematic identification of genomic markers of drug sensitivity in cancer cells.", authors: "Garnett MJ et al.", journal: "Nature", year: "2012", doi: "10.1038/nature11005", note: "多数のがん細胞株で用量反応曲線をあてはめてIC50を求め、薬剤感受性マーカーを探索した論文です。" }
  ]
});
