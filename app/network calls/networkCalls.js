import { GetItem } from '../async-storage/async-storage';
import { Platform } from 'react-native';
import axios from 'axios';
import ImageResizer from '@bam.tech/react-native-image-resizer';


const REQUEST_TIMEOUT_MS = 30000;

export const ERROR_MESSAGES = {
  noServer: 'Server URL is missing. Please enter it on the login screen.',
  network: "Can't connect to the server. Check the server URL and your internet connection.",
  timeout: 'The server took too long to respond. Please try again.',
  notErp: "This URL doesn't look like a SowaanERP server. Check the server URL.",
  notFound: 'Server not found at this URL. Check the server URL.',
  unavailable: 'The server is unavailable right now. Please try again later.',
  unauthorized: 'Your session has expired. Please log in again.',
  forbidden: "You don't have permission to do this.",
  generic: 'Something went wrong. Please try again.',
};

// "erp.example.com/" -> "https://erp.example.com"
export const normalizeBaseUrl = (input) => {
  let url = (input || '').trim().replace(/\/+$/, '');
  if (!url) {
    return '';
  }
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
};

const getBaseUrl = async () => normalizeBaseUrl(await GetItem('BASEURL'));

// Frappe errors can contain HTML, e.g. "<details><summary>Not permitted</summary>...</details>"
const cleanText = (text) => {
  const summary = text.match(/<summary>(.*?)<\/summary>/i);
  return (summary ? summary[1] : text).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

// Pull the human-readable message out of a Frappe error body
const getServerMessage = (body) => {
  if (!body || typeof body !== 'object') {
    return '';
  }
  if (body._server_messages) {
    try {
      const first = JSON.parse(JSON.parse(body._server_messages)[0]);
      if (first?.message) {
        return cleanText(first.message);
      }
    } catch { }
  }
  if (typeof body.message === 'string' && body.message) {
    return cleanText(body.message);
  }
  if (typeof body.exception === 'string' && body.exception) {
    // "frappe.exceptions.ValidationError: Message" -> "Message"
    return cleanText(body.exception.replace(/^[\w.]+:\s*/, ''));
  }
  return '';
};

const statusMessage = (status) => {
  if (status === 401) {
    return ERROR_MESSAGES.unauthorized;
  }
  if (status === 403) {
    return ERROR_MESSAGES.forbidden;
  }
  if (status === 404) {
    return ERROR_MESSAGES.notFound;
  }
  if (status >= 502 && status <= 504) {
    return ERROR_MESSAGES.unavailable;
  }
  return `${ERROR_MESSAGES.generic} (HTTP ${status})`;
};

const request = async (method, url, data) => {
  const BaseUrl = await getBaseUrl();
  if (!BaseUrl) {
    return { error: ERROR_MESSAGES.noServer };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(`${BaseUrl}${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: data === undefined ? undefined : JSON.stringify(data),
      signal: controller.signal,
    });
  } catch (error) {
    console.error(`${method} ${url} failed:`, error);
    return { error: error?.name === 'AbortError' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.network };
  } finally {
    clearTimeout(timer);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    // HTML or empty body: not a Frappe API response
    return {
      error: response.ok ? ERROR_MESSAGES.notErp : statusMessage(response.status),
      status: response.status,
    };
  }

  if (!response.ok) {
    console.error(`${method} ${url} -> ${response.status}`, body?.exception || body?.message);
    return { error: getServerMessage(body) || statusMessage(response.status), status: response.status };
  }
  return body;
};

export const httpGet = (url) => request('GET', url);

export const httpPOST = (url, data) => request('POST', url, data);

export const httpPUT = (url, data) => request('PUT', url, data);


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
