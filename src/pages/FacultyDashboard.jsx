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
  UserRound,
  Users,
  X,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";



/*
|--------------------------------------------------------------------------
| Empty/default values
|--------------------------------------------------------------------------
*/

const emptyFaculty = {
  employeeNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  fullName: "",
  email: "",
  department: "",
  position: "",
  academicYear: "",
  semester: "",
};

const emptyWorkload = {
  lectureUnits: 0,
  laboratoryUnits: 0,
  totalUnits: 0,
  maximumUnits: 24,
};

const announcementCategories = ["All", "Academic", "Enrollment", "Campus"];

/*
|--------------------------------------------------------------------------
| Main faculty dashboard
|--------------------------------------------------------------------------
*/

function FacultyDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSection = searchParams.get("section") || "dashboard";

  const [faculty, setFaculty] = useState(emptyFaculty);

  const [workload, setWorkload] = useState(emptyWorkload);

  const [classes, setClasses] = useState([]);
  const [advisees, setAdvisees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [directoryEntries, setDirectoryEntries] = useState([]);

  const [requests, setRequests] = useState([]);

  const [directorySearch, setDirectorySearch] = useState("");

  const [classSearch, setClassSearch] = useState("");

  const [adviseeSearch, setAdviseeSearch] = useState("");

  const [adviseeStatusFilter, setAdviseeStatusFilter] = useState("All");

  const [announcementFilter, setAnnouncementFilter] = useState("All");

  const [showRequestModal, setShowRequestModal] = useState(false);

  const [requestSubmitting, setRequestSubmitting] = useState(false);

  const [requestDeletingId, setRequestDeletingId] = useState(null);

  const [requestError, setRequestError] = useState("");

  const [requestForm, setRequestForm] = useState({
    service: "Classroom Concern",
    details: "",
  });

  const [loading, setLoading] = useState(true);

  const [apiConnected, setApiConnected] = useState(false);

  const [pageMessage, setPageMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const session = await getSession();

    if (!session.logged_in) {
      navigate("/");
    }

    if (session.role !== "faculty") {
      navigate("/");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Load faculty data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadFacultyDashboard();
  }, []);

  async function loadFacultyDashboard() {
    setLoading(true);
    setPageMessage("");

    const results = await Promise.allSettled([
      getFacultyProfile(),
      getFacultyWorkload(),
      getFacultyClasses(),
      getFacultyAdvisees(),
      getFacultyAnnouncements(),
      getFacultyDirectory(),
      getFacultyRequests(),
    ]);

    const [
      profileResult,
      workloadResult,
      classesResult,
      adviseesResult,
      announcementsResult,
      directoryResult,
      requestsResult,
    ] = results;

    let successfulRequests = 0;

    if (profileResult.status === "fulfilled") {
      successfulRequests += 1;

      const profileData = extractData(profileResult.value, "faculty");

      setFaculty(normalizeFaculty(profileData));
    }

    if (workloadResult.status === "fulfilled") {
      successfulRequests += 1;

      const workloadData = extractData(workloadResult.value, "workload");

      setWorkload(normalizeWorkload(workloadData));
    }

    if (classesResult.status === "fulfilled") {
      successfulRequests += 1;

      const classData = extractData(classesResult.value, "classes");

      setClasses(Array.isArray(classData) ? classData : []);
    }

    if (adviseesResult.status === "fulfilled") {
      successfulRequests += 1;

      const adviseeData = extractData(adviseesResult.value, "advisees");

      setAdvisees(Array.isArray(adviseeData) ? adviseeData : []);
    }

    if (announcementsResult.status === "fulfilled") {
      successfulRequests += 1;

      const announcementData = extractData(
        announcementsResult.value,
        "announcements",
      );

      setAnnouncements(Array.isArray(announcementData) ? announcementData : []);
    }

    if (directoryResult.status === "fulfilled") {
      successfulRequests += 1;

      const directoryData = extractData(directoryResult.value, "directory");

      setDirectoryEntries(Array.isArray(directoryData) ? directoryData : []);
    }

    if (requestsResult.status === "fulfilled") {
      successfulRequests += 1;

      const requestData = extractData(requestsResult.value, "requests");

      setRequests(Array.isArray(requestData) ? requestData : []);
    }

    if (successfulRequests === 0) {
      setApiConnected(false);

      setPageMessage(
        "The PHP API is not connected yet. Faculty information will appear after the PHP endpoints are available.",
      );
    } else {
      setApiConnected(true);

      if (successfulRequests < 7) {
        setPageMessage("Some faculty information could not be loaded.");
      }
    }

    setLoading(false);
  }

  /*
  |--------------------------------------------------------------------------
  | Computed values
  |--------------------------------------------------------------------------
  */

  const facultyDisplayName =
    faculty.firstName ||
    faculty.name ||
    getFirstName(faculty.fullName) ||
    "Faculty";

  const facultyFullName =
    faculty.fullName ||
    [faculty.firstName, faculty.middleName, faculty.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Not available";

  const academicYear = faculty.academicYear || "Not available";

  const openRequestCount = requests.filter(
    (request) => getRequestStatus(request) !== "Completed",
  ).length;

  const statistics = [
    {
      title: "Teaching Load",
      value: `${workload.totalUnits || 0} Units`,
      description: "Current semester",
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Assigned Classes",
      value: classes.length,
      description: classes.length === 1 ? "Active class" : "Active classes",
      icon: GraduationCap,
      color: "purple",
    },
    {
      title: "Student Advisees",
      value: advisees.length,
      description:
        advisees.length === 1 ? "Assigned advisee" : "Assigned advisees",
      icon: Users,
      color: "green",
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

  const filteredClasses = useMemo(() => {
    const searchTerm = classSearch.trim().toLowerCase();

    if (!searchTerm) {
      return classes;
    }

    return classes.filter((classItem) => {
      const searchableText = [
        classItem.code,
        classItem.subject_code,
        classItem.subject,
        classItem.subject_name,
        classItem.section,
        classItem.schedule,
        classItem.room,
        classItem.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [classes, classSearch]);

  const filteredAdvisees = useMemo(() => {
    const searchTerm = adviseeSearch.trim().toLowerCase();

    return advisees.filter((advisee) => {
      const searchableText = [
        advisee.studentNumber,
        advisee.student_number,
        advisee.name,
        advisee.fullName,
        advisee.full_name,
        advisee.program,
        advisee.yearLevel,
        advisee.year_level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);

      const status = advisee.status || advisee.advising_status || "Regular";

      const matchesStatus =
        adviseeStatusFilter === "All" || status === adviseeStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [advisees, adviseeSearch, adviseeStatusFilter]);

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
  | Request form
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
      const response = await createFacultyRequest({
        service: requestForm.service,
        details: cleanDetails,
      });

      const newRequest = response?.data || response?.request || response;

      if (!newRequest || typeof newRequest !== "object") {
        throw new Error("The PHP endpoint did not return the created request.");
      }

      setRequests((previousRequests) => [newRequest, ...previousRequests]);

      setRequestForm({
        service: "Classroom Concern",
        details: "",
      });

      setShowRequestModal(false);

      setSearchParams({
        section: "requests",
      });
    } catch (error) {
      setRequestError(
        error.message || "The faculty request could not be submitted.",
      );
    } finally {
      setRequestSubmitting(false);
    }
  }

  async function deleteRequest(requestId) {
    if (!requestId) {
      return;
    }

    const shouldDelete = window.confirm("Remove this faculty request?");

    if (!shouldDelete) {
      return;
    }

    setRequestDeletingId(requestId);
    setPageMessage("");

    try {
      await deleteFacultyRequest(requestId);

      setRequests((previousRequests) =>
        previousRequests.filter(
          (request) => getRequestId(request) !== requestId,
        ),
      );
    } catch (error) {
      setPageMessage(
        error.message || "The faculty request could not be deleted.",
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
    <DashboardLayout role="faculty">
      <section className="page-heading">
        <div>
          <p className="academic-year">Academic Year {academicYear}</p>

          <h1>
            {currentSection === "dashboard"
              ? `Welcome, ${facultyDisplayName}!`
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
            <FacultyOverview
              statistics={statistics}
              faculty={faculty}
              facultyFullName={facultyFullName}
              workload={workload}
              classes={classes}
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

          {currentSection === "classes" && (
            <ClassesSection
              search={classSearch}
              setSearch={setClassSearch}
              classes={filteredClasses}
            />
          )}

          {currentSection === "workload" && (
            <WorkloadSection
              faculty={faculty}
              facultyFullName={facultyFullName}
              workload={workload}
              classes={classes}
            />
          )}

          {currentSection === "advisees" && (
            <AdviseesSection
              search={adviseeSearch}
              setSearch={setAdviseeSearch}
              statusFilter={adviseeStatusFilter}
              setStatusFilter={setAdviseeStatusFilter}
              advisees={filteredAdvisees}
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
| Main dashboard view
|--------------------------------------------------------------------------
*/

function FacultyOverview({
  statistics,
  faculty,
  facultyFullName,
  workload,
  classes,
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
              <h2>Faculty Workload</h2>

              <p>Current teaching load distribution</p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => changeSection("workload")}
            >
              View details
            </button>
          </div>

          <WorkloadSummary workload={workload} />
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
            <h2>Assigned Classes</h2>

            <p>Current faculty teaching assignments</p>
          </div>

          <button
            type="button"
            className="text-button"
            onClick={() => changeSection("classes")}
          >
            View all classes
          </button>
        </div>

        <ClassesTable classes={classes.slice(0, 3)} />
      </section>

      <section className="dashboard-card full-width-card">
        <div className="card-heading">
          <div>
            <h2>Recent Service Requests</h2>

            <p>Recently submitted faculty requests</p>
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
            description="You have not submitted a faculty request."
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
| Faculty information
|--------------------------------------------------------------------------
*/

function FacultyInformation({ faculty, facultyFullName }) {
  return (
    <div className="information-list">
      <InformationRow
        label="Employee number"
        value={
          faculty.employeeNumber || faculty.employee_number || "Not available"
        }
      />

      <InformationRow
        label="Faculty name"
        value={facultyFullName || "Not available"}
      />

      <InformationRow
        label="Department"
        value={faculty.department || faculty.department_name || "Not available"}
      />

      <InformationRow
        label="Position"
        value={faculty.position || faculty.designation || "Not available"}
      />

      <InformationRow
        label="Semester"
        value={faculty.semester || "Not available"}
      />

      <InformationRow
        label="Academic year"
        value={faculty.academicYear || faculty.academic_year || "Not available"}
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
| Faculty workload
|--------------------------------------------------------------------------
*/

function WorkloadSummary({ workload }) {
  const maximumUnits = Number(workload.maximumUnits) || 24;

  const lectureUnits = Number(workload.lectureUnits) || 0;

  const laboratoryUnits = Number(workload.laboratoryUnits) || 0;

  const totalUnits =
    Number(workload.totalUnits) || lectureUnits + laboratoryUnits;

  const lectureWidth = Math.min((lectureUnits / maximumUnits) * 100, 100);

  const laboratoryWidth = Math.min((laboratoryUnits / maximumUnits) * 100, 100);

  return (
    <>
      <div className="progress-list">
        <div className="progress-item">
          <div className="progress-label">
            <span>Lecture units</span>

            <strong>{lectureUnits} units</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill progress-blue"
              style={{
                width: `${lectureWidth}%`,
              }}
            />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span>Laboratory units</span>

            <strong>{laboratoryUnits} units</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill progress-purple"
              style={{
                width: `${laboratoryWidth}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="workload-total">
        <span>Total teaching load</span>

        <strong>{totalUnits} units</strong>
      </div>
    </>
  );
}

function WorkloadSection({ faculty, facultyFullName, workload, classes }) {
  return (
    <>
      <section className="dashboard-grid faculty-content-grid">
        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Faculty Information</h2>

              <p>Current faculty assignment record</p>
            </div>

            <StatusBadge status="Active" />
          </div>

          <FacultyInformation
            faculty={faculty}
            facultyFullName={facultyFullName}
          />
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Teaching Load</h2>

              <p>Lecture and laboratory distribution</p>
            </div>
          </div>

          <WorkloadSummary workload={workload} />
        </article>
      </section>

      <section className="dashboard-card full-width-card">
        <div className="card-heading">
          <div>
            <h2>Workload Breakdown</h2>

            <p>Classes included in the current workload</p>
          </div>

          <strong className="faculty-total-units">
            {workload.totalUnits || 0} Units
          </strong>
        </div>

        <ClassesTable classes={classes} />
      </section>

      <section className="dashboard-card full-width-card">
        <div className="faculty-information-notice">
          <BookOpen size={23} />

          <p>
            This module displays faculty workload information from PHP. It does
            not process payroll or official compensation records.
          </p>
        </div>
      </section>
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Faculty directory
|--------------------------------------------------------------------------
*/

function DirectorySection({ search, setSearch, entries }) {
  return (
    <section className="dashboard-card full-width-card">
      <div className="card-heading">
        <div>
          <h2>Faculty Directory</h2>

          <p>Search academic departments and offices</p>
        </div>

        <span className="faculty-result-count">
          {entries.length} {entries.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="faculty-search-box">
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
          description="Directory entries will appear after they are returned by PHP."
        />
      ) : (
        <div className="faculty-directory-grid">
          {entries.map((entry, index) => (
            <article
              className="faculty-directory-card"
              key={entry.id || entry.directory_id || index}
            >
              <div className="faculty-directory-icon">
                <Users size={22} />
              </div>

              <div>
                <span className="faculty-directory-type">
                  {entry.type || "Campus Office"}
                </span>

                <h3>{entry.name || entry.office_name || "Unnamed Office"}</h3>

                <p>
                  {entry.service ||
                    entry.description ||
                    "No description available."}
                </p>

                <div className="faculty-directory-contact">
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
| Assigned classes
|--------------------------------------------------------------------------
*/

function ClassesSection({ search, setSearch, classes }) {
  const totalStudents = classes.reduce(
    (total, classItem) =>
      total + Number(classItem.students || classItem.student_count || 0),
    0,
  );

  return (
    <>
      <section className="faculty-class-summary-grid">
        <SummaryCard icon={BookOpen} label="Classes" value={classes.length} />

        <SummaryCard icon={Users} label="Students" value={totalStudents} />

        <SummaryCard
          icon={GraduationCap}
          label="Lecture Classes"
          value={
            classes.filter(
              (classItem) =>
                String(classItem.type || "").toLowerCase() === "lecture",
            ).length
          }
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Laboratory Classes"
          value={
            classes.filter(
              (classItem) =>
                String(classItem.type || "").toLowerCase() === "laboratory",
            ).length
          }
        />
      </section>

      <section className="dashboard-card full-width-card">
        <div className="card-heading">
          <div>
            <h2>Assigned Classes</h2>

            <p>Search current teaching assignments</p>
          </div>

          <span className="faculty-result-count">
            {classes.length} {classes.length === 1 ? "result" : "results"}
          </span>
        </div>

        <div className="faculty-search-box faculty-search-spacing">
          <Search size={19} />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search subject, section, schedule, or room"
          />
        </div>

        <ClassesTable classes={classes} />
      </section>
    </>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <article className="faculty-summary-card">
      <Icon size={23} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ClassesTable({ classes }) {
  if (!classes || classes.length === 0) {
    return (
      <EmptyState
        title="No assigned classes"
        description="Assigned classes will appear after they are returned by PHP."
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
            <th>Section</th>
            <th>Schedule</th>
            <th>Room</th>
            <th>Type</th>
            <th>Students</th>
          </tr>
        </thead>

        <tbody>
          {classes.map((classItem, index) => {
            const type = classItem.type || "Lecture";

            return (
              <tr key={classItem.id || classItem.class_id || index}>
                <td>
                  {classItem.code || classItem.subject_code || "Not available"}
                </td>

                <td>
                  {classItem.subject ||
                    classItem.subject_name ||
                    "Not available"}
                </td>

                <td>{classItem.section || "Not available"}</td>

                <td>{classItem.schedule || "Not available"}</td>

                <td>{classItem.room || "Not available"}</td>

                <td>
                  <span
                    className={
                      String(type).toLowerCase() === "laboratory"
                        ? "faculty-type-badge faculty-laboratory"
                        : "faculty-type-badge faculty-lecture"
                    }
                  >
                    {type}
                  </span>
                </td>

                <td>{classItem.students ?? classItem.student_count ?? 0}</td>
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
| Advisees
|--------------------------------------------------------------------------
*/

function AdviseesSection({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  advisees,
}) {
  return (
    <section className="dashboard-card full-width-card">
      <div className="card-heading">
        <div>
          <h2>Student Advisees</h2>

          <p>Search students assigned for advising</p>
        </div>

        <span className="faculty-result-count">
          {advisees.length} {advisees.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="faculty-filter-row">
        <div className="faculty-search-box">
          <Search size={19} />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student name or number"
          />
        </div>

        <select
          className="faculty-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>

          <option value="Regular">Regular</option>

          <option value="For Advising">For Advising</option>
        </select>
      </div>

      {advisees.length === 0 ? (
        <EmptyState
          title="No advisees found"
          description="Advisee information will appear after it is returned by PHP."
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Name</th>
                <th>Program</th>
                <th>Year Level</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {advisees.map((advisee, index) => {
                const status =
                  advisee.status || advisee.advising_status || "Regular";

                return (
                  <tr key={advisee.id || advisee.student_id || index}>
                    <td>
                      {advisee.studentNumber ||
                        advisee.student_number ||
                        "Not available"}
                    </td>

                    <td>
                      {advisee.name ||
                        advisee.fullName ||
                        advisee.full_name ||
                        "Not available"}
                    </td>

                    <td>
                      {advisee.program ||
                        advisee.program_name ||
                        "Not available"}
                    </td>

                    <td>
                      {advisee.yearLevel ||
                        advisee.year_level ||
                        "Not available"}
                    </td>

                    <td>
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Announcements
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

        <Bell size={23} className="faculty-heading-icon" />
      </div>

      <div className="faculty-announcement-filters">
        {announcementCategories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              filter === category
                ? "faculty-filter-button faculty-filter-active"
                : "faculty-filter-button"
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
        <div className="faculty-announcement-list">
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
          ? "announcement-item faculty-announcement-expanded"
          : "announcement-item"
      }
    >
      <div className="faculty-announcement-header">
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
| Service requests
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
          <h2>Faculty Service Requests</h2>

          <p>Create and monitor faculty requests</p>
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

      <div className="faculty-information-notice faculty-request-notice">
        <ClipboardList size={23} />

        <p>
          Requests in this section will be submitted to the PHP faculty request
          endpoint.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="No faculty requests"
          description="You have not submitted a faculty service request."
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
    <div className="table-container faculty-request-table">
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
                      className="faculty-delete-button"
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
    <div className="faculty-modal-overlay">
      <form className="faculty-request-modal" onSubmit={submitRequest}>
        <div className="faculty-modal-heading">
          <div>
            <h2>Submit Faculty Request</h2>

            <p>
              This request will be sent to PHP when the endpoint is connected.
            </p>
          </div>

          <button
            type="button"
            className="faculty-modal-close"
            onClick={closeModal}
            disabled={submitting}
            aria-label="Close request form"
          >
            <X size={21} />
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="faculty-request-service">Service type</label>

          <select
            id="faculty-request-service"
            name="service"
            value={form.service}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="Classroom Concern">Classroom Concern</option>

            <option value="Schedule Concern">Schedule Concern</option>

            <option value="Teaching Load Concern">Teaching Load Concern</option>

            <option value="Faculty Record Concern">
              Faculty Record Concern
            </option>

            <option value="Portal Access">Portal Access</option>

            <option value="Other Faculty Service">Other Faculty Service</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="faculty-request-details">Request details</label>

          <textarea
            id="faculty-request-details"
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="Describe your request or concern"
            maxLength={500}
            disabled={submitting}
          />

          <div className="faculty-character-count">
            {form.details.length}/500
          </div>
        </div>

        {error && <p className="faculty-form-error">{error}</p>}

        <div className="faculty-modal-actions">
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
| Status, loading, and empty states
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status || "Not available"}
    </span>
  );
}

function DashboardLoadingState() {
  return (
    <section className="dashboard-loading">
      <div className="dashboard-loading-spinner" />

      <h2>Loading faculty information</h2>

      <p>Waiting for a response from the PHP API.</p>
    </section>
  );
}

function EmptyState({ title, description, buttonText, onClick }) {
  return (
    <div className="faculty-empty-state">
      <UserRound size={35} />

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

function extractData(response, propertyName) {
  return response?.data || response?.[propertyName] || response;
}

function normalizeFaculty(data) {
  if (!data || typeof data !== "object") {
    return emptyFaculty;
  }

  return {
    ...emptyFaculty,
    ...data,

    employeeNumber: data.employeeNumber || data.employee_number || "",

    firstName: data.firstName || data.first_name || "",

    middleName: data.middleName || data.middle_name || "",

    lastName: data.lastName || data.last_name || "",

    fullName: data.fullName || data.full_name || "",

    academicYear: data.academicYear || data.academic_year || "",
  };
}

function normalizeWorkload(data) {
  if (!data || typeof data !== "object") {
    return emptyWorkload;
  }

  const lectureUnits =
    Number(data.lectureUnits ?? data.lecture_units ?? 0) || 0;

  const laboratoryUnits =
    Number(data.laboratoryUnits ?? data.laboratory_units ?? 0) || 0;

  return {
    ...emptyWorkload,
    ...data,

    lectureUnits,

    laboratoryUnits,

    totalUnits:
      Number(
        data.totalUnits ?? data.total_units ?? lectureUnits + laboratoryUnits,
      ) || 0,

    maximumUnits: Number(data.maximumUnits ?? data.maximum_units ?? 24) || 24,
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
    normalizedStatus === "approved" ||
    normalizedStatus === "active" ||
    normalizedStatus === "regular"
  ) {
    return "status-completed";
  }

  if (
    normalizedStatus === "processing" ||
    normalizedStatus === "pending" ||
    normalizedStatus === "for advising"
  ) {
    return "status-processing";
  }

  return "status-review";
}

function getSectionTitle(section) {
  const titles = {
    dashboard: "Faculty Dashboard",
    directory: "Faculty Directory",
    classes: "Assigned Classes",
    workload: "Faculty Workload",
    advisees: "Student Advisees",
    announcements: "Announcements",
    requests: "Service Requests",
  };

  return titles[section] || titles.dashboard;
}

function getSectionDescription(section) {
  const descriptions = {
    dashboard:
      "Review assigned classes, workload, advisees, announcements, and service requests.",

    directory: "Search academic departments and administrative offices.",

    classes: "Review and search your assigned classes and schedules.",

    workload: "Monitor your lecture and laboratory teaching load.",

    advisees: "Search students assigned for faculty advising.",

    announcements: "Read academic, enrollment, and campus announcements.",

    requests: "Create and monitor faculty service requests.",
  };

  return descriptions[section] || descriptions.dashboard;
}

export default FacultyDashboard;
