"use strict";

import express from "express";
import fetch from "node-fetch";
import { keys } from "./sources/keys.js"; // this file is hidden from GH using .gitignore

const PORT = process.env.PORT || 3000;
const APIendpoint = "https://api.openweathermap.org/data/2.5/weather";

const app = express();
app.use(express.json());

const makeResponseObject = (message) => {
  // we give back to client unified objects created by this function
  return { message };
};

app.get("/", (req, res) => {
  res.json(makeResponseObject("Hello from backend to frontend!"));
});

app.post("/weather", (req, res) => {
  let cityName = req.body.cityName;

  if (!("cityName" in req.body)) {
    res
      .status(400) // bad request: no `cityName` property provided
      .json(
        makeResponseObject("There is no `cityName` property in the request!")
      );
  } else if (cityName === "") {
    res
      .status(400) // bad request: `cityName` property provided has unaccepted value
      .json(
        makeResponseObject(
          "`cityName` property in the request has unaccepted value!"
        )
      );
  } else {
    cityName = cityName[0].toUpperCase() + cityName.slice(1); // Capitalize the name
    const url = `${APIendpoint}?q=${cityName}&units=metric&appid=${keys.API_KEY}`; // Build the URL for fetch

    fetch(url)
      .then((weatherResponse) => {
        if (weatherResponse.ok) return weatherResponse.json();
        return Promise.reject(new Error("Info about weather is not available"));
      })
      .then(({ main: { temp } }) =>
        res.json(
          makeResponseObject(
            `Current temperature in the city of ${cityName} is ${temp} degrees celsius.`
          )
        )
      )
      .catch((err) => {
        res
          .status(500) // bad response: error on the server side
          .json(
            makeResponseObject(
              `Something went terribly wrong. ${err.message}. Please try again later.`
            )
          );
      });
  }
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT} ...`));
