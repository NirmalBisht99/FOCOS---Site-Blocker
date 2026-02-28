import React, { useState, useEffect, useRef } from 'react'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import ControlCenter from './components/ControlCenter'
import PomodoroMode from './components/Pomodoromode'
import StrictMode from './components/strictMode'
import FeaturesSection from './components/FeaturesSection'
import Footer from './components/Footer'

export default function App() {
  const [blockDuration, setBlockDuration]       = useState([1])
  const [isBlocking, setIsBlocking]             = useState(false)
  const [blockedSites, setBlockedSites]         = useState([])
  const [inputUrl, setInputUrl]                 = useState('')
  const [timeLeft, setTimeLeft]                 = useState(null)
  const [activeMode, setActiveMode]             = useState('normal') // 'normal' | 'pomodoro' | 'strict'
  const [elevationWarning, setElevationWarning] = useState(false)
  const timerRef = useRef(null)

  // ── Boot-time checks ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
    if (window.focos?.isElevated) {
      window.focos.isElevated().then((elevated) => {
        if (!elevated) setElevationWarning(true)
      })
    }
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const focosAvailable = () => {
    if (!window.focos) {
      alert('FOCOS API not available. Please restart the app.')
      return false
    }
    return true
  }

  const formatTime = (s) => {
    if (s === null || s === undefined) return '00:00:00'
    const h   = Math.floor(s / 3600)
    const m   = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':')
  }

  // ── Site list management ──────────────────────────────────────────────────
  const handleAddSite = () => {
    const raw     = inputUrl.trim()
    const cleaned = raw.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase()
    if (cleaned && !blockedSites.includes(cleaned)) {
      setBlockedSites((prev) => [...prev, cleaned])
      setInputUrl('')
    }
  }

  const handleRemoveSite = (index) => {
    if (activeMode === 'strict' && isBlocking) {
      alert('Cannot modify blocked sites during Strict Mode!')
      return
    }
    setBlockedSites((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Core block / unblock ──────────────────────────────────────────────────
  const blockSites = async (sites = blockedSites) => {
    if (!focosAvailable()) return false
    try {
      const res = await window.focos.blockSites(sites)
      if (!res.success) {
        alert('Failed to block sites:\n' + res.error + '\n\nMake sure you allowed the admin prompt.')
        return false
      }
      setIsBlocking(true)
      return true
    } catch (err) {
      console.error('[blockSites]', err)
      alert('Unexpected error blocking sites. See console.')
      return false
    }
  }

  const unblockSites = async () => {
    if (!focosAvailable()) return false
    try {
      const res = await window.focos.unblockSites()
      if (!res.success) {
        alert('Failed to unblock sites:\n' + res.error)
        return false
      }
      setIsBlocking(false)
      return true
    } catch (err) {
      console.error('[unblockSites]', err)
      alert('Unexpected error unblocking sites. See console.')
      return false
    }
  }

  // ── Normal mode ───────────────────────────────────────────────────────────
  const handleStartBlocking = async () => {
    if (blockedSites.length === 0) return
    const ok = await blockSites()
    if (ok) {
      setTimeLeft(Math.round(blockDuration[0] * 3600))
      document.getElementById('blockList')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleStopBlocking = async () => {
    if (activeMode === 'strict' && isBlocking) {
      alert('Cannot stop blocking during Strict Mode!')
      return
    }
    const ok = await unblockSites()
    if (ok) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setTimeLeft(null)
      setBlockDuration([1])
    }
  }

  useEffect(() => {
    if (!isBlocking || timeLeft === null || activeMode !== 'normal') return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          unblockSites()
          setTimeLeft(null)
          setBlockDuration([1])
          if (typeof Notification !== 'undefined') {
            new Notification('Session Complete', { body: 'Time for a break!' })
          }
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [isBlocking, activeMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pomodoro callbacks ────────────────────────────────────────────────────
  const handlePomodoroBlock   = () => blockSites()
  const handlePomodoroUnblock = () => unblockSites()
  const handlePomodoroStop    = async () => { await unblockSites(); setActiveMode('normal') }

  // ── Strict mode callbacks ─────────────────────────────────────────────────
  const handleStrictStart = () => blockSites()
  const handleStrictStop  = async () => { await unblockSites(); setActiveMode('normal') }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white min-h-screen font-sans">
      <Navigation />

      <HeroSection />

      {/* ── Mode selector ── */}
      <section className="py-12 px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Focus Mode</h2>
          <p className="text-gray-400">Select the mode that fits your productivity style</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {[
            { mode: 'normal',   icon: '⏰', label: 'Normal Mode',   desc: 'Classic blocking with flexible duration control', color: 'blue'   },
            { mode: 'pomodoro', icon: '🍅', label: 'Pomodoro Mode', desc: 'Focus sessions with automatic break intervals',   color: 'orange' },
            { mode: 'strict',   icon: '🔒', label: 'Strict Mode',   desc: 'Unbreakable focus — no cancellation allowed',    color: 'red'    },
          ].map(({ mode, icon, label, desc, color }) => (
            <button
              key={mode}
              onClick={() => !isBlocking && setActiveMode(mode)}
              disabled={isBlocking}
              className={
                'p-6 rounded-xl border-2 transition-all text-left ' +
                (activeMode === mode
                  ? 'border-' + color + '-500 bg-' + color + '-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-' + color + '-400') +
                (isBlocking ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer')
              }
            >
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="text-xl font-bold mb-2">{label}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Normal mode ── */}
      {activeMode === 'normal' && (
        <ControlCenter
          blockDuration={blockDuration}
          setBlockDuration={setBlockDuration}
          isBlocking={isBlocking}
          timeLeft={timeLeft}
          formatTime={formatTime}
          handleStartBlocking={handleStartBlocking}
          handleStopBlocking={handleStopBlocking}
          blockedSites={blockedSites}
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          handleAddSite={handleAddSite}
          handleRemoveSite={handleRemoveSite}
        />
      )}

      {/* ── Pomodoro mode ── */}
      {activeMode === 'pomodoro' && (
        <section className="py-12 px-6" id="blockList">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <PomodoroMode
              isActive={isBlocking}
              onBlock={handlePomodoroBlock}
              onUnblock={handlePomodoroUnblock}
              onComplete={handlePomodoroStop}
              blockedSites={blockedSites}
            />
            <SitePanel
              isBlocking={isBlocking}
              inputUrl={inputUrl}
              setInputUrl={setInputUrl}
              handleAddSite={handleAddSite}
              handleRemoveSite={handleRemoveSite}
              blockedSites={blockedSites}
              accentClass="text-purple-400"
              btnClass="bg-purple-600 hover:bg-purple-700"
            />
          </div>
        </section>
      )}

      {/* ── Strict mode ── */}
      {activeMode === 'strict' && (
        <section className="py-12 px-6" id="blockList">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrictMode
              isActive={isBlocking}
              onStart={handleStrictStart}
              onStop={handleStrictStop}
              blockedSites={blockedSites}
            />
            <SitePanel
              isBlocking={isBlocking}
              inputUrl={inputUrl}
              setInputUrl={setInputUrl}
              handleAddSite={handleAddSite}
              handleRemoveSite={handleRemoveSite}
              blockedSites={blockedSites}
              accentClass="text-red-400"
              btnClass="bg-red-600 hover:bg-red-700"
              showLockBanner={isBlocking}
            />
          </div>
        </section>
      )}

      <FeaturesSection />
      <Footer />
    </div>
  )
}

// ── Shared site-list panel (Pomodoro + Strict modes) ──────────────────────────
function SitePanel({ isBlocking, inputUrl, setInputUrl, handleAddSite, handleRemoveSite, blockedSites, accentClass, btnClass, showLockBanner = false }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h2 className={'text-xl font-bold mb-4 ' + accentClass}>Blocked Sites</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="e.g., facebook.com"
          className="flex-1 border border-gray-600 bg-gray-700 text-white px-4 py-2 rounded placeholder-gray-400"
          onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
          disabled={isBlocking}
        />
        <button
          onClick={handleAddSite}
          disabled={isBlocking}
          className={btnClass + ' text-white px-4 py-2 rounded disabled:opacity-50 transition-colors'}
        >
          Add
        </button>
      </div>

      {showLockBanner && (
        <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-500">
          <p className="text-sm text-red-300">🔒 Locked in Strict Mode</p>
        </div>
      )}

      {blockedSites.length === 0 ? (
        <p className="text-gray-400">No sites added yet.</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {blockedSites.map((site, i) => (
            <li key={i} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <span>{site}</span>
              <button
                onClick={() => handleRemoveSite(i)}
                disabled={isBlocking}
                className="text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded disabled:opacity-50"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}