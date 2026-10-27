import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import schoolLogo from "../assets/iscplogo.png";
import { login } from "../services/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");

      const response = await login(email, password);

      if (!response.success) {
        setError(response.message || "Invalid credentials.");
        return;
      }

      const dashboardRoutes = {
        student: "/student-dashboard",
        faculty: "/faculty-dashboard",
        admin: "/admin-dashboard",
      };

      navigate(dashboardRoutes[response.role]);
    } catch (error) {
      setError(error.message || "Unable to connect to the server.");
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="left-panel">
          <div>
            <div className="school-logo">
              <img src={schoolLogo} />
            </div>

            <p className="system-label">SMART CAMPUS HUB</p>

            <h1>International State College of the Philippines (ISCP)</h1>
          </div>
        </section>

        <section className="right-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mobile-logo">
              <GraduationCap size={30} />
            </div>

            <p className="welcome-label">Welcome back</p>

            <h2>Sign in to your account</h2>

            <div className="form-group">
              <label htmlFor="email">University Email</label>

              <div className="input-container">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  placeholder="name@iscp.edu.ph"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-container">
                <LockKeyhole size={19} />

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />

                <span>Remember me</span>
              </label>

              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
