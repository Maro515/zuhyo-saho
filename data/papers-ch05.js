/* 第5章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch05:t1": [
    { pmid: "5432063", title: "Cleavage of structural proteins during the assembly of the head of bacteriophage T4.", authors: "Laemmli UK", journal: "Nature", year: "1970", doi: "10.1038/227680a0", note: "SDS-PAGEの原著論文です。タンパク質を分子量に応じて分離する現在の標準的な手法を確立しました。" },
    { pmid: "1812789", title: "Blue native electrophoresis for isolation of membrane protein complexes in enzymatically active form.", authors: "Schägger H et al.", journal: "Analytical biochemistry", year: "1991", doi: "10.1016/0003-2697(91)90094-a", note: "変性させずに膜タンパク質複合体を分離できるBlue Native-PAGEを開発し、複合体研究の基盤を作りました。" }
  ],
  "ch05:t2": [
    { pmid: "388439", title: "Electrophoretic transfer of proteins from polyacrylamide gels to nitrocellulose sheets: procedure and some applications.", authors: "Towbin H et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1979", doi: "10.1073/pnas.76.9.4350", note: "ゲルからメンブレンへタンパク質を電気的に転写する手法を示した、イムノブロットの原著論文です。" },
    { pmid: "6266278", title: '"Western blotting": electrophoretic transfer of proteins from sodium dodecyl sulfate--polyacrylamide gels to unmodified nitrocellulose and radiographic detection with antibody and radioiodinated protein A.', authors: "Burnette WN", journal: "Analytical biochemistry", year: "1981", doi: "10.1016/0003-2697(81)90281-5", note: "ウェスタンブロットという名称を与え、抗体と標識プロテインAによる検出手順を体系化しました。" }
  ],
  "ch05:t3": [
    { pmid: "236308", title: "High resolution two-dimensional electrophoresis of proteins.", authors: "O'Farrell PH", journal: "The Journal of biological chemistry", year: "1975", doi: "", note: "等電点電気泳動とSDS-PAGEを組み合わせた二次元電気泳動を確立した原著です。" },
    { pmid: "9420172", title: "Difference gel electrophoresis: a single gel method for detecting changes in protein extracts.", authors: "Unlü M et al.", journal: "Electrophoresis", year: "1997", doi: "10.1002/elps.1150181133", note: "蛍光色素で複数試料を標識し同一ゲルで比較する2D-DIGEを開発した、代表的な応用研究です。" }
  ],
  "ch05:t4": [
    { pmid: "9278050", title: "Fluorescent indicators for Ca2+ based on green fluorescent proteins and calmodulin.", authors: "Miyawaki A et al.", journal: "Nature", year: "1997", doi: "10.1038/42264", note: "GFP変異体間のFRETでカルシウムを可視化するカメレオンを開発した記念碑的論文です。" },
    { pmid: "11429608", title: "Spatio-temporal images of growth-factor-induced activation of Ras and Rap1.", authors: "Mochizuki N et al.", journal: "Nature", year: "2001", doi: "10.1038/35082594", note: "FRETプローブRaichuで、生細胞内のRas活性化を時空間的に描き出した応用研究です。" }
  ],
  "ch05:t5": [
    { pmid: "21593866", title: "Global quantification of mammalian gene expression control.", authors: "Schwanhäusser B et al.", journal: "Nature", year: "2011", doi: "10.1038/nature10098", note: "パルス標識と質量分析で数千種のタンパク質の半減期を網羅的に測定した代表的な研究です。" },
    { pmid: "21233346", title: "Proteome half-life dynamics in living human cells.", authors: "Eden E et al.", journal: "Science (New York, N.Y.)", year: "2011", doi: "10.1126/science.1199784", note: "生細胞イメージングで個々のタンパク質の分解速度を追跡した、代表的な応用研究のひとつです。" }
  ],
  "ch05:t6": [
    { pmid: "6990414", title: "Proposed role of ATP in protein breakdown: conjugation of protein with multiple chains of the polypeptide of ATP-dependent proteolysis.", authors: "Hershko A et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1980", doi: "10.1073/pnas.77.4.1783", note: "ポリユビキチン鎖の付加が分解シグナルとなることを示した、この分野の原点となる論文です。" },
    { pmid: "19345192", title: "Quantitative proteomics reveals the function of unconventional ubiquitin chains in proteasomal degradation.", authors: "Xu P et al.", journal: "Cell", year: "2009", doi: "10.1016/j.cell.2009.01.041", note: "質量分析で鎖の結合様式を定量し、非典型的なユビキチン鎖も分解に関与すると示した応用研究です。" }
  ],
  "ch05:t7": [
    { pmid: "19915560", title: "An auxin-based degron system for the rapid depletion of proteins in nonplant cells.", authors: "Nishimura K et al.", journal: "Nature methods", year: "2009", doi: "10.1038/nmeth.1401", note: "植物ホルモン依存の分解系を動物細胞に移植し、迅速な標的分解を可能にしたAID法の原著です。" },
    { pmid: "27052166", title: "Rapid Protein Depletion in Human Cells by Auxin-Inducible Degron Tagging with Short Homology Donors.", authors: "Natsume T et al.", journal: "Cell reports", year: "2016", doi: "10.1016/j.celrep.2016.03.001", note: "CRISPRと短い相同アームでヒト細胞のAID株を効率的に作る方法を示しました。" }
  ],
  "ch05:t8": [
    { pmid: "11438690", title: "Protacs: chimeric molecules that target proteins to the Skp1-Cullin-F box complex for ubiquitination and degradation.", authors: "Sakamoto KM et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2001", doi: "10.1073/pnas.141230798", note: "標的とE3リガーゼを繋ぐキメラ分子でタンパク質分解を誘導した、PROTACの原著です。" },
    { pmid: "25999370", title: "DRUG DEVELOPMENT. Phthalimide conjugation as a strategy for in vivo target protein degradation.", authors: "Winter GE et al.", journal: "Science (New York, N.Y.)", year: "2015", doi: "10.1126/science.aab1433", note: "サリドマイド誘導体を用いた低分子デグレーダーでBRD4を分解した、代表的な応用研究です。" }
  ],
  "ch05:t9": [
    { pmid: "28406179", title: "Genetic visualization of protein interactions harnessing liquid phase transitions.", authors: "Watanabe T et al.", journal: "Scientific reports", year: "2017", doi: "10.1038/srep46380", note: "相互作用を蛍光の輝点形成として可視化する、Fluoppi法を初めて報告した原著論文です。" },
    { pmid: "31784573", title: "Simultaneous measurement of p53:Mdm2 and p53:Mdm4 protein-protein interactions in whole cells using fluorescence labelled foci.", authors: "Frosi Y et al.", journal: "Scientific reports", year: "2019", doi: "10.1038/s41598-019-54123-z", note: "輝点形成法でp53とMdm2/Mdm4の結合を同時定量した創薬志向の応用研究です。" }
  ],
  "ch05:t10": [
    { pmid: "11983170", title: "Visualization of interactions among bZIP and Rel family proteins in living cells using bimolecular fluorescence complementation.", authors: "Hu CD et al.", journal: "Molecular cell", year: "2002", doi: "10.1016/s1097-2765(02)00496-3", note: "分割した蛍光タンパク質の再構成で相互作用を検出する、BiFC法を確立した原著論文です。" },
    { pmid: "15580262", title: "Protein tagging and detection with engineered self-assembling fragments of green fluorescent protein.", authors: "Cabantous S et al.", journal: "Nature biotechnology", year: "2005", doi: "10.1038/nbt1044", note: "自己集合するGFP断片を設計し、split-GFPタグ検出系を実用化した研究です。" }
  ],
  "ch05:t11": [
    { pmid: "22412018", title: "A promiscuous biotin ligase fusion protein identifies proximal and interacting proteins in mammalian cells.", authors: "Roux KJ et al.", journal: "The Journal of cell biology", year: "2012", doi: "10.1083/jcb.201112098", note: "細胞内で近接するタンパク質をビオチン標識して回収する、BioID法を確立した原著論文です。" },
    { pmid: "33961781", title: "Dual proteome-scale networks reveal cell-specific remodeling of the human interactome.", authors: "Huttlin EL et al.", journal: "Cell", year: "2021", doi: "10.1016/j.cell.2021.04.011", note: "大規模IP-MSでヒト相互作用ネットワークを構築したBioPlexの代表的成果です。" }
  ],
  "ch05:t12": [
    { pmid: "5135623", title: "Enzyme-linked immunosorbent assay (ELISA). Quantitative assay of immunoglobulin G.", authors: "Engvall E et al.", journal: "Immunochemistry", year: "1971", doi: "10.1016/0019-2791(71)90454-x", note: "酵素で標識した抗体により抗原量を測定するELISAの概念と手順を、初めて示した原著論文です。" },
    { pmid: "20495550", title: "Single-molecule enzyme-linked immunosorbent assay detects serum proteins at subfemtomolar concentrations.", authors: "Rissin DM et al.", journal: "Nature biotechnology", year: "2010", doi: "10.1038/nbt.1641", note: "微小な反応槽で1分子ずつ数えるデジタルELISAを実現し、検出感度を飛躍的に高めました。" }
  ],
  "ch05:t13": [
    { pmid: "17406249", title: "RIP-Chip: the isolation and identification of mRNAs, microRNAs and protein components of ribonucleoprotein complexes from cell extracts.", authors: "Keene JD et al.", journal: "Nature protocols", year: "2006", doi: "10.1038/nprot.2006.47", note: "RNA結合タンパク質を免疫沈降し結合RNAを同定する、RIP法の標準的な手順書です。" },
    { pmid: "14615540", title: "CLIP identifies Nova-regulated RNA networks in the brain.", authors: "Ule J et al.", journal: "Science (New York, N.Y.)", year: "2003", doi: "10.1126/science.1090095", note: "紫外線架橋と免疫沈降を組み合わせ、脳内での結合部位を精密に同定した代表的な応用研究です。" }
  ],
  "ch05:t14": [
    { pmid: "2547163", title: "A novel genetic system to detect protein-protein interactions.", authors: "Fields S et al.", journal: "Nature", year: "1989", doi: "10.1038/340245a0", note: "転写因子を二分割し、酵母の中で結合の有無を検出する酵母ツーハイブリッド法の原著論文です。" },
    { pmid: "16189514", title: "Towards a proteome-scale map of the human protein-protein interaction network.", authors: "Rual JF et al.", journal: "Nature", year: "2005", doi: "10.1038/nature04209", note: "酵母ツーハイブリッドを大規模に展開し、ヒトの相互作用地図を初めて描いた応用研究です。" }
  ],
  "ch05:t15": [
    { pmid: "4158310", title: "Estimation of the molecular weights of proteins by Sephadex gel-filtration.", authors: "Andrews P", journal: "The Biochemical journal", year: "1964", doi: "10.1042/bj0910222", note: "ゲル濾過での溶出位置から分子量を推定できることを示した、基礎的できわめて重要な論文です。" },
    { pmid: "1678", title: "Metal chelate affinity chromatography, a new approach to protein fractionation.", authors: "Porath J et al.", journal: "Nature", year: "1975", doi: "10.1038/258598a0", note: "金属キレートによる分離法を提案し、現在のHisタグ精製の基礎を築いた重要な論文です。" }
  ],
  "ch05:t16": [
    { pmid: "11231557", title: "Large-scale analysis of the yeast proteome by multidimensional protein identification technology.", authors: "Washburn MP et al.", journal: "Nature biotechnology", year: "2001", doi: "10.1038/85686", note: "多次元液体クロマトと質量分析を結合したMudPITで、網羅解析を確立した原著論文です。" },
    { pmid: "28601559", title: "An Optimized Shotgun Strategy for the Rapid Generation of Comprehensive Human Proteomes.", authors: "Bekker-Jensen DB et al.", journal: "Cell systems", year: "2017", doi: "10.1016/j.cels.2017.05.009", note: "短時間でヒト細胞のほぼ全タンパク質を同定できるよう条件を最適化した、代表的な応用研究です。" }
  ],
  "ch05:t17": [
    { pmid: "22669653", title: "Selected reaction monitoring-based proteomics: workflows, potential, pitfalls and future directions.", authors: "Picotti P et al.", journal: "Nature methods", year: "2012", doi: "10.1038/nmeth.2015", note: "SRM/MRMの原理と設計指針、そして陥りやすい落とし穴を整理した標準的な総説論文です。" },
    { pmid: "19561596", title: "Multi-site assessment of the precision and reproducibility of multiple reaction monitoring-based measurements of proteins in plasma.", authors: "Addona TA et al.", journal: "Nature biotechnology", year: "2009", doi: "10.1038/nbt.1546", note: "複数施設で血漿タンパク質のMRM定量の再現性を検証した、大規模な多施設応用研究です。" }
  ],
  "ch05:t18": [
    { pmid: "11897050", title: "A comparison of ALPHAScreen, TR-FRET, and TRF as assay methods for FXR nuclear receptors.", authors: "Glickman JF et al.", journal: "Journal of biomolecular screening", year: "2002", doi: "10.1177/108705710200700102", note: "AlphaScreenを他の均一系測定法と比較し、その特性を明確にした基礎論文です。" },
    { pmid: "25312469", title: "AlphaScreen selectivity assay for β-catenin/B-cell lymphoma 9 inhibitors.", authors: "Zhang M et al.", journal: "Analytical biochemistry", year: "2015", doi: "10.1016/j.ab.2014.09.018", note: "β-カテニン結合阻害剤の選択性評価にAlphaScreenを用いた創薬応用研究です。" }
  ],
  "ch05:t19": [
    { pmid: "24755770", title: "Homogenous 96-plex PEA immunoassay exhibiting high sensitivity, specificity, and excellent scalability.", authors: "Assarsson E et al.", journal: "PloS one", year: "2014", doi: "10.1371/journal.pone.0095192", note: "近接伸長アッセイで96種類を同時測定する系を構築した、Olinkの基盤となる論文です。" },
    { pmid: "29875488", title: "Genomic atlas of the human plasma proteome.", authors: "Sun BB et al.", journal: "Nature", year: "2018", doi: "10.1038/s41586-018-0175-2", note: "血漿タンパク質を大規模に測定し、遺伝子変異との関連地図を描いた代表的な応用研究です。" }
  ],
  "ch05:t20": [
    { pmid: "13517261", title: "A three-dimensional model of the myoglobin molecule obtained by x-ray analysis.", authors: "KENDREW JC et al.", journal: "Nature", year: "1958", doi: "10.1038/181662a0", note: "X線結晶解析で初めてタンパク質の立体構造を決定した、構造生物学の出発点となる論文です。" },
    { pmid: "9525859", title: "The structure of the potassium channel: molecular basis of K+ conduction and selectivity.", authors: "Doyle DA et al.", journal: "Science (New York, N.Y.)", year: "1998", doi: "10.1126/science.280.5360.69", note: "カリウムチャネルの結晶構造から、イオン選択性が生まれる仕組みを解き明かした研究です。" }
  ],
  "ch05:t21": [
    { pmid: "23000701", title: "RELION: implementation of a Bayesian approach to cryo-EM structure determination.", authors: "Scheres SH", journal: "Journal of structural biology", year: "2012", doi: "10.1016/j.jsb.2012.09.006", note: "ベイズ統計に基づく単粒子解析ソフトRELIONを公開し、分解能革命を支えました。" },
    { pmid: "24305160", title: "Structure of the TRPV1 ion channel determined by electron cryo-microscopy.", authors: "Liao M et al.", journal: "Nature", year: "2013", doi: "10.1038/nature12822", note: "結晶化が難しい膜タンパク質をクライオ電顕で解いた、いわゆる分解能革命を象徴する成果です。" }
  ],
  "ch05:t22": [
    { pmid: "3839023", title: "Solution conformation of proteinase inhibitor IIA from bull seminal plasma by 1H nuclear magnetic resonance and distance geometry.", authors: "Williamson MP et al.", journal: "Journal of molecular biology", year: "1985", doi: "10.1016/0022-2836(85)90347-x", note: "NMRの距離情報から、溶液中でのタンパク質の立体構造を初めて決定した記念碑的論文です。" },
    { pmid: "17522630", title: "Mechanism of coupled folding and binding of an intrinsically disordered protein.", authors: "Sugase K et al.", journal: "Nature", year: "2007", doi: "10.1038/nature05858", note: "NMR緩和分散法で、天然変性領域が結合しながら折り畳まれる過程を捉えた応用研究です。" }
  ],
  "ch05:t23": [
    { pmid: "1765656", title: "Kinetic analysis of monoclonal antibody-antigen interactions with a new biosensor based analytical system.", authors: "Karlsson R et al.", journal: "Journal of immunological methods", year: "1991", doi: "10.1016/0022-1759(91)90331-9", note: "SPRバイオセンサーで抗原抗体反応の結合速度と解離速度を測定した、初期の代表論文です。" },
    { pmid: "38019013", title: "Cryptic-site-specific antibodies to the SARS-CoV-2 receptor binding domain can retain functional binding affinity to spike variants.", authors: "Li K et al.", journal: "Journal of virology", year: "2023", doi: "10.1128/jvi.01070-23", note: "SPRで抗体と変異型スパイクの結合親和性を比較した、近年の代表的な応用例のひとつです。" }
  ],
  "ch05:t24": [
    { pmid: "2757186", title: "Rapid measurement of binding constants and heats of binding using a new titration calorimeter.", authors: "Wiseman T et al.", journal: "Analytical biochemistry", year: "1989", doi: "10.1016/0003-2697(89)90213-3", note: "現在のITC装置と解析法の原型を示した、等温滴定型カロリメトリーの記念碑的な原著論文です。" },
    { pmid: "38856178", title: "From X-ray crystallographic structure to intrinsic thermodynamics of protein-ligand binding using carbonic anhydrase isozymes as a model system.", authors: "Paketurytė-Latvė V et al.", journal: "IUCrJ", year: "2024", doi: "10.1107/S2052252524004627", note: "ITCと結晶構造を統合し、結合の熱力学的な内訳を詳細に解析した代表的な応用研究です。" }
  ],
  "ch05:t25": [
    { pmid: "16340016", title: "Phosphate-binding tag, a new tool to visualize phosphorylated proteins.", authors: "Kinoshita E et al.", journal: "Molecular & cellular proteomics : MCP", year: "2006", doi: "10.1074/mcp.T500024-MCP200", note: "リン酸基を捕捉する分子をゲルに組み込み、移動度の差でリン酸化を検出する原理を示した原著です。" },
    { pmid: "27474410", title: "Phos-tag analysis of Rab10 phosphorylation by LRRK2: a powerful assay for assessing kinase function and inhibitors.", authors: "Ito G et al.", journal: "The Biochemical journal", year: "2016", doi: "10.1042/BCJ20160557", note: "Phos-tagでLRRK2によるRab10リン酸化を定量し、阻害剤評価に応用した研究です。" }
  ],
  "ch05:t26": [
    { pmid: "133023", title: "Enzymic unwinding of DNA. 2. Chain separation by an ATP-dependent DNA unwinding enzyme.", authors: "Abdel-Monem M et al.", journal: "European journal of biochemistry", year: "1976", doi: "10.1111/j.1432-1033.1976.tb10359.x", note: "ATP依存的にDNA二本鎖を解きほぐす酵素活性を示した、ヘリカーゼ研究の出発点です。" },
    { pmid: "16030011", title: "POT1 stimulates RecQ helicases WRN and BLM to unwind telomeric DNA substrates.", authors: "Opresko PL et al.", journal: "The Journal of biological chemistry", year: "2005", doi: "10.1074/jbc.M505211200", note: "試験管内ヘリカーゼアッセイで、テロメアDNAの巻き戻しが促進されると示した応用研究です。" }
  ],
  "ch05:t27": [
    { pmid: "13998950", title: "A multiple ribosomal structure in protein synthesis.", authors: "WARNER JR et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1963", doi: "10.1073/pnas.49.1.122", note: "ショ糖密度勾配遠心でポリソームの存在を初めて証明した、古典的かつ基礎的な重要論文です。" },
    { pmid: "19213877", title: "Genome-wide analysis in vivo of translation with nucleotide resolution using ribosome profiling.", authors: "Ingolia NT et al.", journal: "Science (New York, N.Y.)", year: "2009", doi: "10.1126/science.1168978", note: "密度勾配遠心でリボソームを回収し、翻訳を網羅解析するRibo-seqを開発しました。" }
  ],
  "ch05:t28": [
    { pmid: "11592975", title: "A high-speed atomic force microscope for studying biological macromolecules.", authors: "Ando T et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2001", doi: "10.1073/pnas.211400898", note: "生体分子の動きを高速で走査できる原子間力顕微鏡を、世界に先駆けて開発した原著論文です。" },
    { pmid: "20935627", title: "Video imaging of walking myosin V by high-speed atomic force microscopy.", authors: "Kodera N et al.", journal: "Nature", year: "2010", doi: "10.1038/nature09450", note: "ミオシンVが歩く姿を無標識で動画撮影した、高速AFMの代表的な応用研究のひとつです。" }
  ]
});
