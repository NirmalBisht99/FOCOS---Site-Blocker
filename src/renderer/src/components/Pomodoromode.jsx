import React, { useState, useEffect, useRef } from 'react';

const PomodoroMode = ({ 
  isActive, 
  onBlock,
  onUnblock,
  onComplete,
  blockedSites,
  isDark 
}) => {
  const [focusTime, setFocusTime] = useState(25); // minutes
  const [breakTime, setBreakTime] = useState(5); // minutes
  const [cycles, setCycles] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusTime * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isPomodoroActive || timeLeft === null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleCycleComplete();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isPomodoroActive, timeLeft]);

  const handleCycleComplete = async () => {
    clearInterval(timerRef.current);
    timerRef.current = null;

    if (typeof Notification !== 'undefined') {
      if (isOnBreak) {
        new Notification("Break Complete! 🎯", {
          body: "Time to focus again!",
        });
      } else {
        new Notification("Focus Session Complete! 🎉", {
          body: "Time for a well-deserved break!",
        });
      }
    }

    if (isOnBreak) {
      // Break ended, start next focus session
      if (currentCycle < cycles) {
        setCurrentCycle(prev => prev + 1);
        setIsOnBreak(false);
        setTimeLeft(focusTime * 60);
        
        // Re-block sites for next focus session
        await onBlock();
      } else {
        // All cycles complete
        handlePomodoroStop();
        if (typeof Notification !== 'undefined') {
          new Notification("Pomodoro Session Complete! 🏆", {
            body: `You completed ${cycles} focus cycles!`,
          });
        }
      }
    } else {
      // Focus ended, start break
      setIsOnBreak(true);
      setTimeLeft(breakTime * 60);
      
      // Unblock sites during break
      await onUnblock();
    }
  };

  const handlePomodoroStart = async () => {
    if (blockedSites.length === 0) {
      alert("Please add at least one site to block!");
      return;
    }

    // Start blocking sites
    await onBlock();
    
    setIsPomodoroActive(true);
    setCurrentCycle(1);
    setIsOnBreak(false);
    setTimeLeft(focusTime * 60);
  };

  const handlePomodoroStop = async () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPomodoroActive(false);
    setTimeLeft(focusTime * 60);
    setCurrentCycle(1);
    setIsOnBreak(false);
    
    // Stop blocking sites and complete Pomodoro
    await onComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = isOnBreak ? breakTime * 60 : focusTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-8 rounded-xl w-full`}>
      <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center justify-center gap-2">
        <span className="text-3xl">🍅</span> Pomodoro Mode
      </h2>

      {!isPomodoroActive ? (
        <div className="space-y-6">
          {/* Focus Time */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Focus Time (minutes)
            </label>
            <input
              type="range"
              min={1}
              max={60}
              value={focusTime}
              onChange={(e) => setFocusTime(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <p className="text-center text-xl font-semibold mt-2">{focusTime} min</p>
          </div>

          {/* Break Time */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Break Time (minutes)
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={breakTime}
              onChange={(e) => setBreakTime(parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
            <p className="text-center text-xl font-semibold mt-2">{breakTime} min</p>
          </div>

          {/* Cycles */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Number of Cycles
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={cycles}
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
          {/* Current Status */}
          <div className="text-center">
            <div className={`text-sm font-medium mb-2 ${isOnBreak ? 'text-green-400' : 'text-orange-400'}`}>
              {isOnBreak ? '☕ Break Time' : '🎯 Focus Time'}
            </div>
            <div className="text-5xl font-bold mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Cycle {currentCycle} of {cycles}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isOnBreak 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : 'bg-gradient-to-r from-orange-400 to-red-600'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Cycles Indicator */}
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
  );
};

export default PomodoroMode;