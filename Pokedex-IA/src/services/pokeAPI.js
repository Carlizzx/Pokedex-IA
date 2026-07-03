export const fetchPokemons = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1351');
  const data = await res.json();

  const promises = data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return res.json();
  });

  return Promise.all(promises);
};