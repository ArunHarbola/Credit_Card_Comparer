export interface CreditCardFeature {
  name: string;
  value: string | number | boolean;
  category: 'rewards' | 'fees' | 'benefits' | 'requirements';
}

export interface CreditCard {
  cardName: string;
  targetAudience: string;
  annualFee: number;
  feeWaiver: string;
  welcomeRenewalBenefit: string;
  rewardRateBase: string;
  pointValueApprox: string;
  rewardTransfer: string;
  milestoneBenefits: string;
  loungeAccessDomestic: string;
  loungeAccessInternational: string;
  lifestyleBenefits: string;
  forexMarkupFee: string;
}

export interface Bank {
  bank: string;
  cards: CreditCard[];
}

export interface CreditCardData {
  creditCardComparison: Bank[];
}

// Helper type for card selection
export interface SelectedCard {
  bank: string;
  card: CreditCard;
} 