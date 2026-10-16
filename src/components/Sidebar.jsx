import { NavLink, useNavigate } from "react-router-dom";

import {
  Bell,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  X,
} from "lucide-react";

function Sidebar({ role, isOpen, closeSidebar }) {
  const navigate = useNavigate();

  const dashboardPaths = {
    student: "/student-dashboard",
    faculty: "/faculty-dashboard",
    admin: "/admin-dashboard",
  };

  const commonLinks = [
    {
      name: "Dashboard",
      path: dashboardPaths[role],
      icon: LayoutDashboard,
    },
    {
      name: "Directory",
      path: `${dashboardPaths[role]}?section=directory`,
      icon: Users,
    },
    {
      name: "Enrollment",
      path: `${dashboardPaths[role]}?section=enrollment`,
      icon: GraduationCap,
    },
    {
      name: "Announcements",
      path: `${dashboardPaths[role]}?section=announcements`,
      icon: Bell,
    },
    {
      name: "Service Requests",
      path: `${dashboardPaths[role]}?section=requests`,
      icon: ClipboardList,
    },
  ];

  const adminLinks = [
    {
      name: "Administrative Reports",
      path: "/admin-dashboard?section=reports",
      icon: FileBarChart,
    },
  ];

  const navigationLinks =
    role === "admin"
      ? [...commonLinks.slice(0, 3), ...adminLinks, ...commonLinks.slice(3)]
      : commonLinks;

  function handleLogout() {
    localStorage.removeItem("demoRole");
    navigate("/");
  }

  return (
    <>
      {isOpen && (
        <button
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <GraduationCap size={28} />
            </div>

            <div>
              <h2>IAAMS</h2>
              <p>{role} portal</p>
            </div>
          </div>

          <button
            className="sidebar-close-button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-navigation">
          {navigationLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  isActive && link.name === "Dashboard"
                    ? "sidebar-link sidebar-link-active"
                    : "sidebar-link"
                }
                onClick={closeSidebar}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;