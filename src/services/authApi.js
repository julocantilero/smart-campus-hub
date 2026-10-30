const API_BASE_URL = "http://localhost/smart-campus-hub/Backend";

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response.json();
}

export async function getSession() {
  const response = await fetch(`${API_BASE_URL}/auth/session.php`, {
    credentials: "include",
  });

  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout.php`, {
    credentials: "include",
  });

  return response.json();
}

