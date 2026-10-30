import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import StatCard from "../components/StatCard";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAdminProfile,
  getAdminStatistics,
  getAdminRequests,
  getReports,
  createAnnouncement,
  updateRequestStatus,
  getDirectory,
  deleteDirectory,
  createDirectory,
  deleteAnnouncement,
  getEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
} from "../services/adminApi";
import { getSession } from "../services/authApi";
import { getAnnouncements } from "../services/sharedApi";
import { Users, GraduationCap, ClipboardList, Bell } from "lucide-react";
import jsPDF from "jspdf";
function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const [statistics, setStatistics] = useState([]);

  const [announcements, setAnnouncements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [directoryEntries, setDirectoryEntries] = useState([]);
  const iconMap = {
    Students: Users,
    Faculty: GraduationCap,
    Requests: ClipboardList,
    Announcements: Bell,
  };
  const [apiConnected, setApiConnected] = useState(false);
  const [pageMessage, setPageMessage] = useState("");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    description: "",
  });
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);
  useEffect(() => {
    loadAdminDashboard();
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    checkSession();
  }, []);

  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [directoryForm, setDirectoryForm] = useState({
    name: "",
    type: "",
    email: "",
    location: "",
    service: "",
  });

  async function checkSession() {
    const session = await getSession();

    if (!session.logged_in) {
      navigate("/");
    }

    if (session.role !== "admin") {
      navigate("/");
    }
  }

  const [searchParams, setSearchParams] = useSearchParams();

  const currentSection = searchParams.get("section") || "dashboard";

  function changeSection(section) {
    if (section === "dashboard") {
      setSearchParams({});
      return;
    }

    setSearchParams({ section });
  }

  function getSectionTitle(section) {
    const titles = {
      dashboard: "Administrative Dashboard",
      directory: "Campus Directory",
      enrollment: "Enrollment Management",
      reports: "Reports",
      announcements: "Announcements",
      requests: "Service Requests",
    };

    return titles[section] || titles.dashboard;
  }

  async function handleEnrollmentStatusUpdate(enrollmentId, status) {
    try {
      await updateEnrollmentStatus(enrollmentId, status);

      setEnrollments((previous) =>
        previous.map((enrollment) =>
          enrollment.id === enrollmentId
            ? {
                ...enrollment,
                status,
              }
            : enrollment,
        ),
      );
    } catch (error) {
      alert(error.message || "Failed to update enrollment status.");
    }
  }

  function getSectionDescription(section) {
    const descriptions = {
      dashboard:
        "Monitor students, faculty, enrollment, announcements, reports, and service requests.",

      directory: "Manage campus offices and directory information.",

      enrollment: "Review enrollment statistics and student enrollment status.",

      reports: "Generate and monitor institutional reports.",

      announcements: "Create and manage campus announcements.",

      requests: "Review and process service requests.",
    };

    return descriptions[section] || descriptions.dashboard;
  }

  async function handleDeleteAnnouncement(id) {
    const confirmed = window.confirm("Delete this announcement?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteAnnouncement(id);

      setAnnouncements((previous) =>
        previous.filter((announcement) => announcement.id !== id),
      );
    } catch (error) {
      alert(error.message || "Failed to delete announcement.");
    }
  }

  async function submitAnnouncement() {
    if (
      !announcementForm.title.trim() ||
      !announcementForm.description.trim()
    ) {
      alert("Please complete all fields.");
      return;
    }

    try {
      setAnnouncementSubmitting(true);

      const response = await createAnnouncement(announcementForm);

      const newAnnouncement = response?.data || response;

      setAnnouncements((previousAnnouncements) => [
        newAnnouncement,
        ...previousAnnouncements,
      ]);

      setAnnouncementForm({
        title: "",
        description: "",
      });

      setShowAnnouncementModal(false);

      changeSection("announcements");
    } catch (error) {
      alert(error.message || "Failed to create announcement.");
    } finally {
      setAnnouncementSubmitting(false);
    }
  }

  async function handleRequestStatusUpdate(requestId, status) {
    try {
      await updateRequestStatus(requestId, status);

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status,
              }
            : request,
        ),
      );
    } catch (error) {
      alert(error.message || "Failed to update request status.");
    }
  }

  async function submitDirectory() {
    try {
      const response = await createDirectory(directoryForm);

      const newEntry = response?.data || response;

      setDirectoryEntries((previous) => [newEntry, ...previous]);

      setDirectoryForm({
        name: "",
        type: "",
        email: "",
        location: "",
        service: "",
      });

      setShowDirectoryModal(false);
    } catch (error) {
      alert(error.message || "Failed to create directory entry.");
    }
  }

  async function handleDeleteEnrollment(id) {
    const confirmed = window.confirm("Remove this enrollment record?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteEnrollment(id);

      setEnrollments((previous) =>
        previous.filter((enrollment) => enrollment.id !== id),
      );
    } catch (error) {
      alert(error.message || "Failed to remove enrollment.");
    }
  }

  async function handleDeleteDirectory(id) {
    const confirmed = window.confirm("Delete this directory entry?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteDirectory(id);

      setDirectoryEntries((previous) =>
        previous.filter((entry) => entry.id !== id),
      );
    } catch (error) {
      alert(error.message || "Failed to delete directory entry.");
    }
  }

  async function loadAdminDashboard() {
    try {
      setLoading(true);

      console.log("Loading Admin API...");

      const results = await Promise.allSettled([
        getAdminProfile(),
        getAdminStatistics(),
        getAnnouncements(),
        getAdminRequests(),
        getReports(),
        getDirectory(),
        getEnrollments(),
      ]);

      console.log(results);

      const [
        profileResult,
        statisticsResult,
        announcementsResult,
        requestsResult,
        reportsResult,
        directoryResult,
        enrollmentsResult,
      ] = results;

      let successCount = 0;

      if (profileResult.status === "fulfilled") {
        successCount++;

        setAdmin(profileResult.value?.data || profileResult.value);
      }

      if (statisticsResult.status === "fulfilled") {
        successCount++;

        const stats = statisticsResult.value?.data || [];

        setStatistics(
          stats.map((stat) => ({
            ...stat,
            icon: iconMap[stat.title],
          })),
        );
      }

      if (announcementsResult.status === "fulfilled") {
        successCount++;

        setAnnouncements(announcementsResult.value?.data || []);
      }

      if (requestsResult.status === "fulfilled") {
        successCount++;

        setRequests(requestsResult.value?.data || []);
      }

      if (reportsResult.status === "fulfilled") {
        successCount++;

        setReports(reportsResult.value?.data || []);
      }

      if (directoryResult.status === "fulfilled") {
        successCount++;

        setDirectoryEntries(directoryResult.value?.data || []);
      }

      if (enrollmentsResult.status === "fulfilled") {
        setEnrollments(enrollmentsResult.value?.data || []);
      }

      if (successCount > 0) {
        setApiConnected(true);
        setPageMessage("");
      } else {
        setApiConnected(false);

        setPageMessage("Admin API is not connected.");
      }
    } catch (error) {
      console.error(error);

      setApiConnected(false);

      setPageMessage(error.message || "Admin API is not connected.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading Admin Dashboard...</div>;
  }

  return (
    <DashboardLayout role="admin" userName={admin.email}>
      {pageMessage && (
        <div
          className={
            apiConnected
              ? "dashboard-api-notice"
              : "dashboard-api-notice api-not-connected"
          }
        >
          <strong>{apiConnected ? "Notice" : "Admin API not connected"}</strong>

          <p>{pageMessage}</p>
        </div>
      )}

      <section className="page-heading">
        <div>
          <p className="academic-year">Academic Year 2026–2027</p>

          <h1>{getSectionTitle(currentSection)}</h1>

          <p>{getSectionDescription(currentSection)}</p>
        </div>
      </section>

      <section className="stats-grid">
        {Array.isArray(statistics) &&
          statistics.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>

      {currentSection === "dashboard" && (
        <AdminOverview
          statistics={statistics}
          announcements={announcements}
          requests={requests}
          changeSection={changeSection}
          setShowAnnouncementModal={setShowAnnouncementModal}
          setShowDirectoryModal={setShowDirectoryModal}
        />
      )}

      {currentSection === "directory" && (
        <AdminDirectorySection
          changeSection={changeSection}
          directoryEntries={directoryEntries}
          handleDelete={handleDeleteDirectory}
          openModal={() => setShowDirectoryModal(true)}
        />
      )}

      {currentSection === "enrollment" && (
        <AdminEnrollmentSection
          enrollments={enrollments}
          changeSection={changeSection}
          handleEnrollmentStatusUpdate={handleEnrollmentStatusUpdate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDeleteEnrollment={handleDeleteEnrollment}
        />
      )}

      {currentSection === "reports" && (
        <AdminReportsSection
          reports={reports}
          changeSection={changeSection}
          enrollments={enrollments}
        />
      )}

      {currentSection === "announcements" && (
        <AdminAnnouncementsSection
          announcements={announcements}
          changeSection={changeSection}
          handleDeleteAnnouncement={handleDeleteAnnouncement}
          openAnnouncementModal={() => setShowAnnouncementModal(true)}
        />
      )}

      {currentSection === "requests" && (
        <AdminRequestsSection
          requests={requests}
          changeSection={changeSection}
          handleRequestStatusUpdate={handleRequestStatusUpdate}
        />
      )}

      {showAnnouncementModal && (
        <AnnouncementModal
          form={announcementForm}
          setForm={setAnnouncementForm}
          submitAnnouncement={submitAnnouncement}
          submitting={announcementSubmitting}
          closeModal={() => setShowAnnouncementModal(false)}
        />
      )}

      {showDirectoryModal && (
        <DirectoryModal
          form={directoryForm}
          setForm={setDirectoryForm}
          submitDirectory={submitDirectory}
          closeModal={() => setShowDirectoryModal(false)}
        />
      )}
    </DashboardLayout>
  );
}

function AdminOverview({
  announcements,
  requests,
  changeSection,
  setShowAnnouncementModal,
  setShowDirectoryModal,
}) {
  return (
    <section className="dashboard-grid">
      <article className="dashboard-card" style={{ cursor: "pointer" }}>
        <div className="card-heading">
          <h2>Announcements</h2>
        </div>

        <h3>{announcements.length}</h3>

        <p>Published announcements</p>

        <button
          type="button"
          className="primary-button"
          onClick={() => changeSection("announcements")}
        >
          Open
        </button>
      </article>

      <article className="dashboard-card">
        <div className="card-heading">
          <h2>Service Requests</h2>
        </div>

        <h3>{requests.length}</h3>
        <p>Active requests</p>

        <button
          className="primary-button"
          onClick={() => changeSection("requests")}
        >
          Open
        </button>
      </article>

      <article className="dashboard-card">
        <div className="card-heading">
          <h2>Reports</h2>
        </div>

        <button
          className="primary-button"
          onClick={() => changeSection("reports")}
        >
          Open Reports
        </button>
      </article>

      <article className="dashboard-card">
        <div className="card-heading">
          <h2>Enrollment</h2>
        </div>

        <button
          className="primary-button"
          onClick={() => changeSection("enrollment")}
        >
          Open
        </button>
      </article>
    </section>
  );
}

function AdminDirectorySection({
  changeSection,
  directoryEntries,
  handleDelete,
  openModal,
}) {
  return (
    <section className="dashboard-card">
      <button
        type="button"
        className="secondary-button"
        onClick={() => changeSection("dashboard")}
      >
        Back to Dashboard
      </button>

      <div className="card-heading">
        <h2>Campus Directory</h2>

        <button type="button" className="primary-button" onClick={openModal}>
          <Plus size={18} />
          Add Office
        </button>
      </div>

      {directoryEntries.length === 0 ? (
        <p>No directory entries found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Office</th>
                <th>Type</th>
                <th>Email</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {directoryEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name || entry.office_name}</td>
                  <td>{entry.type || "N/A"}</td>
                  <td>{entry.email || "N/A"}</td>
                  <td>{entry.location || "N/A"}</td>

                  <td>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AdminEnrollmentSection({
  enrollments,
  changeSection,
  handleEnrollmentStatusUpdate,
  handleDeleteEnrollment,
  handleRequestStatusUpdate,
  searchTerm,
  setSearchTerm,
}) {
  const enrolledStudents = enrollments.filter(
    (enrollment) => enrollment.status === "Enrolled",
  ).length;

  const pendingStudents = enrollments.filter(
    (enrollment) => enrollment.status === "Pending",
  ).length;

  const rejectedStudents = enrollments.filter(
    (enrollment) => enrollment.status === "Rejected",
  ).length;

  const totalUnits = enrollments.reduce(
    (total, enrollment) => total + Number(enrollment.total_units || 0),
    0,
  );

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      `${enrollment.first_name} ${enrollment.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.student_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );
  return (
    <section className="dashboard-card admin-section">
      <div className="card-heading">
        <h2>Enrollment Management</h2>

        <button
          type="button"
          className="secondary-button"
          onClick={() => changeSection("dashboard")}
        >
          Back
        </button>
      </div>

      <div className="form-group">
        <input
          type="search"
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student No.</th>
              <th>Name</th>
              <th>Program</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Units</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEnrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.student_number}</td>
                <td>
                  {enrollment.first_name} {enrollment.last_name}
                </td>
                <td>{enrollment.program}</td>
                <td>{enrollment.year_level}</td>
                <td>{enrollment.semester}</td>
                <td>{enrollment.total_units}</td>
                <td>
                  <span
                    className={`status-badge ${
                      enrollment.status === "Enrolled"
                        ? "status-completed"
                        : enrollment.status === "Rejected"
                          ? "status-rejected"
                          : "status-processing"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </td>

                <td>
                  {enrollment.status === "Pending" && (
                    <>
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                          handleEnrollmentStatusUpdate(
                            enrollment.id,
                            "Enrolled",
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        style={{ marginLeft: "8px" }}
                        onClick={() =>
                          handleEnrollmentStatusUpdate(
                            enrollment.id,
                            "Rejected",
                          )
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    className="secondary-button"
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDeleteEnrollment(enrollment.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminReportsSection({ reports, changeSection, enrollments }) {
  const totalEnrollments = enrollments.length;

  const totalEnrolled = enrollments.filter(
    (e) => e.status === "Enrolled",
  ).length;

  const totalPending = enrollments.filter((e) => e.status === "Pending").length;

  const totalRejected = enrollments.filter(
    (e) => e.status === "Rejected",
  ).length;

  const totalUnits = enrollments.reduce(
    (total, enrollment) => total + Number(enrollment.total_units || 0),
    0,
  );

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Smart Campus Hub Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);

    doc.text(`Total Enrollments: ${totalEnrollments}`, 20, 55);

    doc.text(`Enrolled Students: ${totalEnrolled}`, 20, 65);

    doc.text(`Pending Students: ${totalPending}`, 20, 75);

    doc.text(`Rejected Students: ${totalRejected}`, 20, 85);

    doc.text(`Total Units: ${totalUnits}`, 20, 95);

    doc.save("Enrollment_Report.pdf");
  }
  return (
    <section className="dashboard-card">
      <button
        type="button"
        className="secondary-button"
        onClick={() => changeSection("dashboard")}
      >
        Back to Dashboard
      </button>

      <h2>Reports</h2>
      <button type="button" className="primary-button" onClick={exportPDF}>
        <Download size={18} />
        Export PDF
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(reports) &&
              reports.map((report, index) => (
                <tr key={report.id || index}>
                  <td>{report.name || report.report_name || "N/A"}</td>

                  <td>{report.date || report.created_at || "N/A"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminAnnouncementsSection({
  announcements,
  changeSection,
  handleDeleteAnnouncement,
  openAnnouncementModal,
}) {
  return (
    <section className="dashboard-card">
      <button
        type="button"
        className="secondary-button"
        onClick={() => changeSection("dashboard")}
      >
        Back to Dashboard
      </button>

      <h2>Announcements</h2>

      <button
        type="button"
        className="primary-button"
        onClick={openAnnouncementModal}
      >
        <Plus size={18} />
        Create Announcement
      </button>

      <div className="announcement-list">
        {Array.isArray(announcements) &&
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-item">
              <h3>{announcement.title || "Untitled Announcement"}</h3>
              <small>{announcement.created_at}</small>
              <p>
                {announcement.description ||
                  announcement.content ||
                  "No description available"}
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleDeleteAnnouncement(announcement.id)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}

function AdminRequestsSection({
  requests,
  changeSection,
  handleRequestStatusUpdate,
}) {
  return (
    <section className="dashboard-card">
      <button
        type="button"
        className="secondary-button"
        onClick={() => changeSection("dashboard")}
      >
        Back to Dashboard
      </button>

      <h2>Service Requests</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>User</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(requests) &&
              requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id || "N/A"}</td>

                  <td>{request.service || request.request_type || "N/A"}</td>

                  <td>{request.submittedBy || request.user || "N/A"}</td>

                  <td>{request.status || "Pending"}</td>
                  <td>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() =>
                        handleRequestStatusUpdate(request.id, "Approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        handleRequestStatusUpdate(request.id, "Rejected")
                      }
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AnnouncementModal({
  form,
  setForm,
  submitAnnouncement,
  submitting,
  closeModal,
}) {
  return (
    <div className="modal-overlay">
      <div className="request-modal">
        <div className="modal-heading">
          <h2>New Announcement</h2>

          <button
            type="button"
            className="secondary-button"
            onClick={closeModal}
          >
            Close
          </button>
        </div>

        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            value={form.title}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                title: event.target.value,
              }))
            }
            placeholder="Announcement title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                description: event.target.value,
              }))
            }
            placeholder="Announcement details"
          />
        </div>

        <button
          type="button"
          className="primary-button"
          disabled={submitting}
          onClick={submitAnnouncement}
        >
          {submitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}

function DirectoryModal({ form, setForm, submitDirectory, closeModal }) {
  return (
    <div className="modal-overlay">
      <div className="request-modal">
        <div className="modal-heading">
          <h2>Add Office</h2>

          <button
            type="button"
            className="secondary-button"
            onClick={closeModal}
          >
            Close
          </button>
        </div>

        <div className="form-group">
          <label>Office Name</label>

          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                name: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Type</label>

          <input
            type="text"
            value={form.type}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                type: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                email: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Location</label>

          <input
            type="text"
            value={form.location}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                location: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Service</label>

          <textarea
            value={form.service}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                service: event.target.value,
              }))
            }
          />
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={submitDirectory}
        >
          Create Entry
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
