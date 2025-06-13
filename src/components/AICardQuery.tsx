import { useState } from 'react';
import { queryCards } from '@/lib/ai-service';

export default function AICardQuery() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exampleQueries = [
    "Show me cards that offer lounge access",
    "Best credit cards for first-time users with no annual fee",
    "Show me cards that offer cashback on fuel"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await queryCards(query);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-lg shadow-md p-6 card-hover">
      <h2 className="text-2xl font-semibold gradient-text mb-4">
        Ask About Credit Cards
      </h2>
      <p className="text-gray-600 mb-4 slide-up">
        Get personalized credit card recommendations and comparisons using natural language.
      </p>

      <div className="mb-6 fade-in">
        <p className="text-sm text-gray-500 mb-2">Try these example queries:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="example-query text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors button-hover"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 fade-in">
        <div>
          <label htmlFor="query" className="sr-only">
            Ask about credit cards
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about credit cards..."
              className="input-focus flex-1 rounded-lg border-gray-300 shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="button-hover px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <span className="loading-dots">Thinking</span> : 'Ask'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg slide-up">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg ai-response slide-up">
          <h3 className="font-medium text-gray-900 mb-2">Response:</h3>
          <div className="prose prose-sm max-w-none">
            {response.split('\n').map((line, index) => (
              <p key={index} className="text-gray-700 mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 