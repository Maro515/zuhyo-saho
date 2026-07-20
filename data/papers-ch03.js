/* 第3章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch03:t1": [
    { pmid: "7348605", title: "Video-enhanced contrast, differential interference contrast (AVEC-DIC) microscopy: a new method capable of analyzing microtubule-related motility in the reticulopodial network of Allogromia laticollaris.", authors: "Allen RD et al.", journal: "Cell motility", year: "1981", doi: "10.1002/cm.970010303", note: "ビデオ増感による微分干渉観察法を確立し、無染色のまま微小管レベルの動きまで可視化してみせた原著です。" },
    { pmid: "3926325", title: "Identification of a novel force-generating protein, kinesin, involved in microtubule-based motility.", authors: "Vale RD et al.", journal: "Cell", year: "1985", doi: "10.1016/s0092-8674(85)80099-4", note: "ビデオ増感DIC観察で微小管上を動く粒子を追跡し、キネシンの発見につなげた代表的な応用研究です。" }
  ],
  "ch03:t2": [
    { pmid: "3112165", title: "An evaluation of confocal versus conventional imaging of biological structures by fluorescence light microscopy.", authors: "White JG et al.", journal: "The Journal of cell biology", year: "1987", doi: "10.1083/jcb.105.1.41", note: "共焦点像と通常の蛍光像を直接比較し、生物試料での有用性を実証して共焦点顕微鏡を普及させた論文です。" },
    { pmid: "17972876", title: "Transgenic strategies for combinatorial expression of fluorescent proteins in the nervous system.", authors: "Livet J et al.", journal: "Nature", year: "2007", doi: "10.1038/nature06293", note: "多色の蛍光タンパク質で神経を染め分けたBrainbowを共焦点で三次元観察した、代表的な応用研究です。" }
  ],
  "ch03:t3": [
    { pmid: "17121392", title: "Enzyme-labeled antibodies: preparation and application for the localization of antigens.", authors: "Nakane PK et al.", journal: "The journal of histochemistry and cytochemistry : official journal of the Histochemistry Society", year: "1966", doi: "10.1177/14.12.929", note: "酵素を標識した抗体で組織切片中の抗原を光学顕微鏡下に可視化する、免疫組織化学の原理を確立した原著です。" },
    { pmid: "6166661", title: "Use of avidin-biotin-peroxidase complex (ABC) in immunoperoxidase techniques: a comparison between ABC and unlabeled antibody (PAP) procedures.", authors: "Hsu SM et al.", journal: "The journal of histochemistry and cytochemistry : official journal of the Histochemistry Society", year: "1981", doi: "10.1177/29.4.6166661", note: "アビジン・ビオチン複合体法を導入して検出感度を大きく高め、現在のIHC染色の標準手順を作った論文です。" }
  ],
  "ch03:t4": [
    { pmid: "15395569", title: "Localization of antigen in tissue cells; improvements in a method for the detection of antigen by means of fluorescent antibody.", authors: "COONS AH et al.", journal: "The Journal of experimental medicine", year: "1950", doi: "10.1084/jem.91.1.1", note: "蛍光標識抗体で組織内の抗原を検出する方法を改良し、免疫蛍光染色を実用的な技術に育てた原著です。" },
    { pmid: "417343", title: "Cytoplasmic microtubular images in glutaraldehyde-fixed tissue culture cells by electron microscopy and by immunofluorescence microscopy.", authors: "Weber K et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1978", doi: "10.1073/pnas.75.4.1820", note: "免疫蛍光像と電子顕微鏡像を対比し、蛍光で描いた微小管網が実像であることを裏づけた応用研究です。" }
  ],
  "ch03:t5": [
    { pmid: "23818604", title: "Highly multiplexed single-cell analysis of formalin-fixed, paraffin-embedded cancer tissue.", authors: "Gerdes MJ et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2013", doi: "10.1073/pnas.1300136110", note: "染色と蛍光の消去を繰り返して同一切片で数十種類の抗原を検出する、超多色染色の枠組みを確立した論文です。" },
    { pmid: "30078711", title: "Deep Profiling of Mouse Splenic Architecture with CODEX Multiplexed Imaging.", authors: "Goltsev Y et al.", journal: "Cell", year: "2018", doi: "10.1016/j.cell.2018.07.010", note: "DNAで標識した抗体を使うCODEXにより脾臓を多重染色し、組織の細胞構築を地図化した代表的な応用研究です。" }
  ],
  "ch03:t6": [
    { pmid: "15514700", title: "Serial block-face scanning electron microscopy to reconstruct three-dimensional tissue nanostructure.", authors: "Denk W et al.", journal: "PLoS biology", year: "2004", doi: "10.1371/journal.pbio.0020329", note: "樹脂ブロックを削りながらSEM撮影を繰り返し、組織を三次元再構築する連続ブロック面SEMの原著です。" },
    { pmid: "23925239", title: "Connectomic reconstruction of the inner plexiform layer in the mouse retina.", authors: "Helmstaedter M et al.", journal: "Nature", year: "2013", doi: "10.1038/nature12346", note: "連続ブロック面SEMでマウス網膜の神経回路を網羅的に再構築した、コネクトーム研究の代表例です。" }
  ],
  "ch03:t7": [
    { pmid: "19871454", title: "A STUDY OF TISSUE CULTURE CELLS BY ELECTRON MICROSCOPY : METHODS AND PRELIMINARY OBSERVATIONS.", authors: "Porter KR et al.", journal: "The Journal of experimental medicine", year: "1945", doi: "10.1084/jem.81.3.233", note: "培養細胞を透過電子顕微鏡で観察した先駆的研究で、小胞体を含む細胞内の微細構造を初めて描き出しました。" },
    { pmid: "4348786", title: "Evidence for recycling of synaptic vesicle membrane during transmitter release at the frog neuromuscular junction.", authors: "Heuser JE et al.", journal: "The Journal of cell biology", year: "1973", doi: "10.1083/jcb.57.2.315", note: "透過電顕像からシナプス小胞膜の再利用を示し、開口放出とリサイクルの概念を確立した代表的な応用研究です。" }
  ],
  "ch03:t8": [
    { pmid: "10629217", title: "Correlative light-electron microscopy reveals the tubular-saccular ultrastructure of carriers operating between Golgi apparatus and plasma membrane.", authors: "Polishchuk RS et al.", journal: "The Journal of cell biology", year: "2000", doi: "10.1083/jcb.148.1.45", note: "生細胞の蛍光観察と同一部位の電顕像を対応づけ、ゴルジ体由来の輸送体の実体を明かしたCLEMの代表例です。" },
    { pmid: "21200030", title: "Correlated fluorescence and 3D electron microscopy with high sensitivity and spatial precision.", authors: "Kukulski W et al.", journal: "The Journal of cell biology", year: "2011", doi: "10.1083/jcb.201009037", note: "蛍光像と電顕像を数十ナノメートルの精度で重ね合わせる手順を確立し、CLEMの定量性を大きく高めました。" }
  ],
  "ch03:t9": [
    { pmid: "2321027", title: "Two-photon laser scanning fluorescence microscopy.", authors: "Denk W et al.", journal: "Science (New York, N.Y.)", year: "1990", doi: "10.1126/science.2321027", note: "二光子励起により深部を低退色で観察できる走査型蛍光顕微鏡を初めて実現した原著です。" },
    { pmid: "8990119", title: "In vivo dendritic calcium dynamics in neocortical pyramidal neurons.", authors: "Svoboda K et al.", journal: "Nature", year: "1997", doi: "10.1038/385161a0", note: "生きたマウスの大脳皮質で錐体細胞の樹状突起のカルシウム動態を二光子観察した、代表的な応用研究です。" }
  ],
  "ch03:t10": [
    { pmid: "15310904", title: "Optical sectioning deep inside live embryos by selective plane illumination microscopy.", authors: "Huisken J et al.", journal: "Science (New York, N.Y.)", year: "2004", doi: "10.1126/science.1100035", note: "薄いシート状の光を側面から当てて生きた胚の深部を低侵襲に光学切片化した、ライトシート顕微鏡の原著です。" },
    { pmid: "18845710", title: "Reconstruction of zebrafish early embryonic development by scanned light sheet microscopy.", authors: "Keller PJ et al.", journal: "Science (New York, N.Y.)", year: "2008", doi: "10.1126/science.1162493", note: "走査型ライトシートでゼブラフィッシュ初期胚の細胞をほぼ全数追跡した、代表的な応用研究です。" }
  ],
  "ch03:t11": [
    { pmid: "7014571", title: "Cell-substrate contacts illuminated by total internal reflection fluorescence.", authors: "Axelrod D", journal: "The Journal of cell biology", year: "1981", doi: "10.1083/jcb.89.1.141", note: "エバネッセント光で細胞と基板の接着面だけを照らす全反射照明蛍光観察を、細胞生物学に導入した原著です。" },
    { pmid: "10707088", title: "Single-molecule imaging of EGFR signalling on the surface of living cells.", authors: "Sako Y et al.", journal: "Nature cell biology", year: "2000", doi: "10.1038/35004044", note: "全反射照明で生細胞膜上のEGF受容体を1分子ずつ観察し、二量体化の過程を捉えた代表的な応用研究です。" }
  ],
  "ch03:t12": [
    { pmid: "16902090", title: "Imaging intracellular fluorescent proteins at nanometer resolution.", authors: "Betzig E et al.", journal: "Science (New York, N.Y.)", year: "2006", doi: "10.1126/science.1127344", note: "光活性化蛍光タンパク質を1分子ずつ光らせて位置を決めるPALMを示した、超解像顕微鏡の原著です。" },
    { pmid: "28739933", title: "Structural organization of the actin-spectrin-based membrane skeleton in dendrites and soma of neurons.", authors: "Han B et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2017", doi: "10.1073/pnas.1705043114", note: "STORM超解像で神経細胞の樹状突起や細胞体にある膜骨格の周期構造を明かした、代表的な応用研究です。" }
  ],
  "ch03:t13": [
    { pmid: "786399", title: "Mobility measurement by analysis of fluorescence photobleaching recovery kinetics.", authors: "Axelrod D et al.", journal: "Biophysical journal", year: "1976", doi: "10.1016/S0006-3495(76)85755-4", note: "褪色後の蛍光回復曲線から拡散係数と可動率を求める、FRAP解析の理論と手順を示した原著です。" },
    { pmid: "10766243", title: "High mobility of proteins in the mammalian cell nucleus.", authors: "Phair RD et al.", journal: "Nature", year: "2000", doi: "10.1038/35007077", note: "FRAPにより核内のタンパク質が想定よりはるかに速く動き回ることを示した、細胞核研究の代表的な応用例です。" }
  ]
});
