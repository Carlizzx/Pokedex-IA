import React from 'react'
import './PokeCard.css'

export const PokeCard = ({
  id,
  title,
  image,
  types,
  backgroundimg = 'src/assets/pokemonicon.png',
}) => {
  
  // Define a color do fundo do background dependendo do tipo do Pokémon

  const colors = {
    fire: '#FFA500',
    grass: '#008000',
    electric: '#FFD700',
    water: '#1E90FF',
    ground: '#CD853F',
    rock: '#DEB887',
    fairy: '#EE82EE',
    poison: '#8A2BE2',
    bug: '#006400',
    dragon: '#4169E1',
    psychic: '#FF69B4',
    flying: '#BA55D3',
    fighting: '#FF6347',
    normal: '#C0C0C0',
    ghost: '#4B0082',
    ice: '#87CEFA',
    dark: '#1C1C1C',
    steel: '#B0C4DE',
  }

  const primaryType = types[0]?.toLowerCase() || 'normal'
  const bgColor = colors[primaryType] || '#F5F5F5'

  return (
    <div
      className="poke-card"
      style={{
        '--bg-img': `url(${backgroundimg})`,
        background: `linear-gradient(135deg, ${bgColor}, ${bgColor}cc)`
      }}
    >
      <div className="poke-card__image-wrapper">
        <img src={image} alt={title} className="poke-card__image" />
      </div>

      <div className="poke-card__content">
        <p className="poke-card__id">#{id}</p>
        <h3 className="poke-card__title">{title}</h3>
      </div>

      <div className="poke-card__types">
        {types.map((type) => (
          <span key={type} className="poke-card__type">
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}