import { CreditCard, CreditCardData } from '@/types/credit-card';
import { getCardData } from './card-service';

export async function queryCards(query: string): Promise<string> {
  try {
    // Get all card data
    const cardData = await getCardData();
    
    // Prepare the prompt with context
    const prompt = `You are a credit card expert assistant. Use the following credit card data to answer the user's query. 
    Format your response in a clear, concise way. If comparing cards, use bullet points for benefits.
    If recommending cards, explain why each card is a good fit.
    
    Credit Card Data:
    ${JSON.stringify(cardData, null, 2)}
    
    User Query: ${query}`;

    const response = await fetch(
      "https://router.huggingface.co/featherless-ai/v1/completions",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          stream: false
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Handle the response based on the model's output format
    if (data.choices && data.choices[0]?.text) {
      return data.choices[0].text.trim();
    } else if (data.generated_text) {
      return data.generated_text.trim();
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format from API');
    }
  } catch (error) {
    console.error('Error querying cards:', error);
    throw new Error('Failed to process your query. Please try again.');
  }
} 