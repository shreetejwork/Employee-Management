import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initializeDatabase } from "./config/db_init.js";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import leaveRoutes from "./routes/leaves.js";
import salaryRoutes from "./routes/salaries.js";
import companyRoutes from "./routes/company.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// -----------------------------
// Request Logger
// -----------------------------
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// -----------------------------
// CORS
// -----------------------------
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin (curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// -----------------------------
// Body Parsers
// -----------------------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// -----------------------------
// Routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);

// -----------------------------
// Health Check
// -----------------------------
app.get("/", (req, res) => {
  res.send("HR & Payroll System API is running.");
});

// -----------------------------
// Error Handler
// -----------------------------
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// -----------------------------
// Start Server
// -----------------------------
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
};

startServer();
