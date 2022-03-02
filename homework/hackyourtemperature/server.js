import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("Hello from backend to frontend!"));

app.post("/weather", (req, res) => {
  const cityName = req.body.cityName;
  res.send(cityName);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));
