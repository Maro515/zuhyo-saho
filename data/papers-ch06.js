/* 第6章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch06:t1": [
    { pmid: "15389848", title: "Shotgun lipidomics: electrospray ionization mass spectrometric analysis and quantitation of cellular lipidomes directly from crude extracts of biological samples.", authors: "Han X et al.", journal: "Mass spectrometry reviews", year: "2005", doi: "10.1002/mas.20023", note: "粗抽出物から直接脂質を網羅定量するショットガンリピドミクスの原理と実際を確立した総説です。" },
    { pmid: "20671299", title: "Lipidomics reveals a remarkable diversity of lipids in human plasma.", authors: "Quehenberger O et al.", journal: "Journal of lipid research", year: "2010", doi: "10.1194/jlr.M009449", note: "ヒト血漿の脂質分子種を網羅的に同定・定量し、血漿リピドームの全体像を示した代表的研究です。" }
  ],
  "ch06:t2": [
    { pmid: "16971499", title: "Multiparameter metabolic analysis reveals a close link between attenuated mitochondrial bioenergetic function and enhanced glycolysis dependency in human tumor cells.", authors: "Wu M et al.", journal: "American journal of physiology. Cell physiology", year: "2007", doi: "10.1152/ajpcell.00247.2006", note: "細胞外フラックス解析でOCRとECARを同時測定し、腫瘍細胞の解糖依存性を示した基礎となる論文です。" },
    { pmid: "22206904", title: "Mitochondrial respiratory capacity is a critical regulator of CD8+ T cell memory development.", authors: "van der Windt GJ et al.", journal: "Immunity", year: "2012", doi: "10.1016/j.immuni.2011.12.007", note: "フラックス解析で予備呼吸能を測定し、CD8陽性T細胞の記憶形成に呼吸能が必須と示した応用例です。" }
  ],
  "ch06:t3": [
    { pmid: "382871", title: "Glucose clamp technique: a method for quantifying insulin secretion and resistance.", authors: "DeFronzo RA et al.", journal: "The American journal of physiology", year: "1979", doi: "10.1152/ajpendo.1979.237.3.E214", note: "高血糖クランプと高インスリン正常血糖クランプの手法を定式化した、この分野の原著論文です。" },
    { pmid: "14960743", title: "Impaired mitochondrial activity in the insulin-resistant offspring of patients with type 2 diabetes.", authors: "Petersen KF et al.", journal: "The New England journal of medicine", year: "2004", doi: "10.1056/NEJMoa031314", note: "クランプ法でインスリン抵抗性を定量し、2型糖尿病患者の子でのミトコンドリア機能低下を示しました。" }
  ],
  "ch06:t4": [
    { pmid: "20713647", title: "Standard operating procedures for describing and performing metabolic tests of glucose homeostasis in mice.", authors: "Ayala JE et al.", journal: "Disease models & mechanisms", year: "2010", doi: "10.1242/dmm.006239", note: "マウスの糖負荷試験とインスリン負荷試験の実施法や報告様式を標準化した、指針となる論文です。" },
    { pmid: "11479627", title: "The fat-derived hormone adiponectin reverses insulin resistance associated with both lipoatrophy and obesity.", authors: "Yamauchi T et al.", journal: "Nature medicine", year: "2001", doi: "10.1038/90984", note: "アディポネクチン投与後の糖負荷試験とインスリン負荷試験でインスリン抵抗性の改善を示しました。" }
  ],
  "ch06:t5": [
    { pmid: "21423183", title: "Metabolite profiles and the risk of developing diabetes.", authors: "Wang TJ et al.", journal: "Nature medicine", year: "2011", doi: "10.1038/nm.2307", note: "血漿のメタボローム解析で分岐鎖アミノ酸が糖尿病発症を予測することを示した代表的な応用研究です。" },
    { pmid: "22101433", title: "Reductive glutamine metabolism by IDH1 mediates lipogenesis under hypoxia.", authors: "Metallo CM et al.", journal: "Nature", year: "2011", doi: "10.1038/nature10602", note: "13C標識グルタミンを用いた代謝フラックス解析で、低酸素下の還元的カルボキシル化を明らかにしました。" }
  ],
  "ch06:t6": [
    { pmid: "9406525", title: "Molecular imaging of biological samples: localization of peptides and proteins using MALDI-TOF MS.", authors: "Caprioli RM et al.", journal: "Analytical chemistry", year: "1997", doi: "10.1021/ac970888i", note: "MALDI-TOF MSで組織上のペプチドやタンパク質の分布を画像化した、イメージング質量分析の原著です。" },
    { pmid: "11283679", title: "Imaging mass spectrometry: a new technology for the analysis of protein expression in mammalian tissues.", authors: "Stoeckli M et al.", journal: "Nature medicine", year: "2001", doi: "10.1038/86573", note: "哺乳類の組織切片でタンパク質分布を質量分析イメージングにより可視化し、応用の道を開いた論文です。" }
  ],
  "ch06:t7": [
    { pmid: "22205519", title: "A guide to analysis of mouse energy metabolism.", authors: "Tschöp MH et al.", journal: "Nature methods", year: "2011", doi: "10.1038/nmeth.1806", note: "代謝ケージによる酸素消費量や熱産生の測定法と、体重で補正する解析上の注意点をまとめた指針です。" },
    { pmid: "19187776", title: "UCP1 ablation induces obesity and abolishes diet-induced thermogenesis in mice exempt from thermal stress by living at thermoneutrality.", authors: "Feldmann HM et al.", journal: "Cell metabolism", year: "2009", doi: "10.1016/j.cmet.2008.12.014", note: "熱中性温度下で間接熱量測定を行い、UCP1欠損マウスが肥満になることを示した代謝表現型解析です。" }
  ],
  "ch06:t8": [
    { pmid: "9139827", title: "Mice lacking mitochondrial uncoupling protein are cold-sensitive but not obese.", authors: "Enerbäck S et al.", journal: "Nature", year: "1997", doi: "10.1038/387090a0", note: "UCP1欠損マウスを寒冷曝露して体温を追跡し、寒冷刺激試験の意義を示した古典的な論文です。" },
    { pmid: "19357405", title: "Cold-activated brown adipose tissue in healthy men.", authors: "van Marken Lichtenbelt WD et al.", journal: "The New England journal of medicine", year: "2009", doi: "10.1056/NEJMoa0808718", note: "健常男性を寒冷曝露しFDG-PETで褐色脂肪の活性化を示した、ヒト寒冷刺激試験の代表例です。" }
  ]
});
