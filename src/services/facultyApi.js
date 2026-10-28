const API_BASE_URL =
  "http://localhost/smart-campus-hub/Backend";

export async function getFacultyProfile() {
  const response = await fetch(
    `${API_BASE_URL}/faculty/profile.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getFacultyClasses() {
  const response = await fetch(
    `${API_BASE_URL}/faculty/classes.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getFacultyAdvisees() {
  const response = await fetch(
    `${API_BASE_URL}/faculty/advisees.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getFacultyWorkload() {
  const response = await fetch(
    `${API_BASE_URL}/faculty/workload.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getFacultyDirectory() {
  const response = await fetch(
    `${API_BASE_URL}/shared/directory.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getFacultyRequests() {
  const response = await fetch(
    `${API_BASE_URL}/faculty/requests.php`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function createFacultyRequest(data) {
  const response = await fetch(
    `${API_BASE_URL}/faculty/createRequest.php`,
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

export async function deleteFacultyRequest(id) {
  const response = await fetch(
    `${API_BASE_URL}/faculty/deleteRequest.php?id=${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return response.json();
}