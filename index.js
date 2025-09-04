require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

// ✅ Route de bienvenue
app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur marvel 🦸‍♂️🦸🏽‍♀️");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ✅ Liste des personnages
app.get("/characters", async (req, res) => {
  try {
    const limit = 100;
    let queries = `&limit=${limit}`;

    if (req.query.name) {
      queries += `&name=${req.query.name}`;
    }
    if (req.query.page) {
      const skip = (req.query.page - 1) * limit;
      queries += `&skip=${skip}`;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}${queries}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ✅ Détail d’un personnage
app.get("/character/:id", async (req, res) => {
  try {
    const characterId = req.params.id;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ✅ Comics (avec recherche + pagination)
app.get("/comics", async (req, res) => {
  try {
    const limit = 100;
    let queries = `&limit=${limit}`;

    if (req.query.title) {
      queries += `&title=${req.query.title}`;
    }
    if (req.query.page) {
      const skip = (req.query.page - 1) * limit;
      queries += `&skip=${skip}`;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}${queries}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ✅ Liste des comics associés à un personnage
app.get("/comics/:characterId", async (req, res) => {
  try {
    const { characterId } = req.params;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ✅ Détail d’un comic (via comicId)
app.get("/comic/:id", async (req, res) => {
  try {
    const comicId = req.params.id;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${comicId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du comic", error: error.message });
  }
});

// ✅ Écoute du serveur
app.listen(process.env.PORT, () => {
  console.log("✅ Server started on port " + process.env.PORT);
});
