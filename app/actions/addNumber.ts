'use server';

export async function addNumber(formData: FormData) {
  const value = formData.get('value');
  if (!value) {
    return { error: 'Value is required' };
  }

  const numValue = parseInt(value as string, 10);
  if (isNaN(numValue)) {
    return { error: 'Please enter a valid integer' };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/numbers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: numValue }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || 'Failed to add number' };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'An error occurred' };
  }
} 