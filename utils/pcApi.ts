export interface PCStatusResponse {
  name: string;
  status: boolean;
}

export interface WakeResponse {
  message: string;
}

const WAKEPC_SERVER_URL = process.env.WAKEPC_SERVER_URL || 'http://127.0.0.1:8909';

export const wakePC = async (name: string): Promise<WakeResponse> => {
  try {
    const response = await fetch(`${WAKEPC_SERVER_URL}/wake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error waking PC:', error);
    throw error;
  }
};

export const checkPCStatus = async (name: string): Promise<PCStatusResponse> => {
  try {
    const response = await fetch(`${WAKEPC_SERVER_URL}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking PC status:', error);
    throw error;
  }
};
