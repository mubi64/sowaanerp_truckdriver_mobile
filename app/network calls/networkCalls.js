import { GetItem } from '../async-storage/async-storage';
import { Platform } from 'react-native';
import axios from 'axios';
import ImageResizer from '@bam.tech/react-native-image-resizer';


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

    // console.log('API response GET:', url, response);
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


export const uploadToERP = async (uri, doctype, name, format) => {
  const resizedImage = await ImageResizer.createResizedImage(
    uri,
    800, // width
    800, // height
    format || 'JPEG', // format
    70 // quality (0-100)
  );

  const fileName = resizedImage.name || resizedImage.uri.split('/').pop();
  const fileType = fileName.split('.').pop();
  const BaseUrl = await getBaseUrl();
  const formData = new FormData();

  formData.append('file', {
    uri: Platform.OS === 'android' ? resizedImage.uri : resizedImage.uri.replace('file://', ''),
    name: fileName,
    type: `image/${fileType}`,
    optimize: true,
  });
  formData.append('is_private', 0);
  if (doctype) {
    formData.append('doctype', doctype);
  }

  if (name) {
    formData.append('docname', name);
  }

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const res = await axios.post(`${BaseUrl}/api/method/upload_file`, formData, config);
    console.log('success images upload', res.data.message);
    return res.data.message.file_url;
  } catch (err) {
    console.error('Upload failed:', err.response?.data || err);
    throw new Error('Image upload failed');
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
