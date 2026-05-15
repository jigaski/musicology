import { useState } from 'react'
import JSZip from 'jszip'
import Starfield from './Starfield'
import './Upload.css'

import FirstSong from './components/cards/FirstSong'
import MostPlayed from './components/cards/MostPlayed'
import MoodShift from './components/cards/MoodShift'
import MostSkipped from './components/cards/MostSkipped'
import LeastPlayed from './components/cards/LeastPlayed'
import RageQuits from './components/cards/RageQuits'
import Rediscoveries from './components/cards/Rediscoveries'
import { computeStats } from './utils/stats'

export default function Upload() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleDrop(e) {
    e.preventDefault()
    setLoading(true)
    const file = e.dataTransfer.files[0]
    const zip = await JSZip.loadAsync(file)
    const audioFiles = Object.values(zip.files).filter(f =>
      f.name.includes('Streaming_History_Audio') && f.name.endsWith('.json')
    )
    const allEntries = []
    for (const audioFile of audioFiles) {
      const text = await audioFile.async('text')
      const parsed = JSON.parse(text)
      allEntries.push(...parsed)
    }
    allEntries.sort((a,b)=>new Date(a.ts)-new Date(b.ts))
    setStats(computeStats(allEntries))
    console.log('rediscoveries', computeStats(allEntries).rediscoveries)
    setLoading(false)
  }

  function handleDragOver(e) { e.preventDefault() }

  return (
    <div className="upload">
      <Starfield />
<div className="upload-content" onDrop={handleDrop} onDragOver={handleDragOver}>
  <h1>Musicology</h1>
        <div className="drop-box">
          Drop your Spotify zip file here
        </div>
        {loading && <p>Processing...</p>}
        {stats && <p>Loaded entries from {stats.firstSong.ts.slice(0,4)} to 2026</p>}
        {stats && (
          <div className="stats-grid">
            <FirstSong entry={stats.firstSong} />
            <MostPlayed
              className="stats-card-span-2"
              mostPlays={stats.mostPlayed.mostPlays}
              mostMinutes={stats.mostPlayed.mostMinutes}
            />

            <MostSkipped
              entry={stats.mostSkipped.entry}
              skipCount={stats.mostSkipped.skipCount}
              avgSkipMs={stats.mostSkipped.avgSkipMs}
              totalPlays={stats.mostSkipped.totalPlays}
            />
            <LeastPlayed entries={stats.allEntries} />
            <Rediscoveries rediscoveries={stats.rediscoveries} />
            <RageQuits entries={stats.allEntries} />
            <MoodShift
              className="stats-card-span-2"
              morningEvening={stats.morningEvening}
            />
          </div>
        )}
      </div>
    </div>
  )
}