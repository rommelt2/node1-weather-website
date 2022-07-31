const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDP = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDP));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Rommel Tito",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    quotes: "“Part of the journey is the end.”",
    name: "Rommel Tito",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    message:
      "Saan ka punta? To the Moon! Roadtrip! Broom Broom! Skrt Skrt! Zoom Zoom! Sa Fake! No Room! 🎶",
    name: "Rommel Tito",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an Address",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, weather) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: weather,
          location,
          address: req.query.address,
        });
      });
    }
  );

  // res.send({
  //   forecast: "It is snowing",
  //   location: "Manila",
  //   address: req.query.address,
  // });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    error: "Help article not found",
    name: "Rommel Tito",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    error: "Page not found.",
    name: "Rommel Tito",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
