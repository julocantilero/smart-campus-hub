import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ role, children }) {
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