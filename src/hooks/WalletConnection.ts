"use client";

import { useEffect, useState } from "react";
import { useWallet as useSuietWallet } from "@suiet/wallet-kit";

export function useWalletConnection() {
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

  return {
    address,
    isConnected: wallet.connected,
    connect,
    disconnect,
  };
}
