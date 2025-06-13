'use client';

import { useState } from 'react';
import { SelectedCard } from '@/types/credit-card';
import CardSelector from '@/components/CardSelector';
import ComparisonTable from '@/components/ComparisonTable';
import AICardQuery from '@/components/AICardQuery';

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<(SelectedCard | null)[]>([null, null]);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectCard = (card: SelectedCard | null, index: number) => {
    setSelectedCards(prev => {
      const newCards = [...prev];
      newCards[index] = card;
      return newCards;
    });
    setShowComparison(false);
  };

  const handleCompare = () => {
    if (selectedCards.every(card => card !== null && card.card !== null)) {
      setShowComparison(true);
    }
  };

  const validSelectedCards = selectedCards.filter((card): card is SelectedCard => 
    card !== null && card.card !== null
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold gradient-text mb-2 fade-in">
        Credit Card Comparer
      </h1>
      <p className="text-lg text-gray-600 mb-8 slide-up">
        Select a bank and card to compare their features, rewards, and benefits.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="fade-in">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Cards to Compare</h2>
          <div className="glass-effect rounded-lg p-6 card-hover">
            <CardSelector
              selectedCards={selectedCards}
              onSelectCard={handleSelectCard}
            />
            
            {validSelectedCards.length === 2 && !showComparison && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleCompare}
                  className="button-hover px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Compare Cards
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="fade-in">
          <AICardQuery />
        </div>
      </div>

      {showComparison && validSelectedCards.length === 2 && (
        <div className="slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold gradient-text">Comparison</h2>
            <button
              onClick={() => setShowComparison(false)}
              className="button-hover text-sm text-gray-600 hover:text-gray-900"
            >
              Hide Comparison
            </button>
          </div>
          <div className="glass-effect rounded-lg overflow-hidden">
            <ComparisonTable cards={validSelectedCards} />
          </div>
        </div>
      )}
    </div>
  );
} 