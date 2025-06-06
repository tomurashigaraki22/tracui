// src/utils/wallet.ts
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64, toB64 } from '@mysten/sui.js/utils';
import { SuiClient } from '@mysten/sui.js/client';
import CryptoJS from 'crypto-js'; // We'll need to install this
import { TransactionBlock } from '@mysten/sui.js/transactions';
import pool from '@/lib/mysql';
import { requestSuiFromFaucetV0, getFaucetHost } from '@mysten/sui.js/faucet';

// Initialize Sui client for testnet
export const suiClient = new SuiClient({ 
  url: 'https://fullnode.testnet.sui.io:443' 
});

export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
  encryptedPrivateKey: string; // Add this for encrypted version
}

export const createNewWallet = async (userEmail: string): Promise<WalletInfo> => {
  try {
    const keypair = new Ed25519Keypair();
    const publicKey = keypair.getPublicKey();
    const address = publicKey.toSuiAddress();
    
    // Store the keypair export
    const exportedKeypair = keypair.export();
    localStorage.setItem('keypairExport', JSON.stringify(exportedKeypair));
    
    return {
      address,
      privateKey: exportedKeypair.privateKey,
      publicKey: publicKey.toBase64(),
      encryptedPrivateKey: CryptoJS.AES.encrypt(
        exportedKeypair.privateKey,
        `${userEmail}-${process.env.NEXT_PUBLIC_ENCRYPTION_SALT}`
      ).toString(),
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create wallet');
  }
};

// Update the keypair reconstruction utility
export const getStoredKeypair = (): Ed25519Keypair => {
  const keypairExport = localStorage.getItem('keypairExport');
  if (!keypairExport) {
    throw new Error('No keypair found in storage');
  }
  
  const parsed = JSON.parse(keypairExport);
  return Ed25519Keypair.fromSecretKey(fromB64(parsed.privateKey));
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

export async function createEscrowWallet(productId: string) {
  if (!productId) {
    throw new Error('Product ID is required');
  }

  const keypair = new Ed25519Keypair();
  const address = keypair.getPublicKey().toSuiAddress();
  
  // Get the Sui private key format directly
  const secretKey = `suiprivkey${keypair.export().privateKey}`;
  const publicKey = keypair.getPublicKey().toBase64();

  console.log('Creating escrow wallet:', {
    productId,
    address,
    secretKeyLength: secretKey.length,
    timestamp: new Date().toISOString()
  });
  
  const connection = await pool.getConnection();
  
  try {
    const params = [
      String(productId),
      String(address),
      secretKey, // Store the full Sui private key format
      String(publicKey)
    ];

    if (params.some(param => param === undefined || param === null)) {
      throw new Error('Invalid parameters for escrow creation');
    }

    const [result] = await connection.execute(
      `INSERT INTO escrow_details (
        product_id, 
        wallet_address, 
        private_key,
        secret_key, 
        public_key, 
        amount, 
        status
      ) VALUES (?, ?, ?, ?, ?, 0, "pending")`,
      params
    );
    
    // Return all key formats
    const walletInfo = {
      address,
      privateKey: keypair.export().privateKey,
      secretKey,
      publicKey
    };

    console.log('Escrow wallet created successfully:', {
      address,
      publicKey,
      productId,
      insertId: (result as any).insertId
    });
    
    return walletInfo;
  } catch (error) {
    console.error('Error creating escrow wallet:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Add this helper function
async function requestGasFromFaucet(recipientAddress: string) {
  try {
    console.log('Requesting gas from faucet for address:', recipientAddress);
    const response = await requestSuiFromFaucetV0({
      host: getFaucetHost('testnet'),
      recipient: recipientAddress,
    });
    
    // Wait for faucet transaction to complete
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Faucet response:', response);
    return response;
  } catch (error) {
    console.error('Faucet request failed:', error);
    throw error;
  }
}

// Modify transferToEscrow to include faucet handling
export async function transferToEscrow(
  senderAddress: string,
  senderPrivateKey: string, // This should now be in Sui private key format
  escrowAddress: string,
  amount: number
) {
  try {
    if (!senderPrivateKey || !senderPrivateKey.startsWith('suiprivkey')) {
      throw new Error('Invalid Sui private key format');
    }

    // Convert the stored private key to the format Ed25519Keypair expects
    const rawPrivateKey = senderPrivateKey.replace('suiprivkey', '');
    const keyBytes = fromB64(rawPrivateKey);
    
    // Create keypair from the converted bytes
    const keypair = Ed25519Keypair.fromSecretKey(keyBytes);

    // Get coins owned by sender
    let coins = await suiClient.getCoins({
      owner: senderAddress,
      coinType: '0x2::sui::SUI'
    });

    if (!coins.data || coins.data.length === 0) {
      console.log('No coins found, requesting from faucet...');
      await requestGasFromFaucet(senderAddress);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer for faucet
      
      // Refresh coins after faucet
      coins = await suiClient.getCoins({
        owner: senderAddress,
        coinType: '0x2::sui::SUI'
      });
    }

    if (!coins.data || coins.data.length === 0) {
      throw new Error('No coins available even after faucet request');
    }

    // Find a coin with sufficient balance
    const totalAmount = BigInt(amount) + BigInt(20000000); // amount + gas fee
    const gasCoin = coins.data.find(coin => BigInt(coin.balance) >= totalAmount);

    if (!gasCoin) {
      throw new Error(`Insufficient balance. Need ${totalAmount} SUI`);
    }

    // Create transaction block
    const tx = new TransactionBlock();
    
    // Important: Set the gas coin first
    tx.setGasBudget(20000000);
    
    // Use the specific coin we found
    const primaryCoin = tx.object(gasCoin.coinObjectId);
    
    // Split it into payment and change
    const [paymentCoin] = tx.splitCoins(primaryCoin, [tx.pure(amount)]);
    
    // Transfer the payment coin to escrow
    tx.transferObjects([paymentCoin], tx.pure(escrowAddress));
    
    console.log('Transaction setup:', {
      senderAddress,
      escrowAddress,
      amount,
      gasCoinId: gasCoin.coinObjectId,
      gasCoinBalance: gasCoin.balance,
      totalNeeded: totalAmount.toString()
    });

    // Sign and execute transaction
    const result = await suiClient.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showEvents: true,
        showInput: true,
      },
      requestType: 'WaitForLocalExecution',
    });

    console.log('Transaction result:', {
      digest: result.digest,
      status: result.effects?.status,
      events: result.events
    });

    if (!result.effects?.status?.status === 'success') {
      throw new Error(`Transaction failed: ${JSON.stringify(result.effects)}`);
    }
    
    // Update escrow amount in database
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'UPDATE escrow_details SET amount = ? WHERE wallet_address = ?',
        [amount, escrowAddress]
      );
    } finally {
      conn.release();
    }
    
    return result;
  } catch (error) {
    console.error('Transfer to escrow failed:', error);
    throw error;
  }
}

async function ensureSecretKeyColumn() {
  const connection = await pool.getConnection();
  try {
    // Check if column exists
    const [columns] = await connection.execute<any[]>(`
      SELECT COLUMN_NAME 
      FROM information_schema.columns 
      WHERE table_schema = DATABASE()
        AND table_name = 'escrow_details'
        AND column_name = 'secret_key'
    `);

    // Add column if it doesn't exist
    if (columns.length === 0) {
      await connection.execute(`
        ALTER TABLE escrow_details 
        ADD COLUMN secret_key VARCHAR(255) NOT NULL 
        AFTER private_key
      `);
      console.log('Added secret_key column to escrow_details table');
    } else {
      console.log('secret_key column already exists');
    }
  } catch (error) {
    console.error('Error ensuring secret_key column:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Add this to the same file
async function hasGasForTransaction(address: string, amount: bigint): Promise<boolean> {
  try {
    const coins = await suiClient.getCoins({
      owner: address,
      coinType: '0x2::sui::SUI'
    });

    const totalBalance = coins.data.reduce(
      (acc, coin) => acc + BigInt(coin.balance), 
      BigInt(0)
    );

    return totalBalance >= amount;
  } catch (error) {
    console.error('Error checking gas availability:', error);
    return false;
  }
}