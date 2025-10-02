import React from 'react'
import '../styles/globals.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className="container">
        <header className="header">
          <div className="logo">Algorave Share</div>
          <nav>
            <a href="/">Home</a> | <a href="/events">Events</a> | <a href="/about">About</a> | <a href="/admin">Admin</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">AlgoraveShare demo footer — dummy links</footer>
      </div>
    </div>
  )
}

export default Layout
