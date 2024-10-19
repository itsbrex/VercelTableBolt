const API_KEY_STORAGE_KEY = 'openai-api-key';

export async function saveApiKey(apiKey: string): Promise<void> {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export async function getApiKey(): Promise<string | null> {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/engines', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}