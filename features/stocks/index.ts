/**
 * Stocks Feature Module
 * 
 * Components: StockSignals, StockFilters
 * Utils: stock-api, IDX/Global stock data
 */

export { fetchStockQuote, fetchStockQuotes, fetchStockSignals, fetchMarketIndex, fetchAllMarketIndices, fetchAllPopularStocks, getMarketStatus, marketIndices, popularStocks } from '@/lib/stock-api'
export type { StockMarket, StockQuote, StockSignal } from '@/lib/stock-api'
