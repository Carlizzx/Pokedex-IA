import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar/Navbar'
import { ChatIA } from '../components/ChatIA/ChatIA'
import { fetchPokemonById } from '../services/api/pokeAPI'
import { typeColors } from '../utils/colors'
import './Profiles.css'

export const Profiles = ({ theme, setTheme }) => {
  const { id } = useParams()

  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  const [expandedAbility, setExpandedAbility] = useState(null)
  const [abilityDescriptions, setAbilityDescriptions] = useState({})
  const [loadingAbility, setLoadingAbility] = useState(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await fetchPokemonById(id)

        const formatted = {
          id: data.id,
          name: data.name,
          types: data.types.map((type) => type.type.name),
          image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default,
          shinyImage: data.sprites?.other?.['official-artwork']?.front_shiny || data.sprites?.front_shiny,
          height: `${data.height / 10} m`,
          weight: `${data.weight / 10} kg`,
          abilities: data.abilities.map((ability) => ({
            name: ability.ability.name,
            isHidden: ability.is_hidden,
            url: ability.ability.url,
          })),
          stats: data.stats.slice(0, 4).map((stat, index) => ({
            label: stat.stat.name,
            value: stat.base_stat,
            color: ['#4f46e5', '#f59e0b', '#10b981', '#ef4444'][index] || '#4f46e5',
          })),
        }

        setPokemon(formatted)
      } catch (error) {
        console.error('Erro ao buscar Pokémon:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [id])

  const handleAbilityClick = async (ability) => {
    const isOpening = expandedAbility !== ability.name

    setExpandedAbility(isOpening ? ability.name : null)

    if (isOpening && !abilityDescriptions[ability.name]) {
      try {
        setLoadingAbility(ability.name)
        const response = await fetch(ability.url)
        const data = await response.json()

        const entry =
          data.effect_entries.find((e) => e.language.name === 'en')

        const description = entry
          ? (entry.short_effect || entry.effect)
          : 'Descrição não disponível.'

        setAbilityDescriptions((prev) => ({
          ...prev,
          [ability.name]: description,
        }))
      } catch (error) {
        console.error('Erro ao buscar descrição da habilidade:', error)
        setAbilityDescriptions((prev) => ({
          ...prev,
          [ability.name]: 'Não foi possível carregar a descrição.',
        }))
      } finally {
        setLoadingAbility(null)
      }
    }
  }

  if (loading || !pokemon) {
    return (
      <div className="profiles-page">
        <Navbar HideSerch />
        <main className="profiles-shell">
          <p>Carregando Pokémon...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="profiles-page">
      <Navbar HideSerch />

      <main className="profiles-shell">
        <ChatIA currentPokemon={pokemon} />

        <section className="profiles-hero">
          <div className="profiles-hero__info">
            <p className="profiles-hero__eyebrow">Pokémon selecionado</p>
            <h1 className="Pokemon-name">{pokemon.name}</h1>
            <p className="profiles-hero__id">#0{pokemon.id}</p>
            <div className="profiles-hero__types">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="profiles-hero__type"
                  style={{ backgroundColor: typeColors[type] || '#e2e8f0' }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="profiles-hero__image-card">
            <img src={pokemon.image} alt={pokemon.name} />
          </div>
        </section>

        <section className="profiles-grid">
          <article className="profiles-card">
            <div className="profiles-card__header">
              <h2>Estatísticas</h2>
              <span>Base</span>
            </div>
            <div className="profiles-stats">
              {pokemon.stats.map((stat) => (
                <div key={stat.label} className="profiles-stat">
                  <div className="profiles-stat__top">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                  <div className="profiles-stat__bar">
                    <div
                      className="profiles-stat__fill"
                      style={{ width: `${stat.value}%`, background: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="profiles-card">
            <div className="profiles-card__header">
              <h2>Versões shiny</h2>
              <span>Visual</span>
            </div>
            <div className="profiles-shiny">
              <div className="profiles-shiny__item">
                <img src={pokemon.image} alt={`${pokemon.name} normal`} />
                <span>Normal</span>
              </div>
              <div className="profiles-shiny__item">
                <img src={pokemon.shinyImage} alt={`${pokemon.name} shiny`} />
                <span>Shiny</span>
              </div>
            </div>
          </article>
        </section>

        <section className="profiles-card profiles-card--full">
          <div className="profiles-card__header">
            <h2>Habilidades</h2>
            <span>{pokemon.abilities.length} no total</span>
          </div>

          <div className="profiles-abilities">
            {pokemon.abilities.map((ability) => {
              const isExpanded = expandedAbility === ability.name
              const isLoading = loadingAbility === ability.name

              return (
                <div
                  key={ability.name}
                  className={`profiles-ability-wrapper ${isExpanded ? 'profiles-ability-wrapper--expanded' : ''}`}
                >
                  <button
                    type="button"
                    className={`profiles-ability ${ability.isHidden ? 'profiles-ability--hidden' : ''} ${isExpanded ? 'profiles-ability--active' : ''}`}
                    onClick={() => handleAbilityClick(ability)}
                  >
                    <span className="profiles-ability__name">
                      {ability.name.replace('-', ' ')}
                    </span>
                    {ability.isHidden && (
                      <span className="profiles-ability__badge">Oculta</span>
                    )}
                    <span className="profiles-ability__chevron">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="profiles-ability__details">
                      {isLoading ? (
                        <p className="profiles-ability__loading">Carregando descrição...</p>
                      ) : (
                        <p>{abilityDescriptions[ability.name]}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="profiles-card profiles-card--full">
          <div className="profiles-card__header">
            <h2>Informações</h2>
            <span>Resumo</span>
          </div>

          <div className="profiles-info">
            <div>
              <span>Altura</span>
              <strong>{pokemon.height}</strong>
            </div>
            <div>
              <span>Peso</span>
              <strong>{pokemon.weight}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}