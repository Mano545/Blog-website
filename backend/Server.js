const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4008;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
// /register and /login were top level before, now we can group them or keep them top level via aliases if needed.
// To keep frontend changes minimal for base URLs, we might need to adjust, 
// BUT the plan said "POST /auth/login". So we will mount under /auth.
// Frontend needs to be updated.
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// Legacy support or direct mapping if we want (optional, but better to stick to new structure)
// Old: app.post('/register') -> New: POST /auth/register
// Old: app.get('/posts') -> New: GET /posts/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});