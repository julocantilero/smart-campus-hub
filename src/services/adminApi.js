const API_BASE_URL = "http://localhost/smart-campus-hub/Backend";

export async function getAdminProfile() {
  const response = await fetch(`${API_BASE_URL}/admin/profile.php`, {
    credentials: "include",
  });

  return response.json();
}

export async function getAdminStatistics() {
  const response = await fetch(`${API_BASE_URL}/admin/statistics.php`, {
    credentials: "include",
  });

  return response.json();
}

export async function getAdminRequests() {
  const response = await fetch(`${API_BASE_URL}/admin/requests.php`, {
    credentials: "include",
  });

  return response.json();
}

export async function getEnrollmentOverview() {
  const response = await fetch(`${API_BASE_URL}/admin/enrollmentOverview.php`, {
    credentials: "include",
  });

  return response.json();
}

export async function getReports() {
  const response = await fetch(`${API_BASE_URL}/admin/reports.php`, {
    credentials: "include",
  });

  return response.json();
}

export async function createAnnouncement(data) {
  const response = await fetch(`${API_BASE_URL}/admin/createAnnouncement.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function updateRequestStatus(requestId, status) {
  const response = await fetch(
    `${API_BASE_URL}/admin/updateRequestStatus.php`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId,
        status,
      }),
    },
  );

  return response.json();
}
