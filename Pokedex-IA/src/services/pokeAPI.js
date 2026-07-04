export const fetchPokemons = async (limit, offset) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  const promises = data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return res.json();
  });

  const pokemons = await Promise.all(promises)

  return {
    pokemons,
    total: data.count,
  }
}