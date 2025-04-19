import { GetItem } from '../async-storage/async-storage';

const getBaseUrl = async () => await GetItem('BASEURL');

const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw errorData.message || "Something went wrong!";
    } catch {
      throw `HTTP Error ${response.status}`;
    }
  }
  return response.json();
};

export const httpGet = async (url) => {
  try {
    const BaseUrl = await getBaseUrl();
    const response = await fetch(`${BaseUrl}${url}`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    console.log('API response GET:', response);
    return await handleResponse(response);
  } catch (error) {
    console.error('GET Error on Network line 29:', error);
    return { error };
  }
};

export const httpPOST = async (url, data) => {
  try {
    const BaseUrl = await getBaseUrl();
    const response = await fetch(`${BaseUrl}${url}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    console.log('API response POST:', response);
    return await handleResponse(response);
  } catch (error) {
    console.error('POST Error on Network line  47:', error);
    return { error };
  }
};

export const httpPUT = async (url, data) => {
  try {
    const BaseUrl = await getBaseUrl();
    const response = await fetch(`${BaseUrl}${url}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    console.log('API response PUT:', response);
    return await handleResponse(response);
  } catch (error) {
    console.error('PUT Error on Network line 65:', error);
    return { error };
  }
};

const get_set_cookies = (headers) => {
  const cookies = [];
  for (const [name, value] of headers.entries()) {
    if (name.toLowerCase() === "set-cookie") {
      cookies.push(value);
    }
  }
  console.log('Cookies:', cookies);
};
