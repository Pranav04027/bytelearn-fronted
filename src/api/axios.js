import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.DEV ? "/api/v1" : (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"),
  withCredentials: true,
});

let isRefreshing = false;
let pendingRequests = [];

function subscribeTokenRefresh(cb) {
  pendingRequests.push(cb);
}

function onRefreshed() {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const url = originalRequest.url || "";

    // Only handle 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Don't try to refresh for the refresh endpoint itself
    if (url.includes("/users/refresh-token")) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If a refresh is already in flight, queue this request to retry later
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          instance(originalRequest).then(resolve).catch(reject);
        });
      });
    }

    // Start a refresh
    isRefreshing = true;
    try {
      await instance.post("/users/refresh-token");
      isRefreshing = false;
      onRefreshed();
      return instance(originalRequest);
    } catch (refreshErr) {
      isRefreshing = false;
      pendingRequests = [];
      // Let caller handle (e.g., UI shows logged-out state)
      return Promise.reject(refreshErr);
    }
  }
);

export default instance;
