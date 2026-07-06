import React, { useState } from 'react'

import './ChatIA.css'
import { getOpenRouterResp } from '../../services/api/IAService'

export const ChatIA = ({ currentPokemon }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Olá! Eu sou a IA da Pokedex.' }
  ])

  const handleSendMessage = async () => { 
    const text = inputValue.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInputValue('')
    setMessages((prev) => [...prev, { role: 'assistant', text: 'Pensando..' }])

    //força o contexto do Pokémon atual se o usuário usar termos como "esse Pokémon", "ele", "da página" etc.
    try {
      const forceContext = /(esse\s*pokemon|esse\s*|ele\s|da\s*página|da\s*pagina|deste\s*pokemon|deste\s*poke|desse\s*pokemon|desse\s*|esse\s*ai)/i.test(text)
      const prompt = forceContext
        ? `Usando o Pokémon do contexto atual (tipos e nome): ${text}`
        : text
      const response = await getOpenRouterResp(prompt, currentPokemon)
      // Substitui o último item (o placeholder) pela resposta real
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', text: response }
        return updated
      })
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          text: 'Ops, tive um problema para responder. Tenta de novo!'
        }
        return updated
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className={`chatia ${isOpen ? 'chatia--open' : ''}`}>
      {isOpen && (
        <section className="chatia__panel" aria-label="Chat flutuante da IA">
          <header className="chatia__header">
            <div>
              <p className="chatia__title">IA Pokedex</p>
              <p className="chatia__subtitle">Assistente rápido</p>
            </div>
          </header>

          <div className="chatia__body">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`chatia__bubble chatia__bubble--${msg.role}`}
              >
                {msg.text}
              </p>
            ))}
          </div>

          <div className="chatia__composer">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" onClick={handleSendMessage}>
              Enviar
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        className={`chatia__toggle ${isOpen ? 'chatia__toggle--open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Fechar chat IA' : 'Abrir chat IA'}
      >
        {isOpen ? (
          <span className="chatia__toggle-x" aria-hidden="true" />
        ) : (
          <span className="chatia__toggle-text">IA</span>
        )}
      </button>
    </div>
  )
}