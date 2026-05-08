const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const adminRoutes = require("./routes/adminRoutes");
const seedAdmin = require("./scripts/seedAdmin");
const app = express();
const PORT = process.env.PORT || 4008;
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);
const startServer = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();