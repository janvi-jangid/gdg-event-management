const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080" : "")
).replace(/\/+$/, "");
const API_URL = API_BASE_URL ? `${API_BASE_URL}/api/auth` : "";

function requireApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("The backend API URL is not configured for this deployment.");
  }
}

export async function registerUser(name, email, password) {
  requireApiBaseUrl();
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const text = await response.text();

let data = {};

if (text) {
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
}

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Registration failed"
    );
  }

  return data;
}

export async function loginUser(email, password) {
  requireApiBaseUrl();
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await response.text();

let data = {};

if (text) {
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
}

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Invalid email or password"
    );
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("userEmail", data.email);
  window.dispatchEvent(new Event("authchange"));

  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  window.dispatchEvent(new Event("authchange"));
}


export async function authenticatedRequest(url, options = {}) {
  requireApiBaseUrl();
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const error = new Error(
      response.status === 401
        ? "Your session has expired. Please log in and try again."
        : data?.message || data?.error || `Request failed: ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function registerForEvent(eventId) {
  return authenticatedRequest(
    `${API_BASE_URL}/api/registrations/${eventId}`,
    { method: "POST", body: "{}" }
  );
}

export async function cancelEventRegistration(eventId) {
  return authenticatedRequest(
    `${API_BASE_URL}/api/registrations/${eventId}`,
    { method: "DELETE" }
  );
}

export async function getMyRegistrations() {
  return authenticatedRequest(`${API_BASE_URL}/api/registrations/me`);
}
