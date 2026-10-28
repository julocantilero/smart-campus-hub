const API_BASE_URL =
  "http://localhost/smart-campus-hub/Backend";

export async function getStudentProfile() {
  const response = await fetch(
    `${API_BASE_URL}/student/profile.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getStudentEnrollment() {
  const response = await fetch(
    `${API_BASE_URL}/student/enrollment.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getStudentSubjects() {
  const response = await fetch(
    `${API_BASE_URL}/student/subjects.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getStudentRequests() {
  const response = await fetch(
    `${API_BASE_URL}/student/requests.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function createStudentRequest(data) {
  const response = await fetch(
    `${API_BASE_URL}/student/createRequest.php`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function deleteStudentRequest(id) {
  const response = await fetch(
    `${API_BASE_URL}/student/deleteRequest.php?id=${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return response.json();
}