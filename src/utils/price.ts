const SUI_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd';

export async function convertUSDToSUI(usdAmount: number): Promise<number> {
  try {
    const response = await fetch(SUI_PRICE_API);
    const data = await response.json();
    const suiPrice = data.sui.usd;
    
    // Convert USD to SUI
    const suiAmount = usdAmount / suiPrice;
    
    // Round to 8 decimal places (standard for crypto)
    return Number(suiAmount.toFixed(8));
  } catch (error) {
    console.error('Error fetching SUI price:', error);
    throw new Error('Failed to convert USD to SUI');
  }
}