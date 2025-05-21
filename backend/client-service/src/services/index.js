require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const clientRoutes = require("./routes/clientRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/clients", clientRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Client service running on port ${PORT}`));
