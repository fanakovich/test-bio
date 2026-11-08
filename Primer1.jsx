import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { translations } from './translations.js'
import './Primer1.css'

export default function Primer1({ language = 'ru', onClose }) {
  const [mode, setMode] = useState('register')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const isRegister = mode === 'register'
  const text = translations[language].auth

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    event.currentTarget.style.setProperty('--x', x)
    event.currentTarget.style.setProperty('--y', y)
  }

  const resetPointer = (event) => {
    event.currentTarget.style.setProperty('--x', '50')
    event.currentTarget.style.setProperty('--y', '50')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setFeedback('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (username.trim().length < 2) {
      setFeedback(text.usernameError)
      return
    }

    if (password.length < 6) {
      setFeedback(text.passwordError)
      return
    }

    setFeedback(isRegister ? text.registerSuccess : text.loginSuccess)
  }

  return createPortal(
    <div
      className="primer1-overlay"
      onWheel={(event) => event.stopPropagation()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <section
        className={`primer1-card-shell ${isRegister ? 'is-register' : 'is-login'}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="primer1-title"
      >
        <div className="primer1-card">
          <button className="primer1-close" type="button" onClick={onClose} aria-label={text.close}>
            ×
          </button>

          <header className="primer1-card-header">
            <p className="primer1-logo">LIBFLIX</p>
            <span>{text.tag}</span>
          </header>

          <div className="primer1-mode-switch">
            <span>{isRegister ? text.registerPrompt : text.loginPrompt}</span>
            <button type="button" onClick={() => changeMode(isRegister ? 'login' : 'register')}>
              {isRegister ? text.registerSwitch : text.loginSwitch}
            </button>
          </div>

          {!isRegister && <p className="primer1-welcome">{text.welcome}</p>}
          <h2 id="primer1-title">{isRegister ? text.registerTitle : text.loginTitle}</h2>
          <p className="primer1-note">{text.note}</p>

          <form className="primer1-form" onSubmit={handleSubmit}>
            <label htmlFor="primer1-username">{text.username}</label>
            <input
              id="primer1-username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder={text.usernamePlaceholder}
            />

            <label htmlFor="primer1-password">{text.password}</label>
            <input
              id="primer1-password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={text.passwordPlaceholder}
            />

            {feedback && <p className="primer1-feedback" role="status">{feedback}</p>}
            <button className="primer1-submit" type="submit">
              {isRegister ? text.registerSubmit : text.loginSubmit}
            </button>
          </form>
        </div>
      </section>
    </div>,
    document.body
  )
}