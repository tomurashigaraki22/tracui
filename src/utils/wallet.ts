// src/utils/wallet.ts
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';
import { SuiClient } from '@mysten/sui.js/client';
import CryptoJS from 'crypto-js'; // We'll need to install this

// Initialize Sui client for devnet
export const suiClient = new SuiClient({ 
  url: 'https://fullnode.devnet.sui.io:443' 
});

export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
  encryptedPrivateKey: string; // Add this for encrypted version
}

export const createNewWallet = async (userEmail: string): Promise<WalletInfo> => {
  try {
    // Generate a new Ed25519 keypair
    const keypair = new Ed25519Keypair();
    
    // Get the public key and address
    const publicKey = keypair.getPublicKey();
    const address = publicKey.toSuiAddress();
    
    // Export the private key
    const exportedKeypair = keypair.export();
    const privateKey = fromB64(exportedKeypair.privateKey);
    const privateKeyHex = Buffer.from(privateKey).toString('hex');

    // Create an encryption key using user's email and a salt
    // In production, you might want to use a more secure method
    const encryptionKey = `${userEmail}-${process.env.NEXT_PUBLIC_ENCRYPTION_SALT}`;
    
    // Encrypt the private key
    const encryptedPrivateKey = CryptoJS.AES.encrypt(
      privateKeyHex,
      encryptionKey
    ).toString();
    
    return {
      address,
      privateKey: privateKeyHex, // Keep this for immediate use
      publicKey: publicKey.toBase64(),
      encryptedPrivateKey, // This will be sent to backend
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create wallet');
  }
};

// Optional: Function to check wallet balance
export const getWalletBalance = async (address: string): Promise<string> => {
  try {
    const balance = await suiClient.getBalance({
      owner: address,
      coinType: '0x2::sui::SUI'
    });
    return balance.totalBalance;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Failed to get wallet balance');
  }
};