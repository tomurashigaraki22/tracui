import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { WalrusClient } from '@mysten/walrus'
import type { RequestInfo, RequestInit } from 'undici';
import { Agent, fetch, setGlobalDispatcher } from 'undici';
import { RawSigner, Ed25519Keypair } from '@mysten/sui';

const suiClient = new SuiClient({
    url: getFullnodeUrl("devnet")
})

// Retrieve the private key from localStorage
const privateKeyString = localStorage.getItem("wallet_private_key");
if (!privateKeyString) {
  throw new Error("Private key not found in localStorage");
}

// Convert the private key string to a Uint8Array
const privateKey = Uint8Array.from(Buffer.from(privateKeyString, "hex")); // Use "base64" if the key is base64 encoded

// Create a keypair from the private key
const keypair = Ed25519Keypair.fromSecretKey(privateKey);

// Create a compatible Signer instance
const signer = new RawSigner(keypair, suiClient);

const walrusClient = new WalrusClient({
    network: "testnet",
    suiClient,
    wasmUrl: 'https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm',
    storageNodeClientOptions: {
		onError: (error) => console.log(error),
        timeout: 60_000,
		fetch: (url, init) => {
			// Some casting may be required because undici types may not exactly match the @node/types types
			return fetch(url as RequestInfo, {
				...(init as RequestInit),
				dispatcher: new Agent({
					connectTimeout: 60_000,
				}),
			}) as unknown as Promise<Response>;
		},
	},
})

/**
 * Save product data as a blob using Walrus.
 * @param data - The product data to save.
 * @returns The blob ID.
 */
export async function saveProductBlob(data: unknown): Promise<string> {
  try {
    const blob = new Uint8Array(Buffer.from(JSON.stringify(data))); // Convert data to Uint8Array

    // Construct WriteBlobOptions
    const writeBlobOptions = {
      blob,
      deletable: true, // Example value, adjust as needed
      epochs: 1, // Example value, adjust as needed
      signer, // Use the compatible Signer instance
    };

    const response = await walrusClient.writeBlob(writeBlobOptions); // Save blob using Walrus

    // Extract and return the blob ID
    return response.blobId;
  } catch (error) {
    console.error("Error saving product blob:", error);
    throw error;
  }
}