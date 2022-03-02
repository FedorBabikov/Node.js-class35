import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const response = { message: "" };

app.get("/", (req, res) => {
  response.message = "Hello from backend to frontend!";
  res.json(response);
});

app.post("/weather", (req, res) => {
  const cityName = req.body.cityName;

  if (cityName) {
    response.message = `City name is ${cityName}`;
    res.json(response);
  } else {
    response.message = "There is no `cityName` property in the request!";
    res.status(400).json(response);
  }
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT} ...`));
