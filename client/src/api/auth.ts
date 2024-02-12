// api.ts

// Define the base URL of your backend API
const BASE_URL = 'https://15c61275d3d3.ngrok.app';

// Function to handle HTTP errors
const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
};

// Function to make a generic GET request
export const get = async <T>(url: string, token?: string): Promise<T> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, { headers });
  handleErrors(response);
  return response.json();
};

// Function to make a generic POST request
export const post = async <T>(url: string, data: any, headers?: Record<string, string>): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers, 
    },
    body: JSON.stringify(data),
  });
  handleErrors(response);
  return response.json();
};

// Function to handle user login
export const login = async (email: string, password: string): Promise<any> => {
  const data = { email, password };
  return post('/login', data);
};

// Function to handle user registration
export const register = async (email: string, password: string, username: string): Promise<any> => {
  const data = { email, password, username };
  return post('/register', data);
};

export const requestToken = async (token: string): Promise<any> => {
  return get('/request-token', token);
};