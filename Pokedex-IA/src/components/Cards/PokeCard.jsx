import React from 'react'
import './PokeCard.css'
import { typeColors } from '../../utils/colors'

export const PokeCard = ({
  id,
  title,
  image,
  types,
  onClick,
  backgroundimg = 'src/assets/pokemonicon.png',
}) => {

  const primaryType = types[0]?.toLowerCase() || 'normal'
  const bgColor = typeColors[primaryType] || '#F5F5F5'

  return (
    <div
      className="poke-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.()
        }
      }}
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
          <span
            key={type}
            className="poke-card__type"
            style={{ backgroundColor: typeColors[type.toLowerCase()] || 'rgba(255,255,255,0.2)' }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}