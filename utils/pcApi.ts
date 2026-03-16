import { WAKEPC_SERVER_URL } from '@env';

export interface PCStatusResponse {
  name: string;
  status: boolean;
}

export interface WakeResponse {
  message: string;
}

export const wakePC = async (name: string): Promise<WakeResponse> => {
  try {
    const bodyData = JSON.stringify({ name });
    console.log('Sending wakePC request with body:', bodyData);
    const response = await fetch(`${WAKEPC_SERVER_URL}/wake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyData,
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
    const bodyData = JSON.stringify({ name });
    console.log('Sending checkPCStatus request with body:', bodyData);
    const response = await fetch(`${WAKEPC_SERVER_URL}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyData,
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
