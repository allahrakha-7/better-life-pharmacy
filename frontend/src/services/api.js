const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    const hostname = window.location.hostname;
    return `http://${hostname}:5000/api`;
};

export const BASE_URL = getBaseUrl();

async function request(path, options = {}) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${BASE_URL}${path}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export const api = {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
