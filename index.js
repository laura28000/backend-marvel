require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const API_URL = process.env.MARVEL_API_BASE;
const API_KEY = process.env.MARVEL_API_KEY;
const LIMIT = 100;

// ➤ Health route
app.get("/", (req, res) => {
  res.json({ message: "Marvel backend is working ✅" });
});

// ➤ Characters list (with pagination + search)
app.get("/characters", async (req, res) => {
  try {
    const { name, page } = req.query;
    const skip = (Number(page || 1) - 1) * LIMIT;

    const response = await axios.get(`${API_URL}/characters`, {
      params: {
        apiKey: API_KEY,
        name,
        limit: LIMIT,
        skip,
      },
    });

    res.json({
      results: response.data.results,
      count: response.data.count,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur /characters", error: error.message });
  }
});


// ➤ Character details
app.get("/character/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${API_URL}/character/${id}`, {
      params: { apiKey: API_KEY },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Erreur /character/:id", error: error.message });
  }
});

// ➤ Comics list (with optional search or characterId)
app.get("/comics", async (req, res) => {
  try {
    const { title, page, characterId } = req.query;
    const skip = (Number(page || 1) - 1) * LIMIT;

    const params = {
      apiKey: API_KEY,
      limit: LIMIT,
      skip,
    };

    if (title) params.title = title;
    if (characterId) params.characterId = characterId;

    const response = await axios.get(`${API_URL}/comics`, { params });

    const sorted = response.data.results.sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    res.json({
      results: sorted,
      count: response.data.count,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur /comics", error: error.message });
  }
});

// ➤ Favorites: characters
app.post("/favorites/characters", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.json({ results: [] });

    const responses = await Promise.all(
      ids.map((id) =>
        axios
          .get(`${API_URL}/character/${id}`, {
            params: { apiKey: API_KEY },
          })
          .then((r) => r.data)
          .catch(() => null)
      )
    );

    res.json({
      results: responses.filter((item) => item !== null),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur /favorites/characters", error: error.message });
  }
});

// ➤ Favorites: comics
app.post("/favorites/comics", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.json({ results: [] });

    const responses = await Promise.all(
      ids.map((id) =>
        axios
          .get(`${API_URL}/comic/${id}`, {
            params: { apiKey: API_KEY },
          })
          .then((r) => r.data)
          .catch(async () => {
            try {
              const r2 = await axios.get(`${API_URL}/comics/${id}`, {
                params: { apiKey: API_KEY },
              });
              return r2.data;
            } catch {
              return null;
            }
          })
      )
    );

    res.json({
      results: responses.filter((item) => item !== null),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur /favorites/comics", error: error.message });
  }
});
// ➤ Comic detail (par ID unique)
app.get("/comic/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${API_URL}/comic/${id}`, {
      params: { apiKey: API_KEY },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Erreur /comic/:id", error: error.message });
  }
});

// ➤ 404 pour toutes les routes inconnues
app.all(/.*/, (req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// ➤ Démarrage serveur
app.listen(PORT, () => {
  console.log(`✅ Marvel API backend running at http://localhost:${PORT}`);
});
