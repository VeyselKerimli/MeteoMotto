// Gemini AI API entegrasyonu
const API_KEY = 'AIzaSyDPLupOyVQjv0NbCKIic63SzSmo0bKKwYY';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-pro';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

/**
 * Hava durumu verilerine göre esprili ve samimi öneriler üretir
 * @param weatherData Hava durumu verisi
 * @param language Dil (tr veya en)
 * @returns Gemini AI tarafından üretilen öneri metni
 */
export async function generateWeatherSuggestion(
  weatherData: {
    temp: number;
    feels_like: number;
    description: string;
    city: string;
    humidity: number;
    wind_speed: number;
    condition: string;
  },
  language = 'tr'
): Promise<string> {
  const prompt = language === 'tr' 
    ? `${weatherData.city}'de hava durumu: ${weatherData.temp}°C (hissedilen: ${weatherData.feels_like}°C), ${weatherData.description}, nem: %${weatherData.humidity}, rüzgar: ${weatherData.wind_speed} km/s. 
    Bu hava durumuna göre esprili, samimi ve yararlı bir öneri yaz. Kısa ve öz olsun, 1-2 cümle.`
    : `Weather in ${weatherData.city}: ${weatherData.temp}°C (feels like: ${weatherData.feels_like}°C), ${weatherData.description}, humidity: ${weatherData.humidity}%, wind: ${weatherData.wind_speed} km/h.
    Write a witty, friendly, and helpful suggestion for this weather. Keep it short and concise, 1-2 sentences.`;

  const url = `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 100,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }),
  });

  if (!response.ok) {
    throw new Error(`Öneri alınamadı: ${response.status}`);
  }

  const data: GeminiResponse = await response.json();
  
  if (data.candidates && data.candidates.length > 0 && 
      data.candidates[0].content && 
      data.candidates[0].content.parts && 
      data.candidates[0].content.parts.length > 0) {
    return data.candidates[0].content.parts[0].text;
  }
  
  return language === 'tr' 
    ? 'Bugün için özel bir önerim yok, ama her zaman hazırlıklı olmak iyidir!' 
    : 'I don\'t have a special suggestion for today, but it\'s always good to be prepared!';
}
