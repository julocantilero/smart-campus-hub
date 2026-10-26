import { useEffect, useState } from "react";

import { Download, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";

import {
  getAdminAnnouncements,
  getAdminProfile,
  getAdminRequests,
  getAdminStatistics,
  getEnrollmentOverview,
  getReports,
  createAnnouncement,
} from "../services/adminApi.js";

function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const [statistics, setStatistics] = useState([]);
  const [enrollmentOverview, setEnrollmentOverview] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

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

  async function loadAdminDashboard() {
    try {
      setLoading(true);

      console.log("Loading Admin API...");

      const results = await Promise.allSettled([
        getAdminProfile(),
        getAdminStatistics(),
        getEnrollmentOverview(),
        getAdminAnnouncements(),
        getAdminRequests(),
        getReports(),
      ]);

      console.log(results);

      const [
        profileResult,
        statisticsResult,
        enrollmentResult,
        announcementsResult,
        requestsResult,
        reportsResult,
      ] = results;

      let successCount = 0;

      if (profileResult.status === "fulfilled") {
        successCount++;

        setAdmin(profileResult.value?.data || profileResult.value);
      }

      if (statisticsResult.status === "fulfilled") {
        successCount++;

        setStatistics(
          statisticsResult.value?.data || statisticsResult.value || [],
        );
      }

      if (enrollmentResult.status === "fulfilled") {
        successCount++;

        setEnrollmentOverview(
          enrollmentResult.value?.data || enrollmentResult.value,
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
    <DashboardLayout role="admin">
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

        <div className="heading-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              changeSection("reports");
            }}
          >
            <Download size={19} />
            View Reports
          </button>
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
        />
      )}

      {currentSection === "directory" && (
        <AdminDirectorySection changeSection={changeSection} />
      )}

      {currentSection === "enrollment" && (
        <AdminEnrollmentSection
          enrollmentOverview={enrollmentOverview}
          changeSection={changeSection}
        />
      )}

      {currentSection === "reports" && (
        <AdminReportsSection reports={reports} changeSection={changeSection} />
      )}

      {currentSection === "announcements" && (
        <AdminAnnouncementsSection
          announcements={announcements}
          changeSection={changeSection}
        />
      )}

      {currentSection === "requests" && (
        <AdminRequestsSection
          requests={requests}
          changeSection={changeSection}
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
    </DashboardLayout>
  );
}

function AdminOverview({
  announcements,
  requests,
  changeSection,
  setShowAnnouncementModal,
}) {
  return (
    <section className="dashboard-grid">
      <article className="dashboard-card" style={{ cursor: "pointer" }}>
        <div className="card-heading">
          <h2>Announcements</h2>
          <button
            type="button"
            className="primary-button"
            onClick={() => setShowAnnouncementModal(true)}
          >
            <Plus size={18} />
            Create
          </button>
        </div>

        <h3>{announcements.length}</h3>

        <p>Published announcements</p>
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
          <h2>Enrollment</h2>
        </div>

        <button
          className="primary-button"
          onClick={() => changeSection("enrollment")}
        >
          Open
        </button>
      </article>

      <article className="dashboard-card">
        <div className="card-heading">
          <h2>Reports</h2>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => alert("Report generation coming soon.")}
        >
          <Download size={18} />
          Generate Report
        </button>
      </article>
    </section>
  );
}

function AdminDirectorySection({ changeSection }) {
  return (
    <section className="dashboard-card">
      <button
        type="button"
        className="secondary-button"
        onClick={() => changeSection("dashboard")}
      >
        Back to Dashboard
      </button>

      <h2>Campus Directory</h2>

      <p>Directory management will appear here.</p>
    </section>
  );
}

function AdminEnrollmentSection({ enrollmentOverview, changeSection }) {
  return (
    <section className="dashboard-card">
      <button
        type="button"
        className="secondary-button"
        onClick={() => changeSection("dashboard")}
      >
        Back to Dashboard
      </button>

      <h2>Enrollment Overview</h2>

      <div className="admin-enrollment-grid">
        {Object.entries(enrollmentOverview || {}).map(([key, value]) => (
          <div key={key} className="dashboard-card">
            <h3>{key}</h3>

            <p>{String(value)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminReportsSection({ reports, changeSection }) {
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
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          alert("Report generation coming soon.");
        }}
      >
        <Download size={18} />
        Generate Report
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

function AdminAnnouncementsSection({ announcements, changeSection }) {
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

      <div className="announcement-list">
        {Array.isArray(announcements) &&
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-item">
              <h3>{announcement.title || "Untitled Announcement"}</h3>

              <p>
                {announcement.description ||
                  announcement.content ||
                  "No description available"}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}

function AdminRequestsSection({ requests, changeSection }) {
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

export default AdminDashboard;
