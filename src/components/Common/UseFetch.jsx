// src/components/Common/UseFetch.jsx
import axios from "axios";

// Create axios instance
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper to get token from sessionStorage
const getToken = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.token || null;
  } catch (error) {
    console.error("Error getting token from sessionStorage:", error);
    return null;
  }
};



// Add 401 interceptor (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ✅ GET request
export const getData = async (url, tokenOrConfig = {}) => {
  try {
    let headers = {};
    if (typeof tokenOrConfig === "string") {
      headers = { Authorization: `Token ${tokenOrConfig}` };
    } else {
      const token = getToken();
      headers = {
        Authorization: token ? `Token ${token}` : undefined,
        ...tokenOrConfig.headers,
      };
    }

    const response = await api.get(url, {
      ...(typeof tokenOrConfig === "object" ? tokenOrConfig : {}),
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
};

// ✅ POST request
export const postData = async (url, data = {}, config = {}) => {
  
    
  try {
    const token = getToken();
    const headers = {
      Authorization: token ? `Token ${token}` : undefined,
      ...config.headers,
    };

    const response = await api.post(url, data, { ...config, headers });
    return response.data;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
};

// ✅ PUT request
export const putData = async (url, data = {}, config = {}) => {
  try {
    const token = getToken();
    const headers = {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...config.headers,
    };

    const response = await api.put(url, data, { ...config, headers });
    return response.data;
  } catch (error) {
    console.error("PUT request failed:", error);
    throw error;
  }
};

// ✅ DELETE request
export const deleteData = async (url, config = {}) => {
  try {
    const token = getToken();
    const headers = {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...config.headers,
    };

    const response = await api.delete(url, { ...config, headers });
    return response.data;
  } catch (error) {
    console.error("DELETE request failed:", error);
    throw error;
  }
};

// ✅ Get user role
export const getUserRoles = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.user_role || []; // get roles from user_role
  } catch (error) {
    console.error("Error parsing user data from sessionStorage:", error);
    return [];
  }
};


// ✅ Get username
export const getUsername = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.user?.username || "Guest";
  } catch (error) {
    return "Guest";
  }
};

export const getSessionData = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user || null;
  } catch (error) {
    console.error("Error getting token from sessionStorage:", error);
    return null;
  }
};
