import React from 'react'

const SiteListManager = ({ blockedSites, inputUrl, setInputUrl, handleAddSite, handleRemoveSite, isBlocking = false }) => (
  <div className="mt-10 bg-gray-800 p-6 rounded-xl">
    <h2 className="text-xl font-bold mb-2 text-red-400">🚫 Blocked Sites</h2>
    <div className="flex gap-2 mb-4">
      <input
        type="text" value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        placeholder="e.g., facebook.com or https://twitter.com"
        className="flex-1 border border-gray-600 bg-gray-700 text-white px-4 py-2 rounded placeholder-gray-400"
        onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
        disabled={isBlocking}
      />
      <button onClick={handleAddSite} disabled={isBlocking} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors">
        Add
      </button>
    </div>
    {blockedSites.length === 0 ? (
      <p className="text-sm text-gray-400">No sites added yet. Add a site above to begin.</p>
    ) : (
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {blockedSites.map((site, i) => (
          <li key={i} className="flex justify-between items-center bg-gray-700 text-white p-2 rounded">
            <span className="text-sm font-mono">{site}</span>
            <button onClick={() => handleRemoveSite(i)} disabled={isBlocking} className="text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded disabled:opacity-50 transition-colors" title="Remove site">✖</button>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default SiteListManager