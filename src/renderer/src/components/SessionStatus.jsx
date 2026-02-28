import React from 'react'

const SessionStatus = ({ isBlocking, timeLeft, formatTime, handleStartBlocking, handleStopBlocking, blockedSites }) => (
  <div className="bg-gray-800 p-8 rounded-xl text-center w-full min-h-[250px]">
    <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center justify-center gap-2">
      <span className="text-2xl">🎯</span> Session Status
    </h2>
    {isBlocking ? (
      <>
        <p className="text-green-400 text-3xl font-mono font-bold">{formatTime(timeLeft)}</p>
        <p className="text-sm mt-2 text-gray-400">Blocking {blockedSites.length} site{blockedSites.length !== 1 ? 's' : ''}</p>
        <button onClick={handleStopBlocking} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 mt-4 rounded-full text-lg transition-colors">
          ⏹ Stop
        </button>
      </>
    ) : (
      <>
        <p className="mb-2 text-lg text-gray-300">Ready to start</p>
        <button onClick={handleStartBlocking} disabled={blockedSites.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mt-2 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          ▶ Start Blocking
        </button>
        {blockedSites.length === 0 && <p className="text-xs text-gray-500 mt-2">Add at least one site below</p>}
      </>
    )}
  </div>
)

export default SessionStatus