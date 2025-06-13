import { SelectedCard } from '@/types/credit-card';

interface ComparisonTableProps {
  cards: SelectedCard[];
}

export default function ComparisonTable({ cards }: ComparisonTableProps) {
  if (cards.length !== 2) return null;

  const [card1, card2] = cards;

  const comparisonFields = [
    { label: 'Annual Fee', key: 'annualFee' },
    { label: 'Fee Waiver', key: 'feeWaiver' },
    { label: 'Welcome/Renewal Benefit', key: 'welcomeRenewalBenefit' },
    { label: 'Reward Rate', key: 'rewardRateBase' },
    { label: 'Point Value', key: 'pointValueApprox' },
    { label: 'Reward Transfer', key: 'rewardTransfer' },
    { label: 'Milestone Benefits', key: 'milestoneBenefits' },
    { label: 'Domestic Lounge Access', key: 'loungeAccessDomestic' },
    { label: 'International Lounge Access', key: 'loungeAccessInternational' },
    { label: 'Lifestyle Benefits', key: 'lifestyleBenefits' },
    { label: 'Forex Markup Fee', key: 'forexMarkupFee' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {card1.bank} - {card1.card.cardName}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {card2.bank} - {card2.card.cardName}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {comparisonFields.map(({ label, key }) => (
            <tr key={key}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {label}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {card1.card[key as keyof typeof card1.card]}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {card2.card[key as keyof typeof card2.card]}
              </td>
            </tr>
          ))}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Target Audience
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {card1.card.targetAudience}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {card2.card.targetAudience}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 