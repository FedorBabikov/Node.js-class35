"use strict";

import express from "express";
import fetch from "node-fetch";
import { keys } from "./sources/keys.js"; // this file is hidden from GH using .gitignore

const APIendpoint = "https://api.openweathermap.org/data/2.5/weather";

export const app = express();
app.use(express.json());

const makeResponseObject = (message) => {
  // we give back to client unified objects created by this function
  return { weatherText: message };
};

app.get("/", (req, res) => {
  res.json(makeResponseObject("Hello from backend to frontend!"));
});

app.post("/weather", (req, res) => {
  let cityName = req.body.cityName;

  if (!("cityName" in req.body)) {
    // bad request: no `cityName` property provided
    res
      .status(400)
      .json(
        makeResponseObject("There is no `cityName` property in the request!")
      );
  } else if (cityName === "") {
    // bad request: `cityName` property provided has unaccepted value
    res
      .status(400)
      .json(
        makeResponseObject(
          "`cityName` property in the request has unaccepted value!"
        )
      );
  } else {
    cityName = cityName[0].toUpperCase() + cityName.slice(1); // Capitalize the name
    const url = `${APIendpoint}?q=${cityName}&units=metric&appid=${keys.API_KEY}`; // Build the URL for fetch()

    fetch(url)
      .then((weatherResponse) => {
        if (!weatherResponse.ok)
          return Promise.reject(new Error("City is not found!"));
        return weatherResponse.json();
      })
      .then(({ main: { temp } }) =>
        res.json(
          // status (200) is sent by default
          makeResponseObject(
            `Current temperature in ${cityName} is ${temp} degrees celsius.`
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
