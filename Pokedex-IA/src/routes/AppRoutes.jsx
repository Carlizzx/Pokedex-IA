import React, {useState} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Profiles } from '../pages/Profiles'

export const Router = () => {
    const [pokemonData, setPokemonData] = useState();
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/profiles/:id" element={<Profiles/>} />            </Routes>
        </BrowserRouter>
    );
};
