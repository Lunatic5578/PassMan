import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const _dirname = path.resolve();
const port = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "PassMan";

// 🟢 Setup CORS with fallback
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];
//console.log("✅ Allowed CORS Origin(s):", allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(bodyParser.json());

// 🟢 Health check route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// 🟢 Connect to MongoDB and start server
async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // 🟢 API Routes
    app.get("/api/passwords", async (req, res) => {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ success: false, message: "userId is required" });
      }

      console.log("🔍 API HIT: /api/passwords with userId:", userId);

      const db = client.db(dbName);
      const collection = db.collection("passwords");
      const results = await collection.find({ userId }).toArray();

      res.json(results);
    });

    app.post("/api/passwords", async (req, res) => {
      const { id, userId, username, site, password } = req.body;
      if (!id || !userId) {
        return res.status(400).json({ success: false, message: "id and userId are required" });
      }

      const db = client.db(dbName);
      const collection = db.collection("passwords");

      const result = await collection.insertOne({ id, userId, username, site, password });
      res.send({ success: true, result });
    });

    app.delete("/api/passwords", async (req, res) => {
      const { id, userId } = req.body;
      if (!id || !userId) {
        return res.status(400).json({ success: false, message: "id and userId are required" });
      }

      const db = client.db(dbName);
      const collection = db.collection("passwords");

      const result = await collection.deleteOne({ id, userId });
      res.send({ success: true, result });
    });

    // 🟢 Serve React frontend
    app.use(express.static(path.join(_dirname, "/frontend/dist")));

    // ✅ Handle non-API routes safely
    app.get("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api/")) {
        return next(); // Let API 404 handler catch it
      }
      res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
    });

    // 🛑 404 for unknown API routes
    app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    // ✅ Start the server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
