import { Bank, CreditCard, CreditCardData } from '@/types/credit-card';

let cardData: CreditCardData | null = null;

export async function getCardData(): Promise<CreditCardData> {
  if (cardData) {
    return cardData;
  }

  try {
    const response = await fetch('/cards/cards.json');
    const data = await response.json();
    if (!data || !data.creditCardComparison) {
      throw new Error('Invalid card data format');
    }
    cardData = data as CreditCardData;
    return cardData;
  } catch (error) {
    console.error('Error loading card data:', error);
    throw new Error('Failed to load card data');
  }
}

export async function getBanks(): Promise<string[]> {
  const data = await getCardData();
  return data.creditCardComparison.map(bank => bank.bank);
}

export async function getCardsByBank(bankName: string): Promise<CreditCard[]> {
  const data = await getCardData();
  const bank = data.creditCardComparison.find(b => b.bank === bankName);
  return bank?.cards || [];
}

export async function getCardDetails(bankName: string, cardName: string): Promise<CreditCard | null> {
  const cards = await getCardsByBank(bankName);
  return cards.find(card => card.cardName === cardName) || null;
} 