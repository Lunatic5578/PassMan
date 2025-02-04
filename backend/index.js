const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path=require("path")


dotenv.config({ path: path.resolve(__dirname, "../.env") });


// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = "PassMan";
const app = express();
app.use(bodyParser.json());

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


const port = process.env.PORT;



// Connect to MongoDB
client.connect();


// Get passwords based on userId
app.get("/", async (req, res) => {
  const { userId } = req.query;  // Get userId from query params

  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }

  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("passwords");

  // Find passwords belonging to the given userId
  const findResult = await collection.find({ userId }).toArray();
  
  // Respond with passwords only for the given userId
  res.json(findResult);
});

// Add password
app.post("/", async (req, res) => {
  const { id, userId, username, site, password } = req.body;

  if (!id || !userId) {
    return res.status(400).json({ success: false, message: "id and userId are required" });
  }

  const db = client.db(dbName);
  const collection = db.collection("passwords");

  const newEntry = { id, userId, username, site, password };
  const result = await collection.insertOne(newEntry);
  res.send({ success: true, result });
});

// Delete password
app.delete("/", async (req, res) => {
  const { id, userId } = req.body;

  if (!id || !userId) {
    return res.status(400).json({ success: false, message: "id and userId are required" });
  }

  const db = client.db(dbName);
  const collection = db.collection("passwords");

  const result = await collection.deleteOne({ id, userId });
  res.send({ success: true, result });
});



app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
