import React, { useState, useEffect, useRef } from 'react'

const PomodoroMode = ({ isActive, onBlock, onUnblock, onComplete, blockedSites }) => {
  const [focusTime, setFocusTime]           = useState(25)
  const [breakTime, setBreakTime]           = useState(5)
  const [cycles, setCycles]                 = useState(4)
  const [currentCycle, setCurrentCycle]     = useState(1)
  const [isOnBreak, setIsOnBreak]           = useState(false)
  const [timeLeft, setTimeLeft]             = useState(25 * 60)
  const [isPomodoroActive, setIsPomodoroActive] = useState(false)
  const timerRef = useRef(null)

  // Start/stop countdown whenever isPomodoroActive or timeLeft changes
  useEffect(() => {
    if (!isPomodoroActive || timeLeft === null) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          handleCycleComplete()
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [isPomodoroActive, isOnBreak]) // eslint-disable-line react-hooks/exhaustive-deps

  const notify = (title, body) => {
    if (typeof Notification !== 'undefined') {
      new Notification(title, { body })
    }
  }

  const handleCycleComplete = async () => {
    if (isOnBreak) {
      // Break ended
      if (currentCycle < cycles) {
        notify('Break Complete! 🎯', 'Time to focus again!')
        setCurrentCycle((c) => c + 1)
        setIsOnBreak(false)
        setTimeLeft(focusTime * 60)
        await onBlock()
      } else {
        // All done
        notify('Pomodoro Session Complete! 🏆', `You completed ${cycles} focus cycles!`)
        handlePomodoroStop()
      }
    } else {
      // Focus session ended → start break
      notify('Focus Session Complete! 🎉', 'Time for a well-deserved break!')
      setIsOnBreak(true)
      setTimeLeft(breakTime * 60)
      await onUnblock()
    }
  }

  const handlePomodoroStart = async () => {
    if (blockedSites.length === 0) {
      alert('Please add at least one site to block!')
      return
    }
    await onBlock()
    setIsPomodoroActive(true)
    setCurrentCycle(1)
    setIsOnBreak(false)
    setTimeLeft(focusTime * 60)
  }

  const handlePomodoroStop = async () => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setIsPomodoroActive(false)
    setTimeLeft(focusTime * 60)
    setCurrentCycle(1)
    setIsOnBreak(false)
    await onComplete()
  }

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getProgress = () => {
    if (timeLeft === null) return 100
    const total = isOnBreak ? breakTime * 60 : focusTime * 60
    return ((total - timeLeft) / total) * 100
  }

  return (
    <div className={`bg-gray-800 p-8 rounded-xl w-full`}>
      <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center justify-center gap-2">
        <span className="text-3xl">🍅</span> Pomodoro Mode
      </h2>

      {!isPomodoroActive ? (
        <div className="space-y-6">
          {/* Focus Time */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Focus Time (minutes)
            </label>
            <input
              type="range" min={1} max={60} value={focusTime}
              onChange={(e) => setFocusTime(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <p className="text-center text-xl font-semibold mt-2">{focusTime} min</p>
          </div>

          {/* Break Time */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Break Time (minutes)
            </label>
            <input
              type="range" min={1} max={30} value={breakTime}
              onChange={(e) => setBreakTime(parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
            <p className="text-center text-xl font-semibold mt-2">{breakTime} min</p>
          </div>

          {/* Cycles */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Number of Cycles
            </label>
            <input
              type="range" min={1} max={10} value={cycles}
              onChange={(e) => setCycles(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-center text-xl font-semibold mt-2">{cycles} cycles</p>
          </div>

          <button
            onClick={handlePomodoroStart}
            disabled={blockedSites.length === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            🍅 Start Pomodoro
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`text-sm font-medium mb-2 ${isOnBreak ? 'text-green-400' : 'text-orange-400'}`}>
              {isOnBreak ? '☕ Break Time' : '🎯 Focus Time'}
            </div>
            <div className="text-5xl font-bold font-mono mb-4">{formatTime(timeLeft)}</div>
            <div className={`text-sm text-gray-400`}>
              Cycle {currentCycle} of {cycles}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isOnBreak
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : 'bg-gradient-to-r from-orange-400 to-red-600'
              }`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Cycle dots */}
          <div className="flex justify-center gap-2">
            {[...Array(cycles)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < currentCycle - 1
                    ? 'bg-green-500'
                    : i === currentCycle - 1
                    ? isOnBreak ? 'bg-yellow-500' : 'bg-orange-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handlePomodoroStop}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors"
          >
            ⏹ Stop Pomodoro
          </button>
        </div>
      )}
    </div>
  )
}

export default PomodoroMode