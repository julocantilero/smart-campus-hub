const API_BASE_URL =
  "http://localhost/smart-campus-hub/Backend";

export async function getAnnouncements() {
  const response = await fetch(
    `${API_BASE_URL}/shared/announcements.php`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  console.log("Announcements API:", data);

  return data;
}

export async function getSession() {
  const response = await fetch(
    "http://localhost/smart-campus-hub/Backend/auth/session.php",
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getCampusDirectory() {
  const response = await fetch(
    `${API_BASE_URL}/shared/directory.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}