const express = require("express");
const cors = require("cors");
// const Sequelize = require('sequelize')
const pool = require("./db");

// App Config

const app = express();
const port = process.env.PORT || 5000;
//Middlewares

app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => res.json({ message: "Hello World" }));
//get data

//get DATA for Main Line CHart FOR first 500 readings
app.get("/mains", async (req, res) => {
  try {
    const allData = await pool.query(
      `SELECT "DateTime", "Wattage" from public.readings WHERE "Device_ID"='mains' LIMIT 800`
    );
    res.json(allData.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//get Device Names except mains and alwaysOn to Populate Drop Box First 50
app.get("/devices", async (req, res) => {
  try {
    const allData = await pool.query(
      `SELECT DISTINCT "Device_ID", "Device_Name" from public.readings WHERE "Device_Name" IS NOT NULL LIMIT 50`
    );
    res.json(allData.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get data for particular DeviceId selected for first 200 fields
app.get("/devices/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const data = await pool.query(
      `SELECT  "Device_ID", "Device_Name","Device_Type", "DateTime", "Wattage" from public.readings WHERE "Device_ID" = $1`,
      [deviceId]
    );
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Listener

app.listen(port, () => console.log(`Listening on localhost: ${port}`));
