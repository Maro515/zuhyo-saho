/* 第8章（後半 t21-t39） 各手法を使った代表論文（PubMed検証済み） */
window.PAPERS = Object.assign(window.PAPERS || {}, {
  "ch08:t21": [
    { pmid: "19541911", title: "Circos: an information aesthetic for comparative genomics.", authors: "Krzywinski M et al.", journal: "Genome research", year: "2009", doi: "10.1101/gr.092759.109", note: "Circosの原著論文です。染色体を円環に並べ、リンクや帯でゲノム間の対応関係を一望できる作図法を提案しました。" },
    { pmid: "32025007", title: "Pan-cancer analysis of whole genomes.", authors: "ICGC/TCGA Pan-Cancer Analysis of Whole Genomes Consortium", journal: "Nature", year: "2020", doi: "10.1038/s41586-020-1969-6", note: "2658例の全ゲノムを統合した大規模解析です。構造異常や再構成の全体像をCircos図で示した代表例といえます。" }
  ],
  "ch08:t22": [
    { pmid: "25056061", title: "Biological insights from 108 schizophrenia-associated genetic loci.", authors: "Schizophrenia Working Group of the Psychiatric Genomics Consortium", journal: "Nature", year: "2014", doi: "10.1038/nature13595", note: "統合失調症で108領域を同定した大規模GWASです。Manhattanプロットで有意領域を示す典型例として知られます。" },
    { pmid: "36224396", title: "A saturated map of common genetic variants associated with human height.", authors: "Yengo L et al.", journal: "Nature", year: "2022", doi: "10.1038/s41586-022-05275-y", note: "500万人規模で身長のGWASを行った論文です。飽和に近い数の関連座位がManhattanプロット上に描かれています。" }
  ],
  "ch08:t23": [
    { pmid: "20634204", title: "LocusZoom: regional visualization of genome-wide association scan results.", authors: "Pruim RJ et al.", journal: "Bioinformatics (Oxford, England)", year: "2010", doi: "10.1093/bioinformatics/btq419", note: "Regionalプロットの標準ツールLocusZoomの原著です。連鎖不平衡と遺伝子配置を重ねて表示できます。" },
    { pmid: "30297969", title: "Fine-mapping type 2 diabetes loci to single-variant resolution using high-density imputation and islet-specific epigenome maps.", authors: "Mahajan A et al.", journal: "Nature genetics", year: "2018", doi: "10.1038/s41588-018-0241-6", note: "2型糖尿病座位を単一変異まで絞り込んだ研究です。Regionalプロットで責任候補変異を提示しています。" }
  ],
  "ch08:t24": [
    { pmid: "16255080", title: "A haplotype map of the human genome.", authors: "International HapMap Consortium", journal: "Nature", year: "2005", doi: "10.1038/nature04226", note: "国際HapMap計画の第一報です。ヒトゲノムのハプロタイプ構造とタグSNPの概念を確立した基盤論文です。" },
    { pmid: "17943122", title: "A second generation human haplotype map of over 3.1 million SNPs.", authors: "International HapMap Consortium et al.", journal: "Nature", year: "2007", doi: "10.1038/nature06258", note: "310万SNPに拡張した第二世代ハプロタイプ地図です。組換えホットスポットや選択の痕跡も解析しています。" }
  ],
  "ch08:t25": [
    { pmid: "16172379", title: 'Genome analysis of multiple pathogenic isolates of Streptococcus agalactiae: implications for the microbial "pan-genome".', authors: "Tettelin H et al.", journal: "Proceedings of the National Academy of Sciences of the United States of America", year: "2005", doi: "10.1073/pnas.0506758102", note: "パンゲノム概念を提唱した論文です。株数を増やすと新規遺伝子がどこまで増えるかを集積曲線で評価しています。" },
    { pmid: "24390350", title: "Discovery and saturation analysis of cancer genes across 21 tumour types.", authors: "Lawrence MS et al.", journal: "Nature", year: "2014", doi: "10.1038/nature12912", note: "がん21種で駆動遺伝子の発見数が症例数とともにどう飽和するかを解析し、必要症例数を集積曲線で論じています。" }
  ],
  "ch08:t26": [
    { pmid: "18516045", title: "Mapping and quantifying mammalian transcriptomes by RNA-Seq.", authors: "Mortazavi A et al.", journal: "Nature methods", year: "2008", doi: "10.1038/nmeth.1226", note: "バルクRNA-seqを確立した原著です。RPKMによる定量化を導入し、網羅的な転写産物測定の基礎を築きました。" },
    { pmid: "32913098", title: "The GTEx Consortium atlas of genetic regulatory effects across human tissues.", authors: "GTEx Consortium", journal: "Science (New York, N.Y.)", year: "2020", doi: "10.1126/science.aaz1776", note: "ヒト49組織のバルクRNA-seqを大規模に集積した資源論文です。組織別発現とeQTLの標準参照となっています。" }
  ],
  "ch08:t27": [
    { pmid: "19910308", title: "edgeR: a Bioconductor package for differential expression analysis of digital gene expression data.", authors: "Robinson MD et al.", journal: "Bioinformatics (Oxford, England)", year: "2010", doi: "10.1093/bioinformatics/btp616", note: "カウントデータの発現変動解析を負の二項分布で扱うedgeRの原著です。MAプロットの標準的な出力元となっています。" },
    { pmid: "25516281", title: "Moderated estimation of fold change and dispersion for RNA-seq data with DESeq2.", authors: "Love MI et al.", journal: "Genome biology", year: "2014", doi: "10.1186/s13059-014-0550-8", note: "DESeq2の原著です。発現量の低い遺伝子の対数比を縮小推定し、MAプロットの見え方を大きく改善しました。" }
  ],
  "ch08:t28": [
    { pmid: "30531897", title: "Dimensionality reduction for visualizing single-cell data using UMAP.", authors: "Becht E et al.", journal: "Nature biotechnology", year: "2018", doi: "10.1038/nbt.4314", note: "単一細胞データへのUMAP適用を示した論文です。t-SNEより高速で大域構造を保ちやすい点を実証しています。" },
    { pmid: "26000488", title: "Highly Parallel Genome-wide Expression Profiling of Individual Cells Using Nanoliter Droplets.", authors: "Macosko EZ et al.", journal: "Cell", year: "2015", doi: "10.1016/j.cell.2015.05.002", note: "Drop-seqの原著です。網膜細胞の多様性をt-SNE上のクラスターとして描き出した代表的な応用例です。" }
  ],
  "ch08:t29": [
    { pmid: "24658644", title: "The dynamics and regulators of cell fate decisions are revealed by pseudotemporal ordering of single cells.", authors: "Trapnell C et al.", journal: "Nature biotechnology", year: "2014", doi: "10.1038/nbt.2859", note: "Monocleの原著です。細胞を擬時間で並べ替え、分化の軌跡と分岐を可視化する解析枠組みを確立しました。" },
    { pmid: "30787437", title: "The single-cell transcriptional landscape of mammalian organogenesis.", authors: "Cao J et al.", journal: "Nature", year: "2019", doi: "10.1038/s41586-019-0969-x", note: "マウス胚200万細胞を解析した大規模研究です。Monocle3で器官形成の分化系譜を軌跡として描いています。" }
  ],
  "ch08:t30": [
    { pmid: "30089906", title: "RNA velocity of single cells.", authors: "La Manno G et al.", journal: "Nature", year: "2018", doi: "10.1038/s41586-018-0414-6", note: "RNA velocityを提唱した原著です。未成熟と成熟mRNAの比から細胞の将来状態を矢印で予測します。" },
    { pmid: "32747759", title: "Generalizing RNA velocity to transient cell states through dynamical modeling.", authors: "Bergen V et al.", journal: "Nature biotechnology", year: "2020", doi: "10.1038/s41587-020-0591-3", note: "scVeloの論文です。定常状態の仮定を外し、過渡的な細胞状態にもRNA velocityを適用可能にしました。" }
  ],
  "ch08:t31": [
    { pmid: "25924071", title: "MiXCR: software for comprehensive adaptive immunity profiling.", authors: "Bolotin DA et al.", journal: "Nature methods", year: "2015", doi: "10.1038/nmeth.3364", note: "TCR/BCRレパトア解析の標準ソフトMiXCRの原著です。配列からクロノタイプを高精度に再構成します。" },
    { pmid: "31359002", title: "Clonal replacement of tumor-specific T cells following PD-1 blockade.", authors: "Yost KE et al.", journal: "Nature medicine", year: "2019", doi: "10.1038/s41591-019-0522-3", note: "PD-1阻害後に腫瘍内T細胞クローンが入れ替わることを示した研究です。単一細胞TCRレパトア解析の代表例です。" }
  ],
  "ch08:t32": [
    { pmid: "19213877", title: "Genome-wide analysis in vivo of translation with nucleotide resolution using ribosome profiling.", authors: "Ingolia NT et al.", journal: "Science (New York, N.Y.)", year: "2009", doi: "10.1126/science.1168978", note: "Ribo-seqの原著です。リボソーム保護断片を配列決定し、翻訳を塩基分解能で網羅的に捉える手法を確立しました。" },
    { pmid: "22056041", title: "Ribosome profiling of mouse embryonic stem cells reveals the complexity and dynamics of mammalian proteomes.", authors: "Ingolia NT et al.", journal: "Cell", year: "2011", doi: "10.1016/j.cell.2011.10.002", note: "哺乳類細胞へRibo-seqを応用した研究です。上流ORFや非典型的な翻訳開始点を多数見いだしました。" }
  ],
  "ch08:t33": [
    { pmid: "27365449", title: "Visualization and analysis of gene expression in tissue sections by spatial transcriptomics.", authors: "Ståhl PL et al.", journal: "Science (New York, N.Y.)", year: "2016", doi: "10.1126/science.aaf2403", note: "Visiumの源流となる空間トランスクリプトーム法の原著です。組織切片上の位置情報を保ったまま発現を測定します。" },
    { pmid: "33558695", title: "Transcriptome-scale spatial gene expression in the human dorsolateral prefrontal cortex.", authors: "Maynard KR et al.", journal: "Nature neuroscience", year: "2021", doi: "10.1038/s41593-020-00787-0", note: "ヒト前頭前野をVisiumで解析し、皮質各層の遺伝子発現を空間的に描き出した代表的な応用研究です。" }
  ],
  "ch08:t34": [
    { pmid: "38114474", title: "High resolution mapping of the tumor microenvironment using integrated single-cell, spatial and in situ analysis.", authors: "Janesick A et al.", journal: "Nature communications", year: "2023", doi: "10.1038/s41467-023-43458-x", note: "Xeniumを用いて乳がん組織を単一細胞解像度で解析した論文です。scRNA-seqやVisiumとの統合も示しています。" },
    { pmid: "25858977", title: "RNA imaging. Spatially resolved, highly multiplexed RNA profiling in single cells.", authors: "Chen KH et al.", journal: "Science (New York, N.Y.)", year: "2015", doi: "10.1126/science.aaa6090", note: "MERFISHの原著です。イメージングベース空間解析の基礎となる多重FISHとバーコード復号法を確立しました。" }
  ],
  "ch08:t35": [
    { pmid: "35143307", title: "Spatial-CUT&Tag: Spatially resolved chromatin modification profiling at the cellular level.", authors: "Deng Y et al.", journal: "Science (New York, N.Y.)", year: "2022", doi: "10.1126/science.abg7216", note: "空間エピゲノム解析の代表的原著です。組織切片上でヒストン修飾の分布を細胞レベルで可視化しました。" },
    { pmid: "35978191", title: "Spatial profiling of chromatin accessibility in mouse and human tissues.", authors: "Deng Y et al.", journal: "Nature", year: "2022", doi: "10.1038/s41586-022-05094-1", note: "空間ATAC-seqを確立した論文です。クロマチン開閉状態の組織内分布を発現情報と併せて解析しています。" }
  ],
  "ch08:t36": [
    { pmid: "17540862", title: "Genome-wide mapping of in vivo protein-DNA interactions.", authors: "Johnson DS et al.", journal: "Science (New York, N.Y.)", year: "2007", doi: "10.1126/science.1141319", note: "ChIP-seqの原著の一つです。NRSFの結合部位をゲノム全域で同定し、転写因子解析の標準法を築きました。" },
    { pmid: "17512414", title: "High-resolution profiling of histone methylations in the human genome.", authors: "Barski A et al.", journal: "Cell", year: "2007", doi: "10.1016/j.cell.2007.05.009", note: "ヒストン修飾20種をChIP-seqで網羅した先駆的研究です。エピゲノム地図作成の出発点となりました。" }
  ],
  "ch08:t37": [
    { pmid: "24097267", title: "Transposition of native chromatin for fast and sensitive epigenomic profiling of open chromatin, DNA-binding proteins and nucleosome position.", authors: "Buenrostro JD et al.", journal: "Nature methods", year: "2013", doi: "10.1038/nmeth.2688", note: "ATAC-seqの原著です。トランスポゼースを用い、少量細胞から短時間で開いたクロマチンを検出できます。" },
    { pmid: "30361341", title: "The chromatin accessibility landscape of primary human cancers.", authors: "Corces MR et al.", journal: "Science (New York, N.Y.)", year: "2018", doi: "10.1126/science.aav1898", note: "TCGA検体410例をATAC-seqで解析した大規模研究です。がん種特異的な制御領域を体系的に示しました。" }
  ],
  "ch08:t38": [
    { pmid: "28079019", title: "An efficient targeted nuclease strategy for high-resolution mapping of DNA binding sites.", authors: "Skene PJ et al.", journal: "eLife", year: "2017", doi: "10.7554/eLife.21856", note: "CUT&RUNの原著です。ProteinA-MNaseで標的近傍を切り出し、低バックグラウンドで結合部位を同定します。" },
    { pmid: "31036827", title: "CUT&Tag for efficient epigenomic profiling of small samples and single cells.", authors: "Kaya-Okur HS et al.", journal: "Nature communications", year: "2019", doi: "10.1038/s41467-019-09982-5", note: "CUT&Tagの原著です。Tn5融合体を用いることで単一細胞レベルのエピゲノム解析まで可能にしました。" }
  ],
  "ch08:t39": [
    { pmid: "19815776", title: "Comprehensive mapping of long-range interactions reveals folding principles of the human genome.", authors: "Lieberman-Aiden E et al.", journal: "Science (New York, N.Y.)", year: "2009", doi: "10.1126/science.1181369", note: "Hi-Cの原著です。ゲノム全体の接触頻度地図からA/Bコンパートメントと分形球状構造を見いだしました。" },
    { pmid: "25497547", title: "A 3D map of the human genome at kilobase resolution reveals principles of chromatin looping.", authors: "Rao SS et al.", journal: "Cell", year: "2014", doi: "10.1016/j.cell.2014.11.021", note: "キロベース分解能のHi-C地図を作成した研究です。CTCFが関わるループとTADの構造原理を明らかにしました。" }
  ]
});
