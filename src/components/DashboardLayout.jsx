import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ role, userName, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        userName={userName}
        closeSidebar={closeSidebar}
      />

      <div className="dashboard-main">
        <Topbar role={role} openSidebar={openSidebar} />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;