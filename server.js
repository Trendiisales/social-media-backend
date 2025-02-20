// ✅ BACKEND — server.js

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5050;
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json()); // Ensure body parsing for JSON

// 🔹 In-memory storage
let users = [];
let posts = [];

// 🛡️ Middleware — Authenticate Token
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// 💡 GET Route — For Testing Browser Access
app.get('/register', (req, res) => {
  res.status(200).send("📩 Use POST to register a user here!");
});

// 🟢 **POST — Register User**
app.post('/register', async (req, res) => {
  console.log("🔍 Incoming Request Body:", req.body); // ✅ Debugging line

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "⚠️ Username and password are required." });
  }

  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "⚠️ User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, username, password: hashedPassword });

  res.status(201).json({ message: "✅ User registered successfully!" });
});

// 🟡 **POST — Login User**
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user) return res.status(400).json({ message: "⚠️ Invalid credentials" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: "⚠️ Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, message: "✅ Login successful!" });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
