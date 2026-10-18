const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost/smart-campus-hub/api";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      credentials: "include",

      ...options,

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  let responseData = null;

  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
        responseData?.error ||
        `Request failed with status ${response.status}.`
    );
  }

  return responseData;
}

export function getFacultyProfile() {
  return apiRequest("/faculty/profile.php");
}

export function getFacultyWorkload() {
  return apiRequest("/faculty/workload.php");
}

export function getFacultyClasses() {
  return apiRequest("/faculty/classes.php");
}

export function getFacultyAdvisees() {
  return apiRequest("/faculty/advisees.php");
}

export function getFacultyAnnouncements() {
  return apiRequest("/announcements/list.php");
}

export function getFacultyDirectory() {
  return apiRequest("/directory/list.php");
}

export function getFacultyRequests() {
  return apiRequest(
    "/faculty/requests/list.php"
  );
}

export function createFacultyRequest(requestData) {
  return apiRequest(
    "/faculty/requests/create.php",
    {
      method: "POST",
      body: JSON.stringify(requestData),
    }
  );
}

export function deleteFacultyRequest(requestId) {
  return apiRequest(
    "/faculty/requests/delete.php",
    {
      method: "POST",

      body: JSON.stringify({
        request_id: requestId,
      }),
    }
  );
}