import React, { useEffect, useState } from "react";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";
import reviewIcon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  useEffect(() => {
    const loadDealers = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = selectedState === "All"
          ? "/djangoapp/get_dealers"
          : `/djangoapp/get_dealers/${encodeURIComponent(selectedState)}`;
        const response = await fetch(endpoint, { credentials: "include" });
        const data = await response.json();
        if (!response.ok || data.status !== 200) {
          throw new Error(data.error || "Unable to load dealerships.");
        }
        const list = Array.isArray(data.dealers) ? data.dealers : [];
        setDealers(list);
        setStates((previous) => Array.from(new Set([...previous, ...list.map((dealer) => dealer.state)])).sort());
      } catch (err) {
        setError(err.message || "Unable to load dealerships. Check that Django and the Node API are running.");
      } finally {
        setLoading(false);
      }
    };
    loadDealers();
  }, [selectedState]);

  return (
    <div>
      <Header />
      <main className="container-fluid py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <h1 className="mb-1">Dealerships</h1>
            <p className="text-muted mb-0">Browse locations and read customer reviews.</p>
          </div>
          <label className="d-flex align-items-center gap-2" htmlFor="state">
            Filter by state
            <select className="form-select" style={{ minWidth: 220 }} name="state" id="state" value={selectedState} onChange={(event) => setSelectedState(event.target.value)}>
              <option value="All">All States</option>
              {states.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
          </label>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {loading ? <p role="status">Loading dealerships…</p> : !error && dealers.length === 0 ? <p>No dealerships found for this state.</p> : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Dealer Name</th>
                  <th scope="col">City</th>
                  <th scope="col">Address</th>
                  <th scope="col">ZIP</th>
                  <th scope="col">State</th>
                  {isLoggedIn && <th scope="col">Review Dealer</th>}
                </tr>
              </thead>
              <tbody>
                {dealers.map((dealer) => (
                  <tr key={dealer.id}>
                    <td>{dealer.id}</td>
                    <td><a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a></td>
                    <td>{dealer.city}</td>
                    <td>{dealer.address}</td>
                    <td>{dealer.zip}</td>
                    <td>{dealer.state}</td>
                    {isLoggedIn && <td><a href={`/postreview/${dealer.id}`} aria-label={`Review ${dealer.full_name}`}><img src={reviewIcon} className="review_icon" alt="Post review" /></a></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dealers;
