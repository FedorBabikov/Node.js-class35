"use strict";

import express from "express";
import fetch from "node-fetch";
import { keys } from "./sources/keys.js";

const PORT = process.env.PORT || 3000;
const APIendpoint = "https://api.openweathermap.org/data/2.5/weather";

const app = express();
app.use(express.json());

const makeResponseObject = (message) => {
  return { message };
};

app.get("/", (req, res) => {
  res.json(makeResponseObject("Hello from backend to frontend!"));
});

app.post("/weather", (req, res) => {
  let cityName = req.body.cityName;

  if (!cityName) {
    res
      .status(400)
      .json(
        makeResponseObject("There is no `cityName` property in the request!")
      );
  } else {
    cityName = cityName[0].toUpperCase() + cityName.slice(1);
    const url = `${APIendpoint}?q=${cityName}&units=metric&appid=${keys.API_KEY}`;

    fetch(url)
      .then((weatherResponse) => weatherResponse.json())
      .then(({ main: { temp } }) =>
        res.json(
          makeResponseObject(
            `Current temperature in the city of ${cityName} is ${temp} degrees celsius.`
          )
        )
      )
      .catch((err) => {
        res
          .status(500)
          .json(
            makeResponseObject(
              `Something went terribly wrong: ${err.message}. Please try again later.`
            )
          );
      });
  }
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT} ...`));
