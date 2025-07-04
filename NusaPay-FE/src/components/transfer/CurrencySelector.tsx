"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

// ✅ DIPERBAIKI: Tambahkan kembali properti 'symbol'
interface Currency {
  code: string;
  name: string;
  symbol: string; // Properti ini ditambahkan kembali
  logoUrl?: string;
  flag?: string;
}

interface CurrencySelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Daftar currency kripto yang didukung
const SUPPORTED_CRYPTO_CURRENCIES: Currency[] = [
  // Stablecoins Umum
  { code: 'USDC', name: 'USD Coin', symbol: 'USDC', flag: '🔵' },
  { code: 'USDT', name: 'Tether', symbol: 'USDT', flag: '🟢' },
  { code: 'DAI', name: 'Dai', symbol: 'DAI', flag: '🟡' },
  { code: 'IDRX', name: 'Rupiah Token', symbol: 'IDRX', flag: '🇮🇩' },
  
  // Major L1/L2 Tokens
  { code: 'ETH', name: 'Ethereum', symbol: 'ETH', flag: 'Ξ' },
  { code: 'MATIC', name: 'Polygon', symbol: 'MATIC', flag: '🔷' },
  { code: 'BNB', name: 'Binance Coin', symbol: 'BNB', flag: '🔶' },
  { code: 'AVAX', name: 'Avalanche', symbol: 'AVAX', flag: '🔺' },

  // DeFi & Lainnya
  { code: 'LINK', name: 'Chainlink', symbol: 'LINK', flag: '🔗' },
  { code: 'AAVE', name: 'Aave', symbol: 'AAVE', flag: '👻' },
  { code: 'UNI', name: 'Uniswap', symbol: 'UNI', flag: '🦄' },
];

export default function CurrencySelector({
  label,
  value,
  onChange,
  placeholder = "Select a token",
  disabled = false,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>(SUPPORTED_CRYPTO_CURRENCIES);

  useEffect(() => {
    const filtered = SUPPORTED_CRYPTO_CURRENCIES.filter(currency =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCurrencies(filtered);
  }, [searchTerm]);

  const selectedCurrency = SUPPORTED_CRYPTO_CURRENCIES.find(currency => currency.code === value);

  const handleSelect = (currencyCode: string) => {
    onChange(currencyCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 
          bg-slate-700/50 border border-white/10 rounded-lg text-white
          hover:bg-slate-700/70 transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-cyan-500/50' : ''}
        `}
      >
        <div className="flex items-center space-x-3">
          {selectedCurrency ? (
            <>
              <span className="text-lg">{selectedCurrency.flag}</span>
              <div className="text-left">
                <div className="font-medium">{selectedCurrency.code}</div>
                <div className="text-sm text-gray-400">{selectedCurrency.name}</div>
              </div>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
            <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/20 
            rounded-lg shadow-xl max-h-80 overflow-hidden flex flex-col">
            
            <div className="p-3 border-b border-white/10">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                    w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search token..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-white/10 
                    rounded-lg text-white placeholder-gray-400 focus:outline-none 
                    focus:ring-2 focus:ring-cyan-500/50"
                    autoFocus
                />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((currency) => (
                    <button
                    key={currency.code}
                    onClick={() => handleSelect(currency.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 
                        hover:bg-slate-700/50 transition-colors duration-150 text-left
                        ${value === currency.code ? 'bg-cyan-500/20 text-cyan-300' : 'text-white'}
                    `}
                    >
                    <span className="text-lg">{currency.flag}</span>
                    <div className="flex-1">
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-sm text-gray-400">{currency.name}</div>
                    </div>
                    </button>
                ))
                ) : (
                <div className="px-4 py-8 text-center text-gray-400">
                    No tokens found
                </div>
                )}
            </div>
            </div>

            <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
            />
        </>
      )}
    </div>
  );
}