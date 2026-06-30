const BASE_URL = "http://localhost:5001/api";

const getHeaders = (options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  async get(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(options),
      ...options,
    });
    return this.handleResponse(response);
  },

  async post(endpoint, body, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(options),
      body: JSON.stringify(body),
      ...options,
    });
    return this.handleResponse(response);
  },

  async put(endpoint, body, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(options),
      body: JSON.stringify(body),
      ...options,
    });
    return this.handleResponse(response);
  },

  async delete(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(options),
      ...options,
    });
    return this.handleResponse(response);
  },

  async handleResponse(response) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    return data;
  },
};
