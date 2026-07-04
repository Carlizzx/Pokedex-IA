import React, { useEffect, useState } from 'react'
import { PokeCard } from '../components/Cards/PokeCard'
import { Navbar } from '../components/Navbar/Navbar'
import './Home.css'
import { fetchPokemons } from '../services/pokeAPI'

export const Home = () => {
  const [pokemons, setPokemons] = useState([])       // pokémons da página atual
  const [allPokemons, setAllPokemons] = useState([])  // todos, usados na busca
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')

  const pokemonporpagina = 150
  const isSearching = search.trim().length > 0

  // Carrega a página atual normalmente
  useEffect(() => {
    const load = async () => {
      const offset = (currentPage - 1) * pokemonporpagina
      const data = await fetchPokemons(pokemonporpagina, offset)
      setPokemons(data.pokemons)
      setTotal(data.total)
    }

    load()
  }, [currentPage])

  // Carrega TODOS os pokémons uma única vez (usado só pra busca)
  useEffect(() => {
    const loadAll = async () => {
      const data = await fetchPokemons(2000, 0)
      setAllPokemons(data.pokemons)
    }

    loadAll()
  }, [])

  const totalPages = Math.ceil(total / pokemonporpagina)

  const PagiNumber = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const pages = []
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    pages.push(1)
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i += 1) pages.push(i)
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)

    return pages
  }

  // decide qual lista mostrar
  const listaExibida = isSearching
    ? allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      )
    : pokemons

  return (
    <main className="home">
      <Navbar search={search} setSearch={setSearch} />

      {!isSearching && (
        <div className="home__pagination">
          <button
            className="home__pagination-button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          <span className="home__pagination-info">
            Página {currentPage} de {totalPages || 1}
          </span>

          <button
            className="home__pagination-button"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage >= totalPages}
          >
            Próxima
          </button>
        </div>
      )}

      <div className="home__cards">
        {listaExibida.map((pokemon) => (
          <PokeCard
            key={pokemon.id}
            id={pokemon.id}
            title={pokemon.name}
            image={pokemon.sprites?.front_default}
            types={pokemon.types.map((type) => type.type.name)}
          />
        ))}
      </div>

      {!isSearching && (
        <div className="home__pagination home__pagination--bottom">
          {PagiNumber().map((page, index) => (
            page === '...'
              ? <span key={`${page}-${index}`} className="home__pagination-ellipsis">...</span>
              : <button
                  key={page}
                  className={`home__pagination-button ${currentPage === page ? 'home__pagination-button--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
          ))}
        </div>
      )}
    </main>
  )
}