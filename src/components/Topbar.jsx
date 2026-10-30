import { Bell, Menu, Search, UserRound } from "lucide-react";

function Topbar({ role, openSidebar, userName }) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu-button"
        onClick={openSidebar}
        aria-label="Open sidebar"
      >
        <Menu size={23} />
      </button>

      <div className="topbar-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search students, faculty, requests..."
        />
      </div>

      <div className="topbar-actions">
        <button
          className="notification-button"
          aria-label="View notifications"
        >
          <Bell size={21} />
          <span className="notification-indicator" />
        </button>

        <div className="topbar-profile">
          <div className="profile-avatar">
            <UserRound size={21} />
          </div>

          <div className="profile-information">
            <strong>{userName || "Not Available"}</strong>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;