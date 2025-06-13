import { useEffect, useState } from 'react';
import { Bank, CreditCard, SelectedCard } from '@/types/credit-card';
import { getBanks, getCardsByBank } from '@/lib/card-service';
import { queryCards } from '@/lib/ai-service';

interface CardSelectorProps {
  selectedCards: (SelectedCard | null)[];
  onSelectCard: (card: SelectedCard | null, index: number) => void;
}

export default function CardSelector({ selectedCards, onSelectCard }: CardSelectorProps) {
  const [banks, setBanks] = useState<string[]>([]);
  const [availableCards, setAvailableCards] = useState<{ [key: string]: CreditCard[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [cardSummaries, setCardSummaries] = useState<{ [key: string]: string }>({});
  const [loadingSummaries, setLoadingSummaries] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadBanks = async () => {
      const bankList = await getBanks();
      setBanks(bankList);
    };
    loadBanks();
  }, []);

  const generateCardSummary = async (card: CreditCard, bankName: string) => {
    const cardKey = `${bankName}-${card.cardName}`;
    if (cardSummaries[cardKey] || loadingSummaries[cardKey]) return;

    setLoadingSummaries(prev => ({ ...prev, [cardKey]: true }));
    try {
      const summary = await queryCards(
        `Provide a concise, bullet-point summary of the key benefits and features of the ${bankName} ${card.cardName} credit card. Focus on the most important aspects that would help someone decide if this card is right for them.`
      );
      setCardSummaries(prev => ({ ...prev, [cardKey]: summary }));
    } catch (error) {
      console.error('Error generating card summary:', error);
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [cardKey]: false }));
    }
  };

  const handleBankChange = async (bankName: string, index: number) => {
    if (!bankName) {
      onSelectCard(null, index);
      return;
    }

    onSelectCard({ bank: bankName, card: null as any }, index);

    if (!availableCards[bankName]) {
      try {
        setIsLoading(true);
        const cards = await getCardsByBank(bankName);
        setAvailableCards(prev => ({ ...prev, [bankName]: cards }));
      } catch (error) {
        console.error('Error loading cards:', error);
        onSelectCard(null, index);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCardChange = (bankName: string, cardName: string, index: number) => {
    if (!cardName) {
      onSelectCard({ bank: bankName, card: null as any }, index);
      return;
    }

    const card = availableCards[bankName]?.find(c => c.cardName === cardName);
    if (card) {
      onSelectCard({ bank: bankName, card }, index);
      generateCardSummary(card, bankName);
    }
  };

  return (
    <div className="space-y-6">
      {[0, 1].map((index) => (
        <div key={index} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Card {index + 1}
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor={`bank-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Select Bank
              </label>
              <select
                id={`bank-${index}`}
                value={selectedCards[index]?.bank || ''}
                onChange={(e) => handleBankChange(e.target.value, index)}
                className="card-selector-option w-full rounded-lg border-gray-300 shadow-sm input-focus"
                disabled={isLoading}
              >
                <option value="">Select a bank</option>
                {banks.map((bank) => (
                  <option
                    key={bank}
                    value={bank}
                  >
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            {selectedCards[index]?.bank && (
              <div className="slide-up">
                <label htmlFor={`card-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Select Card
                </label>
                <select
                  id={`card-${index}`}
                  value={selectedCards[index]?.card?.cardName || ''}
                  onChange={(e) => handleCardChange(selectedCards[index]!.bank, e.target.value, index)}
                  className="card-selector-option w-full rounded-lg border-gray-300 shadow-sm input-focus"
                  disabled={isLoading}
                >
                  <option value="">Select a card</option>
                  {availableCards[selectedCards[index]!.bank]?.map((card) => (
                    <option
                      key={card.cardName}
                      value={card.cardName}
                      disabled={selectedCards.some((selected, i) => 
                        i !== index && selected?.card?.cardName === card.cardName
                      )}
                    >
                      {card.cardName} - ₹{card.annualFee.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedCards[index]?.card && (
              <div className="space-y-4">
                {/* <div className="glass-effect rounded-lg p-4 slide-up">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedCards[index]?.card?.cardName}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Annual Fee: ₹{selectedCards[index]?.card?.annualFee.toLocaleString()}</p>
                    <p>Target Audience: {selectedCards[index]?.card?.targetAudience}</p>
                    <p>Fee Waiver: {selectedCards[index]?.card?.feeWaiver}</p>
                  </div>
                </div> */}

                {/* AI Generated Summary */}
                <div className="glass-effect rounded-lg p-4 slide-up">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    AI Summary
                    {loadingSummaries[`${selectedCards[index]?.bank}-${selectedCards[index]?.card?.cardName}`] && (
                      <span className="loading-dots text-sm text-gray-500">Generating</span>
                    )}
                  </h4>
                  <div className="text-sm text-gray-600">
                    {cardSummaries[`${selectedCards[index]?.bank}-${selectedCards[index]?.card?.cardName}`] ? (
                      <div className="prose prose-sm max-w-none">
                        {cardSummaries[`${selectedCards[index]?.bank}-${selectedCards[index]?.card?.cardName}`]
                          .split('\n')
                          .map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        {loadingSummaries[`${selectedCards[index]?.bank}-${selectedCards[index]?.card?.cardName}`]
                          ? 'Generating summary...'
                          : 'Click to generate an AI summary of this card'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedCards[index] && (
              <button
                onClick={() => onSelectCard(null, index)}
                className="button-hover text-sm text-red-600 hover:text-red-700 mt-2"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 