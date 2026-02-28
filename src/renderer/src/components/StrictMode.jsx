import React, { useState, useEffect, useRef } from 'react'

const StrictMode = ({ isActive, onStart, onStop, blockedSites }) => {
  const [strictDuration, setStrictDuration]     = useState(1)
  const [timeLeft, setTimeLeft]                 = useState(null)
  const [isStrictActive, setIsStrictActive]     = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!isStrictActive || timeLeft === null) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          handleStrictComplete()
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [isStrictActive]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStrictComplete = () => {
    setIsStrictActive(false)
    setTimeLeft(null)
    if (typeof Notification !== 'undefined') {
      new Notification('Strict Mode Complete! 🏆', {
        body: 'You successfully completed your strict focus session!',
      })
    }
    onStop()
  }

  const handleStrictStart = () => {
    if (blockedSites.length === 0) {
      alert('Please add at least one site to block!')
      return
    }
    setShowConfirmation(true)
  }

  const confirmStrictStart = async () => {
    await onStart()
    setIsStrictActive(true)
    setTimeLeft(Math.round(strictDuration * 3600))
    setShowConfirmation(false)
  }

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00:00'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
  }

  const getProgress = () => {
    if (timeLeft === null) return 100
    const total = strictDuration * 3600
    return ((total - timeLeft) / total) * 100
  }

  return (
    <div className="bg-gray-800 p-8 rounded-xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-red-400 flex items-center justify-center gap-2">
        <span className="text-3xl">🔒</span> Strict Mode
      </h2>

      {!isStrictActive ? (
        <>
          {!showConfirmation ? (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-red-900/30 border-2 border-red-500">
                <p className="text-sm font-medium text-red-300">
                  ⚠️ <strong>WARNING:</strong> In Strict Mode:
                </p>
                <ul className="text-sm mt-2 space-y-1 text-red-200">
                  <li>• You CANNOT cancel the session</li>
                  <li>• You CANNOT modify settings</li>
                  <li>• You CANNOT change blocked sites</li>
                  <li>• There is NO way to stop early</li>
                  <li>• Session runs until completion only</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Session Duration (hours)
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={24}
                  step={0.5}
                  value={strictDuration}
                  onChange={(e) => setStrictDuration(parseFloat(e.target.value))}
                  className="w-full accent-red-500"
                />
                <p className="text-center text-xl font-semibold mt-2">
                  {strictDuration} {strictDuration === 1 ? 'hour' : 'hours'}
                </p>
              </div>

              <button
                onClick={handleStrictStart}
                disabled={blockedSites.length === 0}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-full text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                🔒 Enable Strict Mode
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-yellow-900/30 border-2 border-yellow-500">
                <h3 className="text-lg font-bold mb-3 text-yellow-300">
                  ⚠️ Final Confirmation
                </h3>
                <p className="text-sm mb-2 text-yellow-200">
                  You are about to enter <strong>Strict Mode</strong> for{' '}
                  <strong>{strictDuration} hour(s)</strong>.
                </p>
                <p className="text-sm mb-2 text-yellow-200">• Sites will be blocked for the entire duration</p>
                <p className="text-sm mb-2 text-yellow-200">• You CANNOT stop or cancel this session</p>
                <p className="text-sm font-bold text-yellow-200">• There is NO emergency stop option!</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-700 px-6 py-3 rounded-full text-lg font-semibold hover:opacity-80 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStrictStart}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-transform"
                >
                  I Understand, Start
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🔒</div>
            <div className="text-red-400 font-semibold mb-2">STRICT MODE ACTIVE</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold font-mono mb-4">{formatTime(timeLeft)}</div>
            <div className="text-sm text-gray-400">Remaining Time</div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-1000"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="p-4 rounded-lg bg-red-900/30 border border-red-500">
            <p className="text-xs text-red-300">
              🚨 Settings are locked. No changes or cancellation allowed during Strict Mode.
            </p>
          </div>

          <div className="text-center text-xs text-gray-500">
            {timeLeft > 3600
              ? '🎯 Keep going strong!'
              : timeLeft > 1800
              ? '⚡ Less than 30 minutes left!'
              : timeLeft > 600
              ? '🔥 Final stretch!'
              : '🏁 Almost there!'}
          </div>
        </div>
      )}
    </div>
  )
}

export default StrictMode