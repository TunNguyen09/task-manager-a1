export function saveAuthData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function getAuthHeaders(includeJson = false) {
  const token = getToken();

  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}