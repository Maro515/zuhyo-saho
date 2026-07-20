/* 第4章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch04:t1": [
    { pmid: "4114858", title: "Demonstration that antigen-binding cells are precursors of antibody-producing cells after purification with a fluorescence-activated cell sorter.", authors: "Julius MH et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1972", doi: "10.1073/pnas.69.7.1934", note: "FACSで分取した抗原結合細胞が抗体産生細胞の前駆体であることを示した、セルソーター初期応用の代表例です。" },
    { pmid: "2898810", title: "Purification and characterization of mouse hematopoietic stem cells.", authors: "Spangrude GJ et al.", journal: "Science (New York, N.Y.)", year: "1988", doi: "10.1126/science.2898810", note: "骨髄細胞を表面マーカーの組み合わせで分取し、造血幹細胞を初めて高純度に精製した記念碑的な研究です。" }
  ],
  "ch04:t2": [
    { pmid: "19601617", title: "Mass cytometry: technique for real time single cell multitarget immunoassay based on inductively coupled plasma time-of-flight mass spectrometry.", authors: "Bandura DR et al.", journal: "Analytical chemistry", year: "2009", doi: "10.1021/ac901049w", note: "誘導結合プラズマ質量分析を1細胞計測に応用し、マスサイトメトリーの原理を確立した装置開発論文です。" },
    { pmid: "21551058", title: "Single-cell mass cytometry of differential immune and drug responses across a human hematopoietic continuum.", authors: "Bendall SC et al.", journal: "Science (New York, N.Y.)", year: "2011", doi: "10.1126/science.1198704", note: "多数の金属標識抗体でヒト造血系を1細胞解析し、CyTOFの威力を示した代表的な応用研究です。" }
  ],
  "ch04:t3": [
    { pmid: "17658411", title: "Cellular image analysis and imaging by flow cytometry.", authors: "Basiji DA et al.", journal: "Clinics in laboratory medicine", year: "2007", doi: "10.1016/j.cll.2007.05.008", note: "フローサイトメトリーに多波長イメージングを統合した装置の原理と性能を解説した基盤的な論文です。" },
    { pmid: "15170603", title: "Distinguishing modes of cell death using the ImageStream multispectral imaging flow cytometer.", authors: "George TC et al.", journal: "Cytometry. Part A : the journal of the International Society for Analytical Cytology", year: "2004", doi: "10.1002/cyto.a.20048", note: "細胞死の様式を画像情報から識別し、イメージングフローサイトメトリーの利点を実証した研究です。" }
  ],
  "ch04:t4": [
    { pmid: "29903975", title: "Ghost cytometry.", authors: "Ota S et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aan0096", note: "画像を再構成せず圧縮信号のまま機械学習で細胞を識別する、ゴーストサイトメトリーの原著論文です。" },
    { pmid: "32115874", title: "Use of Ghost Cytometry to Differentiate Cells with Similar Gross Morphologic Characteristics.", authors: "Adachi H et al.", journal: "Cytometry. Part A : the journal of the International Society for Analytical Cytology", year: "2020", doi: "10.1002/cyto.a.23989", note: "形態がよく似た細胞集団の識別にゴーストサイトメトリーを適用し、分離性能を検証した応用研究です。" }
  ],
  "ch04:t5": [
    { pmid: "49354", title: "Rapid flow cytofluorometric analysis of mammalian cell cycle by propidium iodide staining.", authors: "Krishan A", journal: "The Journal of cell biology", year: "1975", doi: "10.1083/jcb.66.1.188", note: "ヨウ化プロピジウムでDNA量を染色し、細胞周期分布を高速に解析する手法を確立した古典的論文です。" },
    { pmid: "19874578", title: "PD 0332991, a selective cyclin D kinase 4/6 inhibitor, preferentially inhibits proliferation of luminal estrogen receptor-positive human breast cancer cell lines in vitro.", authors: "Finn RS et al.", journal: "Breast cancer research : BCR", year: "2009", doi: "10.1186/bcr2419", note: "CDK4/6阻害薬が管腔型乳癌細胞をG1期に停止させることを細胞周期解析で示した応用研究です。" }
  ],
  "ch04:t6": [
    { pmid: "18267078", title: "Visualizing spatiotemporal dynamics of multicellular cell-cycle progression.", authors: "Sakaue-Sawano A et al.", journal: "Cell", year: "2008", doi: "10.1016/j.cell.2007.12.033", note: "細胞周期依存的に分解される蛍光プローブでG1期とS/G2/M期を色分けするFucciの原著論文です。" },
    { pmid: "25486356", title: "Fucci2a: a bicistronic cell cycle reporter that allows Cre mediated tissue specific expression in mice.", authors: "Mort RL et al.", journal: "Cell cycle (Georgetown, Tex.)", year: "2014", doi: "10.4161/15384101.2015.945381", note: "Cre依存的に組織特異的発現できるFucci2aを開発し、マウス個体での細胞周期観察を可能にしました。" }
  ],
  "ch04:t7": [
    { pmid: "6606682", title: "Rapid colorimetric assay for cellular growth and survival: application to proliferation and cytotoxicity assays.", authors: "Mosmann T", journal: "Journal of immunological methods", year: "1983", doi: "10.1016/0022-1759(83)90303-4", note: "テトラゾリウム塩の還元量から生細胞数を比色定量する、MTT増殖アッセイの原点となった論文です。" },
    { pmid: "7123245", title: "Monoclonal antibody to 5-bromo- and 5-iododeoxyuridine: A new reagent for detection of DNA replication.", authors: "Gratzner HG", journal: "Science (New York, N.Y.)", year: "1982", doi: "10.1126/science.7123245", note: "BrdU取り込みを認識する抗体を作製し、DNA複製中の細胞を直接標識できるようにした画期的研究です。" }
  ],
  "ch04:t8": [
    { pmid: "8068938", title: "Annexin V for flow cytometric detection of phosphatidylserine expression on B cells undergoing apoptosis.", authors: "Koopman G et al.", journal: "Blood", year: "1994", doi: "", note: "アネキシンVでホスファチジルセリンの露出を検出し、アポトーシス細胞を定量する手法の原著です。" },
    { pmid: "1710634", title: "A rapid and simple method for measuring thymocyte apoptosis by propidium iodide staining and flow cytometry.", authors: "Nicoletti I et al.", journal: "Journal of immunological methods", year: "1991", doi: "10.1016/0022-1759(91)90198-o", note: "PI染色でsub-G1分画を測る簡便法を示し、アポトーシス定量の標準手技となった論文です。" }
  ],
  "ch04:t9": [
    { pmid: "1400587", title: "Identification of programmed cell death in situ via specific labeling of nuclear DNA fragmentation.", authors: "Gavrieli Y et al.", journal: "The Journal of cell biology", year: "1992", doi: "10.1083/jcb.119.3.493", note: "末端転移酵素でDNA切断端を標識し、組織切片上でアポトーシスを可視化するTUNEL法の原著です。" },
    { pmid: "3345800", title: "A simple technique for quantitation of low levels of DNA damage in individual cells.", authors: "Singh NP et al.", journal: "Experimental cell research", year: "1988", doi: "10.1016/0014-4827(88)90265-0", note: "アルカリ条件下の単一細胞ゲル電気泳動でDNA損傷を検出する、コメットアッセイの標準法を示しました。" }
  ],
  "ch04:t10": [
    { pmid: "2359136", title: "New colorimetric cytotoxicity assay for anticancer-drug screening.", authors: "Skehan P et al.", journal: "Journal of the National Cancer Institute", year: "1990", doi: "10.1093/jnci/82.13.1107", note: "スルホローダミンB染色による細胞量の比色定量法で、抗癌剤スクリーニングの標準手法となりました。" },
    { pmid: "22460902", title: "Systematic identification of genomic markers of drug sensitivity in cancer cells.", authors: "Garnett MJ et al.", journal: "Nature", year: "2012", doi: "10.1038/nature11005", note: "多数のがん細胞株と薬剤でIC50を測定し、感受性を規定するゲノム異常を体系的に同定しました。" }
  ],
  "ch04:t11": [
    { pmid: "2438036", title: "A rapid in vitro assay for quantitating the invasive potential of tumor cells.", authors: "Albini A et al.", journal: "Cancer research", year: "1987", doi: "", note: "基底膜成分を塗布したフィルターで腫瘍細胞の浸潤能を定量する、浸潤アッセイの原著論文です。" },
    { pmid: "17406593", title: "In vitro scratch assay: a convenient and inexpensive method for analysis of cell migration in vitro.", authors: "Liang CC et al.", journal: "Nature protocols", year: "2007", doi: "10.1038/nprot.2007.30", note: "単層培養に傷を付けて閉鎖速度を測る、簡便で安価なスクラッチアッセイの標準プロトコルです。" }
  ],
  "ch04:t12": [
    { pmid: "1385366", title: "Quantitation of adipose conversion and triglycerides by staining intracytoplasmic lipids with Oil red O.", authors: "Ramírez-Zacarías JL et al.", journal: "Histochemistry", year: "1992", doi: "10.1007/BF00316069", note: "Oil Red O染色の吸光度から細胞内中性脂肪量を定量する、脂肪分化評価の基本となった論文です。" },
    { pmid: "23702831", title: "Imaging of neutral lipids by oil red O for analyzing the metabolic status in health and disease.", authors: "Mehlem A et al.", journal: "Nature protocols", year: "2013", doi: "10.1038/nprot.2013.055", note: "組織や培養細胞の中性脂肪をOil Red Oで可視化し定量する、詳細な標準プロトコルです。" }
  ],
  "ch04:t13": [
    { pmid: "19329995", title: "Single Lgr5 stem cells build crypt-villus structures in vitro without a mesenchymal niche.", authors: "Sato T et al.", journal: "Nature", year: "2009", doi: "10.1038/nature07935", note: "単一のLgr5陽性幹細胞から陰窩絨毛構造を形成させ、腸管オルガノイド培養を確立した論文です。" },
    { pmid: "25957691", title: "Prospective derivation of a living organoid biobank of colorectal cancer patients.", authors: "van de Wetering M et al.", journal: "Cell", year: "2015", doi: "10.1016/j.cell.2015.03.053", note: "大腸癌患者由来オルガノイドのバイオバンクを構築し、薬剤応答と遺伝子異常を結び付けました。" }
  ],
  "ch04:t14": [
    { pmid: "5383844", title: 'Heterotransplantation of a human malignant tumour to "Nude" mice.', authors: "Rygaard J et al.", journal: "Acta pathologica et microbiologica Scandinavica", year: "1969", doi: "10.1111/j.1699-0463.1969.tb04520.x", note: "ヌードマウスにヒト腫瘍を移植して生着させた最初の報告で、異種移植実験の出発点となりました。" },
    { pmid: "25185190", title: "Patient-derived xenograft models: an emerging platform for translational cancer research.", authors: "Hidalgo M et al.", journal: "Cancer discovery", year: "2014", doi: "10.1158/2159-8290.CD-14-0001", note: "患者由来腫瘍移植モデルの作製法と、前臨床研究における意義や限界を整理した代表的な論文です。" }
  ],
  "ch04:t15": [
    { pmid: "13905658", title: "The serial cultivation of human diploid cell strains.", authors: "HAYFLICK L et al.", journal: "Experimental cell research", year: "1961", doi: "10.1016/0014-4827(61)90192-6", note: "ヒト正常線維芽細胞の分裂回数に限界があることを示し、細胞老化の概念を生んだ古典的研究です。" },
    { pmid: "7568133", title: "A biomarker that identifies senescent human cells in culture and in aging skin in vivo.", authors: "Dimri GP et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1995", doi: "10.1073/pnas.92.20.9363", note: "老化細胞で亢進するSA-β-galを指標に、培養細胞と加齢皮膚の老化細胞を検出しました。" }
  ]
});
