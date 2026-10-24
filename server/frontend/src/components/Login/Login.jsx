import React, { useState } from "react";
import "./Login.css";
import Header from "../Header/Header";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/djangoapp/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName, password }),
      });
      const data = await response.json();
      if (!response.ok || data.status !== "Authenticated") {
        throw new Error(data.status || data.error || "The user could not be authenticated.");
      }
      sessionStorage.setItem("username", data.userName);
      sessionStorage.setItem("firstname", data.firstName || "");
      sessionStorage.setItem("lastname", data.lastName || "");
      window.location.assign("/dealers");
    } catch (err) {
      setError(err.message || "Unable to connect to the login service.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="container py-5" style={{ maxWidth: 560 }}>
        <h1>Login</h1>
        <form className="card card-body" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="username">Username</label>
          <input id="username" name="username" className="form-control mb-3" autoComplete="username" value={userName} onChange={(event) => setUserName(event.target.value)} required />
          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="form-control mb-3" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Login"}</button>
          {error && <p className="text-danger mt-3" role="alert">{error}</p>}
          <p className="mt-3 mb-0">New here? <a href="/register">Register now</a>.</p>
        </form>
      </main>
    </div>
  );
};

export default Login;
