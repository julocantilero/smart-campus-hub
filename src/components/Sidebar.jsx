import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  Bell,
  BookOpen,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
  X,
} from "lucide-react";

function Sidebar({ role, isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Student sidebar links
   */

  const studentLinks = [
    {
      name: "Dashboard",
      path: "/student-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Directory",
      path: "/student-dashboard?section=directory",
      icon: Users,
    },
    {
      name: "Enrollment",
      path: "/student-dashboard?section=enrollment",
      icon: GraduationCap,
    },
    {
      name: "Announcements",
      path: "/student-dashboard?section=announcements",
      icon: Bell,
    },
    {
      name: "Service Requests",
      path: "/student-dashboard?section=requests",
      icon: ClipboardList,
    },
  ];

  /*
   * Faculty sidebar links
   */

  const facultyLinks = [
    {
      name: "Dashboard",
      path: "/faculty-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Directory",
      path: "/faculty-dashboard?section=directory",
      icon: Users,
    },
    {
      name: "Assigned Classes",
      path: "/faculty-dashboard?section=classes",
      icon: BookOpen,
    },
    {
      name: "Workload",
      path: "/faculty-dashboard?section=workload",
      icon: GraduationCap,
    },
    {
      name: "Advisees",
      path: "/faculty-dashboard?section=advisees",
      icon: UserRound,
    },
    {
      name: "Announcements",
      path: "/faculty-dashboard?section=announcements",
      icon: Bell,
    },
    {
      name: "Service Requests",
      path: "/faculty-dashboard?section=requests",
      icon: ClipboardList,
    },
  ];

  /*
   * Administrator sidebar links
   */

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Directory",
      path: "/admin-dashboard?section=directory",
      icon: Users,
    },
    {
      name: "Enrollment",
      path: "/admin-dashboard?section=enrollment",
      icon: GraduationCap,
    },
    {
      name: "Reports",
      path: "/admin-dashboard?section=reports",
      icon: FileBarChart,
    },
    {
      name: "Announcements",
      path: "/admin-dashboard?section=announcements",
      icon: Bell,
    },
    {
      name: "Service Requests",
      path: "/admin-dashboard?section=requests",
      icon: ClipboardList,
    },
  ];

  /*
   * Select links based on the current user role.
   * Student links are used as the default.
   */

  let navigationLinks = studentLinks;

  if (role === "faculty") {
    navigationLinks = facultyLinks;
  } else if (role === "admin") {
    navigationLinks = adminLinks;
  }

  /*
   * Check the pathname and query parameter.
   *
   * This ensures only the currently selected sidebar
   * section receives the active style.
   */

  function isLinkActive(linkPath) {
    const [pathname, queryString = ""] = linkPath.split("?");

    if (location.pathname !== pathname) {
      return false;
    }

    const linkParameters = new URLSearchParams(queryString);

    const currentParameters = new URLSearchParams(location.search);

    const linkSection = linkParameters.get("section");

    const currentSection = currentParameters.get("section");

    /*
     * A path without a section query represents
     * the main dashboard.
     */

    if (!linkSection) {
      return !currentSection;
    }

    return linkSection === currentSection;
  }

  function handleCloseSidebar() {
    if (typeof closeSidebar === "function") {
      closeSidebar();
    }
  }

  function handleLogout() {
    localStorage.removeItem("demoRole");

    handleCloseSidebar();
    navigate("/");
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={handleCloseSidebar}
          aria-label="Close sidebar"
        />
      )}

      <aside className={isOpen ? "sidebar sidebar-open" : "sidebar"}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <GraduationCap size={28} />
            </div>

            <div>
              <h2>Smart Campus Hub</h2>

              <p>{role ? `${role} portal` : "campus portal"}</p>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close-button"
            onClick={handleCloseSidebar}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <nav
          className="sidebar-navigation"
          aria-label={`${role || "User"} navigation`}
        >
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.path);

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleCloseSidebar}
                className={
                  active ? "sidebar-link sidebar-link-active" : "sidebar-link"
                }
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <UserRound size={18} />
            </div>

            <div className="sidebar-user-information">
              <strong>Demo User</strong>

              <span>{role ? `${role}` : "Portal account"}</span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
