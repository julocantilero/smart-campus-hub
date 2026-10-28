import { useEffect, useMemo, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Mail,
  MapPin,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";


import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";

/*
|--------------------------------------------------------------------------
| Empty/default values
|--------------------------------------------------------------------------
|
| These values allow the dashboard to render even when PHP is not
| connected yet.
|
*/

const emptyStudent = {
  studentNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  fullName: "",
  email: "",
  program: "",
  yearLevel: "",
  semester: "",
  academicYear: "",
  totalUnits: 0,
  enrollmentStatus: "",
};

const emptyEnrollment = {
  status: "",
  semester: "",
  academicYear: "",
  totalUnits: 0,
  stages: [],
};

const defaultEnrollmentStages = [
  {
    id: 1,
    title: "Application Submitted",
    status: "Pending",
  },
  {
    id: 2,
    title: "Requirements Reviewed",
    status: "Pending",
  },
  {
    id: 3,
    title: "Subject Loading",
    status: "Pending",
  },
  {
    id: 4,
    title: "Officially Enrolled",
    status: "Pending",
  },
];

const announcementCategories = ["All", "Academic", "Enrollment", "Campus"];

/*
|--------------------------------------------------------------------------
| API helper
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

function StudentDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSection = searchParams.get("section") || "dashboard";

  const [student, setStudent] = useState(emptyStudent);

  const [enrollment, setEnrollment] = useState(emptyEnrollment);

  const [subjects, setSubjects] = useState([]);

  const [announcements, setAnnouncements] = useState([]);

  const [directoryEntries, setDirectoryEntries] = useState([]);

  const [requests, setRequests] = useState([]);

  const [directorySearch, setDirectorySearch] = useState("");

  const [announcementFilter, setAnnouncementFilter] = useState("All");

  const [showRequestModal, setShowRequestModal] = useState(false);

  const [requestSubmitting, setRequestSubmitting] = useState(false);

  const [requestDeletingId, setRequestDeletingId] = useState(null);

  const [requestError, setRequestError] = useState("");

  const [requestForm, setRequestForm] = useState({
    service: "Enrollment Concern",
    details: "",
  });

  const [loading, setLoading] = useState(true);

  const [apiConnected, setApiConnected] = useState(false);

  const [pageMessage, setPageMessage] = useState("");

  const navigate = useNavigate();

  

  /*
  |--------------------------------------------------------------------------
  | Load dashboard information
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const session = await getSession();

    if (!session.logged_in) {
      navigate("/");
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    setPageMessage("");

    const results = await Promise.allSettled([
      getStudentProfile(),
      getStudentEnrollment(),
      getStudentSubjects(),
      getAnnouncements(),
      getCampusDirectory(),
      getStudentRequests(),
    ]);

    const [
      profileResult,
      enrollmentResult,
      subjectsResult,
      announcementsResult,
      directoryResult,
      requestsResult,
    ] = results;

    let successfulRequests = 0;

    if (profileResult.status === "fulfilled") {
      successfulRequests += 1;

      const profileData =
        profileResult.value?.data ||
        profileResult.value?.student ||
        profileResult.value;

      setStudent(normalizeStudent(profileData));
    }

    if (enrollmentResult.status === "fulfilled") {
      successfulRequests += 1;

      const enrollmentData =
        enrollmentResult.value?.data ||
        enrollmentResult.value?.enrollment ||
        enrollmentResult.value;

      setEnrollment(normalizeEnrollment(enrollmentData));
    }

    if (subjectsResult.status === "fulfilled") {
      successfulRequests += 1;

      const subjectData =
        subjectsResult.value?.data ||
        subjectsResult.value?.subjects ||
        subjectsResult.value;

      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    }

    if (announcementsResult.status === "fulfilled") {
      successfulRequests += 1;

      const announcementData =
        announcementsResult.value?.data ||
        announcementsResult.value?.announcements ||
        announcementsResult.value;

      setAnnouncements(Array.isArray(announcementData) ? announcementData : []);
    }

    if (directoryResult.status === "fulfilled") {
      successfulRequests += 1;

      const directoryData =
        directoryResult.value?.data ||
        directoryResult.value?.directory ||
        directoryResult.value;

      setDirectoryEntries(Array.isArray(directoryData) ? directoryData : []);
    }

    if (requestsResult.status === "fulfilled") {
      successfulRequests += 1;

      const requestData =
        requestsResult.value?.data ||
        requestsResult.value?.requests ||
        requestsResult.value;

      setRequests(Array.isArray(requestData) ? requestData : []);
    }

    if (successfulRequests === 0) {
      setApiConnected(false);

      setPageMessage(
        "The PHP API is not connected yet. Student information will appear after the PHP endpoints are available.",
      );
    } else {
      setApiConnected(true);

      if (successfulRequests < 6) {
        setPageMessage("Some student information could not be loaded.");
      }
    }

    setLoading(false);
  }

  /*
  |--------------------------------------------------------------------------
  | Computed values
  |--------------------------------------------------------------------------
  */

  const studentDisplayName =
    student.firstName ||
    student.name ||
    getFirstName(student.fullName) ||
    "Student";

  const studentFullName =
    student.fullName ||
    [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Not available";

  const academicYear =
    student.academicYear || enrollment.academicYear || "Not available";

  const totalUnits = enrollment.totalUnits ?? student.totalUnits ?? 0;

  const enrollmentStatus =
    enrollment.status || student.enrollmentStatus || "Not available";

  const openRequestCount = requests.filter(
    (request) => getRequestStatus(request) !== "Completed",
  ).length;

  const statistics = [
    {
      title: "Enrollment Status",
      value: enrollmentStatus,
      description:
        enrollmentStatus === "Not available"
          ? "Waiting for PHP data"
          : "Current semester",
      icon: CheckCircle2,
      color: "green",
    },
    {
      title: "Current Units",
      value: totalUnits,
      description:
        totalUnits > 0 ? "Currently enrolled units" : "No units available",
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Subjects",
      value: subjects.length,
      description:
        subjects.length === 1 ? "Current subject" : "Current subjects",
      icon: GraduationCap,
      color: "purple",
    },
    {
      title: "Service Requests",
      value: openRequestCount,
      description: openRequestCount === 1 ? "Open request" : "Open requests",
      icon: ClipboardList,
      color: "orange",
    },
  ];

  const filteredDirectory = useMemo(() => {
    const searchTerm = directorySearch.trim().toLowerCase();

    if (!searchTerm) {
      return directoryEntries;
    }

    return directoryEntries.filter((entry) => {
      const searchableText = [
        entry.name,
        entry.office_name,
        entry.type,
        entry.email,
        entry.location,
        entry.service,
        entry.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [directoryEntries, directorySearch]);

  const filteredAnnouncements = useMemo(() => {
    if (announcementFilter === "All") {
      return announcements;
    }

    return announcements.filter(
      (announcement) => announcement.category === announcementFilter,
    );
  }, [announcements, announcementFilter]);

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  function changeSection(section) {
    if (section === "dashboard") {
      setSearchParams({});
      return;
    }

    setSearchParams({ section });
  }

  /*
  |--------------------------------------------------------------------------
  | Request modal controls
  |--------------------------------------------------------------------------
  */

  function openRequestModal() {
    setRequestError("");
    setShowRequestModal(true);
  }

  function closeRequestModal() {
    if (requestSubmitting) {
      return;
    }

    setRequestError("");
    setShowRequestModal(false);
  }

  function handleRequestChange(event) {
    const { name, value } = event.target;

    setRequestForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setRequestError("");
  }

  /*
  |--------------------------------------------------------------------------
  | Submit service request to PHP
  |--------------------------------------------------------------------------
  */

  async function submitRequest(event) {
    event.preventDefault();

    const cleanDetails = requestForm.details.trim();

    if (!requestForm.service) {
      setRequestError("Please select a service type.");

      return;
    }

    if (cleanDetails.length < 10) {
      setRequestError(
        "Please enter at least 10 characters describing your request.",
      );

      return;
    }

    setRequestSubmitting(true);
    setRequestError("");

    try {
      const response = await createStudentRequest({
        service: requestForm.service,
        details: cleanDetails,
      });

      const newRequest = response?.data || response?.request || response;

      if (!newRequest) {
        throw new Error("The PHP endpoint did not return the created request.");
      }

      setRequests((previousRequests) => [newRequest, ...previousRequests]);

      setRequestForm({
        service: "Enrollment Concern",
        details: "",
      });

      setShowRequestModal(false);
      setSearchParams({ section: "requests" });
    } catch (error) {
      setRequestError(
        error.message || "The service request could not be submitted.",
      );
    } finally {
      setRequestSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete service request through PHP
  |--------------------------------------------------------------------------
  */

  async function deleteRequest(requestId) {
    if (!requestId) {
      return;
    }

    const shouldDelete = window.confirm("Remove this service request?");

    if (!shouldDelete) {
      return;
    }

    setRequestDeletingId(requestId);
    setPageMessage("");

    try {
      await deleteStudentRequest(requestId);

      setRequests((previousRequests) =>
        previousRequests.filter(
          (request) => getRequestId(request) !== requestId,
        ),
      );
    } catch (error) {
      setPageMessage(
        error.message || "The service request could not be deleted.",
      );
    } finally {
      setRequestDeletingId(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <DashboardLayout role="student">
      <section className="page-heading">
        <div>
          <p className="academic-year">Academic Year {academicYear}</p>

          <h1>
            {currentSection === "dashboard"
              ? `Welcome, ${studentDisplayName}!`
              : getSectionTitle(currentSection)}
          </h1>

          <p>{getSectionDescription(currentSection)}</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openRequestModal}
        >
          <Plus size={19} />
          New Request
        </button>
      </section>

      {pageMessage && (
        <div
          className={
            apiConnected
              ? "dashboard-api-notice"
              : "dashboard-api-notice api-not-connected"
          }
        >
          <strong>{apiConnected ? "Notice" : "PHP API not connected"}</strong>

          <p>{pageMessage}</p>
        </div>
      )}

      {loading ? (
        <DashboardLoadingState />
      ) : (
        <>
          {currentSection === "dashboard" && (
            <DashboardOverview
              statistics={statistics}
              student={student}
              studentFullName={studentFullName}
              enrollment={enrollment}
              subjects={subjects}
              announcements={announcements}
              requests={requests}
              changeSection={changeSection}
              openRequestModal={openRequestModal}
            />
          )}

          {currentSection === "directory" && (
            <DirectorySection
              search={directorySearch}
              setSearch={setDirectorySearch}
              entries={filteredDirectory}
            />
          )}

          {currentSection === "enrollment" && (
            <EnrollmentSection
              student={student}
              studentFullName={studentFullName}
              enrollment={enrollment}
              subjects={subjects}
            />
          )}

          {currentSection === "announcements" && (
            <AnnouncementsSection
              filter={announcementFilter}
              setFilter={setAnnouncementFilter}
              entries={filteredAnnouncements}
            />
          )}

          {currentSection === "requests" && (
            <ServiceRequestsSection
              requests={requests}
              deleteRequest={deleteRequest}
              deletingId={requestDeletingId}
              openRequestModal={openRequestModal}
            />
          )}
        </>
      )}

      {showRequestModal && (
        <RequestModal
          form={requestForm}
          error={requestError}
          submitting={requestSubmitting}
          handleChange={handleRequestChange}
          submitRequest={submitRequest}
          closeModal={closeRequestModal}
        />
      )}
    </DashboardLayout>
  );
}

/*
|--------------------------------------------------------------------------
| Student section navigation
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Dashboard overview
|--------------------------------------------------------------------------
*/

function DashboardOverview({
  statistics,
  student,
  studentFullName,
  enrollment,
  subjects,
  announcements,
  requests,
  changeSection,
  openRequestModal,
}) {
  return (
    <>
      <section className="stats-grid">
        {statistics.map((statistic) => (
          <StatCard key={statistic.title} {...statistic} />
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Enrollment Information</h2>

              <p>Your current enrollment summary</p>
            </div>

            <StatusBadge
              status={
                enrollment.status || student.enrollmentStatus || "Not available"
              }
            />
          </div>

          <StudentInformation
            student={student}
            studentFullName={studentFullName}
            enrollment={enrollment}
          />
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Latest Announcements</h2>

              <p>Important campus information</p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => changeSection("announcements")}
            >
              View all
            </button>
          </div>

          {announcements.length === 0 ? (
            <CompactEmptyState message="No announcements available." />
          ) : (
            <div className="announcement-list">
              {announcements.slice(0, 3).map((announcement, index) => (
                <AnnouncementCard
                  key={announcement.id || announcement.announcement_id || index}
                  announcement={announcement}
                />
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-card full-width-card">
        <div className="card-heading">
          <div>
            <h2>Current Subjects</h2>

            <p>Your subjects for the current semester</p>
          </div>

          <button
            type="button"
            className="text-button"
            onClick={() => changeSection("enrollment")}
          >
            View enrollment
          </button>
        </div>

        <SubjectsTable subjects={subjects} />
      </section>

      <section className="dashboard-card full-width-card">
        <div className="card-heading">
          <div>
            <h2>Recent Service Requests</h2>

            <p>Recently submitted student requests</p>
          </div>

          <button
            type="button"
            className="text-button"
            onClick={() => changeSection("requests")}
          >
            View all
          </button>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            title="No service requests"
            description="You have not submitted a service request."
            buttonText="Create Request"
            onClick={openRequestModal}
          />
        ) : (
          <RequestsTable requests={requests.slice(0, 3)} showActions={false} />
        )}
      </section>
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Student information
|--------------------------------------------------------------------------
*/

function StudentInformation({ student, studentFullName, enrollment }) {
  return (
    <div className="information-list">
      <InformationRow
        label="Student number"
        value={
          student.studentNumber || student.student_number || "Not available"
        }
      />

      <InformationRow
        label="Student name"
        value={studentFullName || "Not available"}
      />

      <InformationRow
        label="Program"
        value={student.program || student.program_name || "Not available"}
      />

      <InformationRow
        label="Year level"
        value={student.yearLevel || student.year_level || "Not available"}
      />

      <InformationRow
        label="Semester"
        value={enrollment.semester || student.semester || "Not available"}
      />

      <InformationRow
        label="Total units"
        value={
          enrollment.totalUnits ??
          enrollment.total_units ??
          student.totalUnits ??
          student.total_units ??
          0
        }
      />
    </div>
  );
}

function InformationRow({ label, value }) {
  return (
    <div className="information-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Directory section
|--------------------------------------------------------------------------
*/

function DirectorySection({ search, setSearch, entries }) {
  return (
    <section className="dashboard-card full-width-card">
      <div className="card-heading">
        <div>
          <h2>Campus Directory</h2>

          <p>Search campus offices, departments, and services</p>
        </div>

        <span className="directory-result-count">
          {entries.length} {entries.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="directory-search">
        <Search size={19} />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search directory"
        />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="No directory entries"
          description="Directory information will appear after the PHP API is connected."
        />
      ) : (
        <div className="directory-grid">
          {entries.map((entry, index) => (
            <article
              className="directory-card"
              key={entry.id || entry.directory_id || index}
            >
              <div className="directory-icon">
                <Users size={22} />
              </div>

              <div>
                <span className="directory-type">
                  {entry.type || "Campus Office"}
                </span>

                <h3>{entry.name || entry.office_name || "Unnamed Office"}</h3>

                <p>
                  {entry.service ||
                    entry.description ||
                    "No description available."}
                </p>

                <div className="directory-contact">
                  {entry.email && (
                    <span>
                      <Mail size={15} />
                      {entry.email}
                    </span>
                  )}

                  {entry.location && (
                    <span>
                      <MapPin size={15} />
                      {entry.location}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Enrollment section
|--------------------------------------------------------------------------
*/

function EnrollmentSection({ student, studentFullName, enrollment, subjects }) {
  const stages =
    Array.isArray(enrollment.stages) && enrollment.stages.length > 0
      ? enrollment.stages
      : defaultEnrollmentStages;

  return (
    <>
      <section className="dashboard-grid student-content-grid">
        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Enrollment Status</h2>

              <p>Current semester information</p>
            </div>

            <StatusBadge
              status={
                enrollment.status || student.enrollmentStatus || "Not available"
              }
            />
          </div>

          <StudentInformation
            student={student}
            studentFullName={studentFullName}
            enrollment={enrollment}
          />
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Enrollment Progress</h2>

              <p>Current enrollment process</p>
            </div>
          </div>

          <div className="enrollment-timeline">
            {stages.map((stage, index) => {
              const stageStatus = stage.status || "Pending";

              const completed = stageStatus === "Completed";

              return (
                <div
                  className="enrollment-stage"
                  key={stage.id || stage.stage_id || index}
                >
                  <div
                    className={
                      completed
                        ? "enrollment-stage-icon"
                        : "enrollment-stage-icon enrollment-stage-pending"
                    }
                  >
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <strong>
                      Step {index + 1}:{" "}
                      {stage.title || stage.name || "Enrollment Stage"}
                    </strong>

                    <span>{stageStatus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="dashboard-card full-width-card">
        <div className="card-heading">
          <div>
            <h2>Enrolled Subjects</h2>

            <p>Subjects returned by the PHP API</p>
          </div>

          <strong className="total-units">
            {enrollment.totalUnits ??
              enrollment.total_units ??
              student.totalUnits ??
              student.total_units ??
              0}{" "}
            Units
          </strong>
        </div>

        <SubjectsTable subjects={subjects} />
      </section>

      <section className="dashboard-card full-width-card">
        <div className="information-notice">
          <GraduationCap size={24} />

          <p>
            This dashboard displays enrollment information from PHP. Official
            enrollment transactions should still be processed by the official
            registrar system.
          </p>
        </div>
      </section>
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Subjects table
|--------------------------------------------------------------------------
*/

function SubjectsTable({ subjects }) {
  if (!subjects || subjects.length === 0) {
    return (
      <EmptyState
        title="No subjects available"
        description="Subject information will appear after it is returned by PHP."
      />
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject</th>
            <th>Schedule</th>
            <th>Room</th>
            <th>Instructor</th>
            <th>Units</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject, index) => (
            <tr
              key={
                subject.id ||
                subject.subject_id ||
                `${subject.subject_code}-${index}`
              }
            >
              <td>{subject.code || subject.subject_code || "Not available"}</td>

              <td>
                {subject.subject ||
                  subject.name ||
                  subject.subject_name ||
                  "Not available"}
              </td>

              <td>{subject.schedule || "Not available"}</td>

              <td>{subject.room || "Not available"}</td>

              <td>
                {subject.instructor ||
                  subject.instructor_name ||
                  "Not available"}
              </td>

              <td>{subject.units ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Announcement section
|--------------------------------------------------------------------------
*/

function AnnouncementsSection({ filter, setFilter, entries }) {
  return (
    <section className="dashboard-card full-width-card">
      <div className="card-heading">
        <div>
          <h2>Campus Announcements</h2>

          <p>Academic and administrative notices</p>
        </div>

        <Bell size={23} className="heading-icon" />
      </div>

      <div className="announcement-filters">
        {announcementCategories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              filter === category
                ? "filter-button filter-button-active"
                : "filter-button"
            }
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="No announcements"
          description="Announcements will appear after they are returned by PHP."
        />
      ) : (
        <div className="full-announcement-list">
          {entries.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id || announcement.announcement_id || index}
              announcement={announcement}
              expanded
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AnnouncementCard({ announcement, expanded = false }) {
  return (
    <article
      className={
        expanded
          ? "announcement-item announcement-expanded"
          : "announcement-item"
      }
    >
      <div className="announcement-card-header">
        <span className="announcement-category">
          {announcement.category || "General"}
        </span>

        <time>{announcement.date || announcement.created_at || ""}</time>
      </div>

      <h3>{announcement.title || "Untitled announcement"}</h3>

      <p>
        {announcement.description ||
          announcement.content ||
          "No announcement details available."}
      </p>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Service request section
|--------------------------------------------------------------------------
*/

function ServiceRequestsSection({
  requests,
  deleteRequest,
  deletingId,
  openRequestModal,
}) {
  return (
    <section className="dashboard-card full-width-card">
      <div className="card-heading">
        <div>
          <h2>My Service Requests</h2>

          <p>Create and monitor student requests</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openRequestModal}
        >
          <Plus size={18} />
          Create Request
        </button>
      </div>

      <div className="information-notice request-notice">
        <ClipboardList size={23} />

        <p>
          Requests in this section will be submitted to your PHP service request
          endpoint.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="No service requests"
          description="You have not submitted a service request."
          buttonText="Create Request"
          onClick={openRequestModal}
        />
      ) : (
        <RequestsTable
          requests={requests}
          showActions
          deleteRequest={deleteRequest}
          deletingId={deletingId}
        />
      )}
    </section>
  );
}

function RequestsTable({ requests, showActions, deleteRequest, deletingId }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Service</th>
            <th>Details</th>
            <th>Date</th>
            <th>Status</th>

            {showActions && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {requests.map((request, index) => {
            const requestId = getRequestId(request);

            return (
              <tr key={requestId || index}>
                <td>{requestId || "Not available"}</td>

                <td>
                  {request.service || request.service_type || "Not available"}
                </td>

                <td>
                  {request.details || request.description || "Not available"}
                </td>

                <td>{request.date || request.created_at || "Not available"}</td>

                <td>
                  <StatusBadge status={getRequestStatus(request)} />
                </td>

                {showActions && (
                  <td>
                    <button
                      type="button"
                      className="delete-request-button"
                      disabled={deletingId === requestId}
                      onClick={() => deleteRequest(requestId)}
                    >
                      <Trash2 size={16} />

                      {deletingId === requestId ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Request modal
|--------------------------------------------------------------------------
*/

function RequestModal({
  form,
  error,
  submitting,
  handleChange,
  submitRequest,
  closeModal,
}) {
  return (
    <div className="modal-overlay">
      <form className="request-modal" onSubmit={submitRequest}>
        <div className="modal-heading">
          <div>
            <h2>Submit Service Request</h2>

            <p>This request will be sent to the PHP endpoint when connected.</p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={closeModal}
            disabled={submitting}
            aria-label="Close request form"
          >
            <X size={21} />
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="request-service">Service type</label>

          <select
            id="request-service"
            name="service"
            value={form.service}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="Enrollment Concern">Enrollment Concern</option>

            <option value="Document Verification">Document Verification</option>

            <option value="Portal Access">Portal Access</option>

            <option value="Student Services">Student Services</option>

            <option value="Academic Record Concern">
              Academic Record Concern
            </option>

            <option value="Other Concern">Other Concern</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="request-details">Request details</label>

          <textarea
            id="request-details"
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="Describe your concern or request"
            maxLength={500}
            disabled={submitting}
          />

          <div className="character-count">{form.details.length}/500</div>
        </div>

        {error && <p className="request-form-error">{error}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={closeModal}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            <Send size={18} />

            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Status badge
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status || "Not available"}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Loading and empty states
|--------------------------------------------------------------------------
*/

function DashboardLoadingState() {
  return (
    <section className="dashboard-loading">
      <div className="dashboard-loading-spinner" />

      <h2>Loading student information</h2>

      <p>Waiting for a response from the PHP API.</p>
    </section>
  );
}

function EmptyState({ title, description, buttonText, onClick }) {
  return (
    <div className="empty-state">
      <ClipboardList size={35} />

      <h3>{title}</h3>
      <p>{description}</p>

      {buttonText && (
        <button type="button" className="primary-button" onClick={onClick}>
          <Plus size={17} />
          {buttonText}
        </button>
      )}
    </div>
  );
}

function CompactEmptyState({ message }) {
  return (
    <div className="compact-empty-state">
      <Bell size={24} />
      <p>{message}</p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Helper functions
|--------------------------------------------------------------------------
*/

function normalizeStudent(data) {
  if (!data || typeof data !== "object") {
    return emptyStudent;
  }

  return {
    ...emptyStudent,

    ...data,

    studentNumber: data.studentNumber || data.student_number || "",

    firstName: data.firstName || data.first_name || "",

    middleName: data.middleName || data.middle_name || "",

    lastName: data.lastName || data.last_name || "",

    fullName: data.fullName || data.full_name || "",

    yearLevel: data.yearLevel || data.year_level || "",

    academicYear: data.academicYear || data.academic_year || "",

    totalUnits: data.totalUnits ?? data.total_units ?? 0,

    enrollmentStatus: data.enrollmentStatus || data.enrollment_status || "",
  };
}

function normalizeEnrollment(data) {
  if (!data || typeof data !== "object") {
    return emptyEnrollment;
  }

  return {
    ...emptyEnrollment,

    ...data,

    academicYear: data.academicYear || data.academic_year || "",

    totalUnits: data.totalUnits ?? data.total_units ?? 0,

    stages: Array.isArray(data.stages) ? data.stages : [],
  };
}

function getFirstName(fullName) {
  if (!fullName || typeof fullName !== "string") {
    return "";
  }

  return fullName.trim().split(/\s+/)[0] || "";
}

function getRequestId(request) {
  return request.id || request.requestId || request.request_id || "";
}

function getRequestStatus(request) {
  return request.status || request.request_status || "Submitted";
}

function getStatusClass(status) {
  const normalizedStatus = String(status || "").toLowerCase();

  if (
    normalizedStatus === "completed" ||
    normalizedStatus === "enrolled" ||
    normalizedStatus === "approved"
  ) {
    return "status-completed";
  }

  if (normalizedStatus === "processing" || normalizedStatus === "pending") {
    return "status-processing";
  }

  return "status-review";
}

function getSectionTitle(section) {
  const titles = {
    dashboard: "Student Dashboard",
    directory: "Campus Directory",
    enrollment: "Enrollment",
    announcements: "Announcements",
    requests: "Service Requests",
  };

  return titles[section] || titles.dashboard;
}

function getSectionDescription(section) {
  const descriptions = {
    dashboard:
      "View your enrollment status, subjects, announcements, and service requests.",

    directory:
      "Search campus offices, departments, and student support services.",

    enrollment: "Review your current enrollment status and enrolled subjects.",

    announcements: "Read academic, enrollment, and campus announcements.",

    requests: "Create and monitor your student service requests.",
  };

  return descriptions[section] || descriptions.dashboard;
}

export default StudentDashboard;
