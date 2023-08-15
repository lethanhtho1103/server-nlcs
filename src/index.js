const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");
const route = require("./routes");
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// config data request

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // chỉ cho phép truy cập từ domain này []
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // chỉ cho phép sử dụng các phương thức này
    // allowedHeaders: ["Content-Type"], // chỉ cho phép sử dụng các header này
  })
);

// routes
route(app);

// conect database
db.connect();

// listenning
app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`);
});
