import React, { useState } from "react";
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const API_BASE = (process.env.REACT_APP_API_BASE || "/djangoapp").replace(/\\/$/, "");

const Header = () => {
  const [error, setError] = useState("");
  const username = sessionStorage.getItem("username");
  const djangoSite = process.env.REACT_APP_DJANGO_SITE_URL || window.location.origin;

  const logout = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_BASE}/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed. Please try again.");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("firstname");
      sessionStorage.removeItem("lastname");
      window.location.assign("/");
    } catch (err) {
      setError(err.message || "Unable to log out.");
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "darkturquoise", minHeight: "1in" }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/" style={{ paddingRight: "5%" }}><strong>Dealerships</strong></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href={`${djangoSite}/about/`}>About Us</a></li>
              <li className="nav-item"><a className="nav-link" href={`${djangoSite}/contact/`}>Contact Us</a></li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              {username ? (
                <>
                  <span className="username" style={{ fontSize: "1rem", color: "#10243a" }}>{username}</span>
                  <a className="nav-link" href={`${API_BASE}/logout`} onClick={logout}>Logout</a>
                </>
              ) : (
                <>
                  <a className="nav-link" href="/login">Login</a>
                  <a className="nav-link" href="/register">Register</a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {error && <p className="alert alert-danger m-2" role="alert">{error}</p>}
    </header>
  );
};

export default Header;
