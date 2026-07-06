import React from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import icon from '../../assets/icon.png'

export const Navbar = ({ search, setSearch, HideSerch, theme, setTheme }) => {
  const Navigate = useNavigate();
  return (
    <header className="app-navbar">

      <div className="app-navbar__brand" >
        <span className="app-navbar__logo" onClick={() => Navigate('/')}>
            <img src={icon} alt="Logo"/>
        </span>
        <div>
          <h2 onClick={() => Navigate('/')}>POKEDEX IA</h2>
        </div>
      </div>
      {!HideSerch && (<label className="app-navbar__search">
        <span>🔎</span>
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>)}
      
    </header>

  )
}