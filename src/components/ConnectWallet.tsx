import { ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

export default function WalletConnect() {
  return (
    <div className="flex items-center justify-center">
      <ConnectButton className="px-4 py-2 bg-[#00FFD1] text-black rounded-lg hover:bg-opacity-80">
        Connect Wallet
      </ConnectButton>
    </div>
  );
}
