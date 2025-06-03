"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { WalletProvider, useWallet as useSuietWallet } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

function WalletContextContent({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const wallet = useSuietWallet();

  useEffect(() => {
    if (wallet.connected) {
      setAddress(wallet.account?.address || null);
    } else {
      setAddress(null);
    }
  }, [wallet.connected, wallet.account]);

  const connect = async () => {
    try {
      await wallet.select("Slush Wallet");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnect = () => {
    try {
      wallet.disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const value = {
    address,
    isConnected: wallet.connected,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function WalletContextProvider({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <WalletContextContent>{children}</WalletContextContent>
    </WalletProvider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextProvider");
  }
  return context;
};
