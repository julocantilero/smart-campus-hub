const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost/smart-campus-hub/api";

console.log("Admin API loaded");

async function apiRequest(endpoint, options = {}) {
  console.log(
    "Calling:",
    `${API_BASE_URL}${endpoint}`
  );

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      credentials: "include",
      ...options,
    }
  );

  return response.json();
}

export function getAdminProfile() {
  return apiRequest("/admin/profile.php");
}

export function getAdminStatistics() {
  return apiRequest("/admin/statistics.php");
}

export function getEnrollmentOverview() {
  return apiRequest("/admin/enrollment-overview.php");
}

export function getAdminAnnouncements() {
  return apiRequest("/admin/announcements.php");
}

export function getAdminRequests() {
  return apiRequest("/admin/requests/list.php");
}

export function getReports() {
  return apiRequest("/admin/reports.php");
}

export function createAnnouncement(announcementData) {
  return apiRequest("/admin/announcements.php", {
    method: "POST",
    body: JSON.stringify(announcementData),
  });
}

export function deleteRequest(requestId) {
  return apiRequest("api/admin/requests/delete.php", {
    method: "POST",

    body: JSON.stringify({
      request_id: requestId,
    }),
  });
}
