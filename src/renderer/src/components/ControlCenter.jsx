import React from 'react'
import DurationControl from './DurationControl'
import SessionStatus from './SessionStatus'
import SiteListManager from './SiteListManager'

const ControlCenter = ({
  blockDuration, setBlockDuration,
  isBlocking, timeLeft, formatTime,
  handleStartBlocking, handleStopBlocking,
  blockedSites, inputUrl, setInputUrl,
  handleAddSite, handleRemoveSite,
}) => (
  <section className="py-12 px-6 w-full" id="blockList">
    <div className="text-center mb-10">
      <h2 className="text-4xl font-bold">Control Center</h2>
      <p className="text-gray-400 mt-2">Configure your focus sessions with precision</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      <DurationControl blockDuration={blockDuration} setBlockDuration={setBlockDuration} />
      <SessionStatus
        isBlocking={isBlocking} timeLeft={timeLeft} formatTime={formatTime}
        handleStartBlocking={handleStartBlocking} handleStopBlocking={handleStopBlocking}
        blockedSites={blockedSites}
      />
    </div>
    <div className="max-w-6xl mx-auto">
      <SiteListManager
        blockedSites={blockedSites} inputUrl={inputUrl} setInputUrl={setInputUrl}
        handleAddSite={handleAddSite} handleRemoveSite={handleRemoveSite}
      />
    </div>
  </section>
)

export default ControlCenter