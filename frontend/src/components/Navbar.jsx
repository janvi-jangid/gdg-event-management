
import { useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/auth";
import "./Navbar.css";

function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isSignup) {
        await registerUser(name, email, password);
        setMessage("Account created! Please log in.");
        setIsSignup(false);
        setPassword("");
      } else {
        await loginUser(email, password);
        setLoggedIn(true);
        setShowAuth(false);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    setLoggedIn(false);
    setMessage("Logged out successfully.");
  }

  return (
    <>
      <header className="navbar">
        <a href="/" className="navbar-brand">
          <span className="brand-mark"></span>
          <span>RBU</span>
        </a>

        <nav className="navbar-links">
          <a href="#home" className="nav-home">Home</a>
          <a href="#team" className="nav-team">Team</a>
          <a href="#events" className="nav-events">Events</a>
          <a href="#gallery" className="nav-gallery">Gallery</a>
          <a href="#portfolio" className="nav-portfolio">Portfolio</a>
          <a href="#more" className="nav-more">More</a>
        </nav>

        {loggedIn ? (
          <button className="join-button" onClick={handleLogout}>
            LOG OUT <span>↗</span>
          </button>
        ) : (
          <button
            className="join-button"
            onClick={() => {
              setIsSignup(false);
              setMessage("");
              setShowAuth(true);
            }}
          >
            JOIN US <span>↗</span>
          </button>
        )}
      </header>

      {showAuth && (
        <div
          className="auth-overlay"
          onClick={() => setShowAuth(false)}
        >
          <section
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="auth-close"
              onClick={() => setShowAuth(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
            <p>
              {isSignup
                ? "Join the RBU community."
                : "Log in to continue."}
            </p>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password (minimum 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={isSignup ? 8 : 1}
                required
              />

              {message && (
                <p className="auth-message" role="alert">
                  {message}
                </p>
              )}

              <button type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isSignup
                    ? "Sign Up"
                    : "Log In"}
              </button>
            </form>

            <p className="auth-switch">
              {isSignup
                ? "Already have an account?"
                : "New here?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setMessage("");
                }}
              >
                {isSignup ? "Log In" : "Sign Up"}
              </button>
            </p>
          </section>
        </div>
      )}
    </>
  );
}

export default Navbar;
