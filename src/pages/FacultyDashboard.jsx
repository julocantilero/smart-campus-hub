import { Plus } from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";

import {
  announcements,
  facultyStats,
} from "../data/DataDashboard";

function FacultyDashboard() {
  return (
    <DashboardLayout role="faculty">
      <section className="page-heading">
        <div>
          <p className="academic-year">
            Academic Year 2026–2027
          </p>

          <h1>Faculty Dashboard</h1>

          <p>
            Review assigned subjects, teaching workload, advisees, and campus
            announcements.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={19} />
          New Request
        </button>
      </section>

      <section className="stats-grid">
        {facultyStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-heading">
            <div>
              <h2>Faculty Workload</h2>
              <p>Current teaching load distribution</p>
            </div>
          </div>

          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-label">
                <span>Lecture units</span>
                <strong>12 units</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill progress-blue"
                  style={{ width: "67%" }}
                />
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Laboratory units</span>
                <strong>6 units</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill progress-purple"
                  style={{ width: "33%" }}
                />
              </div>
            </div>
          </div>

          <div className="workload-total">
            <span>Total teaching load</span>
            <strong>18 units</strong>
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
            <h2>Assigned Classes</h2>
            <p>Faculty teaching assignments</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject</th>
                <th>Section</th>
                <th>Schedule</th>
                <th>Students</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>IT 301</td>
                <td>Web Systems and Technologies</td>
                <td>IT3A</td>
                <td>Monday, 9:00 AM</td>
                <td>38</td>
              </tr>

              <tr>
                <td>IT 302</td>
                <td>Systems Integration</td>
                <td>IT3B</td>
                <td>Tuesday, 1:00 PM</td>
                <td>36</td>
              </tr>

              <tr>
                <td>IT 401</td>
                <td>Capstone Project 1</td>
                <td>IT4A</td>
                <td>Thursday, 10:00 AM</td>
                <td>32</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default FacultyDashboard;