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
          <button className="secondary-button">
            <Download size={19} />
            Generate Report
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowAnnouncementModal(true)}
          >
            <Plus size={19} />
            New Announcement
          </button>
        </div>
      </section>

      {currentSection === "dashboard" && (
        <AdminOverview
          statistics={statistics}
          announcements={announcements}
          requests={requests}
          changeSection={changeSection}
        />
      )}

      {currentSection === "directory" && <AdminDirectorySection />}

      {currentSection === "enrollment" && (
        <AdminEnrollmentSection enrollmentOverview={enrollmentOverview} />
      )}

      {currentSection === "reports" && (
        <AdminReportsSection reports={reports} />
      )}

      {currentSection === "announcements" && (
        <AdminAnnouncementsSection announcements={announcements} />
      )}

      {currentSection === "requests" && (
        <AdminRequestsSection requests={requests} />
      )}
    </DashboardLayout>
  );
}

function AdminOverview({ statistics, announcements, requests, changeSection }) {
  return (
    <>
      

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-heading">
            <h2>Latest Announcements</h2>

            <button
              className="text-button"
              onClick={() => changeSection("announcements")}
            >
              View All
            </button>
          </div>

          <p>{announcements.length} Announcements</p>
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <h2>Service Requests</h2>

            <button
              className="text-button"
              onClick={() => changeSection("requests")}
            >
              View All
            </button>
          </div>

          <p>{requests.length} Requests</p>
        </article>
      </section>
    </>
  );
}

function AdminDirectorySection() {
  return (
    <section className="dashboard-card">
      <h2>Campus Directory</h2>

      <p>Directory management will appear here.</p>
    </section>
  );
}

function AdminEnrollmentSection({ enrollmentOverview }) {
  return (
    <section className="dashboard-card">
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

function AdminReportsSection({ reports }) {
  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <h2>Reports</h2>

        <button className="primary-button">
          <Download size={18} />
          Generate
        </button>
      </div>

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

function AdminAnnouncementsSection({ announcements }) {
  return (
    <section className="dashboard-card">
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

function AdminRequestsSection({ requests }) {
  return (
    <section className="dashboard-card">
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

export default AdminDashboard;
