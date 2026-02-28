import React from 'react'

const DurationControl = ({ blockDuration, setBlockDuration }) => (
  <div className="bg-gray-800 p-8 rounded-xl text-center w-full min-h-[250px]">
    <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center justify-center gap-2">
      <span className="text-2xl">🕒</span> Session Duration
    </h2>
    <input
      type="range" min={0.1} max={24} step={0.1}
      value={blockDuration[0]}
      onChange={(e) => setBlockDuration([parseFloat(e.target.value)])}
      className="w-full accent-blue-500"
    />
    <p className="text-3xl font-semibold mt-4">
      {blockDuration[0] % 1 === 0 ? blockDuration[0] : blockDuration[0].toFixed(1)}{' '}
      {blockDuration[0] === 1 ? 'hour' : 'hours'}
    </p>
  </div>
)

export default DurationControl