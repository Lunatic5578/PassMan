import express from "express";
import { MongoClient } from "mongodb";
import  dotenv from "dotenv";
import  bodyParser  from "body-parser";
import cors from "cors";
import path from "path";


dotenv.config();


// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = "PassMan";
const app = express();

const _dirname=path.resolve()

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(bodyParser.json());

const allowedOrigins = [process.env.CLIENT_URL];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


const port = process.env.PORT;



// Connect to MongoDB
client.connect();


// Get passwords based on userId
app.get("/api/passwords", async (req, res) => {
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
app.post("/api/passwords", async (req, res) => {
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


app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});

