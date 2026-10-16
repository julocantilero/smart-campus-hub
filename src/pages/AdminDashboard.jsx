import { Download, Plus } from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";

import {
  adminStats,
  announcements,
  serviceRequests,
} from "../data/DataDashboard";

function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <section className="page-heading">
        <div>
          <p className="academic-year">
            Academic Year 2026–2027
          </p>

          <h1>Administrative Dashboard</h1>

          <p>
            Monitor student, faculty, enrollment, announcement, report, and
            service request information.
          </p>
        </div>

        <div className="heading-actions">
          <button className="secondary-button">
            <Download size={19} />
            Generate Report
          </button>

          <button className="primary-button">
            <Plus size={19} />
            New Announcement
          </button>
        </div>
      </section>

      <section className="stats-grid">
        {adminStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Enrollment Overview</h2>
              <p>Student enrollment distribution</p>
            </div>

            <button className="text-button">View details</button>
          </div>

          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-label">
                <span>Enrolled</span>
                <strong>4,901 students</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill progress-blue"
                  style={{ width: "78%" }}
                />
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Pending enrollment</span>
                <strong>273 students</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill progress-orange"
                  style={{ width: "16%" }}
                />
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>On leave</span>
                <strong>57 students</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill progress-gray"
                  style={{ width: "6%" }}
                />
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Latest Announcements</h2>
              <p>Recently published notices</p>
            </div>

            <button className="text-button">Manage</button>
          </div>

          <div className="announcement-list">
            {announcements.map((announcement) => (
              <div
                className="announcement-item"
                key={announcement.id}
              >
                <span className="announcement-category">
                  {announcement.category}
                </span>

                <h3>{announcement.title}</h3>
                <p>{announcement.description}</p>
                <time>{announcement.date}</time>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-card full-width-card">
        <div className="card-heading">
          <div>
            <h2>Recent Service Requests</h2>
            <p>Requests submitted by campus users</p>
          </div>

          <button className="text-button">View all requests</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {serviceRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.service}</td>
                  <td>{request.submittedBy}</td>
                  <td>{request.date}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        request.status === "Completed"
                          ? "status-completed"
                          : request.status === "Processing"
                            ? "status-processing"
                            : "status-review"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default AdminDashboard;