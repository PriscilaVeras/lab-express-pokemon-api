const express = require("express");

const PORT = 4000;

// Importing all the pokemon for our data file
const allPokemon = require("./data");

const app = express();

app.use(express.json());
// -- Define your route listeners here! --

// allPolemon
app.get("/pokemon", (req, res) => {
  return res.json(allPokemon);
});

// search pokemon
app.get("/pokemon/search", (req, res) => {
  for (let key in req.query) {
    const filteredPokemon = allPokemon.filter((pokemonElement) => {
      if (key === "types") {
        return pokemonElement.types.includes(req.query.types);
      }

      return pokemonElement.name
        .toLowerCase()
        .includes(req.query.name.toLowerCase());
    });

    if (filteredPokemon) {
      return res.json(filteredPokemon);
    } else {
      return res.json({ msg: "Pokemon not found!" });
    }
  }
});

// especific pokemon
app.get("/pokemon/:id", (req, res) => {
  const id = req.params.id;

  const foundPokemon = allPokemon.find((pokemonUnique) => {
    return pokemonUnique.id === Number(id);
  });

  if (foundPokemon) {
    return res.json(foundPokemon);
  } else {
    return res.json({ msg: "Pokemon not found!" });
  }
});

// create
app.post("/pokemon", (req, res) => {
  const formData = req.body;

  const lastId = allPokemon[allPokemon.length - 1].id;

  const newPokemon = { ...formData, id: lastId + 1 };

  allPokemon.push(newPokemon);

  return res.json(newPokemon);
});

// update
app.put("/pokemon/:id", (req, res) => {
  const formData = req.body;

  const id = req.params.id;

  const foundPokemon = allPokemon.find((pokemonElement) => {
    return pokemonElement.id === Number(id);
  });

  const index = allPokemon.indexOf(foundPokemon);
  allPokemon[index] = { ...foundPokemon, ...formData };
  return res.json(allPokemon[index]);
});

// delete
app.delete("/pokemon/:id", (req, res) => {
  const index = allPokemon.findIndex((pokemonElement) => {
    return pokemonElement.id === Number(req.params.id);
  });

  if (index > -1) {
    allPokemon.splice(index, 1);
    return res.json({ msg: "Pokemon deleted successfully" });
  } else {
    return res.json({ msg: "Pokemon not found." });
  }
});

app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`));
