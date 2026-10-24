import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";

const API_BASE = (process.env.REACT_APP_API_BASE || "/djangoapp").replace(/\\/$/, "");

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [dealerResponse, carsResponse] = await Promise.all([
          fetch(`${API_BASE}/dealer/${id}`, { credentials: "include" }),
          fetch(`${API_BASE}/get_cars`),
        ]);
        const dealerData = await dealerResponse.json();
        const carsData = await carsResponse.json();
        if (!dealerResponse.ok || dealerData.status !== 200 || !dealerData.dealer?.length) {
          throw new Error("Dealership not found.");
        }
        if (!carsResponse.ok || carsData.status !== 200) {
          throw new Error("Unable to load the car catalogue.");
        }
        setDealer(dealerData.dealer[0]);
        setCarModels(carsData.CarModels || []);
      } catch (err) {
        setError(err.message || "Unable to load the review form.");
      }
    };
    load();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    setError("");
    if (!sessionStorage.getItem("username")) {
      setError("Please log in before posting a review.");
      return;
    }
    if (!model || !review.trim() || !date || !year) {
      setError("Please complete every field.");
      return;
    }
    setBusy(true);
    try {
      const [carMake, carModel] = model.split("|||");
      const response = await fetch(`${API_BASE}/add_review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealership: Number(id),
          review: review.trim(),
          purchase: true,
          purchase_date: date,
          car_make: carMake,
          car_model: carModel,
          car_year: Number(year),
        }),
      });
      const data = await response.json();
      if (!response.ok || data.status !== 200) {
        throw new Error(data.error || "Unable to submit the review.");
      }
      navigate(`/dealer/${id}`);
    } catch (err) {
      setError(err.message || "Unable to submit the review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="container py-5" style={{ maxWidth: 760 }}>
        <h1 className="mb-4" style={{ color: "darkblue" }}>{dealer?.full_name || "Post a dealership review"}</h1>
        <form className="card card-body shadow-sm" onSubmit={submitReview}>
          <label className="form-label" htmlFor="review">Your review</label>
          <textarea id="review" className="form-control mb-3" rows="6" value={review} onChange={(event) => setReview(event.target.value)} maxLength={3000} required />
          <label className="form-label" htmlFor="purchaseDate">Purchase date</label>
          <input id="purchaseDate" className="form-control mb-3" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          <label className="form-label" htmlFor="carModel">Car make and model</label>
          <select id="carModel" className="form-select mb-3" value={model} onChange={(event) => setModel(event.target.value)} required>
            <option value="">Choose a car make and model</option>
            {carModels.map((car) => (
              <option key={`${car.CarMake}-${car.CarModel}`} value={`${car.CarMake}|||${car.CarModel}`}>
                {car.CarMake} {car.CarModel}
              </option>
            ))}
          </select>
          <label className="form-label" htmlFor="carYear">Car year</label>
          <input id="carYear" className="form-control mb-4" type="number" min="2015" max="2023" value={year} onChange={(event) => setYear(event.target.value)} required />
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Submitting…" : "Post review"}</button>
          {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
        </form>
      </main>
    </div>
  );
};

export default PostReview;
