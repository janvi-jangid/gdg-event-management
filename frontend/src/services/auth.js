const API_URL = "http://localhost:8080/api/auth";

export async function registerUser(name, email, password) {
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

  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
}


export async function authenticatedRequest(url, options = {}) {
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
    throw new Error(
      data?.message || data?.error || `Request failed: ${response.status}`
    );
  }

  return data;
}
