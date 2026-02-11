import React, { useState, useEffect, useRef } from 'react';

const StrictMode = ({ 
  isActive, 
  onStart, 
  onStop, 
  blockedSites,
  isDark 
}) => {
  const [strictDuration, setStrictDuration] = useState(1); // hours
  const [timeLeft, setTimeLeft] = useState(null);
  const [isStrictActive, setIsStrictActive] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isStrictActive || timeLeft === null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleStrictComplete();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isStrictActive, timeLeft]);

  const handleStrictComplete = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsStrictActive(false);
    setTimeLeft(null);
    
    if (typeof Notification !== 'undefined') {
      new Notification("Strict Mode Complete! 🏆", {
        body: "You successfully completed your strict focus session!",
      });
    }

    // Unblock sites
    onStop();
  };

  const handleStrictStart = async () => {
    if (blockedSites.length === 0) {
      alert("Please add at least one site to block!");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmStrictStart = async () => {
    // Start blocking
    await onStart();
    
    setIsStrictActive(true);
    setTimeLeft(strictDuration * 3600);
    setShowConfirmation(false);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = strictDuration * 3600;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-8 rounded-xl w-full`}>
      <h2 className="text-2xl font-bold mb-6 text-red-400 flex items-center justify-center gap-2">
        <span className="text-3xl">🔒</span> Strict Mode
      </h2>

      {!isStrictActive ? (
        <>
          {!showConfirmation ? (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-100'} border-2 border-red-500`}>
                <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  ⚠️ <strong>WARNING:</strong> In Strict Mode:
                </p>
                <ul className={`text-sm mt-2 space-y-1 ${isDark ? 'text-red-200' : 'text-red-600'}`}>
                  <li>• You CANNOT cancel the session</li>
                  <li>• You CANNOT modify settings</li>
                  <li>• You CANNOT change blocked sites</li>
                  <li>• There is NO way to stop early</li>
                  <li>• Session runs until completion only</li>
                </ul>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
              <div className={`p-6 rounded-lg ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'} border-2 border-yellow-500`}>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  ⚠️ Final Confirmation
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  You are about to enter <strong>Strict Mode</strong> for <strong>{strictDuration} hour(s)</strong>.
                </p>
                <p className={`text-sm mb-2 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  • Sites will be blocked for the entire duration
                </p>
                <p className={`text-sm mb-2 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  • You CANNOT stop or cancel this session
                </p>
                <p className={`text-sm font-bold ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  • There is NO emergency stop option!
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} px-6 py-3 rounded-full text-lg font-semibold hover:opacity-80 transition-opacity`}
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
          {/* Lock Icon Animation */}
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🔒</div>
            <div className="text-red-400 font-semibold mb-2">STRICT MODE ACTIVE</div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="text-5xl font-bold mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Remaining Time
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Warning Message */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-100'} border border-red-500`}>
            <p className={`text-xs ${isDark ? 'text-red-300' : 'text-red-700'}`}>
              🚨 Settings are locked. No changes or cancellation allowed during Strict Mode.
            </p>
          </div>

          {/* Time Milestones */}
          <div className={`text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            {timeLeft > 3600 ? '🎯 Keep going strong!' : 
             timeLeft > 1800 ? '⚡ Less than 30 minutes left!' :
             timeLeft > 600 ? '🔥 Final stretch!' :
             '🏁 Almost there!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrictMode;