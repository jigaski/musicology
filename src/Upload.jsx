import { useState } from 'react'
import JSZip from 'jszip'
import Starfield from './Starfield'
import './Upload.css'

import FirstSong from './FirstSong'
import MostPlayed from './MostPlayed'
import MostSkipped from './MostSkipped'
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
        {stats && <FirstSong entry={stats.firstSong} />}
        {stats && <MostPlayed mostPlays={stats.mostPlayed.mostPlays} 
                              mostMinutes={stats.mostPlayed.mostMinutes} />}
        {stats && <MostSkipped
          entry={stats.mostSkipped.entry}
          skipCount={stats.mostSkipped.skipCount}
          avgSkipMs={stats.mostSkipped.avgSkipMs}
          totalPlays={stats.mostSkipped.totalPlays}
        />}
      </div>
    </div>
  )
}