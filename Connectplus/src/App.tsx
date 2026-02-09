import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function Shell() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-surface-dark text-ink-primary">
      {!isAuthPage && (
        <header className="sticky top-0 z-40 border-b border-white/5 bg-surface-dark/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-emerald shadow-soft-lg shadow-accent-indigo/40">
              <span className="text-xs font-semibold text-ink-primary">+</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-[0.18em] uppercase text-ink-muted">
                connect+
              </span>
              <span className="text-[10px] font-medium text-ink-muted/70">
                Unified Enterprise Operating Platform
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-medium text-ink-muted/90 md:flex">
            <a href="#architecture" className="transition-colors hover:text-ink-primary">
              Architecture
            </a>
            <a href="#vision" className="transition-colors hover:text-ink-primary">
              Vision
            </a>
            <a href="#trust" className="transition-colors hover:text-ink-primary">
              Enterprise Trust
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-white/10 bg-white/0 px-3 py-1.5 text-xs font-medium text-ink-primary/80 shadow-soft-inner transition hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-accent-indigo to-accent-emerald px-3 py-1.5 text-xs font-semibold text-ink-primary shadow-soft-lg shadow-accent-indigo/40"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      )}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      {!isAuthPage && (
        <footer className="border-t border-white/5 bg-surface-dark/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-[11px] text-ink-muted/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} connect+. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span>Security-first. Audit-ready. Enterprise-grade by design.</span>
          </div>
        </div>
      </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

export default App
