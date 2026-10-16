import { Plus } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";

import {
  announcements,
  studentStats,
} from "../data/DataDashboard";

function StudentDashboard() {
  return (
    <DashboardLayout role="student">
      <section className="page-heading">
        <div>
          <p className="academic-year">
            Academic Year 2026–2027
          </p>

          <h1>Student Dashboard</h1>

          <p>
            View your enrollment status, subjects, announcements, and service
            requests.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={19} />
          New Request
        </button>
      </section>

      <section className="stats-grid">
        {studentStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Enrollment Information</h2>
              <p>Your current enrollment summary</p>
            </div>

            <span className="status-badge status-completed">
              Enrolled
            </span>
          </div>

          <div className="information-list">
            <div className="information-row">
              <span>Student number</span>
              <strong>2026-001234</strong>
            </div>

            <div className="information-row">
              <span>Program</span>
              <strong>BS Information Technology</strong>
            </div>

            <div className="information-row">
              <span>Year level</span>
              <strong>Third Year</strong>
            </div>

            <div className="information-row">
              <span>Semester</span>
              <strong>First Semester</strong>
            </div>

            <div className="information-row">
              <span>Total units</span>
              <strong>21 Units</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Latest Announcements</h2>
              <p>Important campus information</p>
            </div>

            <button className="text-button">View all</button>
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
            <h2>Current Subjects</h2>
            <p>Your enrolled subjects for this semester</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject</th>
                <th>Schedule</th>
                <th>Units</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>IT 301</td>
                <td>Web Systems and Technologies</td>
                <td>Monday, 9:00 AM</td>
                <td>3</td>
              </tr>

              <tr>
                <td>IT 302</td>
                <td>Systems Integration</td>
                <td>Tuesday, 1:00 PM</td>
                <td>3</td>
              </tr>

              <tr>
                <td>IT 303</td>
                <td>Information Assurance</td>
                <td>Wednesday, 10:00 AM</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default StudentDashboard;