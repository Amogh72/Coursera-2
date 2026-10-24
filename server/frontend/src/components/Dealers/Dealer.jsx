import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positiveIcon from "../assets/positive.png";
import neutralIcon from "../assets/neutral.png";
import negativeIcon from "../assets/negative.png";
import reviewIcon from "../assets/reviewbutton.png";
import Header from "../Header/Header";

const API_BASE = (process.env.REACT_APP_API_BASE || "/djangoapp").replace(/\\/$/, "");

const sentimentIcon = (sentiment) => {
  if (sentiment === "positive") return positiveIcon;
  if (sentiment === "negative") return negativeIcon;
  return neutralIcon;
};

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  useEffect(() => {
    const loadDealer = async () => {
      setLoading(true);
      setError("");
      try {
        const [dealerResponse, reviewsResponse] = await Promise.all([
          fetch(`${API_BASE}/dealer/${id}`, { credentials: "include" }),
          fetch(`${API_BASE}/reviews/dealer/${id}`, { credentials: "include" }),
        ]);
        const dealerData = await dealerResponse.json();
        const reviewsData = await reviewsResponse.json();
        if (!dealerResponse.ok || dealerData.status !== 200 || !dealerData.dealer?.length) {
          throw new Error(dealerData.error || "Dealership not found.");
        }
        if (!reviewsResponse.ok || reviewsData.status !== 200) {
          throw new Error(reviewsData.error || "Unable to load reviews.");
        }
        setDealer(dealerData.dealer[0]);
        setReviews(Array.isArray(reviewsData.reviews) ? reviewsData.reviews : []);
      } catch (err) {
        setError(err.message || "Unable to load dealership details.");
      } finally {
        setLoading(false);
      }
    };
    loadDealer();
  }, [id]);

  return (
    <div>
      <Header />
      <main className="container py-4">
        {loading && <p role="status">Loading dealership details…</p>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {!loading && !error && dealer && (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h1>{dealer.full_name}</h1>
                <p className="text-muted mb-0">{dealer.city}, {dealer.address}, ZIP {dealer.zip}, {dealer.state}</p>
              </div>
              {isLoggedIn && <a className="btn btn-primary" href={`/postreview/${id}`}><img src={reviewIcon} alt="" style={{ width: 24, marginRight: 8 }} />Post a review</a>}
            </div>
            <h2 className="h3 mb-3">Customer reviews</h2>
            {reviews.length === 0 ? <p>No reviews yet. Be the first to share your experience.</p> : (
              <div className="row g-3">
                {reviews.map((review) => (
                  <div className="col-md-6 col-xl-4" key={review.id}>
                    <article className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <img src={sentimentIcon(review.sentiment)} alt={`${review.sentiment || "neutral"} sentiment`} style={{ width: 36, height: 36 }} />
                          <span className="badge text-bg-light">{review.sentiment || "unrated"}</span>
                        </div>
                        <p className="card-text">{review.review}</p>
                        <p className="text-muted small mb-0">{review.name} · {review.car_make} {review.car_model} {review.car_year}</p>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dealer;
