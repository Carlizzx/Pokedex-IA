import React from 'react'
import './Navbar.css'

export const Navbar = ({ search, setSearch }) => {
  return (
    <header className="app-navbar">
      <div className="app-navbar__brand">
        <span className="app-navbar__logo" >
            <img src="icon.png" alt="Logo" />
        </span>
        <div>
          <h2>POKEDEX IA</h2>
          <p>Explore os Pokémon</p>
        </div>
      </div>

      <label className="app-navbar__search">
        <span>🔎</span>
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
    </header>
  )
}