const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = Number(process.env.PORT || 3030);
const mongoUrl = process.env.MONGO_URL || "mongodb://mongo_db:27017/dealershipsDB";
const dataDir = path.join(__dirname, "data");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

const Reviews = require("./review");
const Dealerships = require("./dealership");
const Cars = require("./inventory");

function readSeed(filename, key) {
  const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, filename), "utf8"));
  return parsed[key] || [];
}

async function seedIfEmpty() {
  const [dealershipCount, reviewCount, carCount] = await Promise.all([
    Dealerships.countDocuments(), Reviews.countDocuments(), Cars.countDocuments()
  ]);
  if (!dealershipCount) await Dealerships.insertMany(readSeed("dealerships.json", "dealerships"));
  if (!reviewCount) await Reviews.insertMany(readSeed("reviews.json", "reviews"));
  if (!carCount) await Cars.insertMany(readSeed("car_records.json", "cars"));
}

app.get("/", (_req, res) => res.json({ message: "Welcome to the Cars Dealership API", status: "ok" }));

app.get("/fetchReviews", async (_req, res) => {
  try {
    res.json(await Reviews.find().sort({ id: 1 }).lean());
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

app.get("/fetchReviews/dealer/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid dealership id" });
    res.json(await Reviews.find({ dealership: id }).sort({ id: -1 }).lean());
  } catch (_error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

app.get("/fetchDealers", async (_req, res) => {
  try {
    res.json(await Dealerships.find().sort({ id: 1 }).lean());
  } catch (_error) {
    res.status(500).json({ error: "Error fetching dealerships" });
  }
});

app.get("/fetchDealers/:state", async (req, res) => {
  try {
    const state = decodeURIComponent(req.params.state);
    const filter = !state || state.toLowerCase() === "all"
      ? {}
      : { state: { $regex: new RegExp("^" + state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") } };
    res.json(await Dealerships.find(filter).sort({ id: 1 }).lean());
  } catch (_error) {
    res.status(500).json({ error: "Error fetching dealerships for state" });
  }
});

app.get("/fetchDealer/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid dealership id" });
    const dealer = await Dealerships.findOne({ id }).lean();
    if (!dealer) return res.status(404).json({ error: "Dealership not found" });
    res.json(dealer);
  } catch (_error) {
    res.status(500).json({ error: "Error fetching dealership" });
  }
});

app.get("/fetchCars", async (_req, res) => {
  try {
    res.json(await Cars.find().sort({ make: 1, model: 1 }).lean());
  } catch (_error) {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

app.post("/insert_review", async (req, res) => {
  try {
    const data = req.body || {};
    const required = ["name", "dealership", "review", "purchase_date", "car_make", "car_model", "car_year"];
    const missing = required.filter((key) => data[key] === undefined || data[key] === null || String(data[key]).trim() === "");
    if (missing.length) return res.status(400).json({ error: "Missing fields", fields: missing });
    const dealerId = Number(data.dealership);
    const carYear = Number(data.car_year);
    if (!Number.isFinite(dealerId) || !Number.isFinite(carYear)) {
      return res.status(400).json({ error: "Dealership and car year must be numbers" });
    }
    if (carYear < 2015 || carYear > 2023) {
      return res.status(400).json({ error: "Car year must be between 2015 and 2023" });
    }
    if (!String(data.review).trim()) {
      return res.status(400).json({ error: "Review text cannot be empty" });
    }
    const dealer = await Dealerships.findOne({ id: dealerId });
    if (!dealer) return res.status(404).json({ error: "Dealership not found" });
    const latest = await Reviews.findOne().sort({ id: -1 }).select("id").lean();
    const review = await Reviews.create({
      id: (latest?.id || 0) + 1,
      name: String(data.name).trim(),
      dealership: dealerId,
      review: String(data.review).trim(),
      purchase: data.purchase === true || data.purchase === "true",
      purchase_date: String(data.purchase_date),
      car_make: String(data.car_make).trim(),
      car_model: String(data.car_model).trim(),
      car_year: carYear
    });
    res.status(201).json(review.toObject());
  } catch (error) {
    console.error("insert_review failed:", error.message);
    res.status(500).json({ error: "Error inserting review" });
  }
});

app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

mongoose.connect(mongoUrl)
  .then(seedIfEmpty)
  .then(() => {
    app.listen(port, "0.0.0.0", () => console.log(`Dealership API listening on port ${port}`));
  })
  .catch((error) => {
    console.error("Unable to connect to MongoDB:", error.message);
    process.exit(1);
  });
