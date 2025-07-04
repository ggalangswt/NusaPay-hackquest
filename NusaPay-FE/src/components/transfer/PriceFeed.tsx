// PriceFeed.tsx
"use client";

import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, TrendingDown, Clock } from "lucide-react";

import { getPriceFeedFromContract, type PriceFeedData } from "@/lib/smartContract";

interface PriceFeedProps {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  onRateUpdate?: (rate: number) => void;
}

export default function PriceFeed({ 
  fromCurrency, 
  toCurrency, 
  amount, 
  onRateUpdate 
}: PriceFeedProps) {
  const [priceFeedData, setPriceFeedData] = useState<PriceFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("");

  // Simulasi data untuk fallback jika smart contract tidak tersedia
  const simulatePriceFeed = async (from: string, to: string): Promise<PriceFeedData> => {
    // Simulasi delay API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulasi rate berdasarkan currency pair
    const baseRates: { [key: string]: number } = {
      'USD-IDR': 15750,
      'EUR-IDR': 17200,
      'GBP-IDR': 19800,
      'JPY-IDR': 105,
      'SGD-IDR': 11650,
      'MYR-IDR': 3420,
      'BTC-USD': 45000,
      'ETH-USD': 2800,
      'BNB-USD': 320,
      'MATIC-USD': 0.85,
    };
    
    const pairKey = `${from}-${to}`;
    const reversePairKey = `${to}-${from}`;
    
    let rate = baseRates[pairKey] || baseRates[reversePairKey];
    
    if (!rate) {
      // Simulasi rate random untuk pair yang tidak ada
      rate = Math.random() * 1000 + 0.1;
    } else if (baseRates[reversePairKey]) {
      // Jika menggunakan reverse pair, invert rate
      rate = 1 / rate;
    }
    
    // Tambahkan sedikit variasi untuk simulasi perubahan harga
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    rate = rate * (1 + variation);
    
    return {
      fromCurrency: from,
      toCurrency: to,
      rate,
      lastUpdated: new Date().toISOString(),
    };
  };

  const fetchPriceFeed = async (useSmartContract: boolean = true) => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setPriceFeedData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let data: PriceFeedData;
      
      if (useSmartContract) {
        try {
          // Coba ambil dari smart contract dulu
          data = await getPriceFeedFromContract(fromCurrency, toCurrency);
        } catch (contractError) {
          console.warn('Smart contract failed, falling back to simulation:', contractError);
          // Jika smart contract gagal, gunakan simulasi
          data = await simulatePriceFeed(fromCurrency, toCurrency);
        }
      } else {
        // Gunakan simulasi langsung
        data = await simulatePriceFeed(fromCurrency, toCurrency);
      }

      setPriceFeedData(data);
      setLastRefreshTime(new Date().toLocaleTimeString());
      
      if (onRateUpdate) {
        onRateUpdate(data.rate);
      }
    } catch (error) {
      console.error('Error fetching price feed:', error);
      setError('Failed to fetch price feed');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh price feed setiap 30 detik
  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      fetchPriceFeed();
      
      const interval = setInterval(() => {
        fetchPriceFeed();
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [fromCurrency, toCurrency]);

  // Hitung converted amount
  const convertedAmount = priceFeedData && amount 
    ? (amount * priceFeedData.rate).toFixed(2)
    : null;

  const formatCurrency = (value: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'IDR' ? 'IDR' : 'USD',
      minimumFractionDigits: currency === 'IDR' ? 0 : 2,
      maximumFractionDigits: currency === 'IDR' ? 0 : 6,
    }).format(value);
  };

  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    return (
      <div className="bg-slate-700/30 border border-white/10 rounded-lg p-4">
        <p className="text-gray-400 text-sm text-center">
          Select different currencies to see exchange rate
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700/30 border border-white/10 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-white">Live Exchange Rate</span>
        </div>
        <button
          onClick={() => fetchPriceFeed()}
          disabled={isLoading}
          className={`p-1 rounded-full hover:bg-slate-600/50 transition-colors
            ${isLoading ? 'animate-spin' : ''}
          `}
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Price Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm text-center py-2">
          {error}
        </div>
      ) : priceFeedData ? (
        <div className="space-y-2">
          {/* Exchange Rate */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">
              1 {fromCurrency} = 
            </span>
            <span className="text-white font-mono">
              {priceFeedData.rate.toLocaleString()} {toCurrency}
            </span>
          </div>

          {/* Converted Amount */}
          {amount > 0 && convertedAmount && (
            <div className="border-t border-white/10 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">You send:</span>
                <span className="text-cyan-300 font-medium">
                  {amount.toLocaleString()} {fromCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">They receive:</span>
                <span className="text-green-300 font-medium">
                  {parseFloat(convertedAmount).toLocaleString()} {toCurrency}
                </span>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Updated: {lastRefreshTime}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}