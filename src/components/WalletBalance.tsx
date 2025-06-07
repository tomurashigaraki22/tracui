"use client";

import { useState, useEffect } from 'react';
import { suiClient } from '@/utils/wallet';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import axios from 'axios';

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

interface CryptoPrice {
  usd: number;
  ngn: number;
}

const DepositModal = ({ isOpen, onClose, address }: BalanceModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Deposit SUI</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-1"
              >
                ×
              </button>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <div className="flex justify-center">
                <QRCode 
                  value={address} 
                  size={200}
                  className="h-auto max-w-full"
                />
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Wallet Address
              </p>
              <div className="bg-gray-50 p-4 rounded-xl break-all text-sm 
                          font-mono text-gray-600 select-all cursor-pointer">
                {address}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-black text-white py-3 rounded-xl 
                       font-medium hover:bg-gray-800 transition-colors
                       active:transform active:scale-[0.98]"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const WalletBalance = () => {
  const [balance, setBalance] = useState<string>('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [prices, setPrices] = useState<CryptoPrice>({ usd: 0, ngn: 0 });
  const [suiAmount, setSuiAmount] = useState<number>(0);

  const fetchPrices = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd,ngn'
      );
      setPrices({
        usd: response.data.sui.usd,
        ngn: response.data.sui.ngn
      });
    } catch (error) {
      console.error('Error fetching SUI price:', error);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const walletAddress = localStorage.getItem('wallet_address');
      if (!walletAddress) return;

      setAddress(walletAddress);
      try {
        const balance = await suiClient.getBalance({
          owner: walletAddress,
          coinType: '0x2::sui::SUI'
        });

        // Convert from MIST to SUI
        const suiBalance = Number(balance.totalBalance) / 1_000_000_000;
        setSuiAmount(suiBalance);
        setBalance(suiBalance.toFixed(4));
        
        // Fetch latest prices when balance updates
        await fetchPrices();
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-3 p-2 w-full">
      <div className="bg-white rounded-xl shadow-sm p-5 w-full hover:shadow-md transition-shadow">
        {/* Balance Header */}
        <div className="flex flex-col mb-4">
          <span className="text-sm font-medium text-gray-500 mb-1">Balance</span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-gray-900">{balance} SUI</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-lg 
                     hover:bg-gray-800 transition-all transform hover:scale-105 
                     active:scale-95 lg:hidden"
            >
              Deposit
            </button>
          </div>
        </div>

        {/* Currency Values */}
        <div className="space-y-2.5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">USD Value</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {formatCurrency(suiAmount * prices.usd, 'USD')}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">NGN Value</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {formatCurrency(suiAmount * prices.ngn, 'NGN')}
            </span>
          </div>
        </div>
      </div>

      <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-lg 
                     hover:bg-white hover:text-black transition-all transform hover:scale-105 
                     active:scale-95 hidden lg:block mt-4 border-gray-400 border-2 hover:border-black"
            >
              Deposit
            </button>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={address}
      />
    </div>
  );
};

export default WalletBalance;