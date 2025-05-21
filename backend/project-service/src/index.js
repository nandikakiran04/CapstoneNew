require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Project service running on port ${PORT}`));
