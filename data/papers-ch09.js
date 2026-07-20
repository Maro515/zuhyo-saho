/* 第9章 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch09:t1": [
    { pmid: "2413450", title: "Rapid determination of 16S ribosomal RNA sequences for phylogenetic analyses.", authors: "Lane DJ et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "1985", doi: "10.1073/pnas.82.20.6955", note: "保存領域プライマーで16S rRNA遺伝子を増幅し解読する、細菌系統解析の基本手順を示した論文です。" },
    { pmid: "22699609", title: "Structure, function and diversity of the healthy human microbiome.", authors: "Human Microbiome Project Consortium", journal: "Nature", year: "2012", doi: "10.1038/nature11234", note: "健常者の全身各部位を16S解析し、ヒト常在菌叢の構造と多様性を大規模に記述した代表的研究です。" }
  ],
  "ch09:t2": [
    { pmid: "15001713", title: "Environmental genome shotgun sequencing of the Sargasso Sea.", authors: "Venter JC et al.", journal: "Science (New York, N.Y.)", year: "2004", doi: "10.1126/science.1093857", note: "海水中の全DNAをショットガン解読し、環境メタゲノム解析の実現可能性を示した先駆的研究です。" },
    { pmid: "20203603", title: "A human gut microbial gene catalogue established by metagenomic sequencing.", authors: "Qin J et al.", journal: "Nature", year: "2010", doi: "10.1038/nature08821", note: "腸内細菌叢を大規模にメタゲノム解析し、300万個を超える遺伝子カタログを構築した論文です。" }
  ],
  "ch09:t3": [
    { pmid: "7542800", title: "Whole-genome random sequencing and assembly of Haemophilus influenzae Rd.", authors: "Fleischmann RD et al.", journal: "Science (New York, N.Y.)", year: "1995", doi: "10.1126/science.7542800", note: "生物のゲノム全体をショットガン法で解読しアセンブルした世界初の報告で、細菌ゲノム解析の原点です。" },
    { pmid: "22506599", title: "SPAdes: a new genome assembly algorithm and its applications to single-cell sequencing.", authors: "Bankevich A et al.", journal: "Journal of computational biology : a journal of computational molecular cell biology", year: "2012", doi: "10.1089/cmb.2012.0021", note: "不均一なカバレッジにも対応するde Bruijnグラフ型アセンブラSPAdesを開発した論文です。" }
  ],
  "ch09:t4": [
    { pmid: "26157614", title: "Compact graphical representation of phylogenetic data and metadata with GraPhlAn.", authors: "Asnicar F et al.", journal: "PeerJ", year: "2015", doi: "10.7717/peerj.1029", note: "系統樹に存在量やメタデータを環状に重ねて描くGraPhlAnを開発し公開した原著論文です。" },
    { pmid: "38049781", title: "Exploring the microbial diversity and characterization of cellulase and hemicellulase genes in goat rumen: a metagenomic approach.", authors: "Thapa S et al.", journal: "BMC biotechnology", year: "2023", doi: "10.1186/s12896-023-00821-6", note: "ヤギ第一胃のメタゲノムをGraPhlAnで可視化し、微生物多様性と酵素遺伝子を解析した応用例です。" }
  ],
  "ch09:t5": [
    { pmid: "31708888", title: "Rarefaction, Alpha Diversity, and Statistics.", authors: "Willis AD", journal: "Frontiers in microbiology", year: "2019", doi: "10.3389/fmicb.2019.02407", note: "レアファクションとα多様性指標の統計的な扱い方を整理し、誤用への注意点を示した解説論文です。" },
    { pmid: "19043404", title: "A core gut microbiome in obese and lean twins.", authors: "Turnbaugh PJ et al.", journal: "Nature", year: "2009", doi: "10.1038/nature07540", note: "双子コホートの腸内細菌叢を比較し、肥満で多様性が低下することをα多様性解析で示しました。" }
  ],
  "ch09:t6": [
    { pmid: "16332807", title: "UniFrac: a new phylogenetic method for comparing microbial communities.", authors: "Lozupone C et al.", journal: "Applied and environmental microbiology", year: "2005", doi: "10.1128/AEM.71.12.8228-8235.2005", note: "系統樹上の枝長を用いて群集間の距離を測るUniFracを提案した、β多様性解析の基盤論文です。" },
    { pmid: "22699611", title: "Human gut microbiome viewed across age and geography.", authors: "Yatsunenko T et al.", journal: "Nature", year: "2012", doi: "10.1038/nature11053", note: "年齢と地域を横断したコホートでUniFrac距離を用い、腸内細菌叢の地域差と加齢変化を示しました。" }
  ]
});
