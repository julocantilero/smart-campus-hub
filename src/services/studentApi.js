const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost/studentcampushub-api";

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
        "The request could not be completed."
    );
  }

  return responseData;
}

/*
|--------------------------------------------------------------------------
| Student profile
|--------------------------------------------------------------------------
*/

export function getStudentProfile() {
  return apiRequest("/student/profile.php");
}

/*
|--------------------------------------------------------------------------
| Student enrollment
|--------------------------------------------------------------------------
*/

export function getStudentEnrollment() {
  return apiRequest("/student/enrollment.php");
}

/*
|--------------------------------------------------------------------------
| Student subjects
|--------------------------------------------------------------------------
*/

export function getStudentSubjects() {
  return apiRequest("/student/subjects.php");
}

/*
|--------------------------------------------------------------------------
| Announcements
|--------------------------------------------------------------------------
*/

export function getAnnouncements() {
  return apiRequest("/announcements/list.php");
}

/*
|--------------------------------------------------------------------------
| Campus directory
|--------------------------------------------------------------------------
*/

export function getCampusDirectory() {
  return apiRequest("/directory/list.php");
}

/*
|--------------------------------------------------------------------------
| Student service requests
|--------------------------------------------------------------------------
*/

export function getStudentRequests() {
  return apiRequest(
    "/student/requests/list.php"
  );
}

export function createStudentRequest(requestData) {
  return apiRequest(
    "/student/requests/create.php",
    {
      method: "POST",
      body: JSON.stringify(requestData),
    }
  );
}

export function deleteStudentRequest(requestId) {
  return apiRequest(
    "/student/requests/delete.php",
    {
      method: "POST",

      body: JSON.stringify({
        request_id: requestId,
      }),
    }
  );
}
``