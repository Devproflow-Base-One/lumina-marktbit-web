/**
 * Stock API Client — Global Stocks Data Integration
 * 
 * Sources: Yahoo Finance API (free, no key needed)
 * Markets: US (NYSE, NASDAQ), Europe (LSE, Euronext, DAX), Asia (TSE, HKEX, SGX), Middle East (Tadawul, DFM), IDX (Indonesia)
 * 
 * Used alongside crypto signal engine for hybrid model.
 */

export type StockMarket = 'US' | 'UK' | 'CA' | 'EU' | 'DE' | 'FR' | 'IT' | 'ES' | 'NL' | 'CH' | 'SE' | 'NO' | 'DK' | 'FI' | 'BE' | 'AT' | 'PL' | 'CZ' | 'GR' | 'PT' | 'IE' | 'JP' | 'CN' | 'HK' | 'TW' | 'KR' | 'SG' | 'IN' | 'TH' | 'MY' | 'PH' | 'VN' | 'ID' | 'ME' | 'AU' | 'SA' | 'AFRICA'

export interface StockQuote {
  symbol: string
  name: string
  market: StockMarket
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  currency: string
  high52?: number
  low52?: number
  pe?: number
  dividend?: number
}

export interface StockSignal {
  id: string
  symbol: string
  name: string
  market: StockMarket
  signalType: 'BUY' | 'SELL' | 'HOLD'
  price: number
  confidence: number
  reason: string
  timestamp: string
  targetPrice?: number
  stopLoss?: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_STOCK_API_URL || 'http://localhost:8788/api/v1'

// ─── Market Indices ───
export const marketIndices: Record<StockMarket, { symbol: string; name: string; flag: string }> = {
  US: { symbol: '^GSPC', name: 'S&P 500', flag: '🇺🇸' },
  UK: { symbol: '^FTSE', name: 'FTSE 100', flag: '🇬🇧' },
  CA: { symbol: '^GSPTSE', name: 'S&P/TSX', flag: '🇨🇦' },
  EU: { symbol: '^STOXX50E', name: 'Euro Stoxx 50', flag: '🇪🇺' },
  DE: { symbol: '^GDAXI', name: 'DAX', flag: '🇩🇪' },
  FR: { symbol: '^FCHI', name: 'CAC 40', flag: '🇫🇷' },
  IT: { symbol: '^FTSEMIB', name: 'FTSE MIB', flag: '🇮🇹' },
  ES: { symbol: '^IBEX', name: 'IBEX 35', flag: '🇪🇸' },
  NL: { symbol: '^AEX', name: 'AEX', flag: '🇳🇱' },
  CH: { symbol: '^SSMI', name: 'SMI', flag: '🇨🇭' },
  SE: { symbol: '^OMXSPI', name: 'OMX Stockholm', flag: '🇸🇪' },
  NO: { symbol: '^OSEAX', name: 'OBX', flag: '🇳🇴' },
  DK: { symbol: '^OMXC20', name: 'OMX Copenhagen', flag: '🇩🇰' },
  FI: { symbol: '^OMXHPI', name: 'OMX Helsinki', flag: '🇫🇮' },
  BE: { symbol: '^BFX', name: 'BEL 20', flag: '🇧🇪' },
  AT: { symbol: '^ATX', name: 'ATX', flag: '🇦🇹' },
  PL: { symbol: '^WIG20', name: 'WIG20', flag: '🇵🇱' },
  CZ: { symbol: '^PX', name: 'PX', flag: '🇨🇿' },
  GR: { symbol: '^GD.AT', name: 'Athex', flag: '🇬🇷' },
  PT: { symbol: '^PSI20', name: 'PSI 20', flag: '🇵🇹' },
  IE: { symbol: '^ISEQ', name: 'ISEQ', flag: '🇮🇪' },
  JP: { symbol: '^N225', name: 'Nikkei 225', flag: '🇯🇵' },
  CN: { symbol: '000001.SS', name: 'Shanghai Composite', flag: '🇨🇳' },
  HK: { symbol: '^HSI', name: 'Hang Seng', flag: '🇭🇰' },
  TW: { symbol: '^TWII', name: 'Taiwan Weighted', flag: '🇹🇼' },
  KR: { symbol: '^KS11', name: 'KOSPI', flag: '🇰🇷' },
  SG: { symbol: '^STI', name: 'Straits Times', flag: '🇸🇬' },
  IN: { symbol: '^NSEI', name: 'NIFTY 50', flag: '🇮🇳' },
  TH: { symbol: '^SET.BK', name: 'SET', flag: '🇹🇭' },
  MY: { symbol: '^KLSE', name: 'KLCI', flag: '🇲🇾' },
  PH: { symbol: '^PSEI', name: 'PSE Composite', flag: '🇵🇭' },
  VN: { symbol: '^VNINDEX', name: 'VN Index', flag: '🇻🇳' },
  ID: { symbol: '^JKSE', name: 'Jakarta Composite', flag: '🇮🇩' },
  ME: { symbol: '^TASI.SR', name: 'Tadawul All Share', flag: '🇸🇦' },
  AU: { symbol: '^AXJO', name: 'ASX 200', flag: '🇦🇺' },
  SA: { symbol: '^BVSP', name: 'Bovespa', flag: '🇧🇷' },
  AFRICA: { symbol: '^JALSH', name: 'JSE Top 40', flag: '🇿🇦' },
}

// ─── Popular stocks by market ───
export const popularStocks: Record<StockMarket, { symbol: string; name: string }[]> = {
  US: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'AMD', name: 'Advanced Micro Devices' },
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'V', name: 'Visa Inc.' },
  ],
  UK: [
    { symbol: 'HSBA.L', name: 'HSBC Holdings' },
    { symbol: 'BARC.L', name: 'Barclays' },
    { symbol: 'RIO.L', name: 'Rio Tinto' },
    { symbol: 'BP.L', name: 'BP plc' },
    { symbol: 'GSK.L', name: 'GSK plc' },
    { symbol: 'AZN.L', name: 'AstraZeneca' },
    { symbol: 'DGE.L', name: 'Diageo' },
    { symbol: 'ULVR.L', name: 'Unilever' },
    { symbol: 'REL.L', name: 'RELX Group' },
    { symbol: 'NG.L', name: 'National Grid' },
  ],
  CA: [
    { symbol: 'RY.TO', name: 'Royal Bank of Canada' },
    { symbol: 'TD.TO', name: 'Toronto-Dominion Bank' },
    { symbol: 'BMO.TO', name: 'Bank of Montreal' },
    { symbol: 'BNS.TO', name: 'Bank of Nova Scotia' },
    { symbol: 'CM.TO', name: 'CIBC' },
    { symbol: 'SHOP.TO', name: 'Shopify' },
    { symbol: 'CNQ.TO', name: 'Canadian Natural Resources' },
    { symbol: 'ENB.TO', name: 'Enbridge' },
    { symbol: 'BAM.TO', name: 'Brookfield Asset Management' },
    { symbol: 'ATD.TO', name: 'Alimentation Couche-Tard' },
  ],
  EU: [
    { symbol: 'MC.PA', name: 'LVMH' },
    { symbol: 'ASML.AS', name: 'ASML Holding' },
    { symbol: 'SAP.DE', name: 'SAP SE' },
    { symbol: 'NESN.SW', name: 'Nestle' },
    { symbol: 'OR.PA', name: "L'Oreal" },
    { symbol: 'SAN.PA', name: 'Sanofi' },
    { symbol: 'AIR.PA', name: 'Airbus' },
    { symbol: 'INGA.AS', name: 'ING Group' },
    { symbol: 'BNP.PA', name: 'BNP Paribas' },
    { symbol: 'DAI.DE', name: 'Daimler' },
  ],
  DE: [
    { symbol: 'SAP.DE', name: 'SAP SE' },
    { symbol: 'SIE.DE', name: 'Siemens' },
    { symbol: 'BMW.DE', name: 'BMW' },
    { symbol: 'VOW.DE', name: 'Volkswagen' },
    { symbol: 'BAS.DE', name: 'BASF' },
    { symbol: 'ALV.DE', name: 'Allianz' },
    { symbol: 'DAI.DE', name: 'Daimler' },
    { symbol: 'DPW.DE', name: 'Deutsche Post' },
    { symbol: 'LIN.DE', name: 'Linde' },
    { symbol: 'FME.DE', name: 'Fresenius' },
  ],
  FR: [
    { symbol: 'MC.PA', name: 'LVMH' },
    { symbol: 'OR.PA', name: "L'Oreal" },
    { symbol: 'SAN.PA', name: 'Sanofi' },
    { symbol: 'AI.PA', name: "Air Liquide" },
    { symbol: 'BNP.PA', name: 'BNP Paribas' },
    { symbol: 'GLE.PA', name: 'Societe Generale' },
    { symbol: 'AIR.PA', name: 'Airbus' },
    { symbol: 'KER.PA', name: 'Kering' },
    { symbol: 'CA.PA', name: 'Carrefour' },
    { symbol: 'STMPA.PA', name: 'STMicroelectronics' },
  ],
  IT: [
    { symbol: 'ENEL.MI', name: 'Enel' },
    { symbol: 'ISP.MI', name: 'Intesa Sanpaolo' },
    { symbol: 'UCG.MI', name: 'UniCredit' },
    { symbol: 'ENI.MI', name: 'Eni' },
    { symbol: 'STLAM.MI', name: 'Stellantis' },
    { symbol: 'G.MI', name: 'Generali' },
    { symbol: 'F.MI', name: 'Ferrari' },
    { symbol: 'MONC.MI', name: 'Moncler' },
    { symbol: 'PRY.MI', name: 'Prysmian' },
    { symbol: 'TIT.MI', name: 'Telecom Italia' },
  ],
  ES: [
    { symbol: 'SAN.MC', name: 'Banco Santander' },
    { symbol: 'IBE.MC', name: 'Iberdrola' },
    { symbol: 'REP.MC', name: 'Repsol' },
    { symbol: 'TEF.MC', name: 'Telefonica' },
    { symbol: 'ITX.MC', name: 'Inditex' },
    { symbol: 'AMS.MC', name: 'Acciona' },
    { symbol: 'FER.MC', name: 'Ferrovial' },
    { symbol: 'MAP.MC', name: 'Mapfre' },
    { symbol: 'CLNX.MC', name: 'Cellnex Telecom' },
    { symbol: 'ACX.MC', name: 'Acerinox' },
  ],
  NL: [
    { symbol: 'ASML.AS', name: 'ASML Holding' },
    { symbol: 'PHIA.AS', name: 'Philips' },
    { symbol: 'ING.AS', name: 'ING Group' },
    { symbol: 'AD.AS', name: 'Adyen' },
    { symbol: 'RDSA.AS', name: 'Royal Dutch Shell' },
    { symbol: 'UNA.AS', name: 'Unilever' },
    { symbol: 'ASRNL.AS', name: 'Aegon' },
    { symbol: 'HEIA.AS', name: 'Heineken' },
    { symbol: 'ABN.AS', name: 'ABN Amro' },
    { symbol: 'KPN.AS', name: 'KPN' },
  ],
  CH: [
    { symbol: 'NESN.SW', name: 'Nestle' },
    { symbol: 'ROG.SW', name: 'Roche' },
    { symbol: 'UBSG.SW', name: 'UBS Group' },
    { symbol: 'NOVN.SW', name: 'Novartis' },
    { symbol: 'CFR.SW', name: 'Richemont' },
    { symbol: 'ZURN.SW', name: 'Zurich Insurance' },
    { symbol: 'GIVN.SW', name: 'Givaudan' },
    { symbol: 'SCHN.SW', name: 'Schindler' },
    { symbol: 'LONN.SW', name: 'Lonza' },
    { symbol: 'BAER.SW', name: 'Julius Baer' },
  ],
  SE: [
    { symbol: 'ERIC-B.ST', name: 'Ericsson' },
    { symbol: 'ATCO-B.ST', name: 'Atlas Copco' },
    { symbol: 'VOLV-B.ST', name: 'Volvo' },
    { symbol: 'NDA-SE.ST', name: 'Nordea Bank' },
    { symbol: 'SHB-B.ST', name: 'SHB' },
    { symbol: 'HM-B.ST', name: 'H&M' },
    { symbol: 'SKA-B.ST', name: 'Skanska' },
    { symbol: 'SIN-B.ST', name: 'SINCH' },
    { symbol: 'ELUX-B.ST', name: 'Electrolux' },
    { symbol: 'INVE-B.ST', name: 'Investor AB' },
  ],
  NO: [
    { symbol: 'EQNR.OL', name: 'Equinor' },
    { symbol: 'DNB.OL', name: 'DNB' },
    { symbol: 'MOL.OL', name: 'Mol' },
    { symbol: 'AKSO.OL', name: 'Aker Solutions' },
    { symbol: 'STB.OL', name: 'Storebrand' },
    { symbol: 'YARA.OL', name: 'Yara International' },
    { symbol: 'ORK.OL', name: 'Orkla' },
    { symbol: 'TEL.OL', name: 'Telenor' },
    { symbol: 'NHY.OL', name: 'Norsk Hydro' },
    { symbol: 'ODF.OL', name: 'ODFjell' },
  ],
  DK: [
    { symbol: 'MAERSK-B.CO', name: 'Maersk' },
    { symbol: 'NOVO-B.CO', name: 'Novo Nordisk' },
    { symbol: 'DSV.CO', name: 'DSV' },
    { symbol: 'CARL-B.CO', name: 'Carlsberg' },
    { symbol: 'DANSKE.CO', name: 'Danske Bank' },
    { symbol: 'COLO-B.CO', name: 'Coloplast' },
    { symbol: 'PNDORA.CO', name: 'Pandora' },
    { symbol: 'TRYG.CO', name: 'Tryg' },
    { symbol: 'LUN.CO', name: 'Lundbeck' },
    { symbol: 'NZYM-B.CO', name: 'Novozymes' },
  ],
  FI: [
    { symbol: 'NOKIA.HE', name: 'Nokia' },
    { symbol: 'NESTE.HE', name: 'Neste' },
    { symbol: 'KONE.HE', name: 'Kone' },
    { symbol: 'UPM.HE', name: 'UPM-Kymmene' },
    { symbol: 'METSO.HE', name: 'Metso' },
    { symbol: 'ORORA.HE', name: 'Orora' },
    { symbol: 'NDA1V.HE', name: 'Nordea Bank' },
    { symbol: 'SAMPO.HE', name: 'Sampo Group' },
    { symbol: 'KNEBV.HE', name: 'Konecranes' },
    { symbol: 'HUO1V.HE', name: 'Huhtamaki' },
  ],
  BE: [
    { symbol: 'BEGB.BR', name: 'Begium' },
    { symbol: 'KBC.BR', name: 'KBC Group' },
    { symbol: 'ABI.BR', name: 'Anheuser-Busch InBev' },
    { symbol: 'ANF.BR', name: 'Ageas' },
    { symbol: 'UCB.BR', name: 'UCB' },
    { symbol: 'INGA.BR', name: 'ING Belgium' },
    { symbol: 'SOLB.BR', name: 'Solvay' },
    { symbol: 'BELGB.BR', name: 'Belgacom' },
    { symbol: 'PROX.BR', name: 'Proximus' },
    { symbol: 'GLPG.BR', name: 'Galapagos' },
  ],
  AT: [
    { symbol: 'OMV.VI', name: 'OMV' },
    { symbol: 'VER.VI', name: 'Verbund' },
    { symbol: 'VOE.VI', name: 'Voestalpine' },
    { symbol: 'ANDR.VI', name: 'Andritz' },
    { symbol: 'RBI.VI', name: 'Raiffeisen' },
    { symbol: 'ERST.VI', name: 'Erste Group' },
    { symbol: 'SBO.VI', name: 'Schoeller-Bleckmann' },
    { symbol: 'STR.VI', name: 'Strabag' },
    { symbol: 'MUV2.VI', name: 'Motive' },
    { symbol: 'VIG.VI', name: 'Vienna Insurance' },
  ],
  PL: [
    { symbol: 'PKN.WA', name: 'PKN Orlen' },
    { symbol: 'PKO.WA', name: 'PKO BP' },
    { symbol: 'KGH.WA', name: 'KGHM' },
    { symbol: 'PGE.WA', name: 'PGE' },
    { symbol: 'OPL.WA', name: 'Orlen' },
    { symbol: 'LPP.WA', name: 'LPP' },
    { symbol: 'CDR.WA', name: 'CD Projekt' },
    { symbol: 'PEKAO.WA', name: 'Bank Pekao' },
    { symbol: 'DNP.WA', name: 'Dino Polska' },
    { symbol: 'MBK.WA', name: 'mBank' },
  ],
  CZ: [
    { symbol: 'CEZ.PR', name: 'CEZ' },
    { symbol: 'KB.PR', name: 'Komercni Banka' },
    { symbol: 'VIG.PR', name: 'Vienna Insurance' },
    { symbol: 'BAV.PR', name: 'Bavaria' },
    { symbol: 'NUTN.PR', name: 'Nutricia' },
    { symbol: 'TAB.PR', name: 'Tabac' },
    { symbol: 'FILB.PR', name: 'Philip Morris' },
    { symbol: 'MONB.PR', name: 'Moneta Money Bank' },
    { symbol: 'KOMB.PR', name: 'Kometa' },
    { symbol: 'PKN.PR', name: 'PKN' },
  ],
  GR: [
    { symbol: 'OPAP.AT', name: 'OPAP' },
    { symbol: 'EUROB.AT', name: 'Eurobank' },
    { symbol: 'ETE.AT', name: 'Hellenic Petroleum' },
    { symbol: 'EYDAP.AT', name: 'EYDAP' },
    { symbol: 'MYTIL.AT', name: 'Mytilineos' },
    { symbol: 'PPC.AT', name: 'PPC' },
    { symbol: 'EUROK.AT', name: 'Eurobank Ergasias' },
    { symbol: 'TPEIR.AT', name: 'Titan Cement' },
    { symbol: 'LAMDA.AT', name: 'Lamda Development' },
    { symbol: 'MOH.AT', name: 'Motor Oil' },
  ],
  PT: [
    { symbol: 'GALP.EL', name: 'Galp Energia' },
    { symbol: 'EDP.EL', name: 'EDP' },
    { symbol: 'BCP.EL', name: 'BCP' },
    { symbol: 'SON.EL', name: 'Sonae' },
    { symbol: 'JMT.EL', name: 'Jerome' },
    { symbol: 'REN.EL', name: 'REN' },
    { symbol: 'NOS.EL', name: 'NOS' },
    { symbol: 'ALTR.EL', name: 'Altri' },
    { symbol: 'PHAR.EL', name: 'Pharol' },
    { symbol: 'CORT.EL', name: 'Corticeira Amorim' },
  ],
  IE: [
    { symbol: 'CRH.IR', name: 'CRH' },
    { symbol: 'IRE.IR', name: 'Irish Life' },
    { symbol: 'BOI.IR', name: 'Bank of Ireland' },
    { symbol: 'AIB.IR', name: 'AIB Group' },
    { symbol: 'TRN.IR', name: 'Trinity' },
    { symbol: 'DCC.IR', name: 'DCC' },
    { symbol: 'KYG.IR', name: 'Kingspan' },
    { symbol: 'GSK.IR', name: 'GSK Ireland' },
    { symbol: 'SMUR.IR', name: 'Smurfit Kappa' },
    { symbol: 'CO3.IR', name: 'C&C Group' },
  ],
  JP: [
    { symbol: '7203.T', name: 'Toyota Motor' },
    { symbol: '6758.T', name: 'Sony Group' },
    { symbol: '4755.T', name: 'Honda Motor' },
    { symbol: '9983.T', name: 'Fast Retailing' },
    { symbol: '8035.T', name: 'Tokyo Electron' },
    { symbol: '8306.T', name: 'Mitsubishi UFJ' },
    { symbol: '4519.T', name: 'SoftBank Group' },
    { symbol: '6702.T', name: 'Keyence' },
    { symbol: '6861.T', name: 'Keyence' },
    { symbol: '8316.T', name: 'Sumitomo Mitsui' },
  ],
  CN: [
    { symbol: 'BABA', name: 'Alibaba Group' },
    { symbol: 'JD', name: 'JD.com' },
    { symbol: 'PDD', name: 'PDD Holdings' },
    { symbol: 'BIDU', name: 'Baidu' },
    { symbol: 'NTES', name: 'NetEase' },
    { symbol: 'TCEHY', name: 'Tencent' },
    { symbol: 'MEITUAN', name: 'Meituan' },
    { symbol: 'NIO', name: 'NIO Inc.' },
    { symbol: 'LI', name: 'Li Auto' },
    { symbol: 'XPEV', name: 'XPeng' },
  ],
  HK: [
    { symbol: '0700.HK', name: 'Tencent' },
    { symbol: '9988.HK', name: 'Alibaba' },
    { symbol: '0941.HK', name: 'China Mobile' },
    { symbol: '1299.HK', name: 'AIA Group' },
    { symbol: '1398.HK', name: 'ICBC' },
    { symbol: '0968.HK', name: 'Xinyi Solar' },
    { symbol: '0388.HK', name: 'HK Exchanges' },
    { symbol: '2318.HK', name: 'Ping An Insurance' },
    { symbol: '0939.HK', name: 'CCB' },
    { symbol: '0883.HK', name: 'CNOOC' },
  ],
  TW: [
    { symbol: '2330.TW', name: 'Taiwan Semiconductor' },
    { symbol: '2454.TW', name: 'MediaTek' },
    { symbol: '2317.TW', name: 'Hon Hai Precision' },
    { symbol: '2412.TW', name: 'Chunghwa Telecom' },
    { symbol: '2303.TW', name: 'Taiwan Power' },
    { symbol: '2382.TW', name: 'Quanta Computer' },
    { symbol: '2882.TW', name: 'Cathay Financial' },
    { symbol: '1301.TW', name: 'Formosa Plastics' },
    { symbol: '3008.TW', name: 'Foxconn' },
    { symbol: '2354.TW', name: 'Compal' },
  ],
  KR: [
    { symbol: '005930.KS', name: 'Samsung Electronics' },
    { symbol: '005935.KS', name: 'Samsung Fire & Marine' },
    { symbol: '035420.KS', name: 'Hyundai Mobis' },
    { symbol: '035720.KS', name: 'Kakao' },
    { symbol: '051910.KS', name: 'LG Chem' },
    { symbol: '006400.KS', name: 'Samsung SDI' },
    { symbol: '035260.KS', name: 'LG Display' },
    { symbol: '005380.KS', name: 'Hyundai Motor' },
    { symbol: '000660.KS', name: 'SK Hynix' },
    { symbol: '068270.KS', name: 'Celltrion' },
  ],
  SG: [
    { symbol: 'O39.SI', name: 'OCBC Bank' },
    { symbol: 'U11.SI', name: 'United Overseas Bank' },
    { symbol: 'C6L.SI', name: 'Singapore Airlines' },
    { symbol: 'D05.SI', name: 'DBS Group' },
    { symbol: 'Z74.SI', name: 'Singapore Telecommunications' },
    { symbol: 'F34.SI', name: 'Keppel Corp' },
    { symbol: 'U96.SI', name: 'UOL Group' },
    { symbol: 'S63.SI', name: 'Singapore Exchange' },
    { symbol: 'BN4.SI', name: 'Boustead Singapore' },
    { symbol: 'A17.SI', name: 'CapitaLand' },
  ],
  IN: [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
    { symbol: 'INFY.NS', name: 'Infosys' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
    { symbol: 'SBIN.NS', name: 'State Bank of India' },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
    { symbol: 'ITC.NS', name: 'ITC Limited' },
    { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank' },
    { symbol: 'LT.NS', name: 'Larsen & Toubro' },
  ],
  TH: [
    { symbol: 'PTT.BK', name: 'PTT' },
    { symbol: 'KBANK.BK', name: 'Kasikornbank' },
    { symbol: 'SCB.BK', name: 'Siam Commercial Bank' },
    { symbol: 'AOT.BK', name: 'Airports of Thailand' },
    { symbol: 'CPF.BK', name: 'Charoen Pokphand Foods' },
    { symbol: 'BDMS.BK', name: 'Bangkok Dusit Medical Services' },
    { symbol: 'ADVANC.BK', name: 'Advanced Info Service' },
    { symbol: 'TRUE.BK', name: 'True Corporation' },
    { symbol: 'CPALL.BK', name: 'CP ALL' },
    { symbol: 'MINT.BK', name: 'Minor International' },
  ],
  MY: [
    { symbol: 'KLSE.KL', name: 'Kuala Lumpur Composite' },
    { symbol: 'MAYBANK.KL', name: 'Maybank' },
    { symbol: 'CIMB.KL', name: 'CIMB Group' },
    { symbol: 'PBBANK.KL', name: 'Public Bank' },
    { symbol: 'RHBBANK.KL', name: 'RHB Bank' },
    { symbol: 'HLBANK.KL', name: 'Hong Leong Bank' },
    { symbol: 'AMMB.KL', name: 'AmBank' },
    { symbol: 'TENAGA.KL', name: 'Tenaga Nasional' },
    { symbol: 'MAXIS.KL', name: 'Maxis' },
    { symbol: 'GENTING.KL', name: 'Genting Malaysia' },
  ],
  PH: [
    { symbol: 'SM.PH', name: 'SM Investments' },
    { symbol: 'BDO.PH', name: 'BDO Unibank' },
    { symbol: 'MBT.PH', name: 'Metrobank' },
    { symbol: 'AC.PH', name: 'Ayala Corporation' },
    { symbol: 'JFC.PH', name: 'Jollibee Foods' },
    { symbol: 'MPI.PH', name: 'Megaworld' },
    { symbol: 'AEV.PH', name: 'Aboitiz Equity' },
    { symbol: 'ALI.PH', name: 'Ayala Land' },
    { symbol: 'SMDC.PH', name: 'SM Development' },
    { symbol: 'DMC.PH', name: 'DMCI Holdings' },
  ],
  VN: [
    { symbol: 'VIC.VN', name: 'Vingroup' },
    { symbol: 'VCB.VN', name: 'Vietcombank' },
    { symbol: 'VHM.VN', name: 'Vinhomes' },
    { symbol: 'MSN.VN', name: 'Masan Group' },
    { symbol: 'GVR.VN', name: 'Vietnam Dairy Products' },
    { symbol: 'MWG.VN', name: 'Mobile World Investment' },
    { symbol: 'HPG.VN', name: 'Hoa Phat Group' },
    { symbol: 'FPT.VN', name: 'FPT Corporation' },
    { symbol: 'STB.VN', name: 'Sacombank' },
    { symbol: 'TCB.VN', name: 'Techcombank' },
  ],
  ID: [
    { symbol: 'BBCA.JK', name: 'Bank Central Asia' },
    { symbol: 'BBRI.JK', name: 'Bank Rakyat Indonesia' },
    { symbol: 'GOTO.JK', name: 'GoTo Group' },
    { symbol: 'TLKM.JK', name: 'Telkom Indonesia' },
    { symbol: 'ASII.JK', name: 'Astra International' },
    { symbol: 'ICBP.JK', name: 'Indofood CBP' },
    { symbol: 'BBNI.JK', name: 'Bank Negara Indonesia' },
    { symbol: 'BMRI.JK', name: 'Bank Mandiri' },
    { symbol: 'UNVR.JK', name: 'Unilever Indonesia' },
    { symbol: 'ADRO.JK', name: 'Adaro Energy' },
  ],
  ME: [
    { symbol: '2222.SR', name: 'Saudi Aramco' },
    { symbol: '1180.SR', name: 'Al Rajhi Bank' },
    { symbol: '7010.SR', name: 'STC (Saudi Telecom)' },
    { symbol: '1120.SR', name: 'Saudi British Bank' },
    { symbol: '1010.SR', name: 'Saudi National Bank' },
    { symbol: '2000.SR', name: 'Almarai' },
    { symbol: '3010.SR', name: 'Savola Group' },
    { symbol: '4030.SR', name: 'Saudi Industrial' },
    { symbol: '8020.SR', name: 'Saudi Electric' },
    { symbol: '9510.SR', name: 'Saudi Arabian Mining' },
  ],
  AU: [
    { symbol: 'BHP.AX', name: 'BHP Group' },
    { symbol: 'CBA.AX', name: 'Commonwealth Bank' },
    { symbol: 'CSL.AX', name: 'CSL Ltd' },
    { symbol: 'NAB.AX', name: 'National Australia Bank' },
    { symbol: 'WBC.AX', name: 'Westpac Banking' },
    { symbol: 'RIO.AX', name: 'Rio Tinto' },
    { symbol: 'ANZ.AX', name: 'ANZ Banking' },
    { symbol: 'WOW.AX', name: 'Woolworths' },
    { symbol: 'COH.AX', name: 'Cochlear' },
    { symbol: 'MQG.AX', name: 'Macquarie Group' },
  ],
  SA: [
    { symbol: 'VALE3.SA', name: 'Vale' },
    { symbol: 'PETR4.SA', name: 'Petrobras' },
    { symbol: 'ITUB4.SA', name: 'Itau Unibanco' },
    { symbol: 'BBDC4.SA', name: 'Banco Bradesco' },
    { symbol: 'ABEV3.SA', name: 'Ambev' },
    { symbol: 'WEGE3.SA', name: 'WEG' },
    { symbol: 'RENT3.SA', name: 'Localiza' },
    { symbol: 'HAPV3.SA', name: 'Hapvida' },
    { symbol: 'PRIO3.SA', name: 'PetroRio' },
    { symbol: 'KLBN11.SA', name: 'Klabin' },
  ],
  AFRICA: [
    { symbol: 'AGL.JO', name: 'Anglo American' },
    { symbol: 'NPN.JO', name: 'Naspers' },
    { symbol: 'SBK.JO', name: 'Standard Bank' },
    { symbol: 'MTN.JO', name: 'MTN Group' },
    { symbol: 'VOD.JO', name: 'Vodacom' },
    { symbol: 'SOL.JO', name: 'Sasol' },
    { symbol: 'NED.JO', name: 'Nedbank' },
    { symbol: 'ABG.JO', name: 'AB InBev' },
    { symbol: 'BHG.JO', name: 'Bidvest' },
    { symbol: 'RMI.JO', name: 'Remgro' },
  ],
}

// ─── API Functions ───
export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/quote/${encodeURIComponent(symbol)}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/quotes?symbols=${symbols.join(',')}`)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export async function fetchStockSignals(market?: StockMarket): Promise<StockSignal[]> {
  try {
    const url = market
      ? `${API_BASE_URL}/signals?market=${market}`
      : `${API_BASE_URL}/signals`
    const res = await fetch(url)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export async function fetchMarketIndex(market: StockMarket): Promise<StockQuote | null> {
  const indexSymbol = marketIndices[market].symbol
  return fetchStockQuote(indexSymbol)
}

export async function fetchAllMarketIndices(): Promise<Record<StockMarket, StockQuote | null>> {
  const results = await Promise.all([
    fetchMarketIndex('US'),
    fetchMarketIndex('UK'),
    fetchMarketIndex('CA'),
    fetchMarketIndex('EU'),
    fetchMarketIndex('DE'),
    fetchMarketIndex('FR'),
    fetchMarketIndex('IT'),
    fetchMarketIndex('ES'),
    fetchMarketIndex('NL'),
    fetchMarketIndex('CH'),
    fetchMarketIndex('SE'),
    fetchMarketIndex('NO'),
    fetchMarketIndex('DK'),
    fetchMarketIndex('FI'),
    fetchMarketIndex('BE'),
    fetchMarketIndex('AT'),
    fetchMarketIndex('PL'),
    fetchMarketIndex('CZ'),
    fetchMarketIndex('GR'),
    fetchMarketIndex('PT'),
    fetchMarketIndex('IE'),
    fetchMarketIndex('JP'),
    fetchMarketIndex('CN'),
    fetchMarketIndex('HK'),
    fetchMarketIndex('TW'),
    fetchMarketIndex('KR'),
    fetchMarketIndex('SG'),
    fetchMarketIndex('IN'),
    fetchMarketIndex('TH'),
    fetchMarketIndex('MY'),
    fetchMarketIndex('PH'),
    fetchMarketIndex('VN'),
    fetchMarketIndex('ID'),
    fetchMarketIndex('ME'),
    fetchMarketIndex('AU'),
    fetchMarketIndex('SA'),
    fetchMarketIndex('AFRICA'),
  ])
  return {
    US: results[0],
    UK: results[1],
    CA: results[2],
    EU: results[3],
    DE: results[4],
    FR: results[5],
    IT: results[6],
    ES: results[7],
    NL: results[8],
    CH: results[9],
    SE: results[10],
    NO: results[11],
    DK: results[12],
    FI: results[13],
    BE: results[14],
    AT: results[15],
    PL: results[16],
    CZ: results[17],
    GR: results[18],
    PT: results[19],
    IE: results[20],
    JP: results[21],
    CN: results[22],
    HK: results[23],
    TW: results[24],
    KR: results[25],
    SG: results[26],
    IN: results[27],
    TH: results[28],
    MY: results[29],
    PH: results[30],
    VN: results[31],
    ID: results[32],
    ME: results[33],
    AU: results[34],
    SA: results[35],
    AFRICA: results[36],
  }
}

export async function fetchAllPopularStocks(): Promise<Record<StockMarket, StockQuote[]>> {
  const results: Record<StockMarket, StockQuote[]> = {
    US: [],
    UK: [],
    CA: [],
    EU: [],
    DE: [],
    FR: [],
    IT: [],
    ES: [],
    NL: [],
    CH: [],
    SE: [],
    NO: [],
    DK: [],
    FI: [],
    BE: [],
    AT: [],
    PL: [],
    CZ: [],
    GR: [],
    PT: [],
    IE: [],
    JP: [],
    CN: [],
    HK: [],
    TW: [],
    KR: [],
    SG: [],
    IN: [],
    TH: [],
    MY: [],
    PH: [],
    VN: [],
    ID: [],
    ME: [],
    AU: [],
    SA: [],
    AFRICA: [],
  }
  
  for (const market of Object.keys(popularStocks) as StockMarket[]) {
    const symbols = popularStocks[market].map(s => s.symbol)
    const quotes = await fetchStockQuotes(symbols)
    results[market] = quotes
  }
  
  return results
}

// ─── Market Status (open/closed) ───
export function getMarketStatus(market: StockMarket): 'open' | 'closed' | 'pre' | 'after' {
  const now = new Date()
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  const totalUtcMinutes = utcHours * 60 + utcMinutes
  const day = now.getUTCDay()

  // Weekend = closed for most
  if (day === 0 || day === 6) return 'closed'

  switch (market) {
    case 'US':
      // 9:30-16:00 ET = 14:30-21:00 UTC
      if (totalUtcMinutes >= 14 * 60 + 30 && totalUtcMinutes < 21 * 60) return 'open'
      if (totalUtcMinutes >= 9 * 60 && totalUtcMinutes < 14 * 60 + 30) return 'pre'
      if (totalUtcMinutes >= 21 * 60 && totalUtcMinutes < 24 * 60) return 'after'
      return 'closed'
    case 'UK':
      // 8:00-16:30 GMT = 8:00-16:30 UTC
      if (totalUtcMinutes >= 8 * 60 && totalUtcMinutes < 16 * 60 + 30) return 'open'
      return 'closed'
    case 'CA':
      // 9:30-16:00 ET = 14:30-21:00 UTC
      if (totalUtcMinutes >= 14 * 60 + 30 && totalUtcMinutes < 21 * 60) return 'open'
      return 'closed'
    case 'EU':
      // 9:00-17:30 CET = 8:00-16:30 UTC
      if (totalUtcMinutes >= 8 * 60 && totalUtcMinutes < 16 * 60 + 30) return 'open'
      return 'closed'
    case 'DE':
    case 'FR':
    case 'IT':
    case 'ES':
    case 'NL':
    case 'BE':
    case 'AT':
    case 'CH':
      // 9:00-17:30 CET = 8:00-16:30 UTC
      if (totalUtcMinutes >= 8 * 60 && totalUtcMinutes < 16 * 60 + 30) return 'open'
      return 'closed'
    case 'SE':
    case 'NO':
    case 'DK':
    case 'FI':
      // 9:00-17:30 CET = 8:00-16:30 UTC
      if (totalUtcMinutes >= 8 * 60 && totalUtcMinutes < 16 * 60 + 30) return 'open'
      return 'closed'
    case 'PL':
    case 'CZ':
      // 9:00-17:30 CET = 8:00-16:30 UTC
      if (totalUtcMinutes >= 8 * 60 && totalUtcMinutes < 16 * 60 + 30) return 'open'
      return 'closed'
    case 'GR':
      // 10:00-17:30 EET = 8:00-15:30 UTC
      if (totalUtcMinutes >= 8 * 60 && totalUtcMinutes < 15 * 60 + 30) return 'open'
      return 'closed'
    case 'PT':
    case 'IE':
      // 9:00-17:30 GMT = 9:00-17:30 UTC
      if (totalUtcMinutes >= 9 * 60 && totalUtcMinutes < 17 * 60 + 30) return 'open'
      return 'closed'
    case 'JP':
      // 9:00-15:00 JST = 0:00-6:00 UTC
      if (totalUtcMinutes >= 0 && totalUtcMinutes < 6 * 60) return 'open'
      return 'closed'
    case 'CN':
      // 9:30-15:00 CST = 1:30-7:00 UTC
      if (totalUtcMinutes >= 1 * 60 + 30 && totalUtcMinutes < 7 * 60) return 'open'
      return 'closed'
    case 'HK':
      // 9:30-16:00 HKT = 1:30-8:00 UTC
      if (totalUtcMinutes >= 1 * 60 + 30 && totalUtcMinutes < 8 * 60) return 'open'
      return 'closed'
    case 'TW':
      // 9:00-13:30 TST = 1:00-5:30 UTC
      if (totalUtcMinutes >= 1 * 60 && totalUtcMinutes < 5 * 60 + 30) return 'open'
      return 'closed'
    case 'KR':
      // 9:00-15:30 KST = 0:00-6:30 UTC
      if (totalUtcMinutes >= 0 && totalUtcMinutes < 6 * 60 + 30) return 'open'
      return 'closed'
    case 'SG':
      // 9:00-17:00 SGT = 1:00-9:00 UTC
      if (totalUtcMinutes >= 1 * 60 && totalUtcMinutes < 9 * 60) return 'open'
      return 'closed'
    case 'IN':
      // 9:15-15:30 IST = 3:45-10:00 UTC
      if (totalUtcMinutes >= 3 * 60 + 45 && totalUtcMinutes < 10 * 60) return 'open'
      return 'closed'
    case 'TH':
      // 10:00-16:30 ICT = 3:00-9:30 UTC
      if (totalUtcMinutes >= 3 * 60 && totalUtcMinutes < 9 * 60 + 30) return 'open'
      return 'closed'
    case 'MY':
      // 9:00-17:00 MYT = 1:00-9:00 UTC
      if (totalUtcMinutes >= 1 * 60 && totalUtcMinutes < 9 * 60) return 'open'
      return 'closed'
    case 'PH':
      // 9:30-15:30 PHT = 1:30-7:30 UTC
      if (totalUtcMinutes >= 1 * 60 + 30 && totalUtcMinutes < 7 * 60 + 30) return 'open'
      return 'closed'
    case 'VN':
      // 9:00-15:00 ICT = 2:00-8:00 UTC
      if (totalUtcMinutes >= 2 * 60 && totalUtcMinutes < 8 * 60) return 'open'
      return 'closed'
    case 'ID':
      // IDX 9:00-15:00 WIB = 2:00-8:00 UTC
      if (totalUtcMinutes >= 2 * 60 && totalUtcMinutes < 8 * 60) return 'open'
      return 'closed'
    case 'ME':
      // Tadawul 10:00-15:00 AST = 7:00-12:00 UTC
      if (totalUtcMinutes >= 7 * 60 && totalUtcMinutes < 12 * 60) return 'open'
      return 'closed'
    case 'AU':
      // ASX 10:00-16:00 AEST = 0:00-6:00 UTC
      if (totalUtcMinutes >= 0 && totalUtcMinutes < 6 * 60) return 'open'
      return 'closed'
    case 'SA':
      // B3 10:00-18:00 BRT = 13:00-21:00 UTC
      if (totalUtcMinutes >= 13 * 60 && totalUtcMinutes < 21 * 60) return 'open'
      return 'closed'
    case 'AFRICA':
      // JSE 9:00-17:00 SAST = 7:00-15:00 UTC
      if (totalUtcMinutes >= 7 * 60 && totalUtcMinutes < 15 * 60) return 'open'
      return 'closed'
    default:
      return 'closed'
  }
}
