import { fromHex, fromB64 } from '@mysten/bcs';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

// Initialize Sui client for the desired network
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

/**
 * Construct, sign, and execute a transaction.
 * @param privateKeyBase64 - The private key in base64 format.
 * @param gasBudget - The gas budget for the transaction.
 * @param gasPrice - The gas price for the transaction.
 * @param transactionBuilder - A callback to build the transaction.
 * @returns The result of the executed transaction.
 */
export async function signAndExecuteTransaction(
  privateKeyBase64: string,
  gasBudget: number,
  gasPrice: number,
  transactionBuilder: (txb: Transaction) => void
): Promise<any> {
  try {
    // Create keypair directly from base64 private key
    const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));

    // Get the sender's address
    const sender = keypair.getPublicKey().toSuiAddress();

    // Create a new transaction block
    const txb = new Transaction();
    txb.setSender(sender);
    txb.setGasPrice(gasPrice);
    txb.setGasBudget(gasBudget);

    // Use the provided callback to build the transaction
    transactionBuilder(txb);

    // Build the transaction bytes
    const bytes = await txb.build();

    // Sign the transaction
    const serializedSignature = (await keypair.signTransaction(bytes)).signature;

    // Execute the transaction
    const result = await suiClient.executeTransactionBlock({
      transactionBlock: bytes,
      signature: serializedSignature,
    });

    return result;
  } catch (error) {
    console.error('Error signing and executing transaction:', error);
    throw error;
  }
}
