import React, { useEffect, useState } from 'react'
import { PokeCard } from '../components/Cards/PokeCard'
import './Home.css'
import { fetchPokemons } from '../services/pokeAPI'

export const Home = () => {
  const [pokemons, setPokemons] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchPokemons()
      setPokemons(data)
    }

    load()
  }, [])

  return (
    <main className="home">
      <h1 className="home__title">Pokedex</h1>

      <div className="home__cards">
        {pokemons.map((pokemon) => (
          <PokeCard
            key={pokemon.id}
            id={pokemon.id}
            title={pokemon.name}
            image={pokemon.sprites.front_default}
            types={pokemon.types.map(t => t.type.name)}
          />
        ))}
      </div>
    </main>
  )
}