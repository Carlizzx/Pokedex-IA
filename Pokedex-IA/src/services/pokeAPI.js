export const fetchPokemons = async (limit, offset, includeDetails = true) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
  const data = await res.json()

  if (!includeDetails) {
    return {
      pokemons: data.results,
      total: data.count,
    }
  }

  const promises = data.results.map(async (pokemon) => {
    const response = await fetch(pokemon.url)
    return response.json()
  })

  const pokemons = await Promise.all(promises)

  return {
    pokemons,
    total: data.count,
  }
}

export const fetchPokemonById = async (id) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!res.ok) {
    throw new Error('Pokémon não encontrado')
  }

  return res.json()
}