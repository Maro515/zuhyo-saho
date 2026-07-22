/* 第12章 代表論文（その他：先端装置 t51〜t73 / PubMed・NCBI ESummary検証済み）
   pmid/title/journal/year は実在確認済み。authors・doi は NCBI ESummary の権威値で再構成。 */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch12:t51": [
    { pmid: "28008086", title: "Nanometer resolution imaging and tracking of fluorescent molecules with minimal photon fluxes.", authors: "Balzarotti F et al.", journal: "Science (New York, N.Y.)", year: "2017", doi: "10.1126/science.aak9913", note: "強度ゼロの励起点を使うMINFLUXの概念を提案し、従来法の約1/22の光子で約1nmの局在化と6nm分解を示した原著です。" },
    { pmid: "33674570", title: "MINFLUX nanometer-scale 3D imaging and microsecond-range tracking on a common fluorescence microscope.", authors: "Schmidt R et al.", journal: "Nature communications", year: "2021", doi: "10.1038/s41467-021-21652-z", note: "標準的な顕微鏡スタンド上で1〜3nmの3次元分解能とマイクロ秒域トラッキングを実現し、MINFLUXの一般利用を後押しした代表的実装です。" },
  ],
  "ch12:t52": [
    { pmid: "19095943", title: "Label-free biomedical imaging with high sensitivity by stimulated Raman scattering microscopy.", authors: "Freudiger CW et al.", journal: "Science (New York, N.Y.)", year: "2008", doi: "10.1126/science.1165758", note: "高周波変調と位相敏感検出により背景のない解釈しやすい化学コントラストを得るSRS顕微鏡を確立した原著論文です。" },
    { pmid: "26324899", title: "Label-free DNA imaging in vivo with stimulated Raman scattering microscopy.", authors: "Lu FK et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2015", doi: "10.1073/pnas.1515121112", note: "C–H結合のスペクトル特徴からDNAを無標識で画像化し、生体内の分裂観察や無標識病理診断への応用を示した代表例です。" },
  ],
  "ch12:t53": [
    { pmid: "15616687", title: "Time-resolved fluorescence microscopy.", authors: "Suhling K et al.", journal: "Photochemical & photobiological sciences : Official journal of the European Photochemistry Association and the European Society for Photobiology", year: "2005", doi: "10.1039/b412924p", note: "時間ゲート・位相変調・TCSPCなどFLIM各方式の長短を整理し、FRETや環境計測への応用を体系化した基礎となる総説です。" },
    { pmid: "18766302", title: "Multiphoton microscopy and fluorescence lifetime imaging microscopy (FLIM) to monitor metastasis and the tumor microenvironment.", authors: "Provenzano PP et al.", journal: "Clinical & experimental metastasis", year: "2009", doi: "10.1007/s10585-008-9204-0", note: "多光子FLIM/SLIMを腫瘍微小環境の観察に応用し、NADH/FADの代謝状態やFRETを内在指標として読む代表的な応用例です。" },
  ],
  "ch12:t54": [
    { pmid: "20037592", title: "Adaptive optics via pupil segmentation for high-resolution imaging in biological tissues.", authors: "Ji N et al.", journal: "Nature methods", year: "2010", doi: "10.1038/nmeth.1411", note: "対物瞳を分割して部分ごとの光線の傾きから収差を測る方式を提案し、2光子顕微鏡で深部の解像度回復を示した原著です。" },
    { pmid: "35252878", title: "Adaptive optics for high-resolution imaging.", authors: "Hampson KM et al.", journal: "Nature reviews. Methods primers", year: "2021", doi: "10.1038/s43586-021-00066-7", note: "天文・視覚科学・顕微鏡を横断して適応光学の原理・装置・再現性上の注意を整理した、読み方の指針となる総説です。" },
  ],
  "ch12:t55": [
    { pmid: "22442475", title: "Photoacoustic tomography: in vivo imaging from organelles to organs.", authors: "Wang LV et al.", journal: "Science (New York, N.Y.)", year: "2012", doi: "10.1126/science.1216210", note: "分解能が撮像深さの約1/200という設計則と、血管・酸素代謝・分子コントラストへの広がりを体系化した代表的総説です。" },
    { pmid: "16674205", title: "Noninvasive imaging of hemoglobin concentration and oxygenation in the rat brain using high-resolution photoacoustic tomography.", authors: "Wang X et al.", journal: "Journal of biomedical optics", year: "2006", doi: "10.1117/1.2192804", note: "多波長光音響で頭蓋越しにヘモグロビン濃度と酸素飽和度を非侵襲に画像化し、機能イメージングの実力を示した代表例です。" },
  ],
  "ch12:t56": [
    { pmid: "15514700", title: "Serial block-face scanning electron microscopy to reconstruct three-dimensional tissue nanostructure.", authors: "Denk W et al.", journal: "PLoS biology", year: "2004", doi: "10.1371/journal.pbio.0020329", note: "SEMチャンバー内で試料表面を削っては撮る操作を自動化し、神経回路追跡に足る連続断面を得たボリュームEM（SBF-SEM）の原著です。" },
    { pmid: "28500755", title: "Enhanced FIB-SEM systems for large-volume 3D imaging.", authors: "Xu CS et al.", journal: "eLife", year: "2017", doi: "10.7554/eLife.25916", note: "FIB-SEMの速度と安定性を高め、10⁶µm³超の大体積を等方的なz分解能で連続撮像できるようにした代表研究です。" },
  ],
  "ch12:t57": [
    { pmid: "21293373", title: "Femtosecond X-ray protein nanocrystallography.", authors: "Chapman HN et al.", journal: "Nature", year: "2011", doi: "10.1038/nature09750", note: "光化学系Iのナノ結晶からフェムト秒回折を統合し、損傷が現れる前に撮り切るdiffraction-before-destructionを実証した原著です。" },
    { pmid: "22653729", title: "High-resolution protein structure determination by serial femtosecond crystallography.", authors: "Boutet S et al.", journal: "Science (New York, N.Y.)", year: "2012", doi: "10.1126/science.1217737", note: "リゾチームの微結晶からSFXで高分解能構造を決め、シンクロトロン構造と一致することを示して実用性を確立した代表研究です。" },
  ],
  "ch12:t58": [
    { pmid: "20558299", title: "Structural characterization of proteins and complexes using small-angle X-ray solution scattering.", authors: "Mertens HD et al.", journal: "Journal of structural biology", year: "2010", doi: "10.1016/j.jsb.2010.06.012", note: "溶液SAXSでRgやオリゴマー状態、低分解能形状を求める解析法を体系的にまとめた、bio-SAXSの標準的な総説です。" },
    { pmid: "18078545", title: "X-ray solution scattering (SAXS) combined with crystallography and computation: defining accurate macromolecular structures, conformations and assemblies in solution.", authors: "Putnam CD et al.", journal: "Quarterly reviews of biophysics", year: "2007", doi: "10.1017/S0033583507004635", note: "SAXSを結晶構造・計算と組み合わせ、溶液中の形・柔軟性・集合状態を精密化する実務的枠組みを示した代表的総説です。" },
  ],
  "ch12:t59": [
    { pmid: "29700264", title: "Quantitative mass imaging of single biological macromolecules.", authors: "Young G et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aar5839", note: "干渉散乱コントラストが質量に比例することを較正し、溶液中の1分子の質量を高精度で測るmass photometryを確立した原著です。" },
    { pmid: "32167227", title: "Quantifying Protein-Protein Interactions by Molecular Counting with Mass Photometry.", authors: "Soltermann F et al.", journal: "Angewandte Chemie (International ed. in English)", year: "2020", doi: "10.1002/anie.202001578", note: "質量ヒストグラムのピークを数えて化学量論と結合親和性を求め、無標識でタンパク質相互作用を定量できることを示した代表研究です。" },
  ],
  "ch12:t60": [
    { pmid: "8628994", title: "Overstretching B-DNA: the elastic response of individual double-stranded and single-stranded DNA molecules.", authors: "Smith SB et al.", journal: "Science (New York, N.Y.)", year: "1996", doi: "10.1126/science.271.5250.795", note: "力測定用レーザーピンセットで1本のDNAを引き、約65pNでの協同的なoverstretch転移を発見した1分子力計測の原著です。" },
    { pmid: "22949705", title: "Tension induces a base-paired overstretched DNA conformation.", authors: "Bosaeus N et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2012", doi: "10.1073/pnas.1213172109", note: "配列を設計したDNAを光ピンセットで引き、overstretchが融解なのか塩基対を保った新形態なのかを配列依存で切り分けた代表研究です。" },
  ],
  "ch12:t61": [
    { pmid: "8596951", title: "The elasticity of a single supercoiled DNA molecule.", authors: "Strick TR et al.", journal: "Science (New York, N.Y.)", year: "1996", doi: "10.1126/science.271.5257.1835", note: "両端を固定した1本のDNAを過巻き・巻き戻しし、磁気ピンセットによる回転–伸長曲線と超らせん転移を初めて観測した基礎論文です。" },
    { pmid: "20624816", title: "Torsional sensing of small-molecule binding using magnetic tweezers.", authors: "Lipfert J et al.", journal: "Nucleic acids research", year: "2010", doi: "10.1093/nar/gkq598", note: "力とトルクを制御する磁気ピンセットで、DNA結合小分子が二重らせんのねじれをどう変えるかを1分子で定量した代表的応用です。" },
  ],
  "ch12:t62": [
    { pmid: "34596858", title: "Determining the Binding Kinetics of Peptide Macrocycles Using Bio-Layer Interferometry (BLI).", authors: "Rhea K", journal: "Methods in molecular biology (Clifton, N.J.)", year: "2022", doi: "10.1007/978-1-0716-1689-5_19", note: "ペプチド大環状化合物とタンパク質の結合速度・親和性（KD）をBLIで求める手順を示した、手法に即した実務的な方法論文です。" },
    { pmid: "39898377", title: "Analyzing DNA-Protein Interactions with Streptavidin-Based Biolayer Interferometry.", authors: "Battapadi T et al.", journal: "Journal of visualized experiments : JoVE", year: "2025", doi: "10.3791/66534", note: "ストレプトアビジンセンサーにDNAを固定し、DNA–タンパク質結合の会合・解離速度と KD をBLIで測る手順を丁寧に解説した論文です。" },
  ],
  "ch12:t63": [
    { pmid: "20981028", title: "Protein-binding assays in biological liquids using microscale thermophoresis.", authors: "Wienken CJ et al.", journal: "Nature communications", year: "2010", doi: "10.1038/ncomms1093", note: "熱泳動を結合測定に応用し、血清や細胞抽出液の中でもタンパク質の親和性を測れることを実証したMSTの基礎的な代表論文です。" },
    { pmid: "29580877", title: "Establishment of a novel microscale thermophoresis ligand-binding assay for characterization of SLC solute carriers using oligopeptide transporter PepT1 (SLC15 family) as a model system.", authors: "Clémençon B et al.", journal: "Journal of pharmacological and toxicological methods", year: "2018", doi: "10.1016/j.vascn.2018.03.004", note: "精製の難しい膜輸送体SLCの基質結合を、精製なしにMSTで測る方法を確立した応用例で、用量反応から KD を求めます。" },
  ],
  "ch12:t64": [
    { pmid: "17853878", title: "The use of differential scanning fluorimetry to detect ligand interactions that promote protein stability.", authors: "Niesen FH et al.", journal: "Nature protocols", year: "2007", doi: "10.1038/nprot.2007.321", note: "リアルタイムPCR装置で行う熱シフト法（DSF）の標準プロトコルを示し、安定化リガンド探索を広く普及させた代表論文です。" },
    { pmid: "30414312", title: "nanoDSF as screening tool for enzyme libraries and biotechnology development.", authors: "Magnusson AO et al.", journal: "The FEBS journal", year: "2019", doi: "10.1111/febs.14696", note: "色素を使わないnanoDSFで多数の酵素変異体の融解温度を高速に測り、熱安定な酵素をスクリーニングした応用例です。" },
  ],
  "ch12:t65": [
    { pmid: "17406547", title: "Using circular dichroism spectra to estimate protein secondary structure.", authors: "Greenfield NJ", journal: "Nature protocols", year: "2006", doi: "10.1038/nprot.2006.202", note: "CDスペクトルの取得から二次構造推定までの基本手順を丁寧にまとめた、CD解析の定番となっている方法論文です。" },
    { pmid: "29893907", title: "BeStSel: a web server for accurate protein secondary structure prediction and fold recognition from the circular dichroism spectra.", authors: "Micsonai A et al.", journal: "Nucleic acids research", year: "2018", doi: "10.1093/nar/gky497", note: "βシートのスペクトル多様性を取り込み、二次構造推定と折りたたみ分類を行うBeStSelサーバを公開した代表論文です。" },
  ],
  "ch12:t66": [
    { pmid: "16565040", title: "Macromolecular size-and-shape distributions by sedimentation velocity analytical ultracentrifugation.", authors: "Brown PH et al.", journal: "Biophysical journal", year: "2006", doi: "10.1529/biophysj.106.081372", note: "拡散を差し引いて大きさと形を同時に分布として得る c(s,fr) 法を示した、現在の沈降速度解析の基盤となる代表的方法論です。" },
    { pmid: "34986360", title: "Best Practices for Aggregate Quantitation of Antibody Therapeutics by Sedimentation Velocity Analytical Ultracentrifugation.", authors: "Bou-Assaf GM et al.", journal: "Journal of pharmaceutical sciences", year: "2022", doi: "10.1016/j.xphs.2021.12.023", note: "抗体医薬の凝集体定量にSV-AUCを使う実務の指針を業界横断でまとめた、代表的な応用・標準化の論文です。" },
  ],
  "ch12:t67": [
    { pmid: "15450495", title: "Native protein mass spectrometry: from intact oligomers to functional machineries.", authors: "van den Heuvel RH et al.", journal: "Current opinion in chemical biology", year: "2004", doi: "10.1016/j.cbpa.2004.08.006", note: "無傷の複合体を測る「ネイティブ質量分析」という分野を定義づけ、リボソームやウイルスまでの応用を展望した代表的総説です。" },
    { pmid: "18055462", title: "Stoichiometry of the peripheral stalk subunits E and G of yeast V1-ATPase determined by mass spectrometry.", authors: "Kitagawa N et al.", journal: "The Journal of biological chemistry", year: "2008", doi: "10.1074/jbc.M707924200", note: "無傷複合体とサブユニットの質量から、V1-ATPaseのEとGが3個ずつという化学量論を決めた、ネイティブMSの典型的応用例です。" },
  ],
  "ch12:t68": [
    { pmid: "20979392", title: "Collision cross sections of proteins and their complexes: a calibration framework and database for gas-phase structural biology.", authors: "Bush MF et al.", journal: "Analytical chemistry", year: "2010", doi: "10.1021/ac1022953", note: "タンパク質と複合体のCCSを測ってデータベース化し、トラベリングウェーブ型IM-MSの校正の枠組みを定めた基盤的論文です。" },
    { pmid: "36827511", title: "Ion Mobility Mass Spectrometry (IM-MS) for Structural Biology: Insights Gained by Measuring Mass, Charge, and Collision Cross Section.", authors: "Christofi E et al.", journal: "Chemical reviews", year: "2023", doi: "10.1021/acs.chemrev.2c00600", note: "質量・電荷・衝突断面積の3つを測って構造情報を引き出すIM-MSの原理と応用を包括的にまとめた代表的総説です。" },
  ],
  "ch12:t69": [
    { pmid: "22035192", title: "High-throughput droplet digital PCR system for absolute quantitation of DNA copy number.", authors: "Hindson BJ et al.", journal: "Analytical chemistry", year: "2011", doi: "10.1021/ac202028g", note: "約2万滴に分けてDNAコピー数を絶対定量する液滴デジタルPCRシステムを報告した、ddPCR普及の起点となる原著です。" },
    { pmid: "25981265", title: "Droplet digital PCR for absolute quantification of pathogens.", authors: "Gutiérrez-Aguirre I et al.", journal: "Methods in molecular biology (Clifton, N.J.)", year: "2015", doi: "10.1007/978-1-4939-2620-6_24", note: "Bio-Rad QX100を用いて病原体を絶対定量する具体的な手順を示した、ddPCRの代表的な実務応用の解説です。" },
  ],
  "ch12:t70": [
    { pmid: "26000488", title: "Highly Parallel Genome-wide Expression Profiling of Individual Cells Using Nanoliter Droplets.", authors: "Macosko EZ et al.", journal: "Cell", year: "2015", doi: "10.1016/j.cell.2015.05.002", note: "液滴にバーコードビーズと細胞を共封入するDrop-seqの原著。数万細胞を1個ずつ並列に転写解析する液滴1細胞ゲノミクスの代表例です。" },
    { pmid: "26226550", title: "The Poisson distribution and beyond: methods for microfluidic droplet production and single cell encapsulation.", authors: "Collins DJ et al.", journal: "Lab on a Chip", year: "2015", doi: "10.1039/c5lc00614g", note: "単一細胞封入をポアソン分布で整理し、能動的手法でその限界を超える戦略まで概説した批判的総説。ウィジェットの中心概念を裏づけます。" },
  ],
  "ch12:t71": [
    { pmid: "9027306", title: "Probing Single Molecules and Single Nanoparticles by Surface-Enhanced Raman Scattering.", authors: "Nie S et al.", journal: "Science", year: "1997", doi: "10.1126/science.275.5303.1102", note: "銀ナノ粒子上で単一分子のラマン信号を室温検出し、増強因子が10^14〜10^15に達しうることを示した金字塔的原著です。" },
    { pmid: "18157119", title: "In vivo tumor targeting and spectroscopic detection with surface-enhanced Raman nanoparticle tags.", authors: "Qian X et al.", journal: "Nature Biotechnology", year: "2008", doi: "10.1038/nbt1377", note: "金ナノ粒子SERSタグを生体投与し腫瘍を標的化・検出。近赤外での体内SERSイメージングを実証した代表的な生物医学応用です。" },
  ],
  "ch12:t72": [
    { pmid: "18833275", title: "Nanoscale magnetic sensing with an individual electronic spin in diamond.", authors: "Maze JR et al.", journal: "Nature", year: "2008", doi: "10.1038/nature07279", note: "単一NVスピンをコヒーレント操作し、ナノスケール分解能で微弱磁場を検出したNV磁気計測の原著。室温での量子センシングを確立しました。" },
    { pmid: "23903748", title: "Nanometre-scale thermometry in a living cell.", authors: "Kucsko G et al.", journal: "Nature", year: "2013", doi: "10.1038/nature12373", note: "ナノダイヤを生きたヒト細胞に導入し、細胞内温度を1.8 mK分解能で計測。NVが温度のナノセンサーにもなることを示した生物応用の代表例です。" },
  ],
  "ch12:t73": [
    { pmid: "27560178", title: "Cell Painting, a high-content image-based assay for morphological profiling using multiplexed fluorescent dyes.", authors: "Bray MA et al.", journal: "Nature Protocols", year: "2016", doi: "10.1038/nprot.2016.105", note: "6色の蛍光色素で8つの細胞構成要素を染め、約1,500の形態特徴量で表現型を数値化する汎用アッセイCell Paintingの標準手順。ハイコンテント手法の代表的方法論。" },
    { pmid: "15539606", title: "Multidimensional drug profiling by automated microscopy.", authors: "Perlman ZE et al.", journal: "Science", year: "2004", doi: "10.1126/science.1100709", note: "自動顕微鏡で1細胞の多次元表現型を測り、薬剤の作用機序を分類・推定した先駆的な応用。ハイコンテント・プロファイリングの原型を示した代表例。" },
  ],
});
