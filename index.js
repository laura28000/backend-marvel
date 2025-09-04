require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur marvel 🦸‍♂️🦸🏽‍♀️");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get("/characters", async (req, res) => {
  try {
    const limit = 100;
    // console.log(req.query); // { name: 'iron' }
    // gestion des possibles queries :
    let queries = "";
    // si on recoit une query name :
    if (req.query.name) {
      queries = queries + "&name=" + req.query.name;
    }
    // si on recoit une query page :
    if (req.query.page) {
      let skip = (req.query.page - 1) * limit;
      queries = queries + "&skip=" + skip;
    }
    // utiliser axios pour envoyer une requête à l'API :
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}${queries}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    const limit = 100;
    // console.log(req.query); // { name: 'iron' }
    // gestion des possibles queries :
    let queries = "";
    // si on recoit une query name :
    if (req.query.title) {
      queries = queries + "&title=" + req.query.title;
    }
    // si on recoit une query page :
    if (req.query.page) {
      let skip = (req.query.page - 1) * limit;
      queries = queries + "&skip=" + skip;
    }
    // utiliser axios pour envoyer une requête à l'API :
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}${queries}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    console.log(req.params); // { characterId: '5fcf934fd8a2480017b916ac' }
    // utiliser axios pour envoyer une requête à l'API :
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get("/character/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${id}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.get("/comic/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${id}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du comic", error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server started 🦸‍♂️🦸🏽‍♀️");
});
