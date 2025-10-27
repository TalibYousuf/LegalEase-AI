/**
 * API utility functions for making HTTP requests
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {};
    
    // Add Content-Type only if body is not FormData
    const isFormData = options.body && typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Check if response is empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * HTTP GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export const get = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: 'GET',
    ...options,
  });
};

/**
 * HTTP POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export const post = (endpoint, data, options = {}) => {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * HTTP PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export const put = (endpoint, data, options = {}) => {
  return fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * HTTP DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export const del = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: 'DELETE',
    ...options,
  });
};

/**
 * Upload file to the API
 * @param {string} endpoint - API endpoint
 * @param {File} file - File to upload
 * @param {Object} additionalData - Additional form data
 * @returns {Promise<any>} - Response data
 */
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add any additional data to the form
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  return fetchApi(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      // Intentionally empty; fetchApi will omit Content-Type for FormData
    },
  });
};